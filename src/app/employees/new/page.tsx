"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function NewEmployeePage() {
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: "",
            phone: "",
            salary: 0
        }
    });

    const onSubmit = async (data: any) => {
        try {
            await api.post("/employees", data);
            toast.success("Employee created successfully");
            router.push("/employees");
        } catch (error) {
            toast.error("Failed to create employee");
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900/50 via-slate-900/30 to-slate-900/50 p-4 md:p-6 flex items-center justify-center">
            <div className="w-full max-w-md space-y-6 bg-linear-to-br from-slate-900/80 via-indigo-900/60 to-slate-900/90 border border-white/20 backdrop-blur-xl p-8 rounded-2xl shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Add Employee</h1>
                    <p className="text-indigo-200">Create a new employee record</p>
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

                    <Button
                        type="submit"
                        className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white font-bold hover:from-indigo-700 hover:to-purple-700 transition active:scale-95 rounded-xl cursor-pointer"
                    >
                        Create Employee
                    </Button>
                </form>
            </div>
        </div>
    )
}