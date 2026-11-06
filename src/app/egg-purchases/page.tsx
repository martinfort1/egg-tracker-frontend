"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import LoadSpin from "@/components/load-spin";
import { api } from "@/lib/api";
import { formatCurrency, formatUtcDate } from "@/lib/utils";
import DateRangeFilter, { DateFilterPreset } from "@/components/date-range-filter";
import EggSupplierCard from "@/components/egg-supplier-card";
import EggPurchaseCard from "@/components/egg-purchase-card";
import PaymentModal from "@/components/payment-modal";
import {
    ShoppingCart,
    Users,
    Plus,
    Search,
    TrendingUp,
    Calendar,
    Table as TableIcon,
    LayoutGrid,
    CheckCircle2,
    Clock,
    AlertCircle,
    Eye,
    Edit,
    Trash2,
    DollarSign,
    Box,
    Check,
} from "lucide-react";
import { toast } from "sonner";

export default function EggPurchasesPage() {
    const [activeTab, setActiveTab] = useState<"suppliers" | "purchases">("suppliers");

    // Suppliers state
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [supplierSearch, setSupplierSearch] = useState("");

    // Purchases state
    const [purchases, setPurchases] = useState<any[]>([]);
    const [metrics, setMetrics] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Filters for purchases
    const [preset, setPreset] = useState<DateFilterPreset>("all");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [selectedSupplierId, setSelectedSupplierId] = useState<string>("all");
    const [purchaseSearch, setPurchaseSearch] = useState("");
    const [viewMode, setViewMode] = useState<"ledger" | "cards">("ledger");

    const fetchData = async (sDate = startDate, eDate = endDate) => {
        try {
            setIsLoading(true);
            const params: any = {};
            if (sDate) params.startDate = sDate;
            if (eDate) params.endDate = eDate;
            if (selectedSupplierId !== "all") params.supplierId = selectedSupplierId;

            const [suppliersRes, purchasesRes, metricsRes] = await Promise.all([
                api.get("/buyers?type=supplier"),
                api.get("/egg-purchases", { params }),
                api.get("/egg-purchases/metrics/summary"),
            ]);

            setSuppliers(suppliersRes.data || []);
            setPurchases(purchasesRes.data || []);
            setMetrics(metricsRes.data || null);
        } catch (error) {
            console.error(error);
            toast.error("Error al cargar datos de compras de huevos");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData(startDate, endDate);
    }, [startDate, endDate, selectedSupplierId]);

    const handleDateRangeChange = (start: string, end: string, newPreset: DateFilterPreset) => {
        setStartDate(start);
        setEndDate(end);
        setPreset(newPreset);
    };

    const handleDeletePurchase = async (purchaseId: string) => {
        if (!confirm("¿Eliminar esta compra de huevos?")) return;

        try {
            await api.delete(`/egg-purchases/${purchaseId}`);
            toast.success("Compra eliminada con éxito");
            fetchData();
        } catch (error) {
            toast.error("Error al eliminar compra");
        }
    };

    // Filtered suppliers
    const filteredSuppliers = useMemo(() => {
        if (!supplierSearch.trim()) return suppliers;
        const q = supplierSearch.toLowerCase().trim();
        return suppliers.filter(
            (s) => s.name?.toLowerCase().includes(q) || s.phone?.includes(q) || s.address?.toLowerCase().includes(q)
        );
    }, [suppliers, supplierSearch]);

    // Filtered purchases
    const filteredPurchases = useMemo(() => {
        let list = purchases;
        if (purchaseSearch.trim()) {
            const q = purchaseSearch.toLowerCase().trim();
            list = list.filter((p) => {
                const supplierMatch = p.supplier?.name?.toLowerCase().includes(q);
                const numberMatch = p.purchaseNumber?.toString().includes(q);
                return supplierMatch || numberMatch;
            });
        }
        return list;
    }, [purchases, purchaseSearch]);

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

    const formatEggItems = (p: any) => {
        const items = [
            { label: "Extra", qty: p.Extra },
            { label: "N°1", qty: p.N1 },
            { label: "N°2", qty: p.N2 },
            { label: "N°3", qty: p.N3 },
            { label: "N°4", qty: p.N4 },
        ].filter((i) => Number(i.qty) > 0);

        if (items.length === 0) return "Sin detalle";
        return items.map((i) => `${i.label}: ${i.qty}`).join(" • ");
    };

    const overallMargin =
        metrics?.totalCost > 0 ? (metrics?.totalEstimatedProfit / metrics?.totalCost) * 100 : 0;

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                            Módulo de Compras
                        </span>
                        <span className="text-xs text-slate-400">Huevos Comprados a Terceros</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-semibold text-slate-900 flex items-center gap-2.5">
                        <ShoppingCart className="w-7 h-7 text-amber-600" />
                        <span>Compra de Huevos</span>
                    </h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Gestioná tus proveedores de huevos, registrá compras de cajones y controlá los márgenes de ganancia.
                    </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                    <Link href="/buyers/new?role=supplier">
                        <Button
                            variant="outline"
                            className="border-slate-200 hover:bg-amber-50 hover:text-amber-800 text-slate-700 rounded-xl px-3.5 py-2 text-xs font-bold h-10 flex items-center gap-1.5 shadow-2xs"
                        >
                            <Users className="w-4 h-4 text-amber-600" />
                            <span>+ Nuevo Proveedor</span>
                        </Button>
                    </Link>

                    <Link href="/egg-purchases/new">
                        <Button className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl px-4 py-2 text-xs font-bold h-10 shadow-sm transition active:scale-95 flex items-center gap-2 cursor-pointer">
                            <Plus className="w-4 h-4" />
                            <span>+ Nueva Compra de Huevos</span>
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Top Financial Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                        Total Invertido (Costo)
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-slate-900 mt-1 block">
                        {formatCurrency(metrics?.totalCost || 0)}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">
                        {metrics?.totalPurchases || 0} compras de huevos
                    </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
                    <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider block">
                        Venta Total Proyectada
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-indigo-900 mt-1 block">
                        {formatCurrency(metrics?.totalExpectedRevenue || 0)}
                    </span>
                    <span className="text-[11px] text-indigo-400 mt-0.5 block">
                        Ingreso estimado al venderlos
                    </span>
                </div>

                <div className="bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-emerald-500/15 p-5 rounded-2xl border border-emerald-300 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5" />
                            Ganancia Neta
                        </span>
                        <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.2 rounded-full">
                            {overallMargin.toFixed(1)}%
                        </span>
                    </div>
                    <span className={`text-xl sm:text-2xl font-black mt-1 block ${(metrics?.totalEstimatedProfit || 0) >= 0 ? "text-emerald-700" : "text-rose-600"}`}>
                        {formatCurrency(metrics?.totalEstimatedProfit || 0)}
                    </span>
                    <span className="text-[11px] text-emerald-700 font-semibold mt-0.5 block">
                        Diferencia limpia proyectada
                    </span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm">
                    <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block">
                        Deuda a Proveedores
                    </span>
                    <span className={`text-xl sm:text-2xl font-black mt-1 block ${(metrics?.totalDebt || 0) > 0 ? "text-rose-600" : "text-emerald-700"}`}>
                        {(metrics?.totalDebt || 0) > 0 ? formatCurrency(metrics?.totalDebt || 0) : "$0"}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">
                        {(metrics?.totalDebt || 0) > 0 ? "Saldo pendiente por abonar" : "Sin deuda pendiente"}
                    </span>
                </div>
            </div>

            {/* Navigation Tabs (Proveedores vs Libro Diario) */}
            <div className="flex items-center gap-3 border-b border-slate-200 pb-1">
                <button
                    type="button"
                    onClick={() => setActiveTab("suppliers")}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                        activeTab === "suppliers"
                            ? "bg-slate-900 text-white shadow-xs"
                            : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50"
                    }`}
                >
                    <Users className="w-4 h-4" />
                    <span>Proveedores de Huevos ({suppliers.length})</span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("purchases")}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                        activeTab === "purchases"
                            ? "bg-slate-900 text-white shadow-xs"
                            : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50"
                    }`}
                >
                    <Box className="w-4 h-4" />
                    <span>Compras / Libro Diario ({purchases.length})</span>
                </button>
            </div>

            {/* TAB 1: SUPPLIERS (Estilo Buyers pero yo soy el comprador) */}
            {activeTab === "suppliers" && (
                <div className="space-y-4">
                    {/* Supplier Search Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="relative flex-1 max-w-md">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Buscar proveedor por nombre, teléfono o dirección..."
                                value={supplierSearch}
                                onChange={(e) => setSupplierSearch(e.target.value)}
                                className="w-full pl-9 pr-3 h-10 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                            />
                        </div>

                        <span className="text-xs text-slate-400 font-medium">
                            {filteredSuppliers.length} proveedores registrados
                        </span>
                    </div>

                    {isLoading ? (
                        <LoadSpin />
                    ) : filteredSuppliers.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-amber-200 shadow-sm space-y-3">
                            <Users className="w-14 h-14 text-amber-300 mx-auto" />
                            <p className="text-slate-700 text-lg font-bold">
                                {supplierSearch ? "No se encontraron proveedores" : "No tenés proveedores de huevos registrados todavía"}
                            </p>
                            <p className="text-slate-400 text-xs max-w-md mx-auto">
                                Podés dar de alta a los contactos a quienes les comprás huevos para llevar su seguimiento y estado de cuenta.
                            </p>
                            <Link href="/buyers/new?role=supplier" className="inline-block pt-2">
                                <Button className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold px-4 py-2">
                                    + Agregar Primer Proveedor
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {filteredSuppliers.map((supplier) => (
                                <EggSupplierCard key={supplier.id} supplier={supplier} refresh={fetchData} />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* TAB 2: PURCHASES / LIBRO DIARIO */}
            {activeTab === "purchases" && (
                <div className="space-y-4">
                    {/* Date Filter */}
                    <DateRangeFilter
                        startDate={startDate}
                        setStartDate={setStartDate}
                        endDate={endDate}
                        setEndDate={setEndDate}
                        activePreset={preset}
                        onSelectPreset={setPreset}
                        accentColor="amber"
                        totalCount={filteredPurchases.length}
                    />

                    {/* Search & View Mode Switcher */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 max-w-xl">
                            <div className="relative flex-1">
                                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Buscar por proveedor o N° de compra..."
                                    value={purchaseSearch}
                                    onChange={(e) => setPurchaseSearch(e.target.value)}
                                    className="w-full pl-9 pr-3 h-10 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                                />
                            </div>

                            {suppliers.length > 0 && (
                                <select
                                    value={selectedSupplierId}
                                    onChange={(e) => setSelectedSupplierId(e.target.value)}
                                    className="h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:border-amber-500 cursor-pointer max-w-[210px] truncate"
                                >
                                    <option value="all">Todos los Proveedores ({suppliers.length})</option>
                                    {suppliers.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <div className="bg-slate-100 p-0.5 rounded-xl flex items-center border border-slate-200 self-end sm:self-auto">
                            <button
                                type="button"
                                onClick={() => setViewMode("ledger")}
                                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                                    viewMode === "ledger" ? "bg-white text-slate-900 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-900"
                                }`}
                            >
                                <TableIcon className="w-3.5 h-3.5" />
                                <span>Libro Diario</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setViewMode("cards")}
                                className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                                    viewMode === "cards" ? "bg-white text-slate-900 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-900"
                                }`}
                            >
                                <LayoutGrid className="w-3.5 h-3.5" />
                                <span>Tarjetas</span>
                            </button>
                        </div>
                    </div>

                    {isLoading ? (
                        <LoadSpin />
                    ) : filteredPurchases.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                            <Box className="w-14 h-14 text-amber-300 mx-auto" />
                            <p className="text-slate-700 text-lg font-bold">
                                No se encontraron compras de huevos
                            </p>
                            <p className="text-slate-400 text-xs max-w-sm mx-auto">
                                Registrá tu primera compra para empezar a llevar el seguimiento de costos y margen de ganancias.
                            </p>
                            <Link href="/egg-purchases/new" className="inline-block pt-1">
                                <Button className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold">
                                    + Registrar Primera Compra
                                </Button>
                            </Link>
                        </div>
                    ) : viewMode === "ledger" ? (
                        /* Ledger Table View */
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                                        <tr>
                                            <th className="py-3 px-4">Fecha</th>
                                            <th className="py-3 px-4">N° Compra</th>
                                            <th className="py-3 px-4">Proveedor</th>
                                            <th className="py-3 px-4">Detalle Cajones</th>
                                            <th className="py-3 px-4 text-right">Costo Compra</th>
                                            <th className="py-3 px-4 text-right">Venta Proyectada</th>
                                            <th className="py-3 px-4 text-right">Ganancia Neta</th>
                                            <th className="py-3 px-4 text-right">Saldo Deuda</th>
                                            <th className="py-3 px-4 text-center">Estado</th>
                                            <th className="py-3 px-4 text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredPurchases.map((p: any) => {
                                            const badge = statusBadge[p.status] || {
                                                className: "bg-slate-100 text-slate-700 border-slate-200",
                                                icon: Clock,
                                            };
                                            const StatusIcon = badge.icon;

                                            return (
                                                <tr key={p.id} className="hover:bg-amber-50/25 transition-colors">
                                                    <td className="py-3 px-4 font-semibold text-slate-700 whitespace-nowrap">
                                                        {formatUtcDate(p.date)}
                                                    </td>

                                                    <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                                                        {p.purchaseNumber ? `N° ${p.purchaseNumber}` : `#${p.id.slice(0, 8)}`}
                                                    </td>

                                                    <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                                                        {p.supplier ? (
                                                            <Link
                                                                href={`/egg-purchases/suppliers/${p.supplier.id}`}
                                                                className="hover:text-amber-700 hover:underline"
                                                            >
                                                                {p.supplier.name}
                                                            </Link>
                                                        ) : (
                                                            <span className="text-slate-400">Proveedor</span>
                                                        )}
                                                    </td>

                                                    <td className="py-3 px-4 text-slate-600 font-medium max-w-xs truncate">
                                                        {formatEggItems(p)}
                                                    </td>

                                                    <td className="py-3 px-4 text-right font-bold text-slate-900 whitespace-nowrap">
                                                        {formatCurrency(p.totalCost)}
                                                    </td>

                                                    <td className="py-3 px-4 text-right font-semibold text-indigo-700 whitespace-nowrap">
                                                        {formatCurrency(p.expectedRevenue)}
                                                    </td>

                                                    <td className={`py-3 px-4 text-right font-extrabold whitespace-nowrap ${p.estimatedProfit >= 0 ? "text-emerald-700" : "text-rose-600"}`}>
                                                        {formatCurrency(p.estimatedProfit)}
                                                    </td>

                                                    <td className="py-3 px-4 text-right font-black whitespace-nowrap">
                                                        <span className={p.remainingAmount > 0 ? "text-rose-600" : "text-emerald-700"}>
                                                            {p.remainingAmount > 0 ? formatCurrency(p.remainingAmount) : "$0"}
                                                        </span>
                                                    </td>

                                                    <td className="py-3 px-4 text-center whitespace-nowrap">
                                                        {p.status !== "PAID" ? (
                                                            <PaymentModal
                                                                sale={p}
                                                                endpoint="egg-purchases"
                                                                onSuccess={fetchData}
                                                            >
                                                                <button
                                                                    type="button"
                                                                    title="Hacé clic para pagar"
                                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 ${badge.className} hover:border-emerald-400 group/status`}
                                                                >
                                                                    <StatusIcon className="w-3.5 h-3.5" />
                                                                    <span>{p.status}</span>
                                                                    <span className="text-[10px] bg-white/90 px-1.5 py-0.5 rounded-md font-bold text-emerald-800 border border-emerald-200 group-hover/status:bg-emerald-600 group-hover/status:text-white transition-colors flex items-center gap-0.5">
                                                                        <DollarSign className="w-2.5 h-2.5" />
                                                                        <span>Pagar</span>
                                                                    </span>
                                                                </button>
                                                            </PaymentModal>
                                                        ) : (
                                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${badge.className}`}>
                                                                <StatusIcon className="w-3.5 h-3.5" />
                                                                <span>{p.status}</span>
                                                            </span>
                                                        )}
                                                    </td>

                                                    <td className="py-3 px-4 text-right whitespace-nowrap">
                                                        <div className="flex items-center justify-end gap-1.5">
                                                            <Link href={`/egg-purchases/${p.id}`}>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 px-2 text-xs text-slate-600 hover:text-slate-900 rounded-lg cursor-pointer"
                                                                    title="Ver detalle de compra"
                                                                >
                                                                    <Eye className="w-3.5 h-3.5" />
                                                                </Button>
                                                            </Link>

                                                            <Link href={`/egg-purchases/${p.id}/edit`}>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 px-2 text-xs text-slate-600 hover:text-amber-800 rounded-lg cursor-pointer"
                                                                    title="Editar compra"
                                                                >
                                                                    <Edit className="w-3.5 h-3.5" />
                                                                </Button>
                                                            </Link>

                                                            <Button
                                                                onClick={() => handleDeletePurchase(p.id)}
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 px-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                                                                title="Eliminar compra"
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
                        /* Cards View */
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                            {filteredPurchases.map((purchase: any) => (
                                <EggPurchaseCard key={purchase.id} purchase={purchase} refresh={fetchData} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
