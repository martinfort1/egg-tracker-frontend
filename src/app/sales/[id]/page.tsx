"use client";

import LoadSpin from "@/components/load-spin";
import { Button } from "@/components/ui/button";
import PaymentModal from "@/components/payment-modal";
import { api } from "@/lib/api";
import {
    Copy,
    Trash2,
    Edit,
    Send,
    ArrowLeft,
    Calendar,
    User,
    Phone,
    MapPin,
    DollarSign,
    CheckCircle2,
    AlertCircle,
    Clock,
    ShoppingBag,
    Check,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { formatCurrency, formatUtcDate } from "@/lib/utils";

export default function SalePage() {
    const { id } = useParams();
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    const fetchData = async () => {
        try {
            const res = await api.get(`/sales/${id}`);
            setData(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch sale details");
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleDelete = async () => {
        try {
            await api.delete(`/sales/${id}`);
            toast.success("Sale deleted successfully");
            router.push("/sales");
        } catch (error) {
            toast.error("Error deleting sale");
        }
    };

    const buildSaleDetails = (sale: any) => {
        const items = [
            { label: "Extra", qty: sale.Extra, price: sale.ExtraPrice },
            { label: "N1", qty: sale.N1, price: sale.N1Price },
            { label: "N2", qty: sale.N2, price: sale.N2Price },
            { label: "N3", qty: sale.N3, price: sale.N3Price },
            { label: "N4", qty: sale.N4, price: sale.N4Price },
        ];

        return items
            .filter((item) => item.qty > 0)
            .map((item) => {
                const subtotal = item.qty * item.price;
                return `-${item.label}: ${item.qty} * $${item.price} = $${subtotal}`;
            })
            .join("\n");
    };

    const generateMessage = () => {
        if (!data) return null;

        const sale = data.sale || data;
        const buyer = data.buyer || data?.buyer;

        if (!buyer?.name) return null;

        const details = buildSaleDetails(sale);
        const saleNumText = sale.saleNumber ? ` N° ${sale.saleNumber}` : "";

        const message = `Hola ${buyer.name}! Te paso el detalle de la venta${saleNumText}:
Fecha: *_${new Date(sale.date).toLocaleDateString()}_*

${details}

- Total: *_$${sale.totalAmount}_*
- Pagado: _$${sale.amountPaid}_

- Deuda Restante: *$${sale.remainingAmount}*
Muchas gracias!`;

        return message;
    };

    const handleCopyToClipboard = () => {
        const message = generateMessage();
        if (!message) return toast.error("No se pudo generar el mensaje");

        navigator.clipboard.writeText(message);
        setCopied(true);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSendWhatsApp = () => {
        const message = generateMessage();
        if (!message) return toast.error("No se pudo generar el mensaje");

        const buyer = data.buyer || data?.buyer;
        const encodedMessage = encodeURIComponent(message);
        let phone = buyer?.phone?.replace(/\D/g, "");

        if (phone && !phone.startsWith("54")) {
            phone = `549${phone}`;
        }

        const url = phone
            ? `https://wa.me/${phone}?text=${encodedMessage}`
            : `https://wa.me/?text=${encodedMessage}`;

        window.open(url, "_blank");
    };

    if (!data) return <LoadSpin />;

    const sale = data.sale || data;
    const buyer = data.buyer || data?.buyer;

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

    const StatusIcon = statusBadge[sale.status]?.icon || AlertCircle;
    const badgeClass = statusBadge[sale.status]?.className || "bg-slate-100 text-slate-700 border-slate-200";

    const items = [
        { label: "Extra", qty: sale.Extra, price: sale.ExtraPrice },
        { label: "N° 1", qty: sale.N1, price: sale.N1Price },
        { label: "N° 2", qty: sale.N2, price: sale.N2Price },
        { label: "N° 3", qty: sale.N3, price: sale.N3Price },
        { label: "N° 4", qty: sale.N4, price: sale.N4Price },
    ].filter((item) => Number(item.qty) > 0);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Navigation & Section Tag */}
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => router.push("/sales")}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Sales
                </button>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    {sale.saleNumber ? `Venta N° ${sale.saleNumber}` : `Venta #${sale.id.slice(0, 8)}`}
                </span>
            </div>

            {/* Header Card */}
            <div className="relative bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden p-6 sm:p-8">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600" />

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-semibold text-slate-900">
                                Sale Details
                            </h1>
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${badgeClass}`}>
                                <StatusIcon className="w-3.5 h-3.5" />
                                {sale.status}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-emerald-600" />
                            Registered on {formatUtcDate(sale.date)}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link href={`/sales/${id}/edit`}>
                            <Button
                                variant="outline"
                                className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-emerald-700 rounded-xl flex items-center gap-1.5 text-sm font-semibold"
                            >
                                <Edit className="w-4 h-4" />
                                Edit Sale
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Key Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Sale Date
                    </p>
                    <p className="text-base sm:text-lg font-bold text-slate-900">
                        {formatUtcDate(sale.date)}
                    </p>
                </div>

                <div className="bg-emerald-50/60 rounded-2xl border border-emerald-200/80 p-4 shadow-sm">
                    <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
                        Total Amount
                    </p>
                    <p className="text-xl sm:text-2xl font-black text-slate-900">
                        {formatCurrency(sale.totalAmount)}
                    </p>
                </div>

                <div className="bg-teal-50/60 rounded-2xl border border-teal-200/80 p-4 shadow-sm">
                    <p className="text-xs font-semibold text-teal-700 uppercase tracking-wider mb-1">
                        Amount Paid
                    </p>
                    <p className="text-xl sm:text-2xl font-black text-teal-800">
                        {formatCurrency(sale.amountPaid)}
                    </p>
                </div>

                <div className={`rounded-2xl border p-4 shadow-sm ${
                    sale.remainingAmount > 0
                        ? "bg-rose-50/60 border-rose-200/80"
                        : "bg-emerald-50/60 border-emerald-200/80"
                }`}>
                    <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${
                        sale.remainingAmount > 0 ? "text-rose-700" : "text-emerald-700"
                    }`}>
                        Remaining Debt
                    </p>
                    <p className={`text-xl sm:text-2xl font-black ${
                        sale.remainingAmount > 0 ? "text-rose-700" : "text-emerald-700"
                    }`}>
                        {sale.remainingAmount > 0 ? formatCurrency(sale.remainingAmount) : "Paid"}
                    </p>
                </div>
            </div>

            {/* Items Breakdown */}
            <div className="bg-white rounded-2xl border border-emerald-100/90 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-emerald-600" />
                        Items Breakdown
                    </h2>
                    <span className="text-xs text-slate-400">
                        {items.length} {items.length === 1 ? "category" : "categories"}
                    </span>
                </div>

                {items.length === 0 ? (
                    <p className="text-sm text-slate-500 py-2">No egg quantities recorded for this sale.</p>
                ) : (
                    <div className="space-y-2.5">
                        {items.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3.5 bg-slate-50/70 hover:bg-emerald-50/30 rounded-xl border border-slate-100 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                                        {item.label}
                                    </span>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">
                                            {item.qty} {item.qty === 1 ? "tray" : "trays"}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            Price: {formatCurrency(item.price)} each
                                        </p>
                                    </div>
                                </div>
                                <span className="text-base font-extrabold text-slate-900">
                                    {formatCurrency(item.qty * item.price)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex justify-between items-center bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-emerald-500/10 border border-emerald-200/80 p-4 rounded-xl">
                    <span className="text-base font-bold text-slate-800">Total Calculation:</span>
                    <span className="text-2xl font-black text-emerald-700">
                        {formatCurrency(sale.totalAmount)}
                    </span>
                </div>
            </div>

            {/* Buyer Information Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <User className="w-4 h-4 text-emerald-600" />
                        Buyer Information
                    </h2>
                    {buyer?.id && (
                        <Link
                            href={`/buyers/${buyer.id}`}
                            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                        >
                            View Buyer Profile →
                        </Link>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                        <span className="text-xs text-slate-400 font-medium">Customer Name</span>
                        <p className="text-base font-bold text-slate-900">
                            {buyer?.name || "Customer not specified"}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <span className="text-xs text-slate-400 font-medium">Phone</span>
                        <p className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            {buyer?.phone || "No phone registered"}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <span className="text-xs text-slate-400 font-medium">Delivery Address</span>
                        <p className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            {buyer?.address || "No address provided"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
                {sale.status !== "PAID" && (
                    <PaymentModal sale={sale} onSuccess={fetchData}>
                        <div className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl py-3 px-4 shadow-sm hover:shadow transition active:scale-95 flex items-center justify-center gap-2 text-base cursor-pointer">
                            <DollarSign className="w-5 h-5" />
                            Add Payment
                        </div>
                    </PaymentModal>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                        onClick={handleSendWhatsApp}
                        className="flex-1 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold rounded-xl h-11 flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                    >
                        <Send className="w-4 h-4" />
                        Send via WhatsApp
                    </Button>

                    <Button
                        onClick={handleCopyToClipboard}
                        variant="outline"
                        className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl h-11 flex items-center justify-center gap-2 font-semibold cursor-pointer"
                    >
                        {copied ? (
                            <>
                                <Check className="w-4 h-4 text-emerald-600" />
                                <span className="text-emerald-700">Copied to Clipboard!</span>
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4" />
                                Copy Message
                            </>
                        )}
                    </Button>

                    <Button
                        onClick={handleDelete}
                        variant="outline"
                        className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 rounded-xl h-11 flex items-center justify-center gap-2 font-semibold cursor-pointer"
                    >
                        <Trash2 className="w-4 h-4" />
                        Delete Sale
                    </Button>
                </div>
            </div>
        </div>
    );
}
