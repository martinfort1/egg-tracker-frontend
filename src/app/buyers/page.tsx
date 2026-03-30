"use client"

import { Button } from "@/components/ui/button";
import BuyerCard from "@/components/buyer-card";
import { api } from "@/lib/api";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react"

export default function BuyersPage(){
    const [buyers, setBuyers] = useState([]);

    useEffect(() => {
      api.get("/buyers")
        .then(res => setBuyers(res.data));

    }, [])

    return (
        <div className="space-y-6 p-4 md:p-6 bg-linear-to-bl from-orange-500/30 via-yellow-900/20 to-indigo-900/30 rounded-2xl border border-white/10 shadow-xl">

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

                <h1 className="flex justify-center text-2xl sm:text-3xl font-bold">
                    Buyers
                </h1>
                <Link href={"/buyers/new"}>
                    <Button className="bg-linear-to-br from-green-400/80 to-green-600/60 text-indigo-100 hover:bg-green-600 rounded-full w-full sm:w-auto cursor-pointer">
                        <Plus className="text-indigo-100 w-4 h-4 mr-2" />
                        Add Buyer
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {buyers.map((buyer:any)=>(
                    <BuyerCard key={buyer.id} buyer={buyer} />
                ))}
            </div>
        </div>
    )


}