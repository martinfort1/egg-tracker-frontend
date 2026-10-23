"use client";

import LoadSpin from "@/components/load-spin";
import PaymentModal from "@/components/payment-modal";
import PaymentHistoryModal from "@/components/payment-history-modal";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { formatCurrency, formatUtcDate } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import {
    ArrowLeft,
    Calendar,
    Package,
    DollarSign,
    CheckCircle2,
    Clock,
    AlertCircle,
    Edit,
    Trash2,
    Layers,
    Receipt,
    History,
    MessageSquare,
} from "lucide-react";

interface FeedBag {
    id: string;
    purchaseNumber?: number;
    date: string;
    amount: number;
    price: number;
    totalAmount: number;
    amountPaid: number;
    remainingAmount: number;
    phase: number;
    status: string;
    createdAt: string;
    updatedAt: string;
    payments?: any[];
}

export default function FeedBagDetailPage() {
    const router = useRouter();
    const [feedBag, setFeedBag] = useState<FeedBag | null>(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    const fetchFeedBag = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/feed-bags/${id}`);
            setFeedBag(response.data);
        } catch (error) {
            toast.error("Failed to fetch feed purchase");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedBag();
    }, [id]);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this feed purchase?")) return;

        try {
            await api.delete(`/feed-bags/${id}`);
            toast.success("Feed purchase deleted successfully");
            router.push("/feed-bags");
        } catch (error) {
            toast.error("Failed to delete feed purchase");
        }
    };

    if (loading) return <LoadSpin />;
    if (!feedBag) return <div className="text-center py-12 text-slate-500">Feed purchase not found</div>;

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

    const badge = statusBadge[feedBag.status] || {
        className: "bg-slate-100 text-slate-700 border-slate-200",
        icon: Clock,
    };
    const StatusIcon = badge.icon;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Top Navigation Bar */}
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => router.push("/feed-bags")}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Feed Purchases
                </button>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    Compra N° {feedBag.purchaseNumber ?? feedBag.id.slice(0, 8)}
                </span>
            </div>

            {/* Header Card */}
            <div className="relative bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden p-6 sm:p-8">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-400 via-amber-500 to-orange-600" />

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-semibold text-slate-900">
                                {feedBag.purchaseNumber ? `Orden de Compra N° ${feedBag.purchaseNumber}` : "Orden de Compra de Alimento"}
                            </h1>
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${badge.className}`}>
                                <StatusIcon className="w-3.5 h-3.5" />
                                {feedBag.status}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-orange-600" />
                            Purchased on {formatUtcDate(feedBag.date)} • Phase {feedBag.phase} Nutrition
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link href={`/feed-bags/${feedBag.id}/edit`}>
                            <Button
                                variant="outline"
                                className="border-slate-200 text-slate-700 hover:text-orange-600 hover:bg-orange-50/50 rounded-xl flex items-center gap-1.5 text-sm font-semibold cursor-pointer"
                            >
                                <Edit className="w-4 h-4" />
                                Modify Purchase
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Package className="w-3.5 h-3.5 text-orange-600" />
                        Quantity
                    </p>
                    <p className="text-2xl font-black text-slate-900">
                        {feedBag.amount} <span className="text-xs font-semibold text-slate-400">bags</span>
                    </p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-orange-600" />
                        Feed Phase
                    </p>
                    <p className="text-2xl font-black text-slate-900">
                        Phase {feedBag.phase}
                    </p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Price per Bag
                    </p>
                    <p className="text-2xl font-black text-slate-900">
                        {formatCurrency(feedBag.price)}
                    </p>
                </div>

                <div className="bg-orange-50/60 rounded-2xl border border-orange-200/80 p-4 shadow-sm">
                    <p className="text-xs font-semibold text-orange-700 uppercase tracking-wider mb-1">
                        Total Amount
                    </p>
                    <p className="text-2xl font-black text-slate-900">
                        {formatCurrency(feedBag.totalAmount)}
                    </p>
                </div>

                <div className="bg-emerald-50/60 rounded-2xl border border-emerald-200/80 p-4 shadow-sm">
                    <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
                        Amount Paid
                    </p>
                    <p className="text-2xl font-black text-emerald-800">
                        {formatCurrency(feedBag.amountPaid)}
                    </p>
                </div>

                <div className={`rounded-2xl border p-4 shadow-sm ${
                    feedBag.remainingAmount > 0
                        ? "bg-rose-50/60 border-rose-200/80"
                        : "bg-emerald-50/60 border-emerald-200/80"
                }`}>
                    <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${
                        feedBag.remainingAmount > 0 ? "text-rose-700" : "text-emerald-700"
                    }`}>
                        Remaining Debt
                    </p>
                    <p className={`text-2xl font-black ${
                        feedBag.remainingAmount > 0 ? "text-rose-700" : "text-emerald-700"
                    }`}>
                        {feedBag.remainingAmount > 0 ? formatCurrency(feedBag.remainingAmount) : "Paid in Full"}
                    </p>
                </div>
            </div>

            {/* Breakdown & Calculation Details */}
            <div className="bg-white rounded-2xl border border-orange-100 p-6 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
                    <Receipt className="w-4 h-4 text-orange-600" />
                    Purchase Breakdown
                </h2>

                <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/70 space-y-2">
                    <div className="flex justify-between items-center text-sm text-slate-700">
                        <span>Formula: {feedBag.amount} bags × {formatCurrency(feedBag.price)}</span>
                        <span className="font-bold text-slate-900">{formatCurrency(feedBag.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-500">
                        <span>Paid towards this purchase:</span>
                        <span className="font-semibold text-emerald-700">{formatCurrency(feedBag.amountPaid)}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-bold">
                        <span className="text-slate-800">Remaining Balance:</span>
                        <span className={feedBag.remainingAmount > 0 ? "text-rose-600" : "text-emerald-700"}>
                            {feedBag.remainingAmount > 0 ? formatCurrency(feedBag.remainingAmount) : "Fully Settled"}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-400 pt-1">
                    <div>
                        <span className="font-semibold text-slate-500">Registered date:</span>{" "}
                        {formatUtcDate(feedBag.createdAt)}
                    </div>
                    <div>
                        <span className="font-semibold text-slate-500">Last updated:</span>{" "}
                        {formatUtcDate(feedBag.updatedAt)}
                    </div>
                </div>
            </div>

            {/* Payment History Section */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <History className="w-4 h-4 text-orange-600" />
                        <h2 className="text-base font-bold text-slate-900">
                            Historial de Pagos de la Compra
                        </h2>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                            {feedBag.payments?.length ?? (feedBag.amountPaid > 0 ? 1 : 0)} pagos
                        </span>
                    </div>

                    <PaymentHistoryModal item={feedBag} endpoint="feed-bags">
                        <Button
                            variant="outline"
                            size="sm"
                            className="text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer text-slate-700 border-slate-200 hover:bg-slate-50"
                        >
                            <History className="w-3.5 h-3.5" />
                            Abrir Historial Completo
                        </Button>
                    </PaymentHistoryModal>
                </div>

                {!feedBag.payments || feedBag.payments.length === 0 ? (
                    feedBag.amountPaid > 0 ? (
                        <div className="bg-slate-50/70 rounded-xl p-3.5 border border-slate-200/70 flex items-center justify-between">
                            <div className="space-y-0.5">
                                <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                    {formatUtcDate(feedBag.date)}
                                </span>
                                <span className="text-[11px] text-slate-400 italic block">
                                    Pago registrado
                                </span>
                            </div>
                            <span className="text-sm font-black text-emerald-700">
                                +{formatCurrency(feedBag.amountPaid)}
                            </span>
                        </div>
                    ) : (
                        <p className="text-xs text-slate-400 text-center py-4 italic">
                            No se registran pagos realizados para esta compra todavía.
                        </p>
                    )
                ) : (
                    <div className="space-y-2.5">
                        {feedBag.payments.map((p: any, idx: number) => (
                            <div
                                key={p.id || idx}
                                className="bg-slate-50/70 hover:bg-emerald-50/30 rounded-xl p-3.5 border border-slate-200/70 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                            >
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                                            #{(feedBag.payments?.length ?? 0) - idx}
                                        </span>
                                        <span className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                            {formatUtcDate(p.date)}
                                        </span>
                                    </div>
                                    {p.note && (
                                        <p className="text-xs text-slate-600 flex items-center gap-1.5 italic pl-8">
                                            <MessageSquare className="w-3 h-3 text-indigo-500 shrink-0" />
                                            &ldquo;{p.note}&rdquo;
                                        </p>
                                    )}
                                </div>

                                <span className="text-sm font-black text-emerald-700 bg-white border border-emerald-200 px-3 py-1 rounded-lg self-end sm:self-auto">
                                    +{formatCurrency(p.amount)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {feedBag.status !== "PAID" && (
                    <PaymentModal
                        sale={feedBag}
                        endpoint="feed-bags"
                        onSuccess={fetchFeedBag}
                    >
                        <Button className="w-full sm:flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl h-12 shadow-sm transition active:scale-95 cursor-pointer flex items-center justify-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            Add Payment to this Purchase
                        </Button>
                    </PaymentModal>
                )}

                <Link href={`/feed-bags/${feedBag.id}/edit`} className="sm:flex-1">
                    <Button
                        variant="outline"
                        className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl h-12 font-semibold flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <Edit className="w-4 h-4" />
                        Modify this Purchase
                    </Button>
                </Link>

                <Button
                    onClick={handleDelete}
                    variant="outline"
                    className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 rounded-xl h-12 flex items-center justify-center gap-2 font-semibold cursor-pointer"
                >
                    <Trash2 className="w-4 h-4" />
                    Delete Purchase
                </Button>
            </div>
        </div>
    );
}
