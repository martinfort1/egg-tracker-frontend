"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface FeedBag {
    id: string;
    date: string;
    amount: number;
    price: number;
    totalAmount: number;
    amountPaid: number;
    remainingAmount: number;
    phase: number;
    status: string;
}

export default function EditFeedBagPage() {
    const router = useRouter();
    const { id } = useParams();

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FeedBag>();

    const amount = watch("amount");
    const price = watch("price");
    const amountPaid = watch("amountPaid");

    useEffect(() => {
        const fetchFeedBag = async () => {
            try {
                const response = await api.get(`/feed-bags/${id}`);
                const feedBag = response.data;
                setValue("date", feedBag.date.split('T')[0]);
                setValue("amount", feedBag.amount);
                setValue("price", feedBag.price);
                setValue("totalAmount", feedBag.totalAmount);
                setValue("amountPaid", feedBag.amountPaid);
                setValue("remainingAmount", feedBag.remainingAmount);
                setValue("phase", feedBag.phase);
            } catch (error) {
                toast.error("Failed to fetch feed bag");
            }
        };

        fetchFeedBag();
    }, [id, setValue]);

    // Auto-calculate total amount and remaining amount
    useEffect(() => {
        const total = amount * price;
        setValue("totalAmount", total);
        setValue("remainingAmount", total - amountPaid);
    }, [amount, price, amountPaid, setValue]);

    const onSubmit = async (data: FeedBag) => {
        try {
            await api.put(`/feed-bags/${id}`, data);
            toast.success("Feed purchase updated successfully");
            router.push(`/feed-bags/${id}`);
        } catch (error) {
            toast.error("Failed to update feed purchase");
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900/50 via-slate-900/30 to-slate-900/50 p-4 md:p-6 flex items-center justify-center">
            <div className="w-full max-w-md space-y-6 bg-linear-to-br from-slate-900/80 via-indigo-900/60 to-slate-900/90 border border-white/20 backdrop-blur-xl p-8 rounded-2xl shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Edit Feed Purchase</h1>
                    <p className="text-indigo-200">Update feed purchase information</p>
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
                        <label className="text-sm font-semibold text-white">Amount (kg)</label>
                        <Input
                            type="number"
                            step="0.01"
                            placeholder="Amount in kg"
                            {...register("amount", { valueAsNumber: true, required: "Amount is required", min: 0.01 })}
                            className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                        />
                        {errors.amount && <p className="text-red-300 text-xs">{String(errors.amount?.message)}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-white">Price per kg</label>
                        <Input
                            type="number"
                            step="0.01"
                            placeholder="Price per kg"
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

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-white">Feed Phase</label>
                        <select
                            {...register("phase", { valueAsNumber: true, required: "Phase is required" })}
                            className="w-full bg-white/20 border border-white/30 text-white rounded-lg px-3 py-2 focus:border-indigo-400 focus:ring-indigo-400/20"
                        >
                            <option value={1} className="bg-slate-800">Phase 1</option>
                            <option value={2} className="bg-slate-800">Phase 2</option>
                        </select>
                        {errors.phase && <p className="text-red-300 text-xs">{String(errors.phase?.message)}</p>}
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
                            Update Feed Purchase
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}