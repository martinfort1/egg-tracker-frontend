"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { PackageCheck, Trash2, Calendar, CheckCircle2, Clock, XCircle } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/lib/api";
import { formatCurrency, formatUtcDate } from "@/lib/utils";
import { Button } from "./ui/button";
import FulfillOrderModal from "./fulfill-order-modal";

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

function formatOrderSummary(order: any) {
    const items: string[] = [];

    if (order.Extra > 0) items.push(`Extra ×${order.Extra}`);
    if (order.N1 > 0) items.push(`N1 ×${order.N1}`);
    if (order.N2 > 0) items.push(`N2 ×${order.N2}`);
    if (order.N3 > 0) items.push(`N3 ×${order.N3}`);
    if (order.N4 > 0) items.push(`N4 ×${order.N4}`);

    return items.length > 0 ? items.join(" · ") : "No items specified";
}

export default function OrderRow({
    item,
    onRefresh,
}: {
    item: any;
    onRefresh: () => void;
}) {
    const router = useRouter();
    const order = item.order || item;
    const buyer = item.buyer || order.buyer;
    const orderWithBuyer = { ...order, buyer };

    const handleDelete = async () => {
        try {
            await api.delete(`/orders/${order.id}`);
            toast.success("Order cancelled successfully");
            onRefresh();
        } catch {
            toast.error("Error deleting order");
        }
    };

    const handleFulfillSuccess = (payload: any) => {
        const saleId = payload?.sale?.id ?? payload?.id ?? payload?.saleId;

        if (saleId) {
            router.push(`/sales/${saleId}`);
            return;
        }

        onRefresh();
    };

    const statusBadge = statusConfig[order.status] || {
        className: "bg-slate-100 text-slate-700 border-slate-200",
        icon: Clock,
    };
    const StatusIcon = statusBadge.icon;

    return (
        <div className="group bg-white px-5 py-4 flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-6 hover:bg-slate-50/80 transition-colors">
            <Link
                href={`/orders/${order.id}`}
                className="flex flex-1 min-w-0 items-center gap-4 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors text-base">
                            {buyer?.name ?? "Unknown customer"}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>{formatUtcDate(order.date)}</span>
                        </div>
                    </div>
                    <p className="text-xs text-slate-600 truncate">
                        {formatOrderSummary(order)}
                    </p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                    <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-xs font-semibold whitespace-nowrap ${statusBadge.className}`}
                    >
                        <StatusIcon className="w-3.5 h-3.5" />
                        {order.status}
                    </span>

                    <span className="font-extrabold text-slate-900 whitespace-nowrap text-right text-base">
                        {formatCurrency(order.totalAmount)}
                    </span>
                </div>
            </Link>

            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                {order.status === "PENDING" && (
                    <div className="flex items-center gap-1.5">
                        <FulfillOrderModal
                            order={orderWithBuyer}
                            onSuccess={handleFulfillSuccess}
                        >
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                title="Set as delivered"
                                className="h-8 px-2.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200 transition active:scale-95 cursor-pointer flex items-center gap-1"
                            >
                                <PackageCheck size={14} />
                                <span>Fulfill</span>
                            </Button>
                        </FulfillOrderModal>

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            title="Cancel order"
                            onClick={handleDelete}
                            className="h-8 px-2.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border-rose-200 transition active:scale-95 cursor-pointer flex items-center gap-1"
                        >
                            <Trash2 size={14} />
                            <span>Cancel</span>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
