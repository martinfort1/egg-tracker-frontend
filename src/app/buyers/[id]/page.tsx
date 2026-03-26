"use client"

import LoadSpin from "@/components/load-spin";
import SaleCard from "@/components/sale-card";
import { api } from "@/lib/api";
import { MapPin, Phone } from "lucide-react";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";

export default function BuyerPage(){
    const { id } = useParams();
    const [data, setData] = useState<any>(null);

    const fetchData = async () => {
        const res = await api.get(`/buyers/${id}/history`);
        setData(res.data);
    };

    useEffect(() =>{
        fetchData()
    }, [id]);

    if(!data) return <LoadSpin /> 

    const { buyer, stats, sales } = data;

    return (
        <div className="space-y-8 bg-linear-to-br from-slate-900/30 via-slate-900/20 to-slate-900/30 p-4 md:p-6 rounded-2xl border border-white/10 shadow-xl">
            <div className="bg-linear-to-br from-indigo-900/30 via-violet-900/25 to-slate-900/40 p-6 rounded-2xl border border-white/20 shadow-lg">
                <h1 className="text-2xl font-bold text-white">{buyer.name}</h1>

                <div className="text-sm font-semibold mt-2 space-y-1 text-indigo-100">
                <div className="flex items-center gap-2 text-sm sm:text-base">
                    <Phone className="w-4 h-4 text-indigo-100" />
                    <span className="text-white">{buyer.phone}</span>
                </div>
                <div className="flex items-start gap-2 text-sm sm:text-base">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-indigo-100" />
                    <span className="text-white">{buyer.address}</span>
                </div>
                <p className="text-sm text-indigo-200">{buyer.notes}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                <div className="p-6 bg-white rounded-xl shadow">
                <p className="text-sm text-gray-500">Total Sales</p>
                <p className="text-xl font-bold">{stats.totalSales}</p>
                </div>

                <div className="p-6 bg-white rounded-xl shadow">
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-xl font-bold">${stats.totalSpent}</p>
                </div>

                <div className="p-6 bg-white rounded-xl shadow">
                <p className="text-sm text-gray-500">Paid</p>
                <p className="text-xl font-bold">${stats.totalPaid}</p>
                </div>

                <div className="p-6 bg-white rounded-xl shadow">
                <p className="text-sm text-gray-500">Debt</p>
                <p className="text-xl font-bold text-red-600">
                    ${stats.totalDebt}
                </p>
                </div>
            </div>
                <div className="space-y-4">
                <h2 className="text-xl font-semibold">
                Sales History
                </h2>

                {sales.length === 0 ? (
                <p className="text-gray-500">No sales yet</p>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {sales.map((sale: any) => (
                    <SaleCard
                        key={sale.id}
                        sale={{ ...sale, buyer }}
                        refresh={fetchData}
                    />
                    ))}

                </div>
                )}
            </div>
        </div>
    )
}