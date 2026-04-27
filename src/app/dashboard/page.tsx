"use client"
import { MetricCard } from "@/components/metric-card";
import { SalesChart } from "@/components/sales-chart";
import TimeFilter from "@/components/time-filter";
import { useDashboard } from "@/hooks/useDashboard";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useEffect, useState } from "react";
import TopBuyers from "@/components/top-buyers";
import LoadSpin from "@/components/load-spin";
import { formatCurrency } from "@/lib/utils";


export default function DashboardPage() {
    const [period, setPeriod] = useState<string>("30d")
    const { data, isLoading, error } = useDashboard(period);
    const { analytics } = useAnalytics(period);

    if (isLoading) {
        return <LoadSpin />
    }

    if (error) {
        return <div>Error: {error.message}</div>
    }

    const { summary, monthly, topBuyers, expenses } = data || {};

    return (
        <div className="space-y-8">
            <h1 className="flex justify-center text-2xl font-bold">
                Dashboard
            </h1>

           <TimeFilter period={period} setPeriod={setPeriod} />
           <h2 className="text-xl font-semibold">Sales Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard title="Sold eggs for:" value={summary?.totalRevenues || 0} />
                <MetricCard title="You have been paid:" value={summary?.totalPaid || 0} />
                <MetricCard title="You are owed:" value={summary?.totalDebts || 0} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-2xl border border-slate-300">
                    <h3 className="text-lg font-semibold mb-4">Profit Summary</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Total Revenue:</span>
                            <span className="font-medium text-green-600">{formatCurrency(summary?.totalRevenues || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Total Expenses:</span>
                            <span className="font-medium text-red-600">{formatCurrency(expenses?.totalExpenses || 0)}</span>
                        </div>
                        <hr className="my-2" />
                        <div className="flex justify-between text-lg font-bold">
                            <span>Net Profit:</span>
                            <span className={`${((summary?.totalRevenues || 0) - (expenses?.totalExpenses || 0)) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency((summary?.totalRevenues || 0) - (expenses?.totalExpenses || 0))}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-2xl border border-slate-300">
                    <h3 className="text-lg font-semibold mb-4">Expense Breakdown</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span>Employee Salaries:</span>
                            <span className="font-medium">{formatCurrency(expenses?.employeePayments || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Feed Bags:</span>
                            <span className="font-medium">{formatCurrency(expenses?.feedBags || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Cartons:</span>
                            <span className="font-medium">{formatCurrency(expenses?.cartons || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Vaccines:</span>
                            <span className="font-medium">{formatCurrency(expenses?.vaccineCosts || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Chickens:</span>
                            <span className="font-medium">{formatCurrency(expenses?.chickens || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Other Expenses:</span>
                            <span className="font-medium">{formatCurrency(expenses?.other || 0)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <SalesChart data={ analytics } period={period} />

            <h2 className="text-xl font-semibold">Monthly Revenue</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {monthly?.map((m: any) => (
                    <div key={m.month} className="bg-white p-4 rounded-xl shadow-2xl border border-slate-300">
                    <p className="text-sm text-gray-500">{m.month} Revenues</p>
                    <p className="text-sm text-gray-500"></p>
                    <p className="font-bold">{formatCurrency(m.revenue)}</p>
                    </div>
                ))}
            </div>

            <div className="space-y-4">
                <TopBuyers topBuyers={topBuyers} />
            </div>
        </div>
    );
}