"use client";

import FeedBagCard from "@/components/feed-bag-card";
import { Button } from "@/components/ui/button";
import LoadSpin from "@/components/load-spin";
import { api } from "@/lib/api";
import {
    Package,
    Plus,
    Calendar,
    DollarSign,
    CheckCircle2,
    Clock,
    AlertCircle,
    Edit,
    Trash2,
    Layers,
    FileText,
    Table as TableIcon,
    LayoutGrid,
    Printer,
    History,
    Receipt,
    Search,
    MessageSquare,
    ArrowUpRight,
    ArrowDownRight,
    ArrowRightLeft,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import PaymentModal from "@/components/payment-modal";
import PaymentHistoryModal from "@/components/payment-history-modal";
import AllFeedPaymentsModal from "@/components/all-feed-payments-modal";
import DateRangeFilter, { DateFilterPreset } from "@/components/date-range-filter";
import { toast } from "sonner";
import { formatCurrency, formatUtcDate } from "@/lib/utils";

interface FeedOperation {
    id: string;
    type: "purchase" | "payment";
    date: string;
    number: number;
    label: string;
    item: any;
}

export default function FeedBagsSupplierStatementPage() {
    const [feedBags, setFeedBags] = useState<any[]>([]);
    const [payments, setPayments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [metrics, setMetrics] = useState({ totalOwed: 0, unpaidCount: 0 });
    const [viewMode, setViewMode] = useState<"ledger" | "cards">("ledger");
    const [operationTypeFilter, setOperationTypeFilter] = useState<"all" | "purchases" | "payments">("all");
    const [filterOnlyDebt, setFilterOnlyDebt] = useState(false);
    const [preset, setPreset] = useState<DateFilterPreset>("all");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState("");

    const fetchData = async (sDate = startDate, eDate = endDate) => {
        try {
            setIsLoading(true);
            const params: any = {};
            if (sDate) params.startDate = sDate;
            if (eDate) params.endDate = eDate;

            const [feedBagsRes, paymentsRes, metricsRes] = await Promise.all([
                api.get("/feed-bags", { params }),
                api.get("/feed-bags/payments/all", { params }),
                api.get("/feed-bags/metrics/summary"),
            ]);

            setFeedBags(feedBagsRes.data || []);
            setPayments(paymentsRes.data || []);
            setMetrics(metricsRes.data || { totalOwed: 0, unpaidCount: 0 });
        } catch (err) {
            console.error("Failed to fetch feed bag operations:", err);
            toast.error("Error al cargar las operaciones de alimento");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData(startDate, endDate);
    }, [startDate, endDate]);

    const handlePaymentSuccess = () => {
        setTimeout(() => {
            fetchData();
            toast.success("Pago registrado exitosamente");
        }, 1200);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de que deseas eliminar esta compra?")) return;

        try {
            await api.delete(`/feed-bags/${id}`);
            toast.success("Compra de alimento eliminada correctamente");
            fetchData();
        } catch (error) {
            toast.error("Error al eliminar la compra");
        }
    };

    // Build unified operations list (Purchases and Payments)
    const allOperations = useMemo<FeedOperation[]>(() => {
        const purchaseOps: FeedOperation[] = feedBags.map((f) => ({
            id: `purchase-${f.id}`,
            type: "purchase",
            date: f.date,
            number: f.purchaseNumber || 0,
            label: f.purchaseNumber ? `Compra N° ${f.purchaseNumber}` : `Compra #${f.id.slice(0, 8)}`,
            item: f,
        }));

        const paymentOps: FeedOperation[] = payments.map((p) => ({
            id: `payment-${p.id}`,
            type: "payment",
            date: p.date,
            number: p.paymentNumber || 0,
            label: p.paymentNumber ? `Pago N° ${p.paymentNumber}` : `Pago #${p.id.slice(0, 8)}`,
            item: p,
        }));

        return [...purchaseOps, ...paymentOps].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    }, [feedBags, payments]);

    // Apply filtering to operations
    const filteredOperations = useMemo(() => {
        let list = allOperations;

        // Filter by operation type
        if (operationTypeFilter === "purchases") {
            list = list.filter((op) => op.type === "purchase");
        } else if (operationTypeFilter === "payments") {
            list = list.filter((op) => op.type === "payment");
        }

        // Filter by outstanding debt
        if (filterOnlyDebt) {
            list = list.filter((op) => {
                if (op.type === "purchase") {
                    return op.item.status !== "PAID" && Number(op.item.remainingAmount) > 0;
                }
                if (op.type === "payment") {
                    return Number(op.item.feedBag?.remainingAmount) > 0;
                }
                return false;
            });
        }

        // Search filter
        if (searchTerm.trim()) {
            const query = searchTerm.toLowerCase().trim();
            list = list.filter((op) => {
                const labelMatch = op.label.toLowerCase().includes(query);
                const dateMatch = formatUtcDate(op.date).toLowerCase().includes(query);
                const numMatch = op.number.toString().includes(query);

                if (op.type === "purchase") {
                    const phaseMatch = `fase ${op.item.phase}`.includes(query);
                    const amountMatch = op.item.amount?.toString().includes(query);
                    const totalMatch = op.item.totalAmount?.toString().includes(query);
                    return labelMatch || dateMatch || numMatch || phaseMatch || amountMatch || totalMatch;
                }

                if (op.type === "payment") {
                    const noteMatch = op.item.note?.toLowerCase().includes(query);
                    const amountMatch = op.item.amount?.toString().includes(query);
                    const linkedPurchaseMatch = op.item.feedBag?.purchaseNumber?.toString().includes(query);
                    return labelMatch || dateMatch || numMatch || noteMatch || amountMatch || linkedPurchaseMatch;
                }

                return labelMatch || dateMatch;
            });
        }

        return list;
    }, [allOperations, operationTypeFilter, filterOnlyDebt, searchTerm]);

    // Financial totals
    const totalPurchased = feedBags.reduce((acc, f) => acc + (Number(f.totalAmount) || 0), 0);
    const totalPaid = payments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
    const totalBags = feedBags.reduce((acc, f) => acc + (Number(f.amount) || 0), 0);
    const totalDebt = metrics.totalOwed > 0
        ? metrics.totalOwed
        : feedBags.reduce((acc, f) => acc + (Number(f.remainingAmount) || 0), 0);

    const statusBadge: Record<string, { className: string; icon: any; label: string }> = {
        PAID: {
            className: "bg-emerald-50 text-emerald-700 border-emerald-200",
            icon: CheckCircle2,
            label: "Pagado",
        },
        PARTIAL: {
            className: "bg-amber-50 text-amber-700 border-amber-200",
            icon: Clock,
            label: "Parcial",
        },
        UNPAID: {
            className: "bg-rose-50 text-rose-700 border-rose-200",
            icon: AlertCircle,
            label: "Impago",
        },
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full">
                            Estado de Cuenta de Proveedores
                        </span>
                        <span className="text-xs text-slate-400">Nutrición & Alimento Balanceado</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-semibold text-slate-900">
                        Historial de Alimento & Proveedores
                    </h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Libro diario consolidado de compras de alimento, abonos y pagos correlativos a proveedores
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <AllFeedPaymentsModal />

                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs transition active:scale-95 cursor-pointer"
                    >
                        <Printer className="w-3.5 h-3.5 text-slate-500" />
                        <span>Imprimir / PDF</span>
                    </button>

                    <Link href="/feed-bags/new">
                        <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl px-4 py-2 font-semibold shadow-sm transition active:scale-95 flex items-center gap-1.5 cursor-pointer">
                            <Plus size={16} />
                            Nueva Compra
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Financial Balances Summary Grid */}
            {!isLoading && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                            Bolsas Compradas
                        </p>
                        <p className="text-2xl font-black text-slate-900">
                            {totalBags} <span className="text-xs font-semibold text-slate-400">bolsas</span>
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">
                            {feedBags.length} compras registradas
                        </p>
                    </div>

                    <div className="bg-orange-50/60 rounded-2xl border border-orange-200/80 p-4 shadow-sm">
                        <p className="text-xs font-semibold text-orange-700 uppercase tracking-wider mb-1">
                            Total Facturado
                        </p>
                        <p className="text-2xl font-black text-slate-900">
                            {formatCurrency(totalPurchased)}
                        </p>
                        <p className="text-[11px] text-orange-700/80 mt-1">Compras de alimento</p>
                    </div>

                    <div className="bg-emerald-50/60 rounded-2xl border border-emerald-200/80 p-4 shadow-sm">
                        <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
                            Total Abonado
                        </p>
                        <p className="text-2xl font-black text-emerald-800">
                            {formatCurrency(totalPaid)}
                        </p>
                        <p className="text-[11px] text-emerald-600 mt-1">
                            {payments.length} pagos registrados
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
                            Saldo Deuda Proveedor
                        </p>
                        <p className={`text-2xl font-black ${
                            totalDebt > 0 ? "text-rose-700" : "text-emerald-700"
                        }`}>
                            {totalDebt > 0 ? formatCurrency(totalDebt) : "$0 (Al día)"}
                        </p>
                        <p className={`text-[11px] mt-1 ${totalDebt > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                            {metrics.unpaidCount} compras con saldo pendiente
                        </p>
                    </div>
                </div>
            )}

            {/* Date Range Filter */}
            <DateRangeFilter
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                activePreset={preset}
                onSelectPreset={setPreset}
                showDebtToggle={true}
                showDebtOnly={filterOnlyDebt}
                setShowDebtOnly={setFilterOnlyDebt}
                debtLabel="Solo compras con deuda pendiente"
                accentColor="orange"
                totalCount={filteredOperations.length}
            />

            {/* Bulk Supplier Payment Banner */}
            {!isLoading && totalDebt > 0 && (
                <div className="bg-white p-5 rounded-2xl border border-orange-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
                    <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="w-2 h-2 rounded-full bg-orange-500" />
                            <p className="text-xs font-bold uppercase tracking-wider text-orange-700">
                                Abono General a Proveedor de Alimento
                            </p>
                        </div>
                        <p className="text-xs text-slate-500">
                            Aplica un pago global contra la deuda total pendiente de alimento ({formatCurrency(totalDebt)})
                        </p>
                    </div>
                    <PaymentModal
                        sale={{ id: "bulk" }}
                        endpoint="feed-bags/payment/bulk"
                        onSuccess={handlePaymentSuccess}
                        isBulkPayment={true}
                        owed={totalDebt}
                    >
                        <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl px-5 py-2.5 text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer w-full sm:w-auto">
                            <DollarSign className="w-4 h-4 mr-1" />
                            Registrar Pago General
                        </Button>
                    </PaymentModal>
                </div>
            )}

            {/* Controls Bar: Operation Type Tabs + Search + View Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
                {/* Operation Type Selector Pills */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                    <button
                        type="button"
                        onClick={() => setOperationTypeFilter("all")}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer ${
                            operationTypeFilter === "all"
                                ? "bg-white text-orange-800 shadow-2xs"
                                : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                        Todas ({allOperations.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setOperationTypeFilter("purchases")}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                            operationTypeFilter === "purchases"
                                ? "bg-white text-orange-800 shadow-2xs"
                                : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                        <Package className="w-3 h-3 text-orange-600" />
                        Compras ({feedBags.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setOperationTypeFilter("payments")}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                            operationTypeFilter === "payments"
                                ? "bg-white text-emerald-800 shadow-2xs"
                                : "text-slate-600 hover:text-slate-900"
                        }`}
                    >
                        <Receipt className="w-3 h-3 text-emerald-600" />
                        Pagos ({payments.length})
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative flex-1 max-w-sm">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Buscar por operación (ej. Compra 1, Pago 2), fecha, nota..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-slate-700"
                    />
                </div>

                {/* View Switcher: Table vs Cards */}
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
                                    ? "bg-white text-orange-800 shadow-2xs font-bold"
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
                                    ? "bg-white text-orange-800 shadow-2xs font-bold"
                                    : "text-slate-600 hover:text-slate-900"
                            }`}
                        >
                            <LayoutGrid className="w-3.5 h-3.5" />
                            <span>Tarjetas</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* List / Table Content */}
            {isLoading ? (
                <LoadSpin />
            ) : filteredOperations.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-orange-100 shadow-sm">
                    <Package className="w-14 h-14 text-orange-300 mx-auto mb-4" />
                    <p className="text-slate-700 text-lg font-medium">No se encontraron operaciones</p>
                    <p className="text-slate-400 text-sm mt-1">
                        {filterOnlyDebt
                            ? "No hay operaciones con saldo pendiente en las fechas seleccionadas"
                            : "Prueba modificando las fechas o el filtro de búsqueda"}
                    </p>
                </div>
            ) : viewMode === "ledger" ? (
                /* LEDGER / TABLE VIEW (Libro Diario de Proveedor) */
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div className="flex items-center gap-2">
                            <TableIcon className="w-4 h-4 text-orange-600" />
                            <h3 className="font-semibold text-slate-800 text-sm">
                                Historial Consolidado de Operaciones
                            </h3>
                            <span className="text-xs bg-orange-100 text-orange-800 font-semibold px-2 py-0.5 rounded-full">
                                {filteredOperations.length}
                            </span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50/90 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                                <tr>
                                    <th className="py-3 px-4">Fecha</th>
                                    <th className="py-3 px-4">Operación / Actividad</th>
                                    <th className="py-3 px-4">Detalle</th>
                                    <th className="py-3 px-4 text-center">Bolsas</th>
                                    <th className="py-3 px-4 text-right">Precio / Bolsa</th>
                                    <th className="py-3 px-4 text-right">Facturado</th>
                                    <th className="py-3 px-4 text-right">Abonado</th>
                                    <th className="py-3 px-4 text-right">Saldo Deuda</th>
                                    <th className="py-3 px-4 text-center">Estado</th>
                                    <th className="py-3 px-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                {filteredOperations.map((op) => {
                                    if (op.type === "purchase") {
                                        const feedBag = op.item;
                                        const badge = statusBadge[feedBag.status] || {
                                            className: "bg-slate-100 text-slate-700 border-slate-200",
                                            icon: Clock,
                                            label: feedBag.status,
                                        };
                                        const StatusIcon = badge.icon;

                                        return (
                                            <tr
                                                key={op.id}
                                                className="hover:bg-orange-50/30 transition-colors"
                                            >
                                                {/* Fecha */}
                                                <td className="py-3.5 px-4 font-medium text-slate-800 whitespace-nowrap">
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                                                        <span>{formatUtcDate(feedBag.date)}</span>
                                                    </div>
                                                </td>

                                                {/* Operacion / Actividad */}
                                                <td className="py-3.5 px-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <span className="p-1 rounded-md bg-orange-100 text-orange-700 shrink-0">
                                                            <Package className="w-3.5 h-3.5" />
                                                        </span>
                                                        <div>
                                                            <span className="font-bold text-slate-900 block">
                                                                {op.label}
                                                            </span>
                                                            <span className="text-[10px] font-semibold text-orange-700 uppercase">
                                                                Compra de Alimento
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Detalle */}
                                                <td className="py-3.5 px-4 whitespace-nowrap">
                                                    <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200">
                                                        Fase {feedBag.phase}
                                                    </span>
                                                </td>

                                                {/* Bolsas */}
                                                <td className="py-3.5 px-4 text-center font-bold text-slate-800 whitespace-nowrap">
                                                    {feedBag.amount}
                                                </td>

                                                {/* Precio unitario */}
                                                <td className="py-3.5 px-4 text-right font-medium text-slate-600 whitespace-nowrap">
                                                    {formatCurrency(feedBag.price)}
                                                </td>

                                                {/* Facturado */}
                                                <td className="py-3.5 px-4 text-right font-bold text-slate-900 whitespace-nowrap">
                                                    {formatCurrency(feedBag.totalAmount)}
                                                </td>

                                                {/* Abonado */}
                                                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                                    <PaymentHistoryModal item={feedBag} endpoint="feed-bags">
                                                        <button
                                                            type="button"
                                                            className="inline-flex items-center gap-1.5 font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded-lg transition active:scale-95 cursor-pointer text-xs"
                                                            title="Ver historial de pagos de esta compra"
                                                        >
                                                            <span>{formatCurrency(feedBag.amountPaid)}</span>
                                                            <span className="text-[10px] bg-emerald-200/80 text-emerald-900 px-1.5 py-0.5 rounded font-black">
                                                                {feedBag.payments?.length ?? (feedBag.amountPaid > 0 ? 1 : 0)} p.
                                                            </span>
                                                        </button>
                                                    </PaymentHistoryModal>
                                                </td>

                                                {/* Saldo Deuda */}
                                                <td className="py-3.5 px-4 text-right font-black whitespace-nowrap">
                                                    {feedBag.remainingAmount > 0 ? (
                                                        <span className="text-rose-600 font-bold">
                                                            {formatCurrency(feedBag.remainingAmount)}
                                                        </span>
                                                    ) : (
                                                        <span className="text-emerald-700 font-semibold">
                                                            Sin deuda
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Estado */}
                                                <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badge.className}`}
                                                    >
                                                        <StatusIcon className="w-3 h-3" />
                                                        {badge.label}
                                                    </span>
                                                </td>

                                                {/* Acciones */}
                                                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                                    <div className="flex items-center justify-end gap-1.5">
                                                        <Link href={`/feed-bags/${feedBag.id}/edit`}>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                title="Modificar compra"
                                                                className="h-8 px-2 text-xs font-semibold border-slate-200 text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg flex items-center gap-1 cursor-pointer"
                                                            >
                                                                <Edit className="w-3 h-3" />
                                                                <span>Editar</span>
                                                            </Button>
                                                        </Link>

                                                        {feedBag.status !== "PAID" && (
                                                            <PaymentModal
                                                                sale={feedBag}
                                                                endpoint="feed-bags"
                                                                onSuccess={handlePaymentSuccess}
                                                            >
                                                                <Button
                                                                    size="sm"
                                                                    className="h-8 px-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-1 cursor-pointer"
                                                                >
                                                                    <DollarSign className="w-3 h-3" />
                                                                    <span>Pagar</span>
                                                                </Button>
                                                            </PaymentModal>
                                                        )}

                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDelete(feedBag.id)}
                                                            className="h-8 w-8 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                                                            title="Eliminar compra"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    }

                                    // Payment row
                                    const payment = op.item;
                                    const linkedBag = payment.feedBag;
                                    const linkedLabel = linkedBag?.purchaseNumber
                                        ? `Compra N° ${linkedBag.purchaseNumber}`
                                        : linkedBag
                                        ? `Compra #${linkedBag.id.slice(0, 8)}`
                                        : "Proveedor";

                                    return (
                                        <tr
                                            key={op.id}
                                            className="bg-emerald-50/20 hover:bg-emerald-50/40 transition-colors"
                                        >
                                            {/* Fecha */}
                                            <td className="py-3.5 px-4 font-medium text-slate-800 whitespace-nowrap">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                                    <span>{formatUtcDate(payment.date)}</span>
                                                </div>
                                            </td>

                                            {/* Operacion / Actividad */}
                                            <td className="py-3.5 px-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <span className="p-1 rounded-md bg-emerald-100 text-emerald-700 shrink-0">
                                                        <Receipt className="w-3.5 h-3.5" />
                                                    </span>
                                                    <div>
                                                        <span className="font-bold text-emerald-800 block">
                                                            {op.label}
                                                        </span>
                                                        <span className="text-[10px] font-semibold text-emerald-700 uppercase">
                                                            Pago / Abono Realizado
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Detalle */}
                                            <td className="py-3.5 px-4 whitespace-nowrap">
                                                <div className="space-y-0.5">
                                                    {linkedBag ? (
                                                        <Link
                                                            href={`/feed-bags/${linkedBag.id}`}
                                                            className="text-xs font-bold text-slate-800 hover:text-orange-700 inline-flex items-center gap-1 transition"
                                                        >
                                                            <span>Abono a {linkedLabel}</span>
                                                            <ArrowUpRight className="w-3 h-3 text-slate-400" />
                                                        </Link>
                                                    ) : (
                                                        <span className="text-xs text-slate-600">Abono a Proveedor</span>
                                                    )}
                                                    {payment.note && (
                                                        <div className="flex items-center gap-1 text-[11px] text-slate-500 italic">
                                                            <MessageSquare className="w-3 h-3 text-indigo-500 shrink-0" />
                                                            <span>&ldquo;{payment.note}&rdquo;</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Bolsas */}
                                            <td className="py-3.5 px-4 text-center text-slate-400 font-medium">
                                                —
                                            </td>

                                            {/* Precio unitario */}
                                            <td className="py-3.5 px-4 text-right text-slate-400 font-medium">
                                                —
                                            </td>

                                            {/* Facturado */}
                                            <td className="py-3.5 px-4 text-right text-slate-400 font-medium">
                                                —
                                            </td>

                                            {/* Abonado (Monto del pago) */}
                                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                                <span className="font-black text-emerald-700 text-sm bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                                                    +{formatCurrency(payment.amount)}
                                                </span>
                                            </td>

                                            {/* Saldo Deuda (De la compra vinculada) */}
                                            <td className="py-3.5 px-4 text-right font-medium whitespace-nowrap">
                                                {linkedBag ? (
                                                    linkedBag.remainingAmount > 0 ? (
                                                        <span className="text-rose-600 font-semibold">
                                                            {formatCurrency(linkedBag.remainingAmount)} rest.
                                                        </span>
                                                    ) : (
                                                        <span className="text-emerald-700 font-semibold">
                                                            Sin saldo
                                                        </span>
                                                    )
                                                ) : (
                                                    <span className="text-slate-400">—</span>
                                                )}
                                            </td>

                                            {/* Estado */}
                                            <td className="py-3.5 px-4 text-center whitespace-nowrap">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    Acreditado
                                                </span>
                                            </td>

                                            {/* Acciones */}
                                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                                {linkedBag && (
                                                    <Link href={`/feed-bags/${linkedBag.id}`}>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 px-2.5 text-xs font-semibold border-emerald-200 text-emerald-800 hover:bg-emerald-50 rounded-lg flex items-center gap-1 cursor-pointer"
                                                        >
                                                            <span>Ver Compra</span>
                                                            <ArrowUpRight className="w-3 h-3" />
                                                        </Button>
                                                    </Link>
                                                )}
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
                    {feedBags.map((feedBag: any) => (
                        <FeedBagCard
                            key={feedBag.id}
                            feedBag={feedBag}
                            refresh={fetchData}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
