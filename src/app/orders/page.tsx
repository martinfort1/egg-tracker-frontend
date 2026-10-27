"use client";

import OrderRow from "@/components/order-row";
import LoadSpin from "@/components/load-spin";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { ClipboardList, Plus, Search, Calendar, PackageCheck, Clock, Repeat, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import DateRangeFilter, { DateFilterPreset } from "@/components/date-range-filter";
import { formatCurrency, isOrderVisible } from "@/lib/utils";

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [preset, setPreset] = useState<DateFilterPreset>("all");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState("");
    const [showAllFutureRecurring, setShowAllFutureRecurring] = useState(false);

    const fetchOrders = async (sDate = startDate, eDate = endDate) => {
        try {
            setIsLoading(true);
            const params: any = {};
            if (sDate) params.startDate = sDate;
            if (eDate) params.endDate = eDate;
            const res = await api.get("/orders", { params });
            setOrders(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Error al cargar las órdenes");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(startDate, endDate);
    }, [startDate, endDate]);

    // Count of fixed-day orders hidden until the day before delivery
    const hiddenFutureCount = useMemo(() => {
        return orders.filter((item) => {
            const order = item.order || item;
            return order.status === "PENDING" && !isOrderVisible(order);
        }).length;
    }, [orders]);

    const filteredOrders = useMemo(() => {
        let list = orders;

        // Hide fixed-day orders before the day before delivery
        if (!showAllFutureRecurring) {
            list = list.filter((item) => isOrderVisible(item));
        }

        if (searchTerm.trim()) {
            const query = searchTerm.toLowerCase().trim();
            list = list.filter((item) => {
                const order = item.order || item;
                const buyerName = order.buyer?.name?.toLowerCase() || "";
                return buyerName.includes(query);
            });
        }

        return list;
    }, [orders, showAllFutureRecurring, searchTerm]);

    const [upcomingOrders, pastOrders] = useMemo(() => {
        const sorted = [...filteredOrders].sort(
            (a, b) =>
                new Date((b.order || b).date).getTime() -
                new Date((a.order || a).date).getTime()
        );

        const now = new Date();
        const upcoming: any[] = [];
        const past: any[] = [];

        sorted.forEach((item) => {
            const order = item.order || item;
            const orderDate = new Date(order.date);
            if (orderDate >= now) {
                upcoming.push(item);
            } else {
                past.push(item);
            }
        });

        return [upcoming, past];
    }, [filteredOrders]);

    const totalProjectedAmount = useMemo(() => {
        return filteredOrders.reduce((acc, item) => {
            const order = item.order || item;
            return acc + (Number(order.totalAmount) || 0);
        }, 0);
    }, [filteredOrders]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div className="max-w-2xl">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                            Pedidos & Entregas
                        </span>
                        <span className="text-xs text-slate-400">Programación de envíos</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-semibold text-slate-900">
                        Historial de Órdenes de Clientes
                    </h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Revisa órdenes pendientes, programa entregas futuras o consulta el historial de pedidos pasados.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setShowAllFutureRecurring(!showAllFutureRecurring)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition active:scale-95 cursor-pointer shadow-2xs ${
                            showAllFutureRecurring
                                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        }`}
                        title="Alternar visibilidad de órdenes fijas futuras"
                    >
                        {showAllFutureRecurring ? (
                            <>
                                <Eye className="w-3.5 h-3.5" />
                                <span>Ocultar Fijas Lejanas</span>
                            </>
                        ) : (
                            <>
                                <EyeOff className="w-3.5 h-3.5 text-indigo-600" />
                                <span>Mostrar Fijas Futuras {hiddenFutureCount > 0 ? `(${hiddenFutureCount})` : ""}</span>
                            </>
                        )}
                    </button>

                    <Link href="/orders/new">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2 font-medium shadow-sm transition active:scale-95 flex items-center gap-2 cursor-pointer w-full sm:w-auto">
                            <Plus className="w-4 h-4 mr-1" />
                            Nueva Orden
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Summary Metrics */}
            {!isLoading && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                            Total Órdenes
                        </p>
                        <p className="text-xl sm:text-2xl font-bold text-slate-900">
                            {filteredOrders.length}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                            En el período seleccionado
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                            Próximas a Entregar
                        </p>
                        <p className="text-xl sm:text-2xl font-bold text-indigo-600">
                            {upcomingOrders.length}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                            Fechas futuras o hoy
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                            Órdenes Históricas
                        </p>
                        <p className="text-xl sm:text-2xl font-bold text-slate-600">
                            {pastOrders.length}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                            Fechas anteriores
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                            Monto Total Proyectado
                        </p>
                        <p className="text-xl sm:text-2xl font-bold text-emerald-600">
                            {formatCurrency(totalProjectedAmount)}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                            Valor total estimado
                        </p>
                    </div>
                </div>
            )}

            {/* Filter Bar */}
            <div className="space-y-3">
                <DateRangeFilter
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    activePreset={preset}
                    onSelectPreset={setPreset}
                    accentColor="indigo"
                    totalCount={filteredOrders.length}
                />

                <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
                    <div className="relative max-w-md">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar órdenes por comprador / cliente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-700"
                        />
                    </div>
                </div>

                {/* Future Fixed Orders Notice & Direct Action Banner */}
                {!showAllFutureRecurring && hiddenFutureCount > 0 && (
                    <div className="bg-indigo-50/70 border border-indigo-200/90 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-indigo-950">
                                    Hay {hiddenFutureCount} {hiddenFutureCount === 1 ? "orden fija futura programada" : "órdenes fijas futuras programadas"}
                                </p>
                                <p className="text-[11px] text-slate-500">
                                    Por defecto aparecen desde el día anterior a su fecha de entrega para no saturar tu lista de trabajo.
                                </p>
                            </div>
                        </div>
                        <Button
                            type="button"
                            onClick={() => setShowAllFutureRecurring(true)}
                            size="sm"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold px-3.5 h-8.5 shrink-0 flex items-center gap-1.5 cursor-pointer shadow-sm transition active:scale-95"
                        >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Hacerlas Visibles Ahora</span>
                        </Button>
                    </div>
                )}

                {showAllFutureRecurring && hiddenFutureCount > 0 && (
                    <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3 px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-amber-900 shadow-2xs">
                        <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-amber-600 shrink-0" />
                            <span>
                                Mostrando <strong>todas</strong> las órdenes futuras programadas en el listado.
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowAllFutureRecurring(false)}
                            className="text-xs font-bold text-amber-800 hover:text-amber-950 underline cursor-pointer shrink-0"
                        >
                            Volver a ocultar fijas lejanas
                        </button>
                    </div>
                )}
            </div>

            {isLoading ? (
                <LoadSpin />
            ) : filteredOrders.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                    <ClipboardList className="w-14 h-14 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 text-lg font-medium">No se encontraron órdenes</p>
                    <p className="text-slate-400 text-sm mt-1">
                        {orders.length > 0
                            ? "Prueba modificando el rango de fechas seleccionado"
                            : "Crea tu primera orden para comenzar"}
                    </p>
                </div>
            ) : (
                <div className="space-y-10">
                    {upcomingOrders.length > 0 && (
                        <section className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] text-indigo-600 font-bold mb-1">
                                        Próximas Entregas (Activas)
                                    </p>
                                    <p className="text-slate-600 text-sm">
                                        Órdenes programadas para entrega activa.
                                    </p>
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    {hiddenFutureCount > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => setShowAllFutureRecurring(!showAllFutureRecurring)}
                                            className="text-xs text-indigo-700 hover:text-indigo-900 font-semibold bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1 rounded-xl transition cursor-pointer flex items-center gap-1.5"
                                            title="Las órdenes por día fijo se muestran desde 1 día antes al día de entrega"
                                        >
                                            <Repeat className="w-3.5 h-3.5" />
                                            <span>
                                                {showAllFutureRecurring
                                                    ? "Ocultar fijas lejanas"
                                                    : `${hiddenFutureCount} fija futura oculta (visible desde el día anterior)`}
                                            </span>
                                        </button>
                                    )}
                                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                                        {upcomingOrders.length} activas
                                    </span>
                                </div>
                            </div>
                            <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm bg-white">
                                {upcomingOrders.map((item, index) => (
                                    <div key={(item.order || item).id}>
                                        <OrderRow item={item} onRefresh={() => fetchOrders(startDate, endDate)} />
                                        {index < upcomingOrders.length - 1 && (
                                            <div className="h-px bg-gray-100" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {pastOrders.length > 0 && (
                        <section className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-bold mb-1">
                                        Historial de Órdenes Anteriores
                                    </p>
                                    <p className="text-slate-600 text-sm">
                                        Órdenes completadas o vencidas en fechas pasadas.
                                    </p>
                                </div>
                                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                    {pastOrders.length} pasadas
                                </span>
                            </div>
                            <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm bg-white">
                                {pastOrders.map((item, index) => (
                                    <div key={(item.order || item).id}>
                                        <OrderRow item={item} onRefresh={() => fetchOrders(startDate, endDate)} />
                                        {index < pastOrders.length - 1 && (
                                            <div className="h-px bg-gray-100" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            )}
        </div>
    );
}
