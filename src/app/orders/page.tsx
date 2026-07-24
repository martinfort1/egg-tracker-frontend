"use client"

import OrderRow from "@/components/order-row";
import LoadSpin from "@/components/load-spin";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { ClipboardList, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const res = await api.get("/orders");
            setOrders(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch orders");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const [upcomingOrders, pastOrders] = useMemo(() => {
        const sorted = [...orders].sort(
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
    }, [orders]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                <div className="max-w-2xl">
                    <h1 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-semibold text-slate-900">
                        Orders
                    </h1>
                    <p className="mt-2 text-sm text-slate-600">
                        Review active orders first, then past orders below. Click any order row to open the order details page.
                    </p>
                </div>
                <Link href="/orders/new">
                    <Button className="bg-linear-to-br from-green-400/80 to-green-600/60 text-white hover:from-green-600 hover:to-green-700 rounded-full w-full sm:w-auto cursor-pointer">
                        <Plus className="w-4 h-4 mr-1" />
                        New Order
                    </Button>
                </Link>
            </div>

            {isLoading ? (
                <LoadSpin />
            ) : orders.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                    <ClipboardList className="w-14 h-14 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-600 text-lg font-medium">No orders yet</p>
                    <p className="text-slate-400 text-sm mt-1">
                        Create your first order to get started
                    </p>
                </div>
            ) : (
                <div className="space-y-10">
                    {upcomingOrders.length > 0 && (
                        <section className="space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-1">
                                        Upcoming orders
                                    </p>
                                    <p className="text-slate-600 text-sm">
                                        Orders with delivery dates today or in the future are shown here first.
                                    </p>
                                </div>
                                <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                                    {upcomingOrders.length} active
                                </span>
                            </div>
                            <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                                {upcomingOrders.map((item, index) => (
                                    <div key={(item.order || item).id}>
                                        <OrderRow item={item} onRefresh={fetchOrders} />
                                        {index < upcomingOrders.length - 1 && (
                                            <div className="h-px bg-gray-200" />
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
                                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-1">
                                        Past orders
                                    </p>
                                    <p className="text-slate-600 text-sm">
                                        Fulfilled or cancelled orders with older dates are stored here for reference.
                                    </p>
                                </div>
                                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                    {pastOrders.length} history
                                </span>
                            </div>
                            <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                                {pastOrders.map((item, index) => (
                                    <div key={(item.order || item).id}>
                                        <OrderRow item={item} onRefresh={fetchOrders} />
                                        {index < pastOrders.length - 1 && (
                                            <div className="h-px bg-gray-200" />
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
