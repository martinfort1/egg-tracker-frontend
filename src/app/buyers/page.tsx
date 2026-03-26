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
        <div className="space-y-6">

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

                <h1 className="flex justify-center text-2xl sm:text-3xl font-bold">
                    Buyers
                </h1>
                <Link href={"/buyers/new"}>
                    <Button className="bg-green-500 text-black hover:bg-green-600 rounded-full w-full sm:w-auto">
                        <Plus className="w-4 h-4 mr-2" />
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