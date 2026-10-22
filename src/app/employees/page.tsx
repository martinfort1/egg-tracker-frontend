"use client"

import EmployeeCard from "@/components/employee-card";
import { Button } from "@/components/ui/button";
import LoadSpin from "@/components/load-spin";
import { api } from "@/lib/api";
import { UserCheck, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function EmployeesPage() {
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchEmployees = async () => {
        try {
            setIsLoading(true);
            const response = await api.get("/employees");
            setEmployees(response.data);
        } catch (err) {
            console.error("Failed to fetch employees:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchEmployees(); }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-semibold text-slate-900">
                        Employees & Payroll
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Manage farm staff, monthly salary payments, advances and balances
                    </p>
                </div>
                <Link href="/employees/new">
                    <Button className="bg-teal-600 hover:bg-teal-700 text-white rounded-lg px-4 py-2 font-medium shadow-sm transition active:scale-95 flex items-center gap-2 cursor-pointer w-full sm:w-auto">
                        <Plus size={16} />
                        Add Employee
                    </Button>
                </Link>
            </div>

            {isLoading ? (
                <LoadSpin />
            ) : employees.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-teal-100 shadow-sm">
                    <UserCheck className="w-14 h-14 text-teal-300 mx-auto mb-4" />
                    <p className="text-slate-700 text-lg font-medium">No employees registered yet</p>
                    <p className="text-slate-400 text-sm mt-1">Add your staff members to track salaries and payouts</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {employees.map((employee: any) => (
                        <EmployeeCard key={employee.id} employee={employee} refresh={fetchEmployees} />
                    ))}
                </div>
            )}
        </div>
    );
}
