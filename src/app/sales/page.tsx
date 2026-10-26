"use client";

import { useState, useMemo } from "react";
import SaleCard from "@/components/sale-card";
import DateRangeFilter, { DateFilterPreset } from "@/components/date-range-filter";
import { Button } from "@/components/ui/button";
import LoadSpin from "@/components/load-spin";
import { useSales } from "@/hooks/useSales";
import {
    Plus,
    BarChart3,
    Table as TableIcon,
    LayoutGrid,
    Printer,
    DollarSign,
    Calendar,
    Search,
    Edit,
    Trash2,
    Eye,
    Receipt,
    CheckCircle2,
    Clock,
    AlertCircle,
} from "lucide-react";
import Link from "next/link";
import PaymentModal from "@/components/payment-modal";
import { formatCurrency, formatUtcDate } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function SalesPage() {
    const [preset, setPreset] = useState<DateFilterPreset>("all");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [showOutstandingOnly, setShowOutstandingOnly] = useState(false);
    const [viewMode, setViewMode] = useState<"ledger" | "cards">("ledger");
    const [searchTerm, setSearchTerm] = useState("");

    const { sales, isLoading, refresh } = useSales(
        preset === "all" ? undefined : preset,
        startDate || undefined,
        endDate || undefined
    );

    const handleDeleteSale = async (id: string) => {
        if (!confirm("¿Estás seguro de que deseas eliminar esta venta?")) return;
        try {
            await api.delete(`/sales/${id}`);
            toast.success("Venta eliminada con éxito");
            refresh();
        } catch (error) {
            toast.error("Error al eliminar la venta");
        }
    };

    // Filter sales by outstanding debt and search term
    const visibleSales = useMemo(() => {
        let list = sales;

        if (showOutstandingOnly) {
            list = list.filter((s: any) => s.status !== "PAID" && (s.remainingAmount > 0));
        }

        if (searchTerm.trim()) {
            const query = searchTerm.toLowerCase().trim();
            list = list.filter((s: any) => {
                const buyerMatch = s.buyer?.name?.toLowerCase().includes(query);
                const numberMatch = s.saleNumber?.toString().includes(query);
                return buyerMatch || numberMatch;
            });
        }

        return list;
    }, [sales, showOutstandingOnly, searchTerm]);

    // Financial summaries for the filtered period
    const totalInvoiced = useMemo(() => {
        return visibleSales.reduce((acc: number, s: any) => acc + (Number(s.totalAmount) || 0), 0);
    }, [visibleSales]);

    const totalPaid = useMemo(() => {
        return visibleSales.reduce((acc: number, s: any) => acc + (Number(s.amountPaid) || 0), 0);
    }, [visibleSales]);

    const totalDebt = useMemo(() => {
        return visibleSales.reduce((acc: number, s: any) => acc + (Number(s.remainingAmount) || 0), 0);
    }, [visibleSales]);

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

    const formatSaleItems = (sale: any) => {
        const items = [
            { label: "Extra", qty: sale.Extra },
            { label: "N°1", qty: sale.N1 },
            { label: "N°2", qty: sale.N2 },
            { label: "N°3", qty: sale.N3 },
            { label: "N°4", qty: sale.N4 },
        ].filter((i) => Number(i.qty) > 0);

        if (items.length === 0) return "Sin detalle";
        return items.map((i) => `${i.label}: ${i.qty}`).join(" • ");
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                            Registro de Operaciones
                        </span>
                        <span className="text-xs text-slate-400">Ventas de Huevos & Clientes</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-semibold text-slate-900">
                        Historial de Ventas & Libro Diario
                    </h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Registro cronológico de todas las ventas, entregas, facturación y cobranzas a clientes
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

                    <Link href="/sales/new">
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-4 py-2 font-semibold shadow-sm transition active:scale-95 flex items-center gap-1.5 cursor-pointer">
                            <Plus size={16} />
                            Nueva Venta
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
                        <p className="text-2xl font-black text-slate-900">
                            {formatCurrency(totalInvoiced)}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">
                            {visibleSales.length} ventas en el período
                        </p>
                    </div>

                    <div className="bg-emerald-50/60 rounded-2xl border border-emerald-200/80 p-4 shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
                            Total Cobrado
                        </p>
                        <p className="text-2xl font-black text-emerald-700">
                            {formatCurrency(totalPaid)}
                        </p>
                        <p className="text-[11px] text-emerald-600 mt-1">
                            Abonos percibidos
                        </p>
                    </div>

                    <div className={`rounded-2xl border p-4 shadow-sm ${
                        totalDebt > 0
                            ? "bg-rose-50/70 border-rose-200/90"
                            : "bg-emerald-50/70 border-emerald-200/90"
                    }`}>
                        <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${
                            totalDebt > 0 ? "text-rose-700" : "text-emerald-700"
                        }`}>
                            Saldo por Cobrar
                        </p>
                        <p className={`text-2xl font-black ${
                            totalDebt > 0 ? "text-rose-700" : "text-emerald-700"
                        }`}>
                            {totalDebt > 0 ? formatCurrency(totalDebt) : "$0 (Al día)"}
                        </p>
                        <p className={`text-[11px] mt-1 ${totalDebt > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                            {visibleSales.filter((s: any) => s.remainingAmount > 0).length} ventas con saldo
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex flex-col justify-between">
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                Efectividad Cobro
                            </p>
                            <p className="text-2xl font-black text-slate-900">
                                {totalInvoiced > 0
                                    ? `${Math.round((totalPaid / totalInvoiced) * 100)}%`
                                    : "100%"}
                            </p>
                        </div>
                        <span className="text-[11px] text-slate-500">
                            Cobrado vs Facturado
                        </span>
                    </div>
                </div>
            )}

            {/* Date Range Filter & Period Controls */}
            <DateRangeFilter
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                activePreset={preset}
                onSelectPreset={setPreset}
                showDebtToggle={true}
                showDebtOnly={showOutstandingOnly}
                setShowDebtOnly={setShowOutstandingOnly}
                debtLabel="Solo ventas con deuda pendiente"
                accentColor="emerald"
                totalCount={visibleSales.length}
            />

            {/* View Mode Controls & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-sm">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Buscar por cliente o N° de venta..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 h-10 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                </div>

                {/* View Switcher: Ledger Table vs Cards */}
                <div className="flex items-center gap-2 self-end sm:self-auto">
                    <span className="text-xs font-semibold text-slate-400 hidden sm:inline">
                        Modo de vista:
                    </span>
                    <div className="bg-slate-100 p-0.5 rounded-xl flex items-center border border-slate-200">
                        <button
                            type="button"
                            onClick={() => setViewMode("ledger")}
                            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                                viewMode === "ledger"
                                    ? "bg-white text-slate-900 shadow-2xs font-bold"
                                    : "text-slate-500 hover:text-slate-900"
                            }`}
                            title="Ver en tabla / libro diario"
                        >
                            <TableIcon className="w-3.5 h-3.5" />
                            <span>Libro Diario</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setViewMode("cards")}
                            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                                viewMode === "cards"
                                    ? "bg-white text-slate-900 shadow-2xs font-bold"
                                    : "text-slate-500 hover:text-slate-900"
                            }`}
                            title="Ver en tarjetas"
                        >
                            <LayoutGrid className="w-3.5 h-3.5" />
                            <span>Tarjetas</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Sales Operations Content */}
            {isLoading ? (
                <LoadSpin />
            ) : visibleSales.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                    <BarChart3 className="w-14 h-14 text-emerald-300 mx-auto" />
                    <p className="text-slate-700 text-lg font-bold">
                        No se encontraron operaciones de venta
                    </p>
                    <p className="text-slate-400 text-xs max-w-sm mx-auto">
                        {startDate || endDate || showOutstandingOnly || searchTerm
                            ? "Probá ajustando el rango de fechas o limpiando los filtros para ver más resultados."
                            : "Creá tu primera venta para empezar a llevar el registro."}
                    </p>
                </div>
            ) : viewMode === "ledger" ? (
                /* LEDGER / TABLE VIEW (Libro Diario de Ventas Completo) */
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50/90 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                                <tr>
                                    <th className="py-3 px-4">Fecha</th>
                                    <th className="py-3 px-4">N° Venta</th>
                                    <th className="py-3 px-4">Cliente</th>
                                    <th className="py-3 px-4">Detalle Huevos</th>
                                    <th className="py-3 px-4 text-right">Facturado</th>
                                    <th className="py-3 px-4 text-right">Cobrado</th>
                                    <th className="py-3 px-4 text-right">Saldo Deuda</th>
                                    <th className="py-3 px-4 text-center">Estado</th>
                                    <th className="py-3 px-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {visibleSales.map((sale: any) => {
                                    const badge = statusBadge[sale.status] || {
                                        className: "bg-slate-100 text-slate-700 border-slate-200",
                                        icon: Clock,
                                    };
                                    const StatusIcon = badge.icon;

                                    return (
                                        <tr
                                            key={sale.id}
                                            className="hover:bg-emerald-50/30 transition-colors"
                                        >
                                            <td className="py-3 px-4 font-semibold text-slate-700 whitespace-nowrap">
                                                {formatUtcDate(sale.date)}
                                            </td>

                                            <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                                                {sale.saleNumber ? `N° ${sale.saleNumber}` : `#${sale.id.slice(0, 8)}`}
                                            </td>

                                            <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                                                {sale.buyer ? (
                                                    <Link
                                                        href={`/buyers/${sale.buyer.id}`}
                                                        className="hover:text-emerald-700 hover:underline"
                                                    >
                                                        {sale.buyer.name}
                                                    </Link>
                                                ) : (
                                                    <span className="text-slate-400">Cliente</span>
                                                )}
                                            </td>

                                            <td className="py-3 px-4 text-slate-600 max-w-xs truncate font-medium">
                                                {formatSaleItems(sale)}
                                            </td>

                                            <td className="py-3 px-4 text-right font-bold text-slate-900 whitespace-nowrap">
                                                {formatCurrency(sale.totalAmount)}
                                            </td>

                                            <td className="py-3 px-4 text-right font-semibold text-emerald-700 whitespace-nowrap">
                                                {formatCurrency(sale.amountPaid)}
                                            </td>

                                            <td className="py-3 px-4 text-right font-black whitespace-nowrap">
                                                <span
                                                    className={
                                                        sale.remainingAmount > 0
                                                            ? "text-rose-600"
                                                            : "text-emerald-700"
                                                    }
                                                >
                                                    {sale.remainingAmount > 0
                                                        ? formatCurrency(sale.remainingAmount)
                                                        : "$0"}
                                                </span>
                                            </td>

                                            <td className="py-3 px-4 text-center whitespace-nowrap">
                                                <span
                                                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.className}`}
                                                >
                                                    <StatusIcon className="w-3 h-3" />
                                                    {sale.status}
                                                </span>
                                            </td>

                                            <td className="py-3 px-4 text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    {/* Register Payment button */}
                                                    {sale.status !== "PAID" && (
                                                        <PaymentModal
                                                            sale={sale}
                                                            endpoint="sales"
                                                            onSuccess={refresh}
                                                        >
                                                            <Button
                                                                size="sm"
                                                                className="h-8 px-2.5 text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg flex items-center gap-1 cursor-pointer"
                                                            >
                                                                <DollarSign className="w-3 h-3" />
                                                                <span>Cobrar</span>
                                                            </Button>
                                                        </PaymentModal>
                                                    )}

                                                    {/* View Detail */}
                                                    <Link href={`/sales/${sale.id}`}>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 px-2 text-xs text-slate-600 hover:text-slate-900 rounded-lg cursor-pointer"
                                                            title="Ver detalle de venta"
                                                        >
                                                            <Eye className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </Link>

                                                    {/* Edit */}
                                                    <Link href={`/sales/${sale.id}/edit`}>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 px-2 text-xs text-slate-600 hover:text-emerald-700 rounded-lg cursor-pointer"
                                                            title="Modificar venta"
                                                        >
                                                            <Edit className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </Link>

                                                    {/* Delete */}
                                                    <Button
                                                        onClick={() => handleDeleteSale(sale.id)}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 px-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                                                        title="Eliminar venta"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
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
                /* CARDS VIEW */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {visibleSales.map((sale: any) => (
                        <SaleCard key={sale.id} sale={sale} refresh={refresh} />
                    ))}
                </div>
            )}
        </div>
    );
}
