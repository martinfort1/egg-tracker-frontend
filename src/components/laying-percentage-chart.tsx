"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ChartPie } from "lucide-react";

export function LayingPercentageChart({ percentage }: { percentage: number }) {
    const safePercentage = Math.max(0, Math.min(100, Math.round(percentage || 0)));
    const data = [
        { name: "Laying", value: safePercentage },
        { name: "Not Laying", value: 100 - safePercentage },
    ];

    const COLORS = ["#10b981", "#e2e8f0"];

    return (
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200/90 hover:shadow-md transition-shadow flex flex-col justify-between h-full">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-sm shadow-amber-500/20 shrink-0">
                        <ChartPie className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                            Laying Chicken Percentage
                        </h2>
                        <p className="text-xs text-slate-500">
                            Current flock laying efficiency
                        </p>
                    </div>
                </div>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                    Efficiency
                </span>
            </div>

            {/* Donut Chart with Center Stat */}
            <div className="relative w-full h-[240px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={68}
                            outerRadius={94}
                            paddingAngle={3}
                            cornerRadius={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const entry = payload[0];
                                    const isLaying = entry.name === "Laying";
                                    return (
                                        <div className="bg-white/95 backdrop-blur-md p-2.5 rounded-xl border border-slate-200/90 shadow-xl text-xs">
                                            <p className="font-bold text-slate-800 flex items-center gap-1.5">
                                                <span
                                                    className="w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: isLaying ? "#10b981" : "#94a3b8" }}
                                                />
                                                {entry.name}: {entry.value}%
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Badge */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-black text-slate-900 tracking-tight">
                        {safePercentage}%
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Laying
                    </span>
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="font-medium text-slate-700">Laying:</span>
                    <span className="font-bold text-emerald-600">{safePercentage}%</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    <span className="font-medium text-slate-500">Not Laying:</span>
                    <span className="font-bold text-slate-600">{100 - safePercentage}%</span>
                </div>
            </div>
        </div>
    );
}
