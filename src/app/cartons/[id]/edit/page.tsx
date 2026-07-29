"use client"

import LoadSpin from "@/components/load-spin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PriceInput } from "@/components/ui/price-input";
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
    bigCartonsQuantity: number;
    smallCartonsQuantity: number;
    bigCartonPrice: number;
    smallCartonPrice: number;
    totalAmount: number;
    amountPaid: number;
    remainingAmount: number;
    status: string;
}

export default function EditCartonPage() {
    const router = useRouter();
    const { id } = useParams();
    const cartonId = Array.isArray(id) ? id[0] : id;

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    const { register, handleSubmit, watch, setValue, formState: { errors }, control } = useForm<Carton>();
    const bigCartonsQuantity = Number(watch("bigCartonsQuantity") ?? 0);
    const smallCartonsQuantity = Number(watch("smallCartonsQuantity") ?? 0);
    const bigCartonPrice = Number(watch("bigCartonPrice") ?? 0);
    const smallCartonPrice = Number(watch("smallCartonPrice") ?? 0);
    const amountPaid = Number(watch("amountPaid") ?? 0);

    useEffect(() => {
        const fetchCarton = async () => {
            try {
                const response = await api.get(`/cartons/${cartonId}`);
                const carton = response.data;
                setValue("date", carton.date?.split("T")[0] ?? "");
                setValue("bigCartonsQuantity", carton.bigCartonsQuantity ?? 0);
                setValue("smallCartonsQuantity", carton.smallCartonsQuantity ?? 0);
                setValue("bigCartonPrice", carton.bigCartonPrice ?? 0);
                setValue("smallCartonPrice", carton.smallCartonPrice ?? 0);
                setValue("quantity", carton.quantity ?? 0);
                setValue("price", carton.price ?? 0);
                setValue("totalAmount", carton.totalAmount ?? 0);
                setValue("amountPaid", carton.amountPaid ?? 0);
                setValue("remainingAmount", carton.remainingAmount ?? 0);
                setLoading(false);
            } catch (error) {
                toast.error("Failed to fetch carton data");
            }
        };

        if (cartonId) {
            fetchCarton();
        }
    }, [cartonId, setValue]);

    useEffect(() => {
        const total = bigCartonsQuantity * bigCartonPrice + smallCartonsQuantity * smallCartonPrice;
        setValue("totalAmount", total);
        setValue("remainingAmount", Math.max(total - amountPaid, 0));
    }, [bigCartonsQuantity, smallCartonsQuantity, bigCartonPrice, smallCartonPrice, amountPaid, setValue]);

    const onSubmit = async (data: Carton) => {
        setIsSubmitting(true);
        try {
            await api.put(`/cartons/${cartonId}`, {
                ...data,
                bigCartonsQuantity: Number(data.bigCartonsQuantity ?? 0),
                smallCartonsQuantity: Number(data.smallCartonsQuantity ?? 0),
                bigCartonPrice: Number(data.bigCartonPrice ?? 0),
                smallCartonPrice: Number(data.smallCartonPrice ?? 0),
                totalAmount: Number(data.totalAmount ?? 0),
                amountPaid: Number(data.amountPaid ?? 0),
                remainingAmount: Number(data.remainingAmount ?? 0),
            });
            toast.success("Carton purchase updated successfully");
            router.push(`/cartons/${cartonId}`);
        } catch (error) {
            toast.error("Failed to update carton purchase");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <LoadSpin />;
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-white">Big cartons quantity</label>
                            <Input
                                type="number"
                                min="0"
                                {...register("bigCartonsQuantity", { valueAsNumber: true, min: 0 })}
                                className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-white">Small cartons quantity</label>
                            <Input
                                type="number"
                                min="0"
                                {...register("smallCartonsQuantity", { valueAsNumber: true, min: 0 })}
                                className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-white">Big carton price</label>
                            <PriceInput
                                min="0"
                                placeholder="Price"
                                control={control}
                                name="bigCartonPrice"
                                className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-white">Small carton price</label>
                            <PriceInput
                                min="0"
                                placeholder="Price"
                                control={control}
                                name="smallCartonPrice"
                                className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                            />
                        </div>
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
                        <PriceInput
                            placeholder="Amount already paid"
                            control={control}
                            name="amountPaid"
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
                            disabled={isSubmitting}
                            className="flex-1 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-bold hover:from-indigo-700 hover:to-purple-700 transition active:scale-95 rounded-xl cursor-pointer"
                        >
                            {isSubmitting ? "Updating..." : "Update Carton Purchase"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}