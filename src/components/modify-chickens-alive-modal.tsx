"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Bird, Pencil, AlertCircle, CheckCircle2, History, SlidersHorizontal, Info } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { formatNumber, formatCurrency, formatUtcDate } from "@/lib/utils";

interface ModifyChickensAliveModalProps {
    chicken?: any;
    chickens?: any[];
    children?: React.ReactNode;
    onSuccess: () => void;
}

export function ModifyChickensAliveModal({
    chicken,
    chickens = [],
    children,
    onSuccess,
}: ModifyChickensAliveModalProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // If a list of chickens was passed, allow selecting which lot
    const lotList = useMemo(() => {
        if (chicken) return [chicken];
        return chickens;
    }, [chicken, chickens]);

    const [selectedId, setSelectedId] = useState<string>(
        chicken?.id || (chickens.length > 0 ? chickens[0].id : "")
    );

    const activeChicken = useMemo(() => {
        return lotList.find((c) => c.id === selectedId) || lotList[0] || null;
    }, [lotList, selectedId]);

    const totalDeaths = useMemo(() => {
        if (!activeChicken) return 0;
        return (activeChicken.deaths || []).reduce(
            (sum: number, d: any) => sum + (Number(d.amount) || 0),
            0
        );
    }, [activeChicken]);

    const initialAlive = useMemo(() => {
        if (!activeChicken) return 0;
        return Math.max(0, (activeChicken.amount || 0) - totalDeaths);
    }, [activeChicken, totalDeaths]);

    const [aliveCount, setAliveCount] = useState<number | "">(initialAlive);
    const [notes, setNotes] = useState<string>("Ajuste de censo de gallinas vivas");
    const [mode, setMode] = useState<"alive" | "lot">("alive");

    // Form data for modifying lot purchase directly
    const [lotData, setLotData] = useState({
        amount: activeChicken?.amount || 0,
        supplier: activeChicken?.supplier || "",
        pricePerChicken: activeChicken?.pricePerChicken || 0,
    });

    useEffect(() => {
        if (activeChicken) {
            setAliveCount(initialAlive);
            setLotData({
                amount: activeChicken.amount || 0,
                supplier: activeChicken.supplier || "",
                pricePerChicken: activeChicken.pricePerChicken || 0,
            });
        }
    }, [activeChicken, initialAlive, open]);

    const diff = useMemo(() => {
        if (!activeChicken || aliveCount === "") return 0;
        return Number(aliveCount) - initialAlive;
    }, [activeChicken, aliveCount, initialAlive]);

    const newProjectedDeaths = useMemo(() => {
        if (!activeChicken || aliveCount === "") return totalDeaths;
        const target = Number(aliveCount);
        if (target >= activeChicken.amount) return 0;
        return activeChicken.amount - target;
    }, [activeChicken, aliveCount, totalDeaths]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeChicken) return;

        setLoading(true);
        try {
            if (mode === "alive") {
                if (aliveCount === "" || Number(aliveCount) < 0) {
                    toast.error("Por favor ingresá una cantidad válida de gallinas vivas");
                    setLoading(false);
                    return;
                }

                await api.patch(`/chickens/${activeChicken.id}/alive`, {
                    aliveCount: Number(aliveCount),
                    notes: notes?.trim() || "Ajuste de censo de gallinas vivas",
                });

                toast.success(
                    `Cantidad de gallinas vivas actualizada a ${formatNumber(Number(aliveCount))}`
                );
            } else {
                // Mode 'lot' -> update original purchase lot
                if (lotData.amount <= 0) {
                    toast.error("La cantidad de gallinas compradas debe ser mayor a 0");
                    setLoading(false);
                    return;
                }

                await api.put(`/chickens/${activeChicken.id}`, {
                    amount: Number(lotData.amount),
                    supplier: lotData.supplier?.trim() || undefined,
                    pricePerChicken: Number(lotData.pricePerChicken) || 0,
                });

                toast.success("Lote de gallinas modificado exitosamente");
            }

            setOpen(false);
            onSuccess();
        } catch (err: any) {
            console.error("Error updating chickens count:", err);
            toast.error(
                err?.response?.data?.message || "Error al actualizar cantidad de gallinas"
            );
        } finally {
            setLoading(false);
        }
    };

    if (!activeChicken) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children ? (
                    children
                ) : (
                    <Button
                        size="sm"
                        variant="outline"
                        className="text-amber-800 bg-amber-50 hover:bg-amber-100 border-amber-200 rounded-xl transition active:scale-95 cursor-pointer text-xs font-semibold h-9 flex items-center justify-center gap-1.5"
                    >
                        <Pencil className="w-3.5 h-3.5 text-amber-600" />
                        <span>Modificar Gallinas Vivas</span>
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-slate-900 sm:max-w-md">
                <DialogHeader className="space-y-1 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                            Plantel de Aves
                        </span>
                    </div>
                    <DialogTitle className="text-xl font-['Playfair_Display'] font-semibold text-slate-900 flex items-center gap-2">
                        <Bird className="w-5 h-5 text-amber-600" />
                        <span>Modificar Gallinas Vivas</span>
                    </DialogTitle>
                    <p className="text-xs text-slate-500">
                        Ajustá la cantidad actual de aves vivas para mantener tu stock y porcentaje de postura al día.
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    {/* Lot Selector if more than one lot exists and not locked to a specific lot */}
                    {!chicken && lotList.length > 1 && (
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700">
                                Seleccionar Lote a Modificar
                            </label>
                            <select
                                value={selectedId}
                                onChange={(e) => setSelectedId(e.target.value)}
                                className="w-full h-11 px-3 border border-slate-200 rounded-xl bg-slate-50/60 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                            >
                                {lotList.map((lot) => (
                                    <option key={lot.id} value={lot.id}>
                                        {lot.purchaseNumber ? `Lote #${lot.purchaseNumber} - ` : ""}
                                        {lot.supplier ? `${lot.supplier} - ` : ""}
                                        {formatUtcDate(lot.date)} ({formatNumber(lot.amount)} iniciales)
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Mode Toggle: Ajuste directo de vivas vs Modificar compra original */}
                    <div className="flex p-1 bg-slate-100 rounded-xl gap-1 text-xs font-semibold">
                        <button
                            type="button"
                            onClick={() => setMode("alive")}
                            className={`flex-1 py-1.5 rounded-lg transition ${
                                mode === "alive"
                                    ? "bg-white text-amber-900 shadow-2xs font-bold"
                                    : "text-slate-600 hover:text-slate-900"
                            }`}
                        >
                            Ajustar Gallinas Vivas
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode("lot")}
                            className={`flex-1 py-1.5 rounded-lg transition ${
                                mode === "lot"
                                    ? "bg-white text-amber-900 shadow-2xs font-bold"
                                    : "text-slate-600 hover:text-slate-900"
                            }`}
                        >
                            Editar Lote de Compra
                        </button>
                    </div>

                    {mode === "alive" ? (
                        <>
                            {/* Current Stats Box */}
                            <div className="bg-amber-50/50 border border-amber-200/70 rounded-xl p-3.5 space-y-2 text-xs">
                                <div className="flex justify-between items-center text-slate-600">
                                    <span>Lote Seleccionado:</span>
                                    <span className="font-bold text-slate-800">
                                        {activeChicken.purchaseNumber
                                            ? `Lote N° ${activeChicken.purchaseNumber}`
                                            : "Lote de Gallinas"}
                                        {activeChicken.supplier ? ` (${activeChicken.supplier})` : ""}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-slate-600">
                                    <span>Compradas Inicialmente:</span>
                                    <span className="font-semibold text-slate-800">
                                        {formatNumber(activeChicken.amount)} gallinas
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-slate-600">
                                    <span>Bajas Registradas:</span>
                                    <span className="font-semibold text-rose-600">
                                        {formatNumber(totalDeaths)} gallinas
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-1 border-t border-amber-200/60 font-bold">
                                    <span className="text-slate-700">Vivas Registradas Actualmente:</span>
                                    <span className="text-amber-900 text-sm font-extrabold">
                                        {formatNumber(initialAlive)}
                                    </span>
                                </div>
                            </div>

                            {/* Main Input: New Alive Count */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                                    <span>Cantidad Real de Gallinas Vivas Hoy</span>
                                    <span className="text-[11px] text-amber-700 font-semibold">
                                        Total deseado
                                    </span>
                                </label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={aliveCount}
                                    onChange={(e) =>
                                        setAliveCount(
                                            e.target.value === "" ? "" : parseInt(e.target.value) || 0
                                        )
                                    }
                                    placeholder="Ingresá cuántas gallinas vivas hay..."
                                    className="h-12 bg-white border-2 border-amber-300 text-slate-900 font-bold text-base rounded-xl px-3.5 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                                    autoFocus
                                />
                            </div>

                            {/* Difference and Impact indicator */}
                            {aliveCount !== "" && (
                                <div className="space-y-1 text-xs">
                                    {diff === 0 ? (
                                        <p className="text-slate-500 flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg">
                                            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                            <span>Misma cantidad actual ({formatNumber(initialAlive)} vivas).</span>
                                        </p>
                                    ) : diff < 0 ? (
                                        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-2.5 rounded-xl space-y-1">
                                            <div className="flex items-center gap-1.5 font-bold">
                                                <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                                <span>
                                                    Reducción de {formatNumber(Math.abs(diff))} aves
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-rose-700">
                                                El sistema registrará automáticamente las bajas correspondientes para que el total de aves vivas quede en{" "}
                                                <strong>{formatNumber(Number(aliveCount))}</strong> (total de bajas acumuladas: {formatNumber(newProjectedDeaths)}).
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 rounded-xl space-y-1">
                                            <div className="flex items-center gap-1.5 font-bold">
                                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                                <span>
                                                    Aumento de {formatNumber(diff)} aves vivas
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-emerald-700">
                                                {Number(aliveCount) > activeChicken.amount
                                                    ? `Supera la compra inicial de ${formatNumber(activeChicken.amount)}. Se actualizará también el tamaño del lote a ${formatNumber(Number(aliveCount))} aves.`
                                                    : `Se corregirá el registro de bajas acumuladas para reflejar ${formatNumber(Number(aliveCount))} gallinas vivas.`}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Note / reason */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700">
                                    Motivo / Observación del ajuste
                                </label>
                                <Input
                                    type="text"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Ej: Censo de galpón, recuento semanal..."
                                    className="h-10 bg-slate-50/60 border border-slate-200 text-slate-900 rounded-xl px-3 text-xs"
                                />
                            </div>
                        </>
                    ) : (
                        /* Mode 'lot': Edit original purchase */
                        <div className="space-y-3">
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800 flex items-start gap-2">
                                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                                <p>
                                    Usá esta opción si te equivocaste al crear el lote original (cambia la cantidad comprada, precio y costo total).
                                </p>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700">
                                    Proveedor
                                </label>
                                <Input
                                    type="text"
                                    value={lotData.supplier}
                                    onChange={(e) =>
                                        setLotData({ ...lotData, supplier: e.target.value })
                                    }
                                    placeholder="Nombre del proveedor"
                                    className="h-10 bg-slate-50/60 border border-slate-200 text-slate-900 rounded-xl px-3 text-xs"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700">
                                    Cantidad Comprada en el Lote
                                </label>
                                <Input
                                    type="number"
                                    min="1"
                                    value={lotData.amount || ""}
                                    onChange={(e) =>
                                        setLotData({
                                            ...lotData,
                                            amount: parseInt(e.target.value) || 0,
                                        })
                                    }
                                    className="h-10 bg-slate-50/60 border border-slate-200 text-slate-900 rounded-xl px-3 text-xs font-bold"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700">
                                    Precio Unitario ($ por gallina)
                                </label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={lotData.pricePerChicken || ""}
                                    onChange={(e) =>
                                        setLotData({
                                            ...lotData,
                                            pricePerChicken: parseFloat(e.target.value) || 0,
                                        })
                                    }
                                    className="h-10 bg-slate-50/60 border border-slate-200 text-slate-900 rounded-xl px-3 text-xs"
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex gap-2.5 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={loading}
                            className="flex-1 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl h-11 font-semibold cursor-pointer"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl h-11 shadow-sm transition active:scale-95 cursor-pointer disabled:opacity-50"
                        >
                            {loading ? "Guardando..." : "Guardar Cambios"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
