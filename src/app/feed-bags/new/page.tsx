"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PriceInput } from "@/components/ui/price-input";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft, Calendar, Package, DollarSign, Layers, CheckCircle2 } from "lucide-react";

export default function NewFeedBagPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fullyPaid, setFullyPaid] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
        control,
    } = useForm({
        defaultValues: {
            date: new Date().toISOString().split("T")[0],
            amount: 0,
            price: 0,
            totalAmount: 0,
            amountPaid: 0,
            remainingAmount: 0,
            phase: 1,
        },
    });

    const amount = Number(watch("amount")) || 0;
    const price = Number(watch("price")) || 0;
    const amountPaid = Number(watch("amountPaid")) || 0;

    // Auto-calculate total and remaining
    useEffect(() => {
        const total = amount * price;
        setValue("totalAmount", total);
        setValue("remainingAmount", Math.max(0, total - (fullyPaid ? total : amountPaid)));
    }, [amount, price, amountPaid, fullyPaid, setValue]);

    // Set amountPaid when fullyPaid changes
    useEffect(() => {
        if (fullyPaid) {
            setValue("amountPaid", amount * price);
        }
    }, [fullyPaid, amount, price, setValue]);

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            const res = await api.post("/feed-bags", data);
            toast.success("Feed purchase recorded successfully");
            router.push(`/feed-bags/${res.data?.id || ""}`);
        } catch (error) {
            toast.error("Failed to create feed purchase");
        } finally {
            setIsSubmitting(false);
        }
    };

    const total = amount * price;
    const remaining = Math.max(0, total - (fullyPaid ? total : amountPaid));

    return (
        <div className="max-w-xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    New Feed Purchase
                </span>
            </div>

            {/* Main Form Card */}
            <div className="relative bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
                <div className="h-1.5 bg-gradient-to-r from-orange-400 via-amber-500 to-orange-600" />

                <div>
                    <h1 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-semibold text-slate-900">
                        Record Feed Purchase
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Register a batch of poultry feed bags, unit price, nutritional phase and supplier payment
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Date and Phase */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-orange-600" />
                                Purchase Date *
                            </label>
                            <Input
                                type="date"
                                {...register("date", { required: "Date is required" })}
                                className="h-11 bg-white border border-slate-200 text-slate-900 rounded-xl px-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                            />
                            {errors.date && (
                                <p className="text-rose-600 text-xs font-medium">{String(errors.date?.message)}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                <Layers className="w-3.5 h-3.5 text-orange-600" />
                                Feed Phase *
                            </label>
                            <select
                                {...register("phase", { valueAsNumber: true, required: "Phase is required" })}
                                className="w-full h-11 bg-white border border-slate-200 text-slate-900 rounded-xl px-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 shadow-xs outline-none transition"
                            >
                                <option value={1}>Phase 1 (Growth / Inception)</option>
                                <option value={2}>Phase 2 (Egg Production)</option>
                            </select>
                            {errors.phase && (
                                <p className="text-rose-600 text-xs font-medium">{String(errors.phase?.message)}</p>
                            )}
                        </div>
                    </div>

                    {/* Amount & Price */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                <Package className="w-3.5 h-3.5 text-orange-600" />
                                Quantity (Bags) *
                            </label>
                            <Input
                                type="number"
                                step="any"
                                placeholder="0"
                                {...register("amount", { valueAsNumber: true, required: "Amount is required", min: 0.01 })}
                                className="h-11 bg-white border border-slate-200 text-slate-900 rounded-xl px-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                            />
                            {errors.amount && (
                                <p className="text-rose-600 text-xs font-medium">{String(errors.amount?.message)}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                <DollarSign className="w-3.5 h-3.5 text-orange-600" />
                                Price per Bag *
                            </label>
                            <PriceInput
                                placeholder="0"
                                control={control}
                                name="price"
                                className="h-11 bg-white border border-slate-200 text-slate-900 rounded-xl px-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                            />
                            {errors.price && (
                                <p className="text-rose-600 text-xs font-medium">{String(errors.price?.message)}</p>
                            )}
                        </div>
                    </div>

                    {/* Payment Status Toggle */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                        <label className="text-xs font-semibold text-slate-700">
                            Payment to Supplier
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setFullyPaid(false)}
                                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                                    !fullyPaid
                                        ? "bg-amber-50 border-amber-300 text-amber-800 shadow-xs"
                                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                }`}
                            >
                                Partial / In Debt
                            </button>
                            <button
                                type="button"
                                onClick={() => setFullyPaid(true)}
                                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                                    fullyPaid
                                        ? "bg-orange-600 border-orange-600 text-white shadow-xs"
                                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                }`}
                            >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Fully Paid
                            </button>
                        </div>
                    </div>

                    {!fullyPaid ? (
                        <div className="space-y-1.5 animate-in fade-in duration-200">
                            <label className="text-xs font-semibold text-slate-600">
                                Initial Amount Paid
                            </label>
                            <PriceInput
                                placeholder="0"
                                control={control}
                                name="amountPaid"
                                className="h-11 bg-white border border-slate-200 text-slate-900 rounded-xl px-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                            />
                        </div>
                    ) : (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs animate-in fade-in duration-200">
                            <span className="font-medium text-emerald-800">
                                Full payment of {formatCurrency(total)} registered
                            </span>
                            <span className="font-bold text-emerald-700">Settled</span>
                        </div>
                    )}

                    {/* Summary Calculation Banner */}
                    <div className="bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-orange-500/10 border border-orange-200/80 rounded-2xl p-4 space-y-2 mt-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-semibold text-slate-700">Total Purchase:</span>
                            <span className="text-xl font-black text-slate-900">{formatCurrency(total)}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-slate-600">
                            <span>Amount Paid:</span>
                            <span className="font-semibold text-emerald-700">
                                {formatCurrency(fullyPaid ? total : amountPaid)}
                            </span>
                        </div>
                        <div className="pt-2 border-t border-orange-200/70 flex justify-between items-center text-xs">
                            <span className="font-semibold text-slate-700">Remaining Supplier Debt:</span>
                            <span className={`font-bold ${remaining > 0 ? "text-rose-600" : "text-emerald-700"}`}>
                                {remaining > 0 ? formatCurrency(remaining) : "No debt"}
                            </span>
                        </div>
                    </div>

                    {/* Submit and Cancel */}
                    <div className="flex gap-3 pt-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={isSubmitting}
                            className="flex-1 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl h-12 font-semibold"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl h-12 shadow-sm transition active:scale-95 cursor-pointer disabled:opacity-50"
                        >
                            {isSubmitting ? "Recording..." : "Save Feed Purchase"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
