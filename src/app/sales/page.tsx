"use client"

import SaleCard from "@/components/sale-card";
import SalesFilter from "@/components/time-filter";
import { Button } from "@/components/ui/button";
import LoadSpin from "@/components/load-spin";
import { useSales } from "@/hooks/useSales";
import { Plus, BarChart3 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SalesPage() {
    const [period, setPeriod] = useState<string>("7d");
    const [showOutstandingOnly, setShowOutstandingOnly] = useState(false);
    const { sales, isLoading, refresh } = useSales(period);

    const visibleSales = showOutstandingOnly
        ? sales.filter((sale: any) => sale.status !== "PAID")
        : sales;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-semibold text-slate-900">
                        Sales
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Track egg sales, deliveries, customer payments and outstanding debts
                    </p>
                </div>
                <Link href="/sales/new">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-4 py-2 font-medium shadow-sm transition active:scale-95 flex items-center gap-2 cursor-pointer w-full sm:w-auto">
                        <Plus className="w-4 h-4" />
                        Add New Sale
                    </Button>
                </Link>
            </div>

            <SalesFilter
                period={period}
                setPeriod={setPeriod}
                showOutstandingOnly={showOutstandingOnly}
                setShowOutstandingOnly={setShowOutstandingOnly}
                showOutstandingToggle
            />

            {isLoading ? (
                <LoadSpin />
            ) : visibleSales.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-emerald-100 shadow-sm">
                    <BarChart3 className="w-14 h-14 text-emerald-300 mx-auto mb-4" />
                    <p className="text-slate-700 text-lg font-medium">No sales recorded for this period</p>
                    <p className="text-slate-400 text-sm mt-1">Create your first sale or adjust the time filter</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {visibleSales.map((sale: any) => (
                        <SaleCard key={sale.id} sale={sale} refresh={refresh} />
                    ))}
                </div>
            )}
        </div>
    );
}
