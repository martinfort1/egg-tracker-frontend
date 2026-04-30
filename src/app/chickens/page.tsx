"use client"

import { MetricCard } from "@/components/metric-card";
import { MetricCardValue } from "@/components/metric-card-value";
import { AddChickenForm } from "@/components/add-chicken-form";
import { AddChickenDeathForm } from "@/components/add-chicken-death-form";
import { ChickenQuantityChart } from "@/components/chicken-quantity-chart";
import { LayingPercentageChart } from "@/components/laying-percentage-chart";
import { LayingPercentageHistoryChart } from "@/components/laying-percentage-history-chart";
import { ChickenPurchaseCard } from "@/components/chicken-purchase-card";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import LoadSpin from "@/components/load-spin";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatUtcDate } from "@/lib/utils";
import { Bird, Diff } from "lucide-react";

export default function ChickensPage() {
    const [chickens, setChickens] = useState<any[]>([]);
    const [currentCount, setCurrentCount] = useState(0);
    const [history, setHistory] = useState<any[]>([]);
    const [layingHistory, setLayingHistory] = useState<any[]>([]);
    const [laying, setLaying] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedChickenId, setSelectedChickenId] = useState<string | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [chickensRes, historyRes, layingHistoryRes] = await Promise.all([
                api.get("/chickens"),
                api.get("/chickens/history"),
                api.get("/chickens/laying-percentage-history"),
            ]);

            setChickens(chickensRes.data);
            setHistory(historyRes.data);
            setLayingHistory(layingHistoryRes.data);
            setLaying(layingHistoryRes.data.length ? layingHistoryRes.data[layingHistoryRes.data.length - 1].percentage : 0);
        } catch (err) {
            console.error("Failed to fetch data:", err);
            toast.error("Failed to load data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (chickens.length > 0) {
            getCurrentCount();
        }
    }, [chickens]);

    const getCurrentCount = async () => {
        try {
            const res = await api.get("/chickens/current-count");
            setCurrentCount(res.data);
        } catch (err) {
            console.error("Failed to fetch current count:", err);
        }
    };

    const handleDeleteChicken = async (id: string) => {
        if (confirm("Are you sure you want to delete this chicken record?")) {
            try {
                await api.delete(`/chickens/${id}`);
                toast.success("Chicken record deleted successfully!");
                fetchData();
            } catch (err) {
                toast.error("Failed to delete chicken record");
                console.error(err);
            }
        }
    };

    const handleDeleteDeath = async (deathId: string) => {
        if (confirm("Are you sure you want to delete this death record?")) {
            try {
                // Assuming there's a delete endpoint for deaths
                // For now, we'll just show a message
                toast.info("Death record deletion not yet implemented");
            } catch (err) {
                toast.error("Failed to delete death record");
                console.error(err);
            }
        }
    };

    if (isLoading) {
        return <LoadSpin />;
    }

    const chartData = history.map((item: any) => ({
        date: item.date,
        count: item.count,
        event: item.event,
    }));

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h1 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-black text-center sm:text-left text-shadow-lg">
                    Chickens Management
                </h1>
                <Link href="#" className="hidden">
                    {/* Placeholder for consistency */}
                </Link>
            </div>

            {/* Metric Cards Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <MetricCardValue title="Current Chickens" value={currentCount}  isCurrency={false} />
                <div className="bg-linear-to-br from-yellow-600/50 via-violet-600/40 to-green-900/35 border border-white/20 backdrop-blur-xl p-6 rounded-2xl shadow-2xl text-white">
                    <p className="text-xl text-slate-900/90 tracking-wide">Laying Percentage</p>
                    <p className="text-3xl md:text-4xl font-extrabold text-black mt-3">{laying.toFixed(2)}%</p>
                    {layingHistory.length > 0 && (
                        <p className="text-xs text-slate-700 mt-2">As of {formatUtcDate(layingHistory[layingHistory.length - 1].date)}</p>
                    )}
                </div>
                <MetricCard title="Total Invested" value={chickens.reduce((sum, c) => sum + c.totalCost, 0)} />
            </div>

        

            {/* Charts Row - Quantity and Laying Percentage Over Time */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChickenQuantityChart data={chartData} />
                <LayingPercentageHistoryChart data={layingHistory} />
            </div>

            {/* Current Laying Percentage Pie Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-full">
                    <LayingPercentageChart percentage={laying} />
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow flex flex-col h-full">
                    <div className="flex flex-col items-center text-center gap-2 bg-linear-to-b from-slate-800 to-slate-700 text-white rounded-lg p-4 mb-4">
                        <div className="flex">
                            <Diff className="text-yellow-500 mt-2"/>
                            <Bird className="text-yellow-500 mt-2"/>
                        </div>
                        <h2 className="font-semibold mb-4">Quick Actions</h2>
                    </div>
                    <div className="space-y-3 flex-1 flex flex-col justify-center gap-y-5">
                        {chickens.length > 0 && (
                            <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                                <p className="text-sm font-semibold text-red-800 mb-2">Register death event</p>
                                <select
                                    value={selectedChickenId || ""}
                                    onChange={(e) => setSelectedChickenId(e.target.value || null)}
                                    className="w-full p-3 border border-red-300 rounded-lg bg-white"
                                >
                                    <option value="">Select a purchase</option>
                                    {chickens.map((chicken) => (
                                        <option key={chicken.id} value={chicken.id}>
                                            {formatUtcDate(chicken.date)} - {chicken.amount} chickens
                                        </option>
                                    ))}
                                </select>
                                {selectedChickenId && (
                                    <div className="mt-3">
                                        <AddChickenDeathForm 
                                            chickenId={selectedChickenId} 
                                            onSuccess={fetchData} 
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="bg-slate-50 p-4 rounded-xl border border-blue-400">
                            <p className="text-sm font-semibold text-gray-700 mb-2">Add new chickens</p>
                            <AddChickenForm onSuccess={fetchData} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Purchase History Cards */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-['Playfair_Display'] font-bold text-shadow-lg">Purchase History</h2>
                    {chickens.length > 0 && (
                        <span className="text-sm text-gray-500">
                            {chickens.length} purchase{chickens.length !== 1 ? 's' : ''}
                        </span>
                    )}
                </div>

                {chickens.length === 0 ? (
                    <div className="bg-white p-12 rounded-xl shadow text-center">
                        <p className="text-gray-500 text-lg">No chicken purchases yet.</p>
                        <p className="text-gray-400">Add your first purchase to get started.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {chickens.map((chicken) => (
                            <ChickenPurchaseCard
                                key={chicken.id}
                                chicken={chicken}
                                onDelete={handleDeleteChicken}
                                onRefresh={fetchData}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
