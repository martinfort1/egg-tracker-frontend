"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { PackageCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/lib/api";
import { formatCurrency, formatUtcDate } from "@/lib/utils";
import { Button } from "./ui/button";
import FulfillOrderModal from "./fulfill-order-modal";

const statusColor: Record<string, string> = {
    FULFILLED: "bg-green-100 text-green-700 border-green-200",
    PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
    CANCELLED: "bg-red-100 text-red-700 border-red-200",
};

function formatOrderSummary(order: any) {
    const items: string[] = [];

    if (order.Extra > 0) items.push(`Extra ×${order.Extra}`);
    if (order.N1 > 0) items.push(`N1 ×${order.N1}`);
    if (order.N2 > 0) items.push(`N2 ×${order.N2}`);
    if (order.N3 > 0) items.push(`N3 ×${order.N3}`);
    if (order.N4 > 0) items.push(`N4 ×${order.N4}`);

    return items.length > 0 ? items.join(" · ") : "No items";
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

    return (
        <div className="group bg-white px-4 py-3 flex flex-col lg:flex-row lg:items-center gap-3 lg:gap-6 hover:bg-slate-50 transition">
            <Link
                href={`/orders/${order.id}`}
                className="flex flex-1 min-w-0 items-center gap-4 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition">
                            {buyer?.name ?? "Unknown buyer"}
                        </span>
                        <span className="text-sm text-slate-500 whitespace-nowrap">
                            {formatUtcDate(order.date)}
                        </span>
                    </div>
                    <p className="text-sm text-slate-600 truncate mt-1">
                        {formatOrderSummary(order)}
                    </p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                    <span
                        className={`px-2.5 py-1 rounded-md border text-xs font-semibold whitespace-nowrap ${
                            statusColor[order.status] ?? "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                    >
                        {order.status}
                    </span>

                    <span className="font-bold text-slate-900 whitespace-nowrap text-right">
                        {formatCurrency(order.totalAmount)}
                    </span>
                </div>
            </Link>

            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                {order.status === "PENDING" && (
                    <div className="flex items-center gap-1">
                        <FulfillOrderModal
                            order={orderWithBuyer}
                            onSuccess={handleFulfillSuccess}
                        >
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                title="Set as delivered"
                                className="h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700 cursor-pointer"
                            >
                                <PackageCheck size={18} />
                            </Button>
                        </FulfillOrderModal>

                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            title="Cancel order"
                            onClick={handleDelete}
                            className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                        >
                            <Trash2 size={18} />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
