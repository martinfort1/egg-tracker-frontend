"use client"

import LoadSpin from "@/components/load-spin";
import PaymentModal from "@/components/payment-modal";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { getEmployeePaymentStatus } from "@/lib/employee-payment-helpers";
import { formatCurrency, formatUtcDate } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Employee {
    id: string;
    name: string;
    phone: string;
    salary: number;
    lastPaidDate: string | null;
    createdAt: string;
    updatedAt: string;
    payments?: EmployeePayment[];
    salaryPeriods?: SalaryPeriod[];
}

interface EmployeePayment {
    id: string;
    amount: number;
    date: string;
    description: string;
    salaryPeriodId?: string;
}

interface SalaryPeriod {
    id: string;
    month: number;
    year: number;
    salary: number;
    balance: number;
}

export default function EmployeeDetailPage() {
    const router = useRouter();
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    const fetchEmployee = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/employees/${id}`);
            setEmployee(response.data);
        } catch (error) {
            toast.error("Failed to fetch employee");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployee();
    }, [id]);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this employee?")) return;

        try {
            await api.delete(`/employees/${id}`);
            toast.success("Employee deleted successfully");
            router.push("/employees");
        } catch (error) {
            toast.error("Failed to delete employee");
        }
    };

    const paymentInfo = employee ? getEmployeePaymentStatus(employee) : null;

    const getMonthlyPaymentHistory = () => {
        if (!employee?.salaryPeriods || employee.salaryPeriods.length === 0) return [];

        // Build payment map by month
        const paymentsByMonth: { [key: string]: any[] } = {};
        employee.payments?.forEach((payment: any) => {
            if (payment.salaryPeriodId && employee.salaryPeriods) {
                const period = employee.salaryPeriods.find(p => p.id === payment.salaryPeriodId);
                if (period) {
                    const key = `${period.year}-${String(period.month + 1).padStart(2, '0')}`;
                    if (!paymentsByMonth[key]) {
                        paymentsByMonth[key] = [];
                    }
                    paymentsByMonth[key].push(payment);
                }
            }
        });

        // Build history from salaryPeriods (source of truth)
        const history = employee.salaryPeriods
            .map((period: any, idx: number) => {
                const key = `${period.year}-${String(period.month + 1).padStart(2, '0')}`;
                const payments = paymentsByMonth[key] || [];
                const totalPaid = payments.reduce((sum: number, p: any) => sum + p.amount, 0);
                
                // Get previous period balance for context
                const allSortedPeriods = [...employee.salaryPeriods!].sort((a, b) => {
                    if (a.year !== b.year) return b.year - a.year;
                    return b.month - a.month;
                });
                const currentIdx = allSortedPeriods.findIndex(p => p.id === period.id);
                const prevPeriod = currentIdx >= 0 && currentIdx < allSortedPeriods.length - 1 
                    ? allSortedPeriods[currentIdx + 1] 
                    : null;
                
                // Get carryover balance from previous period
                const carryoverBalance = prevPeriod?.balance ?? 0;
                
                // Calculate owed considering balance
                const owed = (period.salary - carryoverBalance) - totalPaid;
                
                let status, color, text;

                if (totalPaid === 0) {
                    status = "Payment Due";
                    color = "text-red-400";
                    text = `Owes ${formatCurrency(owed)}`;
                } else if (owed > 0) {
                    status = "Partially Paid";
                    color = "text-yellow-400";
                    text = `Remaining ${formatCurrency(owed)}`;
                } else if (owed === 0) {
                    status = "Paid";
                    color = "text-green-400";
                    text = "Salary completed";
                } else {
                    status = "Advanced";
                    color = "text-cyan-400";
                    text = `Advance ${formatCurrency(Math.abs(owed))}`;
                }

                // Build balance context message
                let balanceContext = "";
                if (prevPeriod) {
                    if (prevPeriod.balance > 0) {
                        balanceContext = `Carried over: ${formatCurrency(prevPeriod.balance)} (Advanced)`;
                    } else if (prevPeriod.balance < 0) {
                        balanceContext = `Carried over: ${formatCurrency(Math.abs(prevPeriod.balance))} (Owed)`;
                    }
                }

                return {
                    month: new Date(period.year, period.month).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }),
                    year: period.year,
                    monthNum: period.month + 1,
                    totalPaid,
                    salary: period.salary,
                    balance: period.balance,
                    owed,
                    status,
                    color,
                    text,
                    balanceContext,
                    payments
                };
            })
            .sort((a, b) => b.year - a.year || b.monthNum - a.monthNum);
            
        return history;
    };

    const monthlyHistory = getMonthlyPaymentHistory();

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-900/50 via-slate-900/30 to-slate-900/50 p-4 md:p-6 flex items-center justify-center">
                <LoadSpin />
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-900/50 via-slate-900/30 to-slate-900/50 p-4 md:p-6 flex items-center justify-center">
                <div className="text-white">Employee not found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900/50 via-slate-900/30 to-slate-900/50 p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-linear-to-br from-slate-900/80 via-indigo-900/60 to-slate-900/90 border border-white/20 backdrop-blur-xl p-8 rounded-2xl shadow-2xl">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">{employee.name}</h1>
                            <p className="text-indigo-200">Employee Details</p>
                        </div>
                        <div className="flex gap-3 flex-wrap">
                            <PaymentModal
                                sale={employee}
                                owed={paymentInfo?.owed ?? 0}
                                endpoint="employees"
                                onSuccess={fetchEmployee}
                                className="bg-linear-to-r from-green-500/35 to-green-950/40 hover:bg-gray-800 transition active:scale-95 gap-2 cursor-pointer"
                            >
                             <span>{(paymentInfo?.owed ?? 0) > 0 ? 'Add Payment' : 'Advance'}</span>
                            </PaymentModal>
                            <Button
                                onClick={() => router.push(`/employees/${employee.id}/edit`)}
                                size={"sm"}
                                className="bg-linear-to-r from-blue-600 to-cyan-600 text-white font-bold hover:from-blue-700 hover:to-cyan-700 transition active:scale-95 rounded-xl cursor-pointer"
                            >
                                Edit
                            </Button>
                            <Button
                                onClick={handleDelete}
                                size={"sm"}
                                className="bg-linear-to-r from-red-600 to-pink-600 text-white font-bold hover:from-red-700 hover:to-pink-700 transition active:scale-95 rounded-xl cursor-pointer"
                            >
                                Delete
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                            <div className="bg-white/10 border border-white/20 p-6 rounded-xl">
                                <h3 className="text-lg font-bold text-white mb-4">Contact Information</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-semibold text-indigo-200">Name</label>
                                        <p className="text-white font-medium">{employee.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-indigo-200">Phone</label>
                                        <p className="text-white font-medium">{employee.phone}</p>
                                        <h3 className="text-lg font-bold text-white mt-4">Salary Information</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-sm font-semibold text-indigo-200">Monthly Salary</label>
                                                <p className="text-white font-medium">{formatCurrency(employee.salary)}</p>
                                            </div>

                                            {employee.lastPaidDate && (
                                                <div>
                                                    <label className="text-sm font-semibold text-indigo-200">Last Paid Date</label>
                                                    <p className="text-white font-medium">
                                                        {formatUtcDate(employee.lastPaidDate)}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/10 border border-white/20 p-6 rounded-xl">
                                <h3 className="text-lg font-bold text-white mb-4">Timestamps</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-semibold text-indigo-200">Created</label>
                                        <p className="text-white font-medium">
                                            {formatUtcDate(employee.createdAt)}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-indigo-200">Last Updated</label>
                                        <p className="text-white font-medium">
                                            {formatUtcDate(employee.updatedAt)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {employee.payments && employee.payments.length > 0 && (
                                <div className="bg-white/10 border border-white/20 p-6 rounded-xl">
                                    <h3 className="text-lg font-bold text-white mb-4">Payment History</h3>
                                    <div className="space-y-3 max-h-64 overflow-y-auto">
                                        {employee.payments.map((payment: any) => (
                                            <div key={payment.id} className="bg-white/5 p-3 rounded-lg border border-white/10">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-white font-medium">{formatCurrency(payment.amount)}</p>
                                                        <p className="text-xs text-indigo-300">{payment.description}</p>
                                                    </div>
                                                    <p className="text-xs text-slate-400">{formatUtcDate(payment.date)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {monthlyHistory.length > 0 && (
                                <div className="bg-white/10 border border-white/20 p-6 rounded-xl">
                                    <h3 className="text-lg font-bold text-white mb-4">Monthly Payment Status</h3>
                                    <div className="space-y-3 max-h-64 overflow-y-auto">
                                        {monthlyHistory.map((monthData: any) => (
                                            <div key={`${monthData.year}-${monthData.monthNum}`} className="bg-white/5 p-3 rounded-lg border border-white/10">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="text-white font-medium">{monthData.month}</h4>
                                                    <span className={`px-2 py-1 rounded text-xs ${
                                                        monthData.status === 'Payment Due' ? 'bg-red-100 text-red-700' :
                                                        monthData.status === 'Partially Paid' ? 'bg-yellow-100 text-yellow-700' :
                                                        monthData.status === 'Paid' ? 'bg-green-100 text-green-700' :
                                                        'bg-cyan-100 text-cyan-700'
                                                    }`}>
                                                        {monthData.status}
                                                    </span>
                                                </div>
                                                {monthData.balanceContext && (
                                                    <p className="text-xs text-indigo-300 mb-2">{monthData.balanceContext}</p>
                                                )}
                                                <div className="text-sm text-slate-300 space-y-1">
                                                    <p>Salary: {formatCurrency(monthData.salary)}</p>
                                                    <p>Paid: {formatCurrency(monthData.totalPaid)}</p>
                                                    <p className={monthData.color}>{monthData.text}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}