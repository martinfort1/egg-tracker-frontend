"use client";

import { useEffect, useState, useMemo } from "react";
import CartonCard from "@/components/carton-card";
import DateRangeFilter, { DateFilterPreset } from "@/components/date-range-filter";
import { Button } from "@/components/ui/button";
import LoadSpin from "@/components/load-spin";
import { api } from "@/lib/api";
import {
    Box,
    Plus,
    Printer,
    Table as TableIcon,
    LayoutGrid,
    Search,
    Calendar,
    DollarSign,
    CheckCircle2,
    Clock,
    AlertCircle,
    Eye,
    Trash2,
} from "lucide-react";
import Link from "next/link";
import PaymentModal from "@/components/payment-modal";
import { formatCurrency, formatUtcDate } from "@/lib/utils";
import { toast } from "sonner";

export default function CartonsPage() {
    const [cartons, setCartons] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [preset, setPreset] = useState<DateFilterPreset>("all");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [showDebtOnly, setShowDebtOnly] = useState(false);
    const [viewMode, setViewMode] = useState<"ledger" | "cards">("ledger");
    const [searchTerm, setSearchTerm] = useState("");

    const fetchCartons = async (sDate = startDate, eDate = endDate) => {
        try {
            setIsLoading(true);
            const params: any = {};
            if (sDate) params.startDate = sDate;
            if (eDate) params.endDate = eDate;
            const response = await api.get("/cartons", { params });
            setCartons(response.data);
        } catch (err) {
            console.error("Failed to fetch cartons:", err);
            toast.error("Error al cargar compras de cartones");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCartons(startDate, endDate);
    }, [startDate, endDate]);

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de que deseas eliminar esta compra de cartones?")) return;
        try {
            await api.delete(`/cartons/${id}`);
            toast.success("Compra de cartones eliminada correctamente");
            fetchCartons(startDate, endDate);
        } catch (error) {
            toast.error("Error al eliminar la compra");
        }
    };

    // Filter cartons by outstanding debt and search term
    const visibleCartons = useMemo(() => {
        let list = cartons;

        if (showDebtOnly) {
            list = list.filter((c: any) => c.status !== "PAID" && Number(c.remainingAmount) > 0);
        }

        if (searchTerm.trim()) {
            const query = searchTerm.toLowerCase().trim();
            list = list.filter((c: any) => {
                const dateStr = formatUtcDate(c.date).toLowerCase();
                const totalStr = (c.totalAmount ?? "").toString();
                const remainingStr = (c.remainingAmount ?? "").toString();
                return dateStr.includes(query) || totalStr.includes(query) || remainingStr.includes(query);
            });
        }

        return list;
    }, [cartons, showDebtOnly, searchTerm]);

    // Financial summaries for the filtered period
    const totalInvoiced = useMemo(() => {
        return visibleCartons.reduce((acc: number, c: any) => acc + (Number(c.totalAmount) || 0), 0);
    }, [visibleCartons]);

    const totalPaid = useMemo(() => {
        return visibleCartons.reduce((acc: number, c: any) => acc + (Number(c.amountPaid) || 0), 0);
    }, [visibleCartons]);

    const totalDebt = useMemo(() => {
        return visibleCartons.reduce((acc: number, c: any) => acc + (Number(c.remainingAmount) || 0), 0);
    }, [visibleCartons]);

    const totalQuantity = useMemo(() => {
        return visibleCartons.reduce((acc: number, c: any) => {
            const total = (Number(c.bigCartonsQuantity ?? 0) + Number(c.smallCartonsQuantity ?? 0)) || Number(c.quantity ?? 0);
            return acc + total;
        }, 0);
    }, [visibleCartons]);

    const statusBadge: Record<string, { className: string; icon: any }> = {
        PAID: {
            className: "bg-emerald-50 text-emerald-700 border-emerald-200",
            icon: CheckCircle2,
        },
        PARTIAL: {
            className: "bg-amber-50 text-amber-700 border-amber-200",
            icon: Clock,
        },
        UNPAID: {
            className: "bg-rose-50 text-rose-700 border-rose-200",
            icon: AlertCircle,
        },
    };

    const formatCartonBreakdown = (carton: any) => {
        const parts = [
            Number(carton.bigCartonsQuantity ?? 0) > 0 ? `${carton.bigCartonsQuantity} Grandes (${formatCurrency(carton.bigCartonPrice)})` : null,
            Number(carton.smallCartonsQuantity ?? 0) > 0 ? `${carton.smallCartonsQuantity} Chicos (${formatCurrency(carton.smallCartonPrice)})` : null,
            Number(carton.bigCartonsQuantity ?? 0) + Number(carton.smallCartonsQuantity ?? 0) === 0 && Number(carton.quantity ?? 0) > 0 ? `${carton.quantity} un. (${formatCurrency(carton.price)})` : null,
        ].filter(Boolean);

        return parts.length > 0 ? parts.join(" • ") : "Sin desglose";
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                            Registro de Empaque & Cartones
                        </span>
                        <span className="text-xs text-slate-400">Maples, Cajas y Packaging</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-semibold text-slate-900">
                        Historial de Cartones & Empaque
                    </h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Registro cronológico de compras de cartones, pagos a proveedores y deudas
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs transition active:scale-95 cursor-pointer"
                    >
                        <Printer className="w-3.5 h-3.5 text-slate-500" />
                        <span>Imprimir / PDF</span>
                    </button>

                    <Link href="/cartons/new">
                        <Button className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl px-4 py-2 font-semibold shadow-sm transition active:scale-95 flex items-center gap-1.5 cursor-pointer">
                            <Plus size={16} />
                            Nueva Compra
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Financial Summary Cards for current selection */}
            {!isLoading && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                            Total Facturado
                        </p>
                        <p className="text-xl sm:text-2xl font-bold text-slate-900">
                            {formatCurrency(totalInvoiced)}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                            {visibleCartons.length} {visibleCartons.length === 1 ? "compra" : "compras"} en el período
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                            Total Abonado
                        </p>
                        <p className="text-xl sm:text-2xl font-bold text-emerald-600">
                            {formatCurrency(totalPaid)}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                            Pagos asentados
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                            Saldo Deuda
                        </p>
                        <p className="text-xl sm:text-2xl font-bold text-rose-600">
                            {formatCurrency(totalDebt)}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                            Pendiente a abonar
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                            Total Unidades
                        </p>
                        <p className="text-xl sm:text-2xl font-bold text-amber-600">
                            {totalQuantity}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                            Cartones / maples adquiridos
                        </p>
                    </div>
                </div>
            )}

            {/* Filter Controls Bar */}
            <div className="space-y-3">
                <DateRangeFilter
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    activePreset={preset}
                    onSelectPreset={setPreset}
                    showDebtToggle={true}
                    showDebtOnly={showDebtOnly}
                    setShowDebtOnly={setShowDebtOnly}
                    debtLabel="Solo compras con deuda pendiente"
                    accentColor="amber"
                    totalCount={visibleCartons.length}
                />

                {/* Search & View Mode Switcher */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar por fecha, monto o saldo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-700"
                        />
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-auto">
                        <span className="text-xs text-slate-500 font-medium mr-1 hidden sm:inline">
                            Vista:
                        </span>
                        <div className="inline-flex rounded-xl bg-slate-100 p-0.5 border border-slate-200">
                            <button
                                type="button"
                                onClick={() => setViewMode("ledger")}
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                    viewMode === "ledger"
                                        ? "bg-white text-amber-700 shadow-2xs font-bold"
                                        : "text-slate-600 hover:text-slate-900"
                                }`}
                            >
                                <TableIcon className="w-3.5 h-3.5" />
                                <span>Libro Diario</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode("cards")}
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                    viewMode === "cards"
                                        ? "bg-white text-amber-700 shadow-2xs font-bold"
                                        : "text-slate-600 hover:text-slate-900"
                                }`}
                            >
                                <LayoutGrid className="w-3.5 h-3.5" />
                                <span>Tarjetas</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            {isLoading ? (
                <LoadSpin />
            ) : visibleCartons.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-amber-100 shadow-sm">
                    <Box className="w-14 h-14 text-amber-300 mx-auto mb-4" />
                    <p className="text-slate-700 text-lg font-medium">No se encontraron compras de cartones</p>
                    <p className="text-slate-400 text-sm mt-1">
                        {cartons.length > 0
                            ? "Prueba cambiando el rango de fechas o los filtros seleccionados"
                            : "Registra tu primera compra de empaque para comenzar"}
                    </p>
                </div>
            ) : viewMode === "ledger" ? (
                /* Ledger / Table View */
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div className="flex items-center gap-2">
                            <TableIcon className="w-4 h-4 text-amber-600" />
                            <h3 className="font-semibold text-slate-800 text-sm">
                                Historial de Operaciones de Cartones
                            </h3>
                            <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">
                                {visibleCartons.length}
                            </span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-semibold">
                                    <th className="py-3 px-4">Fecha</th>
                                    <th className="py-3 px-4">Cantidad</th>
                                    <th className="py-3 px-4">Detalle / Medidas</th>
                                    <th className="py-3 px-4 text-right">Facturado</th>
                                    <th className="py-3 px-4 text-right">Abonado</th>
                                    <th className="py-3 px-4 text-right">Saldo Deuda</th>
                                    <th className="py-3 px-4 text-center">Estado</th>
                                    <th className="py-3 px-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                {visibleCartons.map((carton: any) => {
                                    const StatusBadgeIcon = statusBadge[carton.status]?.icon || AlertCircle;
                                    const badgeClass = statusBadge[carton.status]?.className || "bg-slate-100 text-slate-700 border-slate-200";
                                    const cartonTotalQty = (Number(carton.bigCartonsQuantity ?? 0) + Number(carton.smallCartonsQuantity ?? 0)) || Number(carton.quantity ?? 0);

                                    return (
                                        <tr
                                            key={carton.id}
                                            className="hover:bg-amber-50/30 transition-colors"
                                        >
                                            <td className="py-3.5 px-4 font-medium text-slate-900 whitespace-nowrap">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                                    <span>{formatUtcDate(carton.date)}</span>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                                                {cartonTotalQty} cartones
                                            </td>
                                            <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                                                {formatCartonBreakdown(carton)}
                                            </td>
                                            <td className="py-3.5 px-4 text-right font-bold text-slate-900 whitespace-nowrap">
                                                {formatCurrency(carton.totalAmount)}
                                            </td>
                                            <td className="py-3.5 px-4 text-right font-semibold text-emerald-600 whitespace-nowrap">
                                                {formatCurrency(carton.amountPaid)}
                                            </td>
                                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                                {carton.status === "PAID" ? (
                                                    <span className="text-emerald-700 font-medium">Sin deuda</span>
                                                ) : (
                                                    <span className="font-bold text-rose-600">
                                                        {formatCurrency(carton.remainingAmount)}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                                <span
                                                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badgeClass}`}
                                                >
                                                    <StatusBadgeIcon className="w-3 h-3" />
                                                    {carton.status}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    {carton.status !== "PAID" && (
                                                        <PaymentModal
                                                            sale={carton}
                                                            endpoint="cartons"
                                                            onSuccess={() => fetchCartons(startDate, endDate)}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition cursor-pointer"
                                                        >
                                                            <span>Pagar</span>
                                                        </PaymentModal>
                                                    )}
                                                    <Link href={`/cartons/${carton.id}`}>
                                                        <button
                                                            type="button"
                                                            title="Ver Detalle"
                                                            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-700 hover:bg-amber-50 border border-transparent hover:border-amber-200 transition cursor-pointer"
                                                        >
                                                            <Eye className="w-3.5 h-3.5" />
                                                        </button>
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        title="Eliminar"
                                                        onClick={() => handleDelete(carton.id)}
                                                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition cursor-pointer"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* Cards View */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {visibleCartons.map((carton: any) => (
                        <CartonCard
                            key={carton.id}
                            carton={carton}
                            refresh={() => fetchCartons(startDate, endDate)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
