"use client";

import { formatCurrency } from "@/lib/utils";
import { BarChart2 } from "lucide-react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Rectangle,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

// Custom shape component for conditional bar coloring
const CustomProfitBar = (props: any) => {
    const { x, y, width, height, payload } = props;
    const isPositive = (payload?.profit ?? 0) >= 0;
    const color = isPositive ? "#0f766e" : "#dc2626";

    return (
        <Rectangle
            x={x}
            y={y}
            width={width}
            height={height}
            fill={color}
            radius={[5, 5, 0, 0]}
        />
    );
};

const compactFormatter = new Intl.NumberFormat("es-AR", {
    notation: "compact",
});

// Custom sleek tooltip
const CustomTooltip = (props: any) => {
    const { active, payload, label } = props;

    if (active && payload && payload.length) {
        return (
            <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-200/90 shadow-xl min-w-[210px]">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-1.5 mb-2 border-b border-slate-100">
                    {label}
                </p>
                <div className="space-y-1.5 text-xs">
                    {payload.map((entry: any, index: number) => {
                        const isProfit = entry.name === "Profit Margin";
                        const value = typeof entry.value === "number" ? entry.value : Number(entry.value);
                        const isPositive = value >= 0;

                        const dotColor = isProfit
                            ? isPositive ? "#0f766e" : "#dc2626"
                            : entry.dataKey === "revenue"
                            ? "#10b981"
                            : "#f43f5e";

                        const labelText = isProfit
                            ? isPositive ? "Net Profit" : "Net Loss"
                            : entry.name;

                        return (
                            <div key={index} className="flex items-center justify-between gap-3">
                                <span className="flex items-center gap-1.5 text-slate-600">
                                    <span
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: dotColor }}
                                    />
                                    {labelText}:
                                </span>
                                <span className="font-bold" style={{ color: dotColor }}>
                                    {formatCurrency(value || 0)}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    return null;
};

export function SalesChart({ data, period }: any) {
    const hasData = Array.isArray(data) && data.length > 0;

    return (
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200/90 hover:shadow-md transition-shadow flex flex-col gap-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-sm shadow-emerald-500/20 shrink-0">
                        <BarChart2 className="w-5 h-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                                {period === "7d" || period === "30d" ? "Weekly" : "Monthly"} Margins Chart
                            </h2>
                            <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                                {period === "7d" || period === "30d" ? "Weekly" : "Monthly"}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Compare revenues, operational expenses, and net profit margin
                        </p>
                    </div>
                </div>

                {/* Legend badges */}
                <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-600 bg-slate-50/80 px-3 py-1.5 rounded-xl border border-slate-200/60 self-start sm:self-auto">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                        <span>Revenue</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
                        <span>Expenses</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-teal-700" />
                        <span>Profit Margin (+ / -)</span>
                    </div>
                </div>
            </div>

            {/* Chart Body */}
            {!hasData ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                        <BarChart2 className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-700">No margin data available</p>
                    <p className="text-xs text-slate-400 mt-0.5">Try selecting another time range above</p>
                </div>
            ) : (
                <div className="w-full h-[320px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} barGap={4} barCategoryGap={12}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis
                                dataKey="label"
                                stroke="#94a3b8"
                                tick={{ fill: "#64748b", fontSize: 12 }}
                                axisLine={{ stroke: "#e2e8f0" }}
                                tickLine={false}
                                dy={8}
                            />
                            <YAxis
                                stroke="#94a3b8"
                                tick={{ fill: "#64748b", fontSize: 12 }}
                                axisLine={{ stroke: "#e2e8f0" }}
                                tickLine={false}
                                tickFormatter={(value) => `$${compactFormatter.format(value)}`}
                                dx={-4}
                            />
                            <ReferenceLine
                                y={0}
                                stroke="#cbd5e1"
                                strokeWidth={1.5}
                                strokeDasharray="3 3"
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar
                                dataKey="revenue"
                                fill="#10b981"
                                radius={[5, 5, 0, 0]}
                                name="Revenue"
                            />
                            <Bar
                                dataKey="expenses"
                                fill="#f43f5e"
                                radius={[5, 5, 0, 0]}
                                name="Expenses"
                            />
                            <Bar
                                dataKey="profit"
                                shape={<CustomProfitBar />}
                                fill="#0f766e"
                                name="Profit Margin"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
