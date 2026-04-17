"use client"

import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { TrendingUp } from "lucide-react";
import { formatUtcDate } from "@/lib/utils";

export function LayingPercentageHistoryChart({ data }: { data: any[] }) {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-2xl flex flex-col items-center justify-center h-80">
                <TrendingUp className="text-gray-400 mb-4" size={48} />
                <p className="text-gray-500">No laying data available</p>
            </div>
        );
    }

    const chartData = data.map((item) => ({
        date: item.date,
        percentage: Math.round(item.percentage * 100) / 100,
    }));

    return (
        <div className="bg-white p-6 rounded-xl shadow-2xl">
            <div className="flex flex-col items-center text-center gap-2 bg-linear-to-b from-slate-800 to-slate-700 text-white rounded-lg p-4 mb-4">
                <TrendingUp className="bg-linear-to-b from-yellow-400 to-yellow-500 text-white mt-2" />
                <h2 className="mb-2 font-semibold">
                    Egg Laying Percentage Over Time
                </h2>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(date) => formatUtcDate(date)}
                    />
                    <YAxis domain={[0, 100]} />
                    <Tooltip 
                        formatter={(value) => `${value}%`}
                        labelFormatter={(date) => formatUtcDate(date)}
                    />
                    <Legend />
                    <Line 
                        type="monotone" 
                        dataKey="percentage" 
                        stroke="#eab308"
                        dot={false}
                        strokeWidth={2}
                        isAnimationActive={true}
                        name="Laying %"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
