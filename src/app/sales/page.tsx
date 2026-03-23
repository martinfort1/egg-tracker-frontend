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

    const [period, setPeriod] = useState<string>(); 
    const { sales, refresh } = useSales(period)
    
    return (
        <div className="space-y-6">

            <div className="flex justify-between items-center">

                <h1 className="text-3xl font-bold mb-6">
                    Sales
                </h1>
                <Link href={"/sales/new"}>
                    <Button className="bg-green-500 text-black font- hover:bg-green-600 rounded-full">
                        <Plus />
                        Add New Sale
                    </Button>
                </Link>
            </div>

            {/* {Falta crear metodo en BACKEND que devuelva unicamente ventas en period NO MONTHLY SALES} */}
            {/* <SalesFilter period={period} setPeriod={setPeriod} /> */}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sales.map((sale: any) => (
                    <SaleCard key={sale.id} sale={sale} refresh={refresh} />
                ))}

            </div>
            
        </div>
    )


}