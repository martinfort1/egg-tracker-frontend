"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function NewVaccinePage() {
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: "",
            dateApplied: "",
            nextApplicationDate: "",
            vaccineCost: 0,
            labourCost: 0,
            notes: "",
        }
    });

    const onSubmit = async (data: any) => {
        try {
            const payload = {
                ...data,
                vaccineCost: parseFloat(data.vaccineCost) || 0,
                labourCost: parseFloat(data.labourCost) || 0,
            };
            await api.post("/vaccines", payload);
            toast.success("Vaccine added successfully!");
            router.push("/vaccines");
        } catch (error) {
            toast.error("Failed to add vaccine");
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900/50 via-slate-900/30 to-slate-900/50 p-4 md:p-6">
            <div className="max-w-2xl mx-auto">
                <div className="bg-linear-to-br from-slate-900/80 via-indigo-900/60 to-slate-900/90 border border-white/20 backdrop-blur-xl p-8 rounded-2xl shadow-2xl">
                    <h1 className="text-3xl font-black text-white mb-8">Add New Vaccine</h1>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-indigo-200">Vaccine Name *</label>
                            <Input
                                placeholder="e.g., Newcastle, Gumboro"
                                {...register("name", { required: "Vaccine name is required" })}
                            />
                            {errors.name && <p className="text-red-300 text-xs">{String(errors.name?.message)}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-indigo-200">Date Applied *</label>
                            <Input
                                type="date"
                                {...register("dateApplied", { required: "Date applied is required" })}
                            />
                            {errors.dateApplied && <p className="text-red-300 text-xs">{String(errors.dateApplied?.message)}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-indigo-200">Next Application Date</label>
                            <Input
                                type="date"
                                {...register("nextApplicationDate")}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-indigo-200">Vaccine Cost *</label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    {...register("vaccineCost", { valueAsNumber: true, required: "Vaccine cost is required" })}
                                />
                                {errors.vaccineCost && <p className="text-red-300 text-xs">{String(errors.vaccineCost?.message)}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-indigo-200">Labour Cost *</label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    {...register("labourCost", { valueAsNumber: true, required: "Labour cost is required" })}
                                />
                                {errors.labourCost && <p className="text-red-300 text-xs">{String(errors.labourCost?.message)}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-indigo-200">Notes</label>
                            <textarea
                                placeholder="Add any additional notes..."
                                className="w-full px-4 py-2 bg-slate-900/50 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                                rows={4}
                                {...register("notes")}
                            />
                        </div>

                        <div className="flex gap-4 pt-6">
                            <Button
                                type="submit"
                                className="flex-1 bg-linear-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 font-bold rounded-lg cursor-pointer"
                            >
                                Add Vaccine
                            </Button>
                            <Button
                                type="button"
                                onClick={() => router.back()}
                                className="flex-1 bg-linear-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 font-bold rounded-lg cursor-pointer"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
