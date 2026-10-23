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
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import PaymentModal from "@/components/payment-modal";
import { toast } from "sonner";
import { formatCurrency, formatUtcDate } from "@/lib/utils";

export default function FeedBagsSupplierStatementPage() {
    const [feedBags, setFeedBags] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [metrics, setMetrics] = useState({ totalOwed: 0, unpaidCount: 0 });
    const [viewMode, setViewMode] = useState<"ledger" | "cards">("ledger");
    const [filterOnlyDebt, setFilterOnlyDebt] = useState(false);

    const fetchFeedBags = async () => {
        try {
            setIsLoading(true);
            const response = await api.get("/feed-bags");
            setFeedBags(response.data);
        } catch (err) {
            console.error("Failed to fetch feed bags:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMetrics = async () => {
        try {
            const response = await api.get("/feed-bags/metrics/summary");
            setMetrics(response.data);
        } catch (err) {
            console.error("Failed to fetch metrics:", err);
        }
    };

    useEffect(() => {
        fetchFeedBags();
        fetchMetrics();
    }, []);

    const handlePaymentSuccess = () => {
        setTimeout(() => {
            fetchFeedBags();
            fetchMetrics();
            toast.success("Payment registered successfully");
        }, 1500);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this purchase?")) return;

        try {
            await api.delete(`/feed-bags/${id}`);
            toast.success("Feed purchase deleted successfully");
            fetchFeedBags();
            fetchMetrics();
        } catch (error) {
            toast.error("Failed to delete feed purchase");
        }
    };

    const totalPurchased = feedBags.reduce((acc, f) => acc + (Number(f.totalAmount) || 0), 0);
    const totalPaid = feedBags.reduce((acc, f) => acc + (Number(f.amountPaid) || 0), 0);
    const totalBags = feedBags.reduce((acc, f) => acc + (Number(f.amount) || 0), 0);
    const totalDebt = metrics.totalOwed > 0 ? metrics.totalOwed : feedBags.reduce((acc, f) => acc + (Number(f.remainingAmount) || 0), 0);

    const filteredBags = filterOnlyDebt
        ? feedBags.filter((f) => f.status !== "PAID" && f.remainingAmount > 0)
        : feedBags;

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

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-full">
                            Supplier Account Statement
                        </span>
                        <span className="text-xs text-slate-400">Feed & Nutrition Suppliers</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-semibold text-slate-900">
                        Feed Suppliers & Account Statement
                    </h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Statement of account with poultry feed suppliers, purchase orders and payment debts
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs transition active:scale-95 cursor-pointer"
                    >
                        <Printer className="w-3.5 h-3.5 text-slate-500" />
                        Print / PDF
                    </button>

                    <Link href="/feed-bags/new">
                        <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl px-4 py-2 font-semibold shadow-sm transition active:scale-95 flex items-center gap-1.5 cursor-pointer">
                            <Plus size={16} />
                            Add Feed Purchase
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Account Balances Summary Grid */}
            {!isLoading && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                            Bags Purchased
                        </p>
                        <p className="text-2xl font-black text-slate-900">
                            {totalBags} <span className="text-xs font-semibold text-slate-400">bags</span>
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">{feedBags.length} orders total</p>
                    </div>

                    <div className="bg-orange-50/60 rounded-2xl border border-orange-200/80 p-4 shadow-sm">
                        <p className="text-xs font-semibold text-orange-700 uppercase tracking-wider mb-1">
                            Total Invoiced
                        </p>
                        <p className="text-2xl font-black text-slate-900">
                            {formatCurrency(totalPurchased)}
                        </p>
                        <p className="text-[11px] text-orange-700/80 mt-1">Purchases to date</p>
                    </div>

                    <div className="bg-emerald-50/60 rounded-2xl border border-emerald-200/80 p-4 shadow-sm">
                        <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
                            Total Paid
                        </p>
                        <p className="text-2xl font-black text-emerald-800">
                            {formatCurrency(totalPaid)}
                        </p>
                        <p className="text-[11px] text-emerald-600 mt-1">Paid to suppliers</p>
                    </div>

                    <div className={`rounded-2xl border p-4 shadow-sm ${
                        totalDebt > 0
                            ? "bg-rose-50/70 border-rose-200/90"
                            : "bg-emerald-50/70 border-emerald-200/90"
                    }`}>
                        <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${
                            totalDebt > 0 ? "text-rose-700" : "text-emerald-700"
                        }`}>
                            Current Supplier Debt
                        </p>
                        <p className={`text-2xl font-black ${
                            totalDebt > 0 ? "text-rose-700" : "text-emerald-700"
                        }`}>
                            {totalDebt > 0 ? formatCurrency(totalDebt) : "$0 (Settled)"}
                        </p>
                        <p className={`text-[11px] mt-1 ${totalDebt > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                            {metrics.unpaidCount} unpaid orders
                        </p>
                    </div>
                </div>
            )}

            {/* General Supplier Payment Banner */}
            {!isLoading && totalDebt > 0 && (
                <div className="bg-white p-5 rounded-2xl border border-orange-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
                    <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="w-2 h-2 rounded-full bg-orange-500" />
                            <p className="text-xs font-bold uppercase tracking-wider text-orange-700">
                                Debt Reconciliation / Bulk Supplier Payment
                            </p>
                        </div>
                        <p className="text-xs text-slate-500">
                            Apply a single overall payment towards outstanding supplier feed debt ({formatCurrency(totalDebt)})
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
                            Register General Payment
                        </Button>
                    </PaymentModal>
                </div>
            )}

            {/* Account Movement Controls (Filters & View Toggles) */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
                <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-orange-600" />
                        Supplier Statement & Purchase Movements
                    </h2>
                    <p className="text-xs text-slate-500">
                        Detailed chronological purchases. Modify each purchase or record payments separately.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {/* Filter only debt */}
                    <button
                        type="button"
                        onClick={() => setFilterOnlyDebt(!filterOnlyDebt)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                            filterOnlyDebt
                                ? "bg-rose-50 border-rose-300 text-rose-700"
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                    >
                        {filterOnlyDebt ? "Showing Debts Only" : "Filter Unpaid"}
                    </button>

                    {/* View Switcher: Table vs Cards */}
                    <div className="bg-slate-100 p-0.5 rounded-xl flex items-center border border-slate-200">
                        <button
                            type="button"
                            onClick={() => setViewMode("ledger")}
                            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                                viewMode === "ledger"
                                    ? "bg-white text-slate-900 shadow-2xs"
                                    : "text-slate-500 hover:text-slate-900"
                            }`}
                            title="Table View (Libro Diario)"
                        >
                            <TableIcon className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Ledger</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode("cards")}
                            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                                viewMode === "cards"
                                    ? "bg-white text-slate-900 shadow-2xs"
                                    : "text-slate-500 hover:text-slate-900"
                            }`}
                            title="Cards View"
                        >
                            <LayoutGrid className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Cards</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* List / Table Content */}
            {isLoading ? (
                <LoadSpin />
            ) : filteredBags.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-orange-100 shadow-sm">
                    <Package className="w-14 h-14 text-orange-300 mx-auto mb-4" />
                    <p className="text-slate-700 text-lg font-medium">No feed purchases recorded</p>
                    <p className="text-slate-400 text-sm mt-1">
                        {filterOnlyDebt
                            ? "There are no pending debts with feed suppliers"
                            : "Add your first feed purchase to start tracking supplier account movements"}
                    </p>
                </div>
            ) : viewMode === "ledger" ? (
                /* LEDGER / TABLE VIEW (Libro Diario de Proveedor) */
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50/90 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                                <tr>
                                    <th className="py-3 px-4">Fecha</th>
                                    <th className="py-3 px-4">N° Compra</th>
                                    <th className="py-3 px-4">Fase</th>
                                    <th className="py-3 px-4 text-center">Bolsas</th>
                                    <th className="py-3 px-4 text-right">Precio / Bolsa</th>
                                    <th className="py-3 px-4 text-right">Facturado</th>
                                    <th className="py-3 px-4 text-right">Abonado</th>
                                    <th className="py-3 px-4 text-right">Saldo Deuda</th>
                                    <th className="py-3 px-4 text-center">Estado</th>
                                    <th className="py-3 px-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredBags.map((feedBag: any) => {
                                    const badge = statusBadge[feedBag.status] || {
                                        className: "bg-slate-100 text-slate-700 border-slate-200",
                                        icon: Clock,
                                    };
                                    const StatusIcon = badge.icon;

                                    return (
                                        <tr
                                            key={feedBag.id}
                                            className="hover:bg-orange-50/30 transition-colors"
                                        >
                                            <td className="py-3 px-4 font-medium text-slate-700 whitespace-nowrap">
                                                {formatUtcDate(feedBag.date)}
                                            </td>
                                            <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                                                {feedBag.purchaseNumber ? `N° ${feedBag.purchaseNumber}` : `#${feedBag.id.slice(0, 8)}`}
                                            </td>
                                            <td className="py-3 px-4 whitespace-nowrap">
                                                <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200">
                                                    Phase {feedBag.phase}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-center font-bold text-slate-800 whitespace-nowrap">
                                                {feedBag.amount}
                                            </td>
                                            <td className="py-3 px-4 text-right font-medium text-slate-600 whitespace-nowrap">
                                                {formatCurrency(feedBag.price)}
                                            </td>
                                            <td className="py-3 px-4 text-right font-bold text-slate-900 whitespace-nowrap">
                                                {formatCurrency(feedBag.totalAmount)}
                                            </td>
                                            <td className="py-3 px-4 text-right font-semibold text-emerald-700 whitespace-nowrap">
                                                {formatCurrency(feedBag.amountPaid)}
                                            </td>
                                            <td className="py-3 px-4 text-right font-black whitespace-nowrap">
                                                <span
                                                    className={
                                                        feedBag.remainingAmount > 0
                                                            ? "text-rose-600"
                                                            : "text-emerald-700"
                                                    }
                                                >
                                                    {feedBag.remainingAmount > 0
                                                        ? formatCurrency(feedBag.remainingAmount)
                                                        : "$0"}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-center whitespace-nowrap">
                                                <span
                                                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.className}`}
                                                >
                                                    <StatusIcon className="w-3 h-3" />
                                                    {feedBag.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    {/* Modify this purchase separately */}
                                                    <Link href={`/feed-bags/${feedBag.id}/edit`}>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            title="Modify this purchase separately"
                                                            className="h-8 px-2.5 text-xs font-semibold border-slate-200 text-slate-700 hover:text-orange-600 hover:bg-orange-50/50 rounded-lg flex items-center gap-1 cursor-pointer"
                                                        >
                                                            <Edit className="w-3 h-3" />
                                                            <span>Modify</span>
                                                        </Button>
                                                    </Link>

                                                    {/* Add payment to this purchase */}
                                                    {feedBag.status !== "PAID" && (
                                                        <PaymentModal
                                                            sale={feedBag}
                                                            endpoint="feed-bags"
                                                            onSuccess={handlePaymentSuccess}
                                                        >
                                                            <Button
                                                                size="sm"
                                                                title="Pay this purchase"
                                                                className="h-8 px-2 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg flex items-center gap-1 cursor-pointer"
                                                            >
                                                                <DollarSign className="w-3 h-3" />
                                                                <span>Pay</span>
                                                            </Button>
                                                        </PaymentModal>
                                                    )}

                                                    {/* Details */}
                                                    <Link href={`/feed-bags/${feedBag.id}`}>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 px-2 text-xs text-slate-500 hover:text-slate-900 rounded-lg cursor-pointer"
                                                        >
                                                            View
                                                        </Button>
                                                    </Link>

                                                    {/* Delete */}
                                                    <Button
                                                        onClick={() => handleDelete(feedBag.id)}
                                                        variant="ghost"
                                                        size="sm"
                                                        title="Delete purchase"
                                                        className="h-8 px-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
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
                    {filteredBags.map((feedBag: any) => (
                        <FeedBagCard key={feedBag.id} feedBag={feedBag} refresh={fetchFeedBags} />
                    ))}
                </div>
            )}
        </div>
    );
}
