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
            toast.success("Payment added successfully");
        }, 2000);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PAID': return 'text-green-300 bg-green-500/20 border-green-500/30';
            case 'PARTIAL': return 'text-yellow-300 bg-yellow-500/20 border-yellow-500/30';
            case 'UNPAID': return 'text-red-300 bg-red-500/20 border-red-500/30';
            default: return 'text-gray-300 bg-gray-500/20 border-gray-500/30';
        }
    };

    return (
        <div className="space-y-6 p-4 md:p-6 bg-linear-to-br from-slate-900/30 via-slate-900/20 to-slate-900/30 rounded-2xl border border-white/10 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h1 className="flex justify-center text-2xl sm:text-3xl font-['Playfair_Display'] font-black text-white text-shadow-lg">
                    Feed Bags
                </h1>
                <Link href="/feed-bags/new">
                    <Button className="bg-linear-to-br from-green-400/80 to-green-600/60 text-indigo-100 hover:bg-green-600 rounded-full w-full sm:w-auto cursor-pointer">
                        <Plus size={18} />
                        Add Feed Purchase
                    </Button>
                </Link>
            </div>

            {/* Metrics Section */}
            {!isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <MetricCardValue title="Unpaid Orders" value={metrics.unpaidCount} unit="" isCurrency={false} />
                    <MetricCardValue title="Amount Owed" value={metrics.totalOwed} isCurrency={true} />
                </div>
            )}

            {/* Bulk Payment Button */}
            {!isLoading && metrics.totalOwed > 0 && (
                <div className="flex flex-col items-center justify-between gap-6">
                    <PaymentModal 
                        sale={{ id: 'bulk' }} 
                        endpoint="feed-bags/payment/bulk" 
                        onSuccess={handlePaymentSuccess} 
                        className="w-full flex justify-center rounded-2xl shadow-xl hover:bg-gray-600"
                        isBulkPayment={true}
                        owed={metrics.totalOwed}
                    >
                        <span className="w-full block text-center">Add an indistinct payment here</span>
                    </PaymentModal>
                    <div className="w-full rounded-2xl h-0.5 bg-gray-400"></div>
                </div>
            )}

            {isLoading ? (
                <LoadSpin />
            ) : feedBags.length === 0 ? (
                <div className="col-span-full text-center py-12">
                    <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg">No feed purchases yet</p>
                    <p className="text-slate-500 text-sm">Add your first feed purchase to get started</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {feedBags.map((feedBag: any) => (
                        <FeedBagCard key={feedBag.id} feedBag={feedBag} refresh={fetchFeedBags} />
                    ))}
                </div>
            )}
        </div>
    )
}