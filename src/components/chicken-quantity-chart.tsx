"use client"

import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { TrendingDown } from "lucide-react";
import { formatUtcDate } from "@/lib/utils";

export function ChickenQuantityChart({ data }: { data: any[] }) {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-2xl flex flex-col items-center justify-center h-80">
                <TrendingDown className="text-gray-400 mb-4" size={48} />
                <p className="text-gray-500">No data available</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-2xl">
            <div className="flex flex-col items-center text-center gap-2 bg-linear-to-b from-slate-800 to-slate-700 text-white rounded-lg p-4 mb-4">
                <TrendingDown className="bg-linear-to-b from-blue-400 to-blue-500 text-white mt-2" />
                <h2 className="mb-2 font-semibold">
                    Chicken Quantity Over Time
                </h2>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        tickFormatter={(date) => formatUtcDate(date)}
                    />
                    <YAxis />
                    <Tooltip 
                        formatter={(value) => `${value} chickens`}
                        labelFormatter={(date) => formatUtcDate(date)}
                    />
                    <Legend />
                    <Line 
                        type="monotone" 
                        dataKey="count" 
                        stroke="#3b82f6"
                        dot={false}
                        strokeWidth={2}
                        isAnimationActive={true}
                        name="Chicken Count"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
