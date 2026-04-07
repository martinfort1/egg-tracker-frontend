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
            durationDays: 30,
            notes: "",
        }
    });

    const onSubmit = async (data: any) => {
        try {
            const payload = {
                name: data.name,
                durationDays: parseInt(data.durationDays) || 30,
                notes: data.notes,
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
                            <label className="text-sm font-semibold text-indigo-200">Duration Between Applications (Days) *</label>
                            <Input
                                type="number"
                                placeholder="60"
                                min="1"
                                {...register("durationDays", { valueAsNumber: true, required: "Duration is required", min: { value: 1, message: "Duration must be at least 1 day" } })}
                            />
                            {errors.durationDays && <p className="text-red-300 text-xs">{String(errors.durationDays?.message)}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-indigo-200">Notes</label>
                            <textarea
                                placeholder="General notes about this vaccine..."
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
