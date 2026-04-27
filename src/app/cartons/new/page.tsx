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

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            date: new Date().toISOString().split('T')[0],
            quantity: 0,
            price: 0,
            totalAmount: 0,
            amountPaid: 0,
            remainingAmount: 0
        }
    });

    const quantity = watch("quantity");
    const price = watch("price");
    const amountPaid = watch("amountPaid");
    const [fullyPaid, setFullyPaid] = useState(false);

    // Auto-calculate total amount and remaining amount
    useEffect(() => {
        const total = quantity * price;
        setValue("totalAmount", total);
        setValue("remainingAmount", total - (fullyPaid ? total : amountPaid));
    }, [quantity, price, amountPaid, fullyPaid, setValue]);

    // Set amountPaid when fullyPaid changes
    useEffect(() => {
        if (fullyPaid) {
            setValue("amountPaid", quantity * price);
        }
    }, [fullyPaid, quantity, price, setValue]);

    const onSubmit = async (data: any) => {
        try {
            await api.post("/cartons", data);
            toast.success("Carton purchase created successfully");
            router.push("/cartons");
        } catch (error) {
            toast.error("Failed to create carton purchase");
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900/50 via-slate-900/30 to-slate-900/50 p-4 md:p-6 flex items-center justify-center">
            <div className="w-full max-w-md space-y-6 bg-linear-to-br from-slate-900/80 via-indigo-900/60 to-slate-900/90 border border-white/20 backdrop-blur-xl p-8 rounded-2xl shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Add Carton Purchase</h1>
                    <p className="text-indigo-200">Record a new carton purchase</p>
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

                    {/* Fully Paid Toggle */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-white">Pay Full Amount?</label>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                onClick={() => setFullyPaid(false)}
                                className={`flex-1 transition ${
                                    !fullyPaid
                                        ? 'bg-linear-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-700 text-white'
                                        : 'bg-white/10 text-slate-300 hover:bg-white/20 cursor-pointer'
                                }`}
                            >
                                No
                            </Button>
                            <Button
                                type="button"
                                onClick={() => setFullyPaid(true)}
                                className={`flex-1 transition ${
                                    fullyPaid
                                        ? 'bg-linear-to-r from-green-500 via-green-700 to-green-900 hover:from-green-700 hover:to-green-800 text-white'
                                        : 'bg-white/10 text-slate-300 hover:bg-white/20 cursor-pointer'
                                }`}
                            >
                                Yes
                            </Button>
                        </div>
                    </div>

                    {/* Amount Paid */}
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

                    {/* Payment Summary */}
                    {fullyPaid && (
                        <div className="animate-in fade-in duration-300 bg-linear-to-r from-green-500/20 to-green-600/20 border border-green-400/30 rounded-lg p-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-semibold text-white">Payment Amount:</span>
                                <span className="text-lg font-bold text-green-300">${quantity * price}</span>
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
                        className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white font-bold hover:from-indigo-700 hover:to-purple-700 transition active:scale-95 rounded-xl cursor-pointer"
                    >
                        Create Carton Purchase
                    </Button>
                </form>
            </div>
        </div>
    )
}