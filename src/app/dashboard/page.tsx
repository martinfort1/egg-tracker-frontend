"use client"
import { api } from "@/lib/api";
import { useEffect, useState } from "react";


export default function DashboardPage() {
    const [summary, setSummary] = useState<any>(null)


    useEffect(() => {
      api.get("/sales/summary")
        .then(res => setSummary(res.data));

    }, []);

    if(!summary) return <p>Loading...</p>;

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold">
                Welcome!
            </h1>
            
            <h1 className="text-xl font-bold">Dashboard</h1>

            <div className="grid grid-cols-3 gap-6">

                <div className="p-6 bg-white rounded shadow">
                    <p className="text-sm text-gray-500">Total Sales</p>
                    <p className="text-2xl font-bold">
                    {summary.totalSales}
                    </p>
                </div>

                <div className="p-6 bg-white rounded shadow">
                    <p className="text-sm text-gray-500">Revenue</p>
                    <p className="text-2xl font-bold">
                    {summary.totalRevenues}
                    </p>
                </div>

                <div className="border p-4">
                    <p className="text-sm text-gray-500">Total Debt</p>
                    <p className="text-2xl font-bold">
                    {summary.totalDebts}
                    </p>
                </div>
            </div>
        </div>
    );
}