"use client"

import { api } from "@/lib/api";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";

export default function BuyerPage(){
    const { id } = useParams();
    const [data, setData] = useState<any>(null);

    useEffect(() =>{
        api.get(`/buyers/${id}/history`)
            .then(res => setData(res.data));
    }, [id]);

    if(!data) return <p>Loading...</p>

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold">
                    {data.buyer.name}
                </h1>

                <p>{data.buyer.phone}</p>
                <p>{data.buyer.address}</p>
            </div>

            <div className="grid grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded shadow">
                    Total Spent: ${data.stats.totalSpent}
                </div>

                <div className="p-6 bg-white rounded shadow">
                    Paid: ${data.stats.totalPaid}
                </div>

                <div className="p-6 bg-white rounded shadow">
                    Debt: ${data.stats.totalDebt}
                </div>
            </div>
        </div>
    )
}