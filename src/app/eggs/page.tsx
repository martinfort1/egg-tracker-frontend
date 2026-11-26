"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Layers,
    Egg,
    Bird,
    CheckCircle2,
    Trash2,
    Plus,
    Info,
    Sparkles,
    TrendingUp,
} from "lucide-react";
import { formatNumber } from "@/lib/utils";
import LoadSpin from "@/components/load-spin";

interface EggRecord {
    id: string;
    date: string;
    boxes: number;
    cartons: number;
    chickenId?: string | null;
    chicken?: {
        id: string;
        purchaseNumber?: number | null;
        supplier?: string | null;
        amount: number;
    } | null;
}

export default function EggLayingPage() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [days, setDays] = useState<(Date | null)[]>([]);
    const [eggRecords, setEggRecords] = useState<EggRecord[]>([]);
    const [chickens, setChickens] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const activeLots = useMemo(() => {
        return chickens.filter((c) => c.hasArrived !== false);
    }, [chickens]);

    // Modal state for editing a day's collection
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedChickenId, setSelectedChickenId] = useState<string>("");
    const [boxesInput, setBoxesInput] = useState<number | "">(0);
    const [cartonsInput, setCartonsInput] = useState<number | "">(0);
    const [editingRecordId, setEditingRecordId] = useState<string | null>(null);

    // Format local date to YYYY-MM-DD
    const formatDateKey = (d: Date): string => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    // Load chicken lots once
    useEffect(() => {
        const fetchChickens = async () => {
            try {
                const res = await api.get("/chickens");
                setChickens(res.data || []);
            } catch (err) {
                console.error("Error fetching chicken lots:", err);
            }
        };
        fetchChickens();
    }, []);

    // Generate calendar days for current month
    useEffect(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const calDays: (Date | null)[] = [];
        for (let i = 0; i < startingDayOfWeek; i++) {
            calDays.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            calDays.push(new Date(year, month, i));
        }

        setDays(calDays);
    }, [currentMonth]);

    // Fetch month egg collection data
    const fetchEggData = async () => {
        try {
            setIsLoading(true);
            const year = currentMonth.getFullYear();
            const month = currentMonth.getMonth() + 1;
            const res = await api.get(`/egg-laying/by-month/${year}/${month}`);
            setEggRecords(res.data || []);
        } catch (error) {
            console.error("Failed to fetch egg data:", error);
            toast.error("Error al cargar datos de postura");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEggData();
    }, [currentMonth]);

    // Group records by date string: { "2026-11-25": [records...] }
    const recordsByDate = useMemo(() => {
        const map: { [key: string]: EggRecord[] } = {};
        for (const record of eggRecords) {
            if (!map[record.date]) {
                map[record.date] = [];
            }
            map[record.date].push(record);
        }
        return map;
    }, [eggRecords]);

    // Monthly Totals
    const monthlySummary = useMemo(() => {
        let totalBoxes = 0;
        let totalCartons = 0;

        for (const r of eggRecords) {
            totalBoxes += Number(r.boxes) || 0;
            totalCartons += Number(r.cartons) || 0;
        }

        // 12 bandejas = 1 cajón
        const totalEquivalentBoxes = totalBoxes + totalCartons / 12;
        const totalEggs = totalBoxes * 360 + totalCartons * 30;
        const daysWithRecords = Object.keys(recordsByDate).length;
        const avgBoxesPerDay =
            daysWithRecords > 0 ? totalEquivalentBoxes / daysWithRecords : 0;

        return {
            totalBoxes,
            totalCartons,
            totalEquivalentBoxes,
            totalEggs,
            daysWithRecords,
            avgBoxesPerDay,
        };
    }, [eggRecords, recordsByDate]);

    // Open edit dialog for a specific day
    const handleDayClick = (date: Date) => {
        const dateKey = formatDateKey(date);
        setSelectedDate(date);

        const existingList = recordsByDate[dateKey] || [];
        if (existingList.length > 0) {
            const first = existingList[0];
            setEditingRecordId(first.id);
            setBoxesInput(first.boxes);
            setCartonsInput(first.cartons);
            setSelectedChickenId(first.chickenId || "");
        } else {
            setEditingRecordId(null);
            setBoxesInput(0);
            setCartonsInput(0);
            // Default to first chicken lot if available
            setSelectedChickenId(chickens.length > 0 ? chickens[0].id : "");
        }

        setOpen(true);
    };

    // Calculate real-time stats in the dialog
    const modalBoxes = boxesInput === "" ? 0 : Number(boxesInput);
    const modalCartons = cartonsInput === "" ? 0 : Number(cartonsInput);
    // 12 bandejas = 1 cajón
    const modalTotalBoxes = modalBoxes + modalCartons / 12;
    const modalTotalEggs = modalBoxes * 360 + modalCartons * 30;

    // Find selected chicken lot details
    const selectedChickenLot = useMemo(() => {
        return chickens.find((c) => c.id === selectedChickenId) || null;
    }, [chickens, selectedChickenId]);

    const estimatedLayingRate = useMemo(() => {
        if (!selectedChickenLot) return null;
        const deaths = (selectedChickenLot.deaths || []).reduce(
            (sum: number, d: any) => sum + (Number(d.amount) || 0),
            0
        );
        const alive = Math.max(0, (selectedChickenLot.amount || 0) - deaths);
        if (alive <= 0 || modalTotalEggs <= 0) return 0;
        return Math.min(100, (modalTotalEggs / alive) * 100);
    }, [selectedChickenLot, modalTotalEggs]);

    // Save record
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDate) return;

        if (modalBoxes < 0 || modalCartons < 0) {
            toast.error("Las cantidades no pueden ser negativas");
            return;
        }

        setIsSubmitting(true);
        try {
            const dateStr = formatDateKey(selectedDate);
            await api.post("/egg-laying", {
                date: dateStr,
                boxes: modalBoxes,
                cartons: modalCartons,
                chickenId: selectedChickenId || undefined,
            });

            toast.success("Recolección de huevos guardada exitosamente");
            setOpen(false);
            fetchEggData();
        } catch (error: any) {
            console.error("Error saving egg laying:", error);
            toast.error(
                error?.response?.data?.message || "Error al guardar recolección"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // Delete record
    const handleDelete = async () => {
        if (!editingRecordId) return;
        if (!confirm("¿Deseás eliminar el registro de recolección de este día?")) {
            return;
        }

        setIsSubmitting(true);
        try {
            await api.delete(`/egg-laying/${editingRecordId}`);
            toast.success("Registro eliminado");
            setOpen(false);
            fetchEggData();
        } catch (error) {
            console.error("Error deleting egg laying:", error);
            toast.error("Error al eliminar registro");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Month Navigation
    const prevMonth = () => {
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
        );
    };

    const nextMonth = () => {
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
        );
    };

    const goToToday = () => {
        setCurrentMonth(new Date());
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        );
    };

    const monthNames = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
    ];

    const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <Egg className="w-3 h-3 text-amber-600" />
                            Control de Postura
                        </span>
                        <span className="text-xs text-slate-400">
                            1 Cajón = 12 Bandejas (360 huevos)
                        </span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-semibold text-slate-900">
                        Calendario Diario de Postura
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Registrá día a día cajones y bandejas recolectados y vinculalos al lote correspondiente
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        onClick={() => handleDayClick(new Date())}
                        className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs h-10 px-4 flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Cargar Postura de Hoy</span>
                    </Button>
                </div>
            </div>

            {/* Monthly Financial / Productivity Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-amber-200/90 p-4 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500" />
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-amber-600" />
                        Total en Cajones
                    </p>
                    <p className="text-xl sm:text-2xl font-black text-slate-900">
                        {monthlySummary.totalEquivalentBoxes.toFixed(2)}{" "}
                        <span className="text-sm font-bold text-amber-600">cajones</span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                        {formatNumber(monthlySummary.totalBoxes)} caj. enteros +{" "}
                        {formatNumber(monthlySummary.totalCartons)} bandejas
                    </p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Egg className="w-3.5 h-3.5 text-amber-600" />
                        Total de Huevos
                    </p>
                    <p className="text-xl sm:text-2xl font-black text-slate-900">
                        {formatNumber(monthlySummary.totalEggs)}{" "}
                        <span className="text-xs font-medium text-slate-400">unidades</span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                        Equivalente a {(monthlySummary.totalEggs / 30).toFixed(0)} bandejas
                    </p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                        Promedio Diario
                    </p>
                    <p className="text-xl sm:text-2xl font-black text-emerald-700">
                        {monthlySummary.avgBoxesPerDay.toFixed(2)}{" "}
                        <span className="text-xs font-medium text-slate-400">cajones / día</span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                        En {monthlySummary.daysWithRecords} días con recolección
                    </p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Bird className="w-3.5 h-3.5 text-amber-600" />
                        Lotes en Granja
                    </p>
                    <p className="text-xl sm:text-2xl font-black text-slate-900">
                        {activeLots.length}{" "}
                        <span className="text-xs font-medium text-slate-400">
                            {activeLots.length === 1 ? "lote activo" : "lotes activos"}
                        </span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                        {activeLots[0]?.supplier ? activeLots[0].supplier : "Plantel productivo"}
                    </p>
                </div>
            </div>

            {/* Calendar Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-5">
                {/* Month Navigator Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-['Playfair_Display'] font-bold text-slate-900 capitalize">
                            {monthNames[currentMonth.getMonth()]}{" "}
                            <span className="font-sans text-amber-600 font-bold">
                                {currentMonth.getFullYear()}
                            </span>
                        </h2>
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-auto">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={goToToday}
                            className="h-8 px-2.5 text-xs font-semibold text-slate-600 border-slate-200 hover:bg-slate-50 rounded-lg cursor-pointer"
                        >
                            Mes Actual
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={prevMonth}
                            className="h-8 w-8 p-0 text-slate-600 border-slate-200 hover:bg-slate-50 rounded-lg cursor-pointer"
                            title="Mes anterior"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={nextMonth}
                            className="h-8 w-8 p-0 text-slate-600 border-slate-200 hover:bg-slate-50 rounded-lg cursor-pointer"
                            title="Mes siguiente"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="py-16 text-center">
                        <LoadSpin />
                    </div>
                ) : (
                    <>
                        {/* Weekday Labels */}
                        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-bold uppercase tracking-wider text-slate-400">
                            {weekDays.map((w, idx) => (
                                <div
                                    key={w}
                                    className={`py-1.5 ${
                                        idx === 0 || idx === 6 ? "text-amber-700/80" : ""
                                    }`}
                                >
                                    {w}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                            {days.map((date, index) => {
                                if (!date) {
                                    return (
                                        <div
                                            key={`empty-${index}`}
                                            className="min-h-[90px] sm:min-h-[110px] rounded-xl bg-slate-50/40 border border-transparent"
                                        />
                                    );
                                }

                                const dateKey = formatDateKey(date);
                                const records = recordsByDate[dateKey] || [];
                                const hasData = records.length > 0;

                                // Sums for the day
                                const dayBoxes = records.reduce(
                                    (sum, r) => sum + (Number(r.boxes) || 0),
                                    0
                                );
                                const dayCartons = records.reduce(
                                    (sum, r) => sum + (Number(r.cartons) || 0),
                                    0
                                );
                                const dayEquivalentBoxes = dayBoxes + dayCartons / 12;
                                const isCurrentDay = isToday(date);

                                // First associated lot
                                const lot = records[0]?.chicken;

                                return (
                                    <button
                                        key={dateKey}
                                        type="button"
                                        onClick={() => handleDayClick(date)}
                                        className={`group relative min-h-[90px] sm:min-h-[110px] p-2 sm:p-2.5 rounded-xl text-left transition-all duration-200 flex flex-col justify-between border cursor-pointer hover:shadow-md hover:-translate-y-0.5 ${
                                            isCurrentDay
                                                ? "bg-amber-50/70 border-amber-400 ring-2 ring-amber-400/30"
                                                : hasData
                                                ? "bg-white border-amber-200/90 shadow-2xs hover:border-amber-400"
                                                : "bg-slate-50/60 border-slate-200/70 hover:bg-white hover:border-slate-300"
                                        }`}
                                    >
                                        {/* Day number & indicators */}
                                        <div className="flex items-center justify-between w-full">
                                            <span
                                                className={`text-xs font-bold rounded-md px-1.5 py-0.5 ${
                                                    isCurrentDay
                                                        ? "bg-amber-500 text-white shadow-2xs"
                                                        : hasData
                                                        ? "text-slate-900 bg-amber-100/70"
                                                        : "text-slate-500 group-hover:text-slate-900"
                                                }`}
                                            >
                                                {date.getDate()}
                                            </span>

                                            {hasData && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                            )}
                                        </div>

                                        {/* Day Data Display */}
                                        {hasData ? (
                                            <div className="space-y-1 w-full pt-1">
                                                {/* Main: Cajones en número grande / simple */}
                                                <div className="bg-amber-50/80 border border-amber-200/60 rounded-lg px-1.5 py-1 text-center">
                                                    <span className="text-xs sm:text-sm font-black text-amber-950 block leading-tight">
                                                        {dayEquivalentBoxes % 1 === 0
                                                            ? dayEquivalentBoxes
                                                            : dayEquivalentBoxes.toFixed(2)}{" "}
                                                        <span className="text-[10px] font-bold text-amber-700">
                                                            caj.
                                                        </span>
                                                    </span>
                                                    <span className="text-[9px] sm:text-[10px] font-semibold text-slate-500 block leading-tight">
                                                        {dayBoxes}c · {dayCartons}b
                                                    </span>
                                                </div>

                                                {/* Lot badge if assigned */}
                                                {lot && (
                                                    <div className="truncate text-[9px] font-bold text-slate-600 bg-slate-100 rounded px-1 py-0.5 text-center flex items-center justify-center gap-0.5">
                                                        <Bird className="w-2.5 h-2.5 text-amber-600 shrink-0" />
                                                        <span className="truncate">
                                                            {lot.purchaseNumber
                                                                ? `Lote #${lot.purchaseNumber}`
                                                                : lot.supplier || "Lote"}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center py-2 text-slate-300 group-hover:text-amber-500 transition-colors">
                                                <Plus className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            {/* Modal for Day Collection Input */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl text-slate-900 sm:max-w-md">
                    <DialogHeader className="space-y-1 pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                                Carga de Postura Diaria
                            </span>
                        </div>
                        <DialogTitle className="text-xl font-['Playfair_Display'] font-semibold text-slate-900 flex items-center gap-2">
                            <CalendarIcon className="w-5 h-5 text-amber-600" />
                            <span>
                                {selectedDate
                                    ? selectedDate.toLocaleDateString("es-AR", {
                                          weekday: "long",
                                          day: "numeric",
                                          month: "long",
                                          year: "numeric",
                                      })
                                    : "Seleccionar Día"}
                            </span>
                        </DialogTitle>
                        <p className="text-xs text-slate-500">
                            Ingresá cuántos cajones y bandejas salieron este día (1 cajón = 12 bandejas)
                        </p>
                    </DialogHeader>

                    <form onSubmit={handleSave} className="space-y-4 pt-2">
                        {/* 1. Selector de Lote */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                                <span className="flex items-center gap-1.5">
                                    <Bird className="w-3.5 h-3.5 text-amber-600" />
                                    Lote de Gallinas Correspondiente
                                </span>
                                <span className="text-[11px] font-normal text-slate-400">
                                    (Identificación de origen)
                                </span>
                            </label>

                            {activeLots.length === 0 ? (
                                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
                                    {chickens.length > 0
                                        ? "Los lotes registrados aún no llegaron a la granja ('Por llegar'). Podés cargar igual la postura general."
                                        : "No tenés lotes de gallinas creados aún. Podés cargar igual la recolección general."}
                                </div>
                            ) : (
                                <select
                                    value={selectedChickenId}
                                    onChange={(e) => setSelectedChickenId(e.target.value)}
                                    className="w-full h-11 px-3 border border-slate-200 rounded-xl bg-slate-50/60 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                                >
                                    <option value="">Seleccionar lote (opcional / general)...</option>
                                    {activeLots.map((lot) => (
                                        <option key={lot.id} value={lot.id}>
                                            {lot.purchaseNumber ? `Lote N° ${lot.purchaseNumber} - ` : ""}
                                            {lot.supplier ? `${lot.supplier} - ` : ""}
                                            {formatNumber(lot.amount)} aves en granja
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* 2. Inputs de Cajones y Bandejas */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                                    <Layers className="w-3.5 h-3.5 text-amber-600" />
                                    Cajones Enteros
                                </label>
                                <Input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={boxesInput}
                                    onChange={(e) =>
                                        setBoxesInput(
                                            e.target.value === "" ? "" : parseInt(e.target.value) || 0
                                        )
                                    }
                                    placeholder="0"
                                    className="h-12 bg-white border-2 border-amber-300 text-slate-900 font-black text-lg rounded-xl px-3 text-center focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                                    autoFocus
                                />
                                <span className="text-[10px] text-slate-400 block text-center">
                                    = 12 bandejas c/u
                                </span>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-800 flex items-center gap-1">
                                    <Egg className="w-3.5 h-3.5 text-amber-600" />
                                    Bandejas (Maples)
                                </label>
                                <Input
                                    type="number"
                                    min="0"
                                    max="11"
                                    step="1"
                                    value={cartonsInput}
                                    onChange={(e) =>
                                        setCartonsInput(
                                            e.target.value === "" ? "" : parseInt(e.target.value) || 0
                                        )
                                    }
                                    placeholder="0"
                                    className="h-12 bg-white border-2 border-amber-300 text-slate-900 font-black text-lg rounded-xl px-3 text-center focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                                />
                                <span className="text-[10px] text-slate-400 block text-center">
                                    = 30 huevos c/u
                                </span>
                            </div>
                        </div>

                        {/* 3. Cálculo en vivo del día: Equivalencia en Cajones simples */}
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-3.5 space-y-2 text-xs">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-slate-600">
                                    Equivalente Total en Cajones:
                                </span>
                                <span className="text-base font-black text-amber-950">
                                    {modalTotalBoxes.toFixed(2)}{" "}
                                    <span className="text-xs font-bold text-amber-700">cajones</span>
                                </span>
                            </div>

                            <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1 border-t border-amber-200/60">
                                <span>Total de Huevos Recolectados:</span>
                                <span className="font-bold text-slate-800">
                                    {formatNumber(modalTotalEggs)} huevos ({modalBoxes * 12 + modalCartons} bandejas)
                                </span>
                            </div>

                            {estimatedLayingRate !== null && (
                                <div className="flex justify-between items-center text-[11px] pt-1 border-t border-amber-200/60">
                                    <span className="font-semibold text-slate-700">
                                        % Postura Estimado del Lote:
                                    </span>
                                    <span className="font-black text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                                        {estimatedLayingRate.toFixed(1)}%
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-2.5 pt-2">
                            {editingRecordId && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleDelete}
                                    disabled={isSubmitting}
                                    className="border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl h-11 px-3 cursor-pointer"
                                    title="Eliminar recolección de este día"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            )}

                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                disabled={isSubmitting}
                                className="flex-1 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl h-11 font-semibold cursor-pointer"
                            >
                                Cancelar
                            </Button>

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl h-11 shadow-sm transition active:scale-95 cursor-pointer disabled:opacity-50"
                            >
                                {isSubmitting ? "Guardando..." : "Guardar Recolección"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
