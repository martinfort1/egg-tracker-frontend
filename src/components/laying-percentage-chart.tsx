"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { ChartPie } from "lucide-react";

export function LayingPercentageChart({ percentage }: { percentage: number }) {
    const data = [
        { name: 'Laying', value: Math.round(percentage) },
        { name: 'Not Laying', value: 100 - Math.round(percentage) }
    ];

    const COLORS = ['#0dc700', '#858585'];

    return (
        <div className="bg-white p-6 rounded-xl shadow-2xl">
            <div className="flex flex-col items-center text-center gap-2 bg-linear-to-b from-slate-800 to-slate-700 text-white rounded-lg p-4 mb-4">
                <ChartPie className="text-yellow-500 mt-2" />
                <h2 className="mb-2 font-semibold">
                    Laying Chicken Percentage
                </h2>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }} formatter={(value) => `${value}%`} />
                    <Legend/>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
