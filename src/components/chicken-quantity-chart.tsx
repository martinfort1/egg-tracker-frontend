"use client";

import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { TrendingDown } from "lucide-react";
import { formatUtcDate } from "@/lib/utils";

export function ChickenQuantityChart({ data }: { data: any[] }) {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white p-8 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col items-center justify-center h-80 text-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                    <TrendingDown className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-slate-700">No chicken data available</p>
                <p className="text-xs text-slate-400 mt-0.5">Purchases and death records will appear here</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200/90 hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 shrink-0">
                        <TrendingDown className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                            Chicken Quantity Over Time
                        </h2>
                        <p className="text-xs text-slate-500">
                            Historical flock size tracking
                        </p>
                    </div>
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                    Flock Size
                </span>
            </div>

            <div className="w-full h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="#94a3b8"
                            tick={{ fill: "#64748b", fontSize: 12 }}
                            axisLine={{ stroke: "#e2e8f0" }}
                            tickLine={false}
                            tickFormatter={(date) => formatUtcDate(date)}
                            dy={8}
                        />
                        <YAxis
                            stroke="#94a3b8"
                            tick={{ fill: "#64748b", fontSize: 12 }}
                            axisLine={{ stroke: "#e2e8f0" }}
                            tickLine={false}
                            dx={-4}
                        />
                        <Tooltip
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-white/95 backdrop-blur-md p-3 rounded-xl border border-slate-200/90 shadow-xl text-xs">
                                            <p className="font-bold text-slate-800 pb-1 mb-1.5 border-b border-slate-100">
                                                {label ? formatUtcDate(String(label)) : ""}
                                            </p>
                                            <p className="text-blue-600 font-bold flex items-center gap-1.5">
                                                <span className="w-2 h-2 rounded-full bg-blue-500" />
                                                {payload[0].value} chickens
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#3b82f6"
                            strokeWidth={2.5}
                            dot={{ r: 3, fill: "#3b82f6", strokeWidth: 0 }}
                            activeDot={{ r: 6, fill: "#2563eb", stroke: "#ffffff", strokeWidth: 2 }}
                            name="Chicken Count"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
