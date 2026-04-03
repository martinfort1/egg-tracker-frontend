"use client"

import LoadSpin from "@/components/load-spin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface Carton {
    id: string;
    date: string;
    quantity: number;
    price: number;
    totalAmount: number;
    amountPaid: number;
    remainingAmount: number;
    status: string;
}

export default function EditCartonPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const {id} = useParams();
    
    const [loading, setLoading] = useState(true);

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<Carton>();
    const quantity = watch("quantity");
    const price = watch("price");
    const amountPaid = watch("amountPaid");

    useEffect(() => {
        const fetchCarton = async () => {
            try {
                const response = await api.get(`/cartons/${id}`);
                const carton = response.data;
                setValue("date", carton.date.split('T')[0]);
                setValue("quantity", carton.quantity);
                setValue("price", carton.price);
                setValue("totalAmount", carton.totalAmount);
                setValue("amountPaid", carton.amountPaid);
                setValue("remainingAmount", carton.remainingAmount);
                setLoading(false);
            } catch (error) {
                toast.error("Failed to fetch carton data");
            }
        };
        fetchCarton();
    }, [, setValue]);

    
    // Auto-calculate total amount and remaining amount
    useEffect(() => {
        const total = quantity * price;
        setValue("totalAmount", total);
        setValue("remainingAmount", total - amountPaid);
    }, [quantity, price, amountPaid, setValue]);
    
    const onSubmit = async (data: Carton) => {
        try {
            await api.put(`/cartons/${id}`, data);
            toast.success("Carton purchase updated successfully");
            router.push(`/cartons/${id}`);
        } catch (error) {
            toast.error("Failed to update carton purchase");
        }
    };
    
    if (loading) {
        return (
            <LoadSpin />
        );
    }
    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900/50 via-slate-900/30 to-slate-900/50 p-4 md:p-6 flex items-center justify-center">
            <div className="w-full max-w-md space-y-6 bg-linear-to-br from-slate-900/80 via-indigo-900/60 to-slate-900/90 border border-white/20 backdrop-blur-xl p-8 rounded-2xl shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Edit Carton Purchase</h1>
                    <p className="text-indigo-200">Update carton purchase information</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-white">Purchase Date</label>
                        <Input
                            type="date"
                            {...register("date", { required: "Date is required" })}
                            className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                        />
                        {errors.date && <p className="text-red-300 text-xs">{String(errors.date?.message)}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-white">Quantity</label>
                        <Input
                            type="number"
                            min="1"
                            placeholder="Number of cartons"
                            {...register("quantity", { valueAsNumber: true, required: "Quantity is required", min: 1 })}
                            className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                        />
                        {errors.quantity && <p className="text-red-300 text-xs">{String(errors.quantity?.message)}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-white">Price per carton</label>
                        <Input
                            type="number"
                            step="0.01"
                            placeholder="Price per carton"
                            {...register("price", { valueAsNumber: true, required: "Price is required", min: 0.01 })}
                            className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                        />
                        {errors.price && <p className="text-red-300 text-xs">{String(errors.price?.message)}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-white">Total Amount</label>
                        <Input
                            type="number"
                            step="0.01"
                            readOnly
                            {...register("totalAmount", { valueAsNumber: true })}
                            className="bg-white/10 border-white/20 text-white cursor-not-allowed"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-white">Amount Paid</label>
                        <Input
                            type="number"
                            step="0.01"
                            placeholder="Amount already paid"
                            {...register("amountPaid", { valueAsNumber: true, min: 0 })}
                            className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-white">Remaining Amount</label>
                        <Input
                            type="number"
                            step="0.01"
                            readOnly
                            {...register("remainingAmount", { valueAsNumber: true })}
                            className="bg-white/10 border-white/20 text-white cursor-not-allowed"
                        />
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
                            Update Carton Purchase
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}