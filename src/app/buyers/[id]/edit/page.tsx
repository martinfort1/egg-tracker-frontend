"use client"

import z from "zod";
import { useRouter, useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api";
import { buyerSchema } from "@/lib/schemas/buyer.schema";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import LoadSpin from "@/components/load-spin";

export default function EditBuyerPage() {
    const router = useRouter();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<any>({
        resolver: zodResolver(buyerSchema)
    });

    useEffect(() => {
        const fetchBuyer = async () => {
            try {
                const res = await api.get(`/buyers/${id}`);
                const buyer = res.data;
                setValue("name", buyer.name);
                setValue("phone", buyer.phone);
                setValue("address", buyer.address);
                setValue("notes", buyer.notes);
                setLoading(false);
            } catch (error) {
                toast.error("Failed to load buyer data");
                router.push("/buyers");
            }
        };

        fetchBuyer();
    }, [id, setValue, router]);

    const onSubmit = async (data: any) => {
        try {
            await api.put(`/buyers/${id}`, data);
            toast.success("Buyer updated successfully");
            router.push(`/buyers/${id}`);
        } catch (error) {
            toast.error("Failed to update buyer");
        }
    };

    if (loading) return <LoadSpin />;

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900/50 via-slate-900/30 to-slate-900/50 p-4 md:p-6 flex items-center justify-center">
            <div className="w-full max-w-md space-y-6 bg-linear-to-br from-slate-900/80 via-indigo-900/60 to-slate-900/90 border border-white/20 backdrop-blur-xl p-8 rounded-2xl shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Edit Buyer</h1>
                    <p className="text-indigo-200">Update buyer information</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-white">Name</label>
                        <Input
                            placeholder="Buyer name"
                            {...register("name")}
                            className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                        />
                        {errors.name && <p className="text-red-300 text-xs">{String(errors.name?.message)}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-white">Phone</label>
                        <Input
                            placeholder="Phone number"
                            {...register("phone")}
                            className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                        />
                        {errors.phone && <p className="text-red-300 text-xs">{String(errors.phone?.message)}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-white">Address</label>
                        <Input
                            placeholder="Street address"
                            {...register("address")}
                            className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                        />
                        {errors.address && <p className="text-red-300 text-xs">{String(errors.address?.message)}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-white">Notes</label>
                        <Input
                            placeholder="Additional notes"
                            {...register("notes")}
                            className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                        />
                        {errors.notes && <p className="text-red-300 text-xs">{String(errors.notes?.message)}</p>}
                    </div>

                    <div className="flex gap-3">
                        <Button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 bg-gray-600 text-white hover:bg-gray-700 transition active:scale-95 rounded-xl cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-bold hover:from-indigo-700 hover:to-purple-700 transition active:scale-95 rounded-xl cursor-pointer"
                        >
                            Update Buyer
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}