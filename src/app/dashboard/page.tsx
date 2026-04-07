"use client"
import { MetricCard } from "@/components/metric-card";
import { SalesChart } from "@/components/sales-chart";
import SalesFilter from "@/components/sales-filter";
import { useDashboard } from "@/hooks/useDashboard";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useEffect, useState } from "react";
import TopBuyers from "@/components/top-buyers";
import LoadSpin from "@/components/load-spin";


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

           <SalesFilter period={period} setPeriod={setPeriod} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard title="Revenue" value={summary?.totalRevenues || 0} />
                <MetricCard title="Paid" value={summary?.totalPaid || 0} />
                <MetricCard title="Debt" value={summary?.totalDebts || 0} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard title="Employee Payments" value={expenses?.employeePayments || 0} />
                <MetricCard title="Vaccine Costs" value={expenses?.vaccineCosts || 0} />
                <MetricCard title="Total Expenses" value={expenses?.totalExpenses || 0} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow">
                    <h3 className="text-lg font-semibold mb-4">Profit Summary</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Total Revenue:</span>
                            <span className="font-medium text-green-600">${(summary?.totalRevenues || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Total Expenses:</span>
                            <span className="font-medium text-red-600">${(expenses?.totalExpenses || 0).toLocaleString()}</span>
                        </div>
                        <hr className="my-2" />
                        <div className="flex justify-between text-lg font-bold">
                            <span>Net Profit:</span>
                            <span className={`${((summary?.totalRevenues || 0) - (expenses?.totalExpenses || 0)) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                ${((summary?.totalRevenues || 0) - (expenses?.totalExpenses || 0)).toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow">
                    <h3 className="text-lg font-semibold mb-4">Expense Breakdown</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Employee Salaries:</span>
                            <span className="font-medium">${(expenses?.employeePayments || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Vaccine Costs:</span>
                            <span className="font-medium">${(expenses?.vaccineCosts || 0).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            <SalesChart data={ analytics } period={period} />

            <h2 className="text-xl font-semibold">Monthly Revenue</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {monthly?.map((m: any) => (
                    <div key={m.month} className="bg-white p-4 rounded-xl shadow">
                    <p className="text-sm text-gray-500">{m.month} Revenues</p>
                    <p className="text-sm text-gray-500"></p>
                    <p className="font-bold">${m.revenue}</p>
                    </div>
                ))}
            </div>

            <div className="space-y-4">
                <TopBuyers topBuyers={topBuyers} />
            </div>
        </div>
    );
}