"use client"

import SaleCard from "@/components/sale-card";
import SalesFilter from "@/components/sales-filter";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSales } from "@/hooks/useSales";
import { api } from "@/lib/api";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react"


export default function SalesPage(){

    const [period, setPeriod] = useState<string>("7d"); 
    const { sales, refresh } = useSales(period)
    
    return (
        <div className="space-y-6 p-4 md:p-6 bg-linear-to-br from-yellow-500/25 via-slate-500/30 to-yellow-900/30 rounded-2xl border border-slate/40 shadow-2xl">

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

                <h1 className="flex justify-center text-2xl sm:text-3xl font-semibold">
                    Sales
                </h1>
                <Link href={"/sales/new"}>
                    <Button className="bg-linear-to-r from-green-400/80 to-green-600/60 text-indigo-100 hover:bg-green-600 rounded-full w-full sm:w-auto">
                        <Plus className="text-indigo-100 w-4 h-4 mr-1" />
                        Add New Sale
                    </Button>
                </Link>
            </div>

            {/* {Falta crear metodo en BACKEND que devuelva unicamente ventas en period NO MONTHLY SALES} */}
            {/* <SalesFilter period={period} setPeriod={setPeriod} /> */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {sales.map((sale: any) => (
                    <SaleCard key={sale.id} sale={sale} refresh={refresh} />
                ))}

            </div>
            
        </div>
    )


}