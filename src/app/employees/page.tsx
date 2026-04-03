"use client"

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { UserCheck, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function EmployeesPage(){
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        api.get("/employees")
            .then(res => setEmployees(res.data))
            .catch(err => console.error("Failed to fetch employees:", err));
    }, [])

    return (
        <div className="space-y-6 p-4 md:p-6 bg-linear-to-br from-slate-900/30 via-slate-900/20 to-slate-900/30 rounded-2xl border border-white/10 shadow-xl">

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h1 className="flex justify-center text-2xl sm:text-3xl font-black text-white">
                    Employees
                </h1>
                <Link href="/employees/new">
                    <Button className="bg-linear-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 rounded-full w-full sm:w-auto flex items-center gap-2 cursor-pointer">
                        <Plus size={18} />
                        Add Employee
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {employees.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <UserCheck className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-400 text-lg">No employees yet</p>
                        <p className="text-slate-500 text-sm">Add your first employee to get started</p>
                    </div>
                ) : (
                    employees.map((employee: any) => (
                        <div key={employee.id} className="bg-linear-to-br from-slate-900/80 via-indigo-900/75 to-slate-900/85 border border-white/20 backdrop-blur-xl p-5 rounded-2xl shadow-2xl space-y-4 hover:-translate-y-1 hover:shadow-2xl transition-transform duration-300">
                            <div className="flex flex-col gap-2">
                                <h2 className="text-lg font-bold text-white">{employee.name}</h2>
                                <div className="space-y-1 text-sm">
                                    <p className="text-indigo-100">📞 {employee.phone}</p>
                                    <p className="text-indigo-100">💰 Salary: ${employee.salary}</p>
                                    <p className={`text-sm font-semibold ${employee.paidThisMonth ? 'text-green-300' : 'text-red-300'}`}>
                                        {employee.paidThisMonth ? '✅ Paid this month' : '❌ Not paid this month'}
                                    </p>
                                    <p className="text-orange-200 font-semibold">💸 Owed: ${employee.amountOwed}</p>
                                </div>
                            </div>
                            <div className="pt-2">
                                <Link href={`/employees/${employee.id}`}>
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700 transition active:scale-95 cursor-pointer" size="sm">
                                        View Details
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}