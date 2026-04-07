"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface Employee {
    id: string;
    name: string;
    phone: string;
    salary: number;
}

export default function EditEmployeePage() {
    const router = useRouter();
    const { id } = useParams();

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<Employee>();

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await api.get(`/employees/${id}`);
                const employee = response.data;
                setValue("name", employee.name);
                setValue("phone", employee.phone);
                setValue("salary", employee.salary);
            } catch (error) {
                toast.error("Failed to fetch employee");
            }
        };

        fetchEmployee();
    }, [id, setValue]);

    const onSubmit = async (data: Employee) => {
        try {
            await api.put(`/employees/${id}`, data);
            toast.success("Employee updated successfully");
            router.push(`/employees/${id}`);
        } catch (error) {
            toast.error("Failed to update employee");
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900/50 via-slate-900/30 to-slate-900/50 p-4 md:p-6 flex items-center justify-center">
            <div className="w-full max-w-md space-y-6 bg-linear-to-br from-slate-900/80 via-indigo-900/60 to-slate-900/90 border border-white/20 backdrop-blur-xl p-8 rounded-2xl shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Edit Employee</h1>
                    <p className="text-indigo-200">Update employee information</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-white">Name</label>
                        <Input
                            placeholder="Employee name"
                            {...register("name", { required: "Name is required" })}
                            className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                        />
                        {errors.name && <p className="text-red-300 text-xs">{String(errors.name?.message)}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-white">Phone</label>
                        <Input
                            placeholder="Phone number"
                            {...register("phone", { required: "Phone is required" })}
                            className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                        />
                        {errors.phone && <p className="text-red-300 text-xs">{String(errors.phone?.message)}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-white">Salary</label>
                        <Input
                            type="number"
                            placeholder="Monthly salary"
                            {...register("salary", { valueAsNumber: true, required: "Salary is required" })}
                            className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                        />
                        {errors.salary && <p className="text-red-300 text-xs">{String(errors.salary?.message)}</p>}
                    </div>

                    <div className="flex gap-3">
                        <Button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 bg-gray-600 text-white font-bold hover:bg-gray-700 transition active:scale-95 rounded-xl cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-bold hover:from-indigo-700 hover:to-purple-700 transition active:scale-95 rounded-xl cursor-pointer"
                        >
                            Update Employee
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}