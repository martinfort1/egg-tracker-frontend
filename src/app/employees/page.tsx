"use client"

import EmployeeCard from "@/components/employee-card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { UserCheck, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function EmployeesPage(){
    const [employees, setEmployees] = useState([]);

    const fetchEmployees = async () => {
        try {
            const response = await api.get("/employees");
            setEmployees(response.data);
        } catch (err) {
            console.error("Failed to fetch employees:", err);
        }
    };

    useEffect(() => { fetchEmployees(); }, [])

    return (
        <div className="space-y-6 p-4 md:p-6 bg-linear-to-br from-slate-900/30 via-slate-900/20 to-slate-900/30 rounded-2xl border border-white/10 shadow-xl">

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h1 className="flex justify-center text-2xl sm:text-3xl font-black text-white">
                    Employees
                </h1>
                <Link href="/employees/new">
                    <Button className="bg-linear-to-r from-green-400/80 to-green-600/60 text-white hover:from-green-600 hover:to-green-700 rounded-full w-full sm:w-auto flex items-center gap-2 cursor-pointer">
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
                        <EmployeeCard key={employee.id} employee={employee} refresh={fetchEmployees} />
                    ))
                )}
            </div>
        </div>
    )
}