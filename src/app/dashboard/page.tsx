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
import { MetricCardValue } from "@/components/metric-card-value";
import Footer from "@/components/footer";
import { useFeedBags } from "@/hooks/useFeedBags";


export default function DashboardPage() {
    const [period, setPeriod] = useState<string>("30d")
    const { data, isLoading, error } = useDashboard(period);
    const { analytics } = useAnalytics(period);
    const { feedBags } = useFeedBags();
    
    if (isLoading) {
        return <LoadSpin />
    }

    if (error) {
        return <div>Error: {error.message}</div>
    }

    const { summary, monthly, topBuyers, expenses } = data || {};

    return (
        <div className="space-y-8">
            <h1 className="flex justify-center text-3xl font-['Playfair_Display'] font-bold text-shadow-lg">
                Dashboard
            </h1>

           <TimeFilter period={period} setPeriod={setPeriod} />
           <h2 className="text-xl font-['Playfair_Display'] font-semibold text-shadow-lg">Sales Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <MetricCardValue title="Amount of sales:" value={summary?.totalSales || 0} isCurrency={false} unit=" sales"/>
                <MetricCard title="Sold eggs for:" value={summary?.totalRevenues || 0} />
                <MetricCard title="You have been paid:" value={summary?.totalPaid || 0} />
                <MetricCard title="You are owed:" value={summary?.totalDebts || 0} />
            </div>
                <div className="bg-gray-200 w-full h-1px p-1 rounded-lg sm:display-none"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <MetricCardValue title="Feed bags orders in debt:" value={feedBags?.unpaidCount || 0} isCurrency={false} />
                <MetricCardValue title="Feed bags debt:" value={feedBags?.totalOwed || 0} isCurrency={true} />
                </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/90 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Profit Summary</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-600">Total Revenue:</span>
                            <span className="font-bold text-emerald-600">{formatCurrency(summary?.totalRevenues || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-600">Total Expenses:</span>
                            <span className="font-bold text-rose-600">{formatCurrency(expenses?.totalExpenses || 0)}</span>
                        </div>
                        <hr className="my-2 border-slate-100" />
                        <div className="flex justify-between items-center text-base font-bold">
                            <span className="text-slate-800">Net Profit:</span>
                            <span className={`${((summary?.totalRevenues || 0) - (expenses?.totalExpenses || 0)) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                {formatCurrency((summary?.totalRevenues || 0) - (expenses?.totalExpenses || 0))}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/90 hover:shadow-md transition-shadow">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">Expense Breakdown</h3>
                    <div className="space-y-2.5 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-600">Employee Salaries:</span>
                            <span className="font-semibold text-slate-800">{formatCurrency(expenses?.employeePayments || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-600">Feed Bags:</span>
                            <span className="font-semibold text-slate-800">{formatCurrency(expenses?.feedBags || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-600">Cartons:</span>
                            <span className="font-semibold text-slate-800">{formatCurrency(expenses?.cartons || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-600">Vaccines:</span>
                            <span className="font-semibold text-slate-800">{formatCurrency(expenses?.vaccineCosts || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-600">Chickens:</span>
                            <span className="font-semibold text-slate-800">{formatCurrency(expenses?.chickens || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-slate-600">Other Expenses:</span>
                            <span className="font-semibold text-slate-800">{formatCurrency(expenses?.other || 0)}</span>
                        </div>
                    </div>
                </div>
            </div>

            <SalesChart data={ analytics } period={period} />

            <h2 className="text-xl font-['Playfair_Display'] font-semibold text-shadow-lg">Monthly Revenue</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {monthly?.map((m: any) => (
                    <div key={m.month} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/90 hover:shadow-md transition-shadow">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{m.month} Revenues</p>
                        <p className="text-xl font-black text-slate-900 mt-2">{formatCurrency(m.revenue)}</p>
                    </div>
                ))}
            </div>

            <div className="space-y-4">
                <TopBuyers topBuyers={topBuyers} />
            </div>
        </div>
    );
}