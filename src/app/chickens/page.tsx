"use client";

import { MetricCard } from "@/components/metric-card";
import { MetricCardValue } from "@/components/metric-card-value";
import { AddChickenForm } from "@/components/add-chicken-form";
import { AddChickenDeathForm } from "@/components/add-chicken-death-form";
import { ChickenQuantityChart } from "@/components/chicken-quantity-chart";
import { LayingPercentageChart } from "@/components/laying-percentage-chart";
import { LayingPercentageHistoryChart } from "@/components/laying-percentage-history-chart";
import { ChickenPurchaseCard } from "@/components/chicken-purchase-card";
import { api } from "@/lib/api";
import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import LoadSpin from "@/components/load-spin";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatUtcDate } from "@/lib/utils";
import { Bird, Plus, AlertTriangle, Layers, DollarSign } from "lucide-react";

export default function ChickensPage() {
    const [chickens, setChickens] = useState<any[]>([]);
    const [currentCount, setCurrentCount] = useState(0);
    const [history, setHistory] = useState<any[]>([]);
    const [layingHistory, setLayingHistory] = useState<any[]>([]);
    const [laying, setLaying] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedChickenId, setSelectedChickenId] = useState<string | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [chickensRes, historyRes, layingHistoryRes] = await Promise.all([
                api.get("/chickens"),
                api.get("/chickens/history"),
                api.get("/chickens/laying-percentage-history"),
            ]);

            setChickens(chickensRes.data || []);
            setHistory(historyRes.data || []);
            setLayingHistory(layingHistoryRes.data || []);
            setLaying(
                layingHistoryRes.data?.length
                    ? layingHistoryRes.data[layingHistoryRes.data.length - 1].percentage
                    : 0
            );
        } catch (err) {
            console.error("Failed to fetch data:", err);
            toast.error("Error al cargar datos de gallinas");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (chickens.length > 0) {
            getCurrentCount();
        }
    }, [chickens]);

    const getCurrentCount = async () => {
        try {
            const res = await api.get("/chickens/current-count");
            setCurrentCount(res.data);
        } catch (err) {
            console.error("Failed to fetch current count:", err);
        }
    };

    const handleDeleteChicken = async (id: string) => {
        if (!confirm("¿Estás seguro de que deseas eliminar este lote de gallinas?")) return;

        try {
            await api.delete(`/chickens/${id}`);
            toast.success("Lote de gallinas eliminado exitosamente");
            fetchData();
        } catch (err) {
            toast.error("Error al eliminar lote de gallinas");
        }
    };

    const totalInvested = useMemo(() => {
        return chickens.reduce((sum, c) => sum + (Number(c.totalCost) || 0), 0);
    }, [chickens]);

    const totalDebt = useMemo(() => {
        return chickens.reduce(
            (sum, c) =>
                sum +
                Number(
                    c.remainingAmount ??
                        Math.max(0, (c.totalCost || 0) - (c.amountPaid || 0))
                ),
            0
        );
    }, [chickens]);

    if (isLoading) {
        return <LoadSpin />;
    }

    const chartData = history.map((item: any) => ({
        date: item.date,
        count: item.count,
        event: item.event,
    }));

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                            Plantel de Gallinas
                        </span>
                        <span className="text-xs text-slate-400">Control de Lotes & Producción</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-semibold text-slate-900">
                        Control y Compra de Gallinas
                    </h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Registro de lotes de aves, proveedores, precios, estado de pagos y mortandad
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <AddChickenForm onSuccess={fetchData} />
                </div>
            </div>

            {/* Financial & Population Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Gallinas Vivas
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-slate-900">
                        {currentCount} <span className="text-sm font-medium text-slate-400">aves</span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                        Plantel actual en granja
                    </p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        % de Postura
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-amber-600">
                        {laying.toFixed(2)}%
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                        Eficiencia de producción
                    </p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Inversión Total Lotes
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-slate-900">
                        {formatCurrency(totalInvested)}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                        {chickens.length} {chickens.length === 1 ? "lote adquirido" : "lotes adquiridos"}
                    </p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Saldo Adeudado
                    </p>
                    <p className={`text-xl sm:text-2xl font-bold ${totalDebt === 0 ? "text-emerald-700" : "text-rose-600"}`}>
                        {totalDebt === 0 ? "Saldado" : formatCurrency(totalDebt)}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                        Pendiente en lotes
                    </p>
                </div>
            </div>

            {/* Charts Row - Quantity and Laying Percentage Over Time */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChickenQuantityChart data={chartData} />
                <LayingPercentageHistoryChart data={layingHistory} />
            </div>

            {/* Current Laying Percentage & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-full">
                    <LayingPercentageChart percentage={laying} />
                </div>

                <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200/90 flex flex-col justify-between h-full space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-sm shadow-amber-500/20 shrink-0">
                                <Bird className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                                    Acciones Rápidas
                                </h2>
                                <p className="text-xs text-slate-500">
                                    Registrar compras de lotes y bajas del plantel
                                </p>
                            </div>
                        </div>
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                            Operaciones
                        </span>
                    </div>

                    <div className="space-y-3 flex-1 flex flex-col justify-center">
                        <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200/70 space-y-2">
                            <p className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                                Comprar Aves
                            </p>
                            <p className="text-xs text-slate-600">
                                Registrá un nuevo lote ingresando proveedor, cantidad, precio y condición de pago.
                            </p>
                            <AddChickenForm onSuccess={fetchData} />
                        </div>

                        {chickens.length > 0 && (
                            <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-200/70 space-y-2">
                                <p className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                                    Registrar Bajas en un Lote
                                </p>
                                <select
                                    value={selectedChickenId || ""}
                                    onChange={(e) => setSelectedChickenId(e.target.value || null)}
                                    className="w-full h-10 px-3 border border-rose-200 rounded-xl bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                                >
                                    <option value="">Seleccionar lote correspondiente...</option>
                                    {chickens.map((chicken) => (
                                        <option key={chicken.id} value={chicken.id}>
                                            {chicken.purchaseNumber ? `Lote #${chicken.purchaseNumber} - ` : ""}
                                            {chicken.supplier ? `${chicken.supplier} - ` : ""}
                                            {formatUtcDate(chicken.date)} ({chicken.amount} gallinas)
                                        </option>
                                    ))}
                                </select>
                                {selectedChickenId && (
                                    <div className="pt-1">
                                        <AddChickenDeathForm
                                            chickenId={selectedChickenId}
                                            onSuccess={fetchData}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Purchase History Cards */}
            <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-['Playfair_Display'] font-semibold text-slate-900">
                            Historial de Compras de Lotes
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Control detallado de compras, saldo adeudado y gallinas restantes por pagar
                        </p>
                    </div>
                    {chickens.length > 0 && (
                        <span className="text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full">
                            {chickens.length} {chickens.length === 1 ? "lote registrado" : "lotes registrados"}
                        </span>
                    )}
                </div>

                {chickens.length === 0 ? (
                    <div className="bg-white p-12 rounded-2xl border border-amber-100 shadow-sm text-center">
                        <Bird className="w-14 h-14 text-amber-300 mx-auto mb-3" />
                        <p className="text-slate-700 text-lg font-medium">No hay compras de gallinas registradas</p>
                        <p className="text-slate-400 text-sm mt-1">
                            Hacé clic en "Nueva Compra de Gallinas" para registrar tu primer lote.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {chickens.map((chicken) => (
                            <ChickenPurchaseCard
                                key={chicken.id}
                                chicken={chicken}
                                onDelete={handleDeleteChicken}
                                onRefresh={fetchData}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
