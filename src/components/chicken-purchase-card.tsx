"use client"

import { Button } from "@/components/ui/button";
import { Trash2, Bird, Calendar } from "lucide-react";
import { AddChickenDeathForm } from "@/components/add-chicken-death-form";
import { formatCurrency, formatNumber, formatUtcDate } from "@/lib/utils";

interface ChickenCardProps {
    chicken: any;
    onDelete: (id: string) => void;
    onRefresh: () => void;
}

export function ChickenPurchaseCard({ chicken, onDelete, onRefresh }: ChickenCardProps) {
    const totalDeaths = chicken.deaths.reduce((sum: number, d: any) => sum + d.amount, 0);
    const remaining = chicken.amount - totalDeaths;
    const survivalRate = chicken.amount > 0 ? ((remaining / chicken.amount) * 100).toFixed(1) : "0";

    return (
        <div className="group relative bg-white rounded-2xl border border-amber-200/80 p-5 sm:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            {/* Top Section Accent Line (Gold / Warm Amber) */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600" />

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                <div>
                    <div className="flex items-center gap-1.5 mb-1">
                        <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                            Flock Purchase
                        </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
                        Purchase on {formatUtcDate(chicken.date)}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 font-mono">ID: {chicken.id.slice(0, 8)}</p>
                </div>

                <div className="flex items-center gap-2">
                    <AddChickenDeathForm chickenId={chicken.id} onSuccess={onRefresh} />
                    <Button
                        size="sm"
                        variant="outline"
                        className="text-slate-500 hover:text-rose-600 hover:bg-rose-50 border-slate-200 hover:border-rose-200 rounded-lg transition active:scale-95 cursor-pointer h-9 px-3"
                        onClick={() => onDelete(chicken.id)}
                    >
                        <Trash2 size={15} />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                <div className="bg-amber-50/60 border border-amber-200/60 p-3.5 rounded-xl">
                    <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Purchased</p>
                    <p className="text-xl md:text-2xl font-black text-amber-900 mt-1">{formatNumber(chicken.amount)}</p>
                </div>
                <div className="bg-rose-50/60 border border-rose-200/60 p-3.5 rounded-xl">
                    <p className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">Deaths</p>
                    <p className="text-xl md:text-2xl font-black text-rose-700 mt-1">{formatNumber(totalDeaths)}</p>
                </div>
                <div className="bg-emerald-50/60 border border-emerald-200/60 p-3.5 rounded-xl">
                    <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Remaining</p>
                    <p className="text-xl md:text-2xl font-black text-emerald-800 mt-1">{formatNumber(remaining)}</p>
                </div>
                <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl">
                    <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Total Invested</p>
                    <p className="text-xl md:text-2xl font-black text-slate-900 mt-1">{formatCurrency(chicken.totalCost)}</p>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
                <div>
                    <p className="text-slate-400">Unit Price</p>
                    <p className="font-semibold text-slate-800 mt-0.5">{formatCurrency(chicken.pricePerChicken)}</p>
                </div>
                <div>
                    <p className="text-slate-400">Shipping</p>
                    <p className="font-semibold text-slate-800 mt-0.5">{formatCurrency(chicken.shippingCost)}</p>
                </div>
                <div>
                    <p className="text-slate-400">Survival Rate</p>
                    <p className="font-semibold text-emerald-700 mt-0.5">{survivalRate}%</p>
                </div>
            </div>

            {chicken.deaths && chicken.deaths.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-100">
                    <p className="text-xs font-bold text-slate-700 mb-2">Death Events ({chicken.deaths.length})</p>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto">
                        {chicken.deaths.map((death: any) => (
                            <div key={death.id} className="bg-rose-50/50 border border-rose-100 px-3 py-1.5 rounded-lg text-xs flex justify-between items-center">
                                <span className="font-semibold text-rose-700">-{formatNumber(death.amount)} chickens</span>
                                <span className="text-slate-400">{formatUtcDate(death.date)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
