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
        <div className="space-y-6">

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

                <h1 className="text-2xl sm:text-3xl font-bold">
                    Sales
                </h1>
                <Link href={"/sales/new"}>
                    <Button className="bg-green-500 text-black hover:bg-green-600 rounded-full w-full sm:w-auto">
                        <Plus className="w-4 h-4 mr-2" />
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