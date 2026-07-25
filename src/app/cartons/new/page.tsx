"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function NewCartonPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            date: new Date().toISOString().split("T")[0],
            bigCartonsQuantity: 0,
            smallCartonsQuantity: 0,
            bigCartonPrice: 0,
            smallCartonPrice: 0,
            quantity: 0,
            price: 0,
            totalAmount: 0,
            amountPaid: 0,
            remainingAmount: 0,
        },
    });

    const bigCartonsQuantity = Number(watch("bigCartonsQuantity") ?? 0);
    const smallCartonsQuantity = Number(watch("smallCartonsQuantity") ?? 0);
    const bigCartonPrice = Number(watch("bigCartonPrice") ?? 0);
    const smallCartonPrice = Number(watch("smallCartonPrice") ?? 0);
    const amountPaid = Number(watch("amountPaid") ?? 0);
    const [fullyPaid, setFullyPaid] = useState(false);

    useEffect(() => {
        const total = bigCartonsQuantity * bigCartonPrice + smallCartonsQuantity * smallCartonPrice;
        const totalQuantity = bigCartonsQuantity + smallCartonsQuantity;
        setValue("quantity", totalQuantity);
        setValue("price", total > 0 ? total / Math.max(totalQuantity, 1) : 0);
        setValue("totalAmount", total);
        setValue("remainingAmount", Math.max(total - (fullyPaid ? total : amountPaid), 0));
    }, [bigCartonsQuantity, smallCartonsQuantity, bigCartonPrice, smallCartonPrice, amountPaid, fullyPaid, setValue]);

    useEffect(() => {
        if (fullyPaid) {
            const total = bigCartonsQuantity * bigCartonPrice + smallCartonsQuantity * smallCartonPrice;
            setValue("amountPaid", total);
        }
    }, [fullyPaid, bigCartonsQuantity, smallCartonsQuantity, bigCartonPrice, smallCartonPrice, setValue]);

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            await api.post("/cartons", {
                ...data,
                bigCartonsQuantity: Number(data.bigCartonsQuantity ?? 0),
                smallCartonsQuantity: Number(data.smallCartonsQuantity ?? 0),
                bigCartonPrice: Number(data.bigCartonPrice ?? 0),
                smallCartonPrice: Number(data.smallCartonPrice ?? 0),
                totalAmount: Number(data.totalAmount ?? 0),
                amountPaid: Number(data.amountPaid ?? 0),
                remainingAmount: Number(data.remainingAmount ?? 0),
            });
            toast.success("Carton purchase created successfully");
            router.push("/cartons");
        } catch (error) {
            toast.error("Failed to create carton purchase");
        } finally {
            setIsSubmitting(false);
        }
    };

    const calculatedTotal = bigCartonsQuantity * bigCartonPrice + smallCartonsQuantity * smallCartonPrice;

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900/50 via-slate-900/30 to-slate-900/50 p-4 md:p-6 flex items-center justify-center">
            <div className="w-full max-w-md space-y-6 bg-linear-to-br from-slate-900/80 via-indigo-900/60 to-slate-900/90 border border-white/20 backdrop-blur-xl p-8 rounded-2xl shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Add Carton Purchase</h1>
                    <p className="text-indigo-200">Record a new carton purchase with big and small carton sizes</p>
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
                                placeholder="0"
                                {...register("bigCartonsQuantity", { valueAsNumber: true, min: 0 })}
                                className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-white">Small cartons quantity</label>
                            <Input
                                type="number"
                                min="0"
                                placeholder="0"
                                {...register("smallCartonsQuantity", { valueAsNumber: true, min: 0 })}
                                className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-white">Big carton price</label>
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="Price"
                                {...register("bigCartonPrice", { valueAsNumber: true, min: 0 })}
                                className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-white">Small carton price</label>
                            <Input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="Price"
                                {...register("smallCartonPrice", { valueAsNumber: true, min: 0 })}
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
                        <label className="text-sm font-semibold text-white">Pay Full Amount?</label>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                onClick={() => setFullyPaid(false)}
                                className={`flex-1 transition ${
                                    !fullyPaid
                                        ? "bg-linear-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-700 text-white"
                                        : "bg-white/10 text-slate-300 hover:bg-white/20 cursor-pointer"
                                }`}
                            >
                                No
                            </Button>
                            <Button
                                type="button"
                                onClick={() => setFullyPaid(true)}
                                className={`flex-1 transition ${
                                    fullyPaid
                                        ? "bg-linear-to-r from-green-500 via-green-700 to-green-900 hover:from-green-700 hover:to-green-800 text-white"
                                        : "bg-white/10 text-slate-300 hover:bg-white/20 cursor-pointer"
                                }`}
                            >
                                Yes
                            </Button>
                        </div>
                    </div>

                    {!fullyPaid && (
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
                    )}

                    {fullyPaid && (
                        <div className="animate-in fade-in duration-300 bg-linear-to-r from-green-500/20 to-green-600/20 border border-green-400/30 rounded-lg p-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-semibold text-white">Payment Amount:</span>
                                <span className="text-lg font-bold text-green-300">${calculatedTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    )}

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

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white font-bold hover:from-indigo-700 hover:to-purple-700 transition active:scale-95 rounded-xl cursor-pointer"
                    >
                        {isSubmitting ? "Creating..." : "Create Carton Purchase"}
                    </Button>
                </form>
            </div>
        </div>
    );
}