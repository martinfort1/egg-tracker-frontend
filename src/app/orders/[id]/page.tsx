"use client";

import LoadSpin from "@/components/load-spin";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import {
    Trash2,
    Edit,
    PackageCheck,
    ArrowLeft,
    Calendar,
    User,
    Phone,
    MapPin,
    ShoppingBag,
    Repeat,
    Clock,
    CheckCircle2,
    XCircle,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { formatCurrency, formatUtcDate } from "@/lib/utils";
import FulfillOrderModal from "@/components/fulfill-order-modal";

export default function OrderPage() {
    const { id } = useParams();
    const router = useRouter();
    const [data, setData] = useState<any>(null);

    const fetchData = async () => {
        try {
            const res = await api.get(`/orders/${id}`);
            setData(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load order details");
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleDelete = async () => {
        try {
            await api.delete(`/orders/${id}`);
            toast.success("Order cancelled successfully");
            router.push("/orders");
        } catch (error) {
            toast.error("Error deleting order");
        }
    };

    if (!data) return <LoadSpin />;

    const order = data.order || data;
    const buyer = data.buyer || data?.buyer;
    const orderWithBuyer = { ...order, buyer };

    const statusConfig: Record<string, { className: string; icon: any }> = {
        FULFILLED: {
            className: "bg-emerald-50 text-emerald-700 border-emerald-200",
            icon: CheckCircle2,
        },
        PENDING: {
            className: "bg-amber-50 text-amber-700 border-amber-200",
            icon: Clock,
        },
        CANCELLED: {
            className: "bg-rose-50 text-rose-700 border-rose-200",
            icon: XCircle,
        },
    };

    const statusBadge = statusConfig[order.status] || {
        className: "bg-slate-100 text-slate-700 border-slate-200",
        icon: Clock,
    };
    const StatusIcon = statusBadge.icon;

    const items = [
        { label: "Extra", qty: order.Extra, price: order.ExtraPrice },
        { label: "N° 1", qty: order.N1, price: order.N1Price },
        { label: "N° 2", qty: order.N2, price: order.N2Price },
        { label: "N° 3", qty: order.N3, price: order.N3Price },
        { label: "N° 4", qty: order.N4, price: order.N4Price },
    ].filter((item) => Number(item.qty) > 0);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Navigation & Section Tag */}
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => router.push("/orders")}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Orders
                </button>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    Order #{order.id}
                </span>
            </div>

            {/* Header Card */}
            <div className="relative bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden p-6 sm:p-8">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600" />

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-semibold text-slate-900">
                                Order Details
                            </h1>
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${statusBadge.className}`}>
                                <StatusIcon className="w-3.5 h-3.5" />
                                {order.status}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-indigo-600" />
                            Delivery scheduled for {formatUtcDate(order.date)}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link href={`/orders/${id}/edit`}>
                            <Button
                                variant="outline"
                                className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-indigo-700 rounded-xl flex items-center gap-1.5 text-sm font-semibold"
                            >
                                <Edit className="w-4 h-4" />
                                Edit Order
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Key Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Delivery Date
                    </p>
                    <p className="text-base sm:text-lg font-bold text-slate-900">
                        {formatUtcDate(order.date)}
                    </p>
                </div>

                <div className="bg-indigo-50/60 rounded-2xl border border-indigo-200/80 p-4 shadow-sm">
                    <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-1">
                        Estimated Total
                    </p>
                    <p className="text-xl sm:text-2xl font-black text-slate-900">
                        {formatCurrency(order.totalAmount)}
                    </p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex flex-col justify-between">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Schedule Type
                    </p>
                    <div className="flex items-center gap-1.5">
                        <Repeat className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span className="text-sm font-bold text-slate-900">
                            {order.recurring ? "Recurring Delivery" : "One-time Delivery"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Recurring Schedule Card (if recurring) */}
            {order.recurring && (
                <div className="bg-indigo-50/40 border border-indigo-100 rounded-2xl p-5 space-y-2">
                    <div className="flex items-center gap-2">
                        <Repeat className="w-4 h-4 text-indigo-600" />
                        <h3 className="text-sm font-bold text-slate-900">
                            Recurring Delivery Days
                        </h3>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                        {order.recurringDays && order.recurringDays.length > 0 ? (
                            order.recurringDays.map((day: string) => (
                                <span
                                    key={day}
                                    className="px-3 py-1 rounded-xl text-xs font-bold bg-indigo-600 text-white shadow-xs"
                                >
                                    {day}
                                </span>
                            ))
                        ) : (
                            <span className="text-xs text-slate-500">No specific days selected</span>
                        )}
                    </div>
                </div>
            )}

            {/* Items Breakdown */}
            <div className="bg-white rounded-2xl border border-indigo-100/90 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-indigo-600" />
                        Ordered Items
                    </h2>
                    <span className="text-xs text-slate-400">
                        {items.length} {items.length === 1 ? "category" : "categories"}
                    </span>
                </div>

                {items.length === 0 ? (
                    <p className="text-sm text-slate-500 py-2">No egg quantities specified for this order.</p>
                ) : (
                    <div className="space-y-2.5">
                        {items.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3.5 bg-slate-50/70 hover:bg-indigo-50/30 rounded-xl border border-slate-100 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 font-bold text-xs flex items-center justify-center">
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

                <div className="flex justify-between items-center bg-gradient-to-r from-indigo-500/10 via-purple-500/5 to-indigo-500/10 border border-indigo-200/80 p-4 rounded-xl">
                    <span className="text-base font-bold text-slate-800">Total Order Amount:</span>
                    <span className="text-2xl font-black text-indigo-700">
                        {formatCurrency(order.totalAmount)}
                    </span>
                </div>
            </div>

            {/* Buyer Information Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <User className="w-4 h-4 text-indigo-600" />
                        Buyer Information
                    </h2>
                    {buyer?.id && (
                        <Link
                            href={`/buyers/${buyer.id}`}
                            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline"
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

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
                {order.status === "PENDING" && (
                    <FulfillOrderModal
                        order={orderWithBuyer}
                        onSuccess={(payload: any) => {
                            const saleId = payload?.sale?.id ?? payload?.id ?? payload?.saleId;
                            router.push(saleId ? `/sales/${saleId}` : "/orders");
                        }}
                    >
                        <Button
                            size="lg"
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl h-12 shadow-sm hover:shadow transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <PackageCheck className="w-5 h-5" />
                            Complete Delivery (Fulfill Order)
                        </Button>
                    </FulfillOrderModal>
                )}

                <Button
                    onClick={handleDelete}
                    variant="outline"
                    className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 rounded-xl h-12 flex items-center justify-center gap-2 font-semibold cursor-pointer"
                >
                    <Trash2 className="w-4 h-4" />
                    Cancel Order
                </Button>
            </div>
        </div>
    );
}
