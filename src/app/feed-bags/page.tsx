"use client"

import FeedBagCard from "@/components/feed-bag-card";
import { Button } from "@/components/ui/button";
import LoadSpin from "@/components/load-spin";
import { api } from "@/lib/api";
import { Package, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MetricCardValue } from "@/components/metric-card-value";
import PaymentModal from "@/components/payment-modal";
import { toast } from "sonner";

export default function FeedBagsPage() {
    const [feedBags, setFeedBags] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [metrics, setMetrics] = useState({ totalOwed: 0, unpaidCount: 0 });

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

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-semibold text-slate-900">
                        Feed Bags & Nutrition
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Track poultry feed orders, feed phases, supplier payments and debts
                    </p>
                </div>
                <Link href="/feed-bags/new">
                    <Button className="bg-orange-600 hover:bg-orange-700 text-white rounded-lg px-4 py-2 font-medium shadow-sm transition active:scale-95 flex items-center gap-2 cursor-pointer w-full sm:w-auto">
                        <Plus size={16} />
                        Add Feed Purchase
                    </Button>
                </Link>
            </div>

            {/* Metrics Section */}
            {!isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <MetricCardValue title="Unpaid Feed Orders" value={metrics.unpaidCount} unit=" orders" isCurrency={false} />
                    <MetricCardValue title="Total Feed Debt" value={metrics.totalOwed} isCurrency={true} />
                </div>
            )}

            {/* Bulk Payment Button */}
            {!isLoading && metrics.totalOwed > 0 && (
                <div className="bg-white p-4 rounded-xl border border-orange-100 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-orange-700">Debt Reconciliation</p>
                        <p className="text-xs text-slate-500">Apply a general indistinct payment towards overall feed supplier debt</p>
                    </div>
                    <PaymentModal 
                        sale={{ id: 'bulk' }} 
                        endpoint="feed-bags/payment/bulk" 
                        onSuccess={handlePaymentSuccess} 
                        className="bg-amber-500 hover:bg-amber-600 text-white rounded-lg px-4 py-2 text-xs font-semibold shadow-sm transition active:scale-95 cursor-pointer w-full sm:w-auto text-center"
                        isBulkPayment={true}
                        owed={metrics.totalOwed}
                    >
                        <span>Register General Payment</span>
                    </PaymentModal>
                </div>
            )}

            {isLoading ? (
                <LoadSpin />
            ) : feedBags.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-orange-100 shadow-sm">
                    <Package className="w-14 h-14 text-orange-300 mx-auto mb-4" />
                    <p className="text-slate-700 text-lg font-medium">No feed purchases recorded yet</p>
                    <p className="text-slate-400 text-sm mt-1">Add your first feed purchase to get started</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {feedBags.map((feedBag: any) => (
                        <FeedBagCard key={feedBag.id} feedBag={feedBag} refresh={fetchFeedBags} />
                    ))}
                </div>
            )}
        </div>
    );
}
