"use client"
import { BarChart2 } from "lucide-react"
import {
    Bar,
    BarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"

export function SalesChart({data, period}: any) {

    return(
        <div className="flex flex-col gap-4 bg-white p-6 rounded-xl shadow-2xl">
            <div className=" flex flex-col items-center text-center gap-2 bg-linear-to-b from-slate-800 to-slate-700  text-white">
                <BarChart2 className="bg-linear-to-b from-yellow-400 to-orange-500 text-white-500 mt-4"/>
                <h2 className="mb-4 font-semibold">
                    { period === "7d" || period === "30d" ? "Weekly": "Monthly"} Margins Chart 
                </h2>
            </div>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip />
                    <Bar 
                        dataKey="total"
                        fill="#0eab00" 
                        radius={[8, 8, 0, 0]}
                        className="hover:opacity-80 transition"
                        />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}