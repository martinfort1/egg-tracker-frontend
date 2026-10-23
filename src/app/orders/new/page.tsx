"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PriceInput } from "@/components/ui/price-input";
import { api } from "@/lib/api";
import { orderSchema } from "@/lib/schemas/order.schema";
import { formatCurrency } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Plus,
    ArrowLeft,
    Calendar,
    User,
    ShoppingBag,
    Repeat,
    ClipboardList,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const WEEKDAYS = [
    { key: "MONDAY", label: "Mon" },
    { key: "TUESDAY", label: "Tue" },
    { key: "WEDNESDAY", label: "Wed" },
    { key: "THURSDAY", label: "Thu" },
    { key: "FRIDAY", label: "Fri" },
    { key: "SATURDAY", label: "Sat" },
    { key: "SUNDAY", label: "Sun" },
] as const;

export default function NewOrderPage() {
    const router = useRouter();

    const [buyers, setBuyers] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
        control,
    } = useForm({
        resolver: zodResolver(orderSchema),
        defaultValues: {
            date: new Date().toISOString().split("T")[0],
            Extra: 0,
            N1: 0,
            N2: 0,
            N3: 0,
            N4: 0,
            ExtraPrice: 0,
            N1Price: 0,
            N2Price: 0,
            N3Price: 0,
            N4Price: 0,
            recurring: false,
            recurringDays: [] as string[],
        },
    });

    useEffect(() => {
        const fetchBuyers = async () => {
            try {
                const res = await api.get("/buyers");
                setBuyers(res.data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load buyers");
            }
        };

        fetchBuyers();
    }, []);

    const values = watch();
    const recurring = watch("recurring");
    const recurringDays = (watch("recurringDays") ?? []) as string[];

    const toggleRecurringDay = (day: string) => {
        const updatedDays = recurringDays.includes(day)
            ? recurringDays.filter((currentDay) => currentDay !== day)
            : [...recurringDays, day];

        setValue("recurringDays", updatedDays, {
            shouldValidate: true,
            shouldDirty: true,
        });
    };

    useEffect(() => {
        const totalCalculation =
            (Number(values.Extra) || 0) * (Number(values.ExtraPrice) || 0) +
            (Number(values.N1) || 0) * (Number(values.N1Price) || 0) +
            (Number(values.N2) || 0) * (Number(values.N2Price) || 0) +
            (Number(values.N3) || 0) * (Number(values.N3Price) || 0) +
            (Number(values.N4) || 0) * (Number(values.N4Price) || 0);

        setTotal(totalCalculation || 0);
    }, [values.Extra, values.ExtraPrice, values.N1, values.N1Price, values.N2, values.N2Price, values.N3, values.N3Price, values.N4, values.N4Price]);

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            const res = await api.post("/orders", data);
            toast.success("Order created successfully");
            router.push(`/orders/${res.data.id}`);
        } catch (error) {
            console.error(error);
            toast.error("Failed to create order");
        } finally {
            setIsSubmitting(false);
        }
    };

    const eggSizes = [
        { key: "Extra", label: "Extra", color: "text-indigo-700 bg-indigo-50 border-indigo-200" },
        { key: "N1", label: "N° 1", color: "text-blue-700 bg-blue-50 border-blue-200" },
        { key: "N2", label: "N° 2", color: "text-violet-700 bg-violet-50 border-violet-200" },
        { key: "N3", label: "N° 3", color: "text-purple-700 bg-purple-50 border-purple-200" },
        { key: "N4", label: "N° 4", color: "text-slate-700 bg-slate-50 border-slate-200" },
    ] as const;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Orders
                </button>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    Orders Section
                </span>
            </div>

            {/* Main Card */}
            <div className="relative bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600" />

                <div className="p-6 sm:p-8 space-y-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-semibold text-slate-900">
                            New Order
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Schedule a delivery order for an egg customer, configure recurring deliveries if needed
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Client and Date Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Client Selection */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                                        <User className="w-4 h-4 text-indigo-600" />
                                        Client
                                    </label>
                                    <Link
                                        href="/buyers/new"
                                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1"
                                    >
                                        <Plus className="w-3 h-3" />
                                        Add Buyer
                                    </Link>
                                </div>
                                <select
                                    {...register("buyerId")}
                                    className="w-full h-11 bg-white border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-xs outline-none transition"
                                >
                                    <option value="">Select a buyer...</option>
                                    {buyers.map((buyer) => (
                                        <option key={buyer.id} value={buyer.id}>
                                            {buyer.name} {buyer.phone ? `(${buyer.phone})` : ""}
                                        </option>
                                    ))}
                                </select>
                                {errors.buyerId && (
                                    <p className="text-rose-600 text-xs font-medium">{String(errors.buyerId?.message)}</p>
                                )}
                            </div>

                            {/* Order Date */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4 text-indigo-600" />
                                    Order / Delivery Date
                                </label>
                                <Input
                                    type="date"
                                    {...register("date")}
                                    className="h-11 bg-white border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-xs"
                                />
                                {errors.date && (
                                    <p className="text-rose-600 text-xs font-medium">{String(errors.date?.message)}</p>
                                )}
                            </div>
                        </div>

                        {/* Recurring Order Toggle Box */}
                        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-4 space-y-4">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                                        <Repeat className="w-4 h-4 text-indigo-600" />
                                        Recurring Order
                                    </label>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        Repeat this delivery automatically on selected weekdays
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const nextValue = !recurring;
                                        setValue("recurring", nextValue, {
                                            shouldValidate: true,
                                            shouldDirty: true,
                                        });
                                        if (!nextValue) {
                                            setValue("recurringDays", [], {
                                                shouldValidate: true,
                                                shouldDirty: true,
                                            });
                                        }
                                    }}
                                    className={`rounded-full px-4 py-1.5 text-xs font-bold transition cursor-pointer border ${
                                        recurring
                                            ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                                            : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                    }`}
                                >
                                    {recurring ? "Recurring: ON" : "One-time"}
                                </button>
                            </div>

                            {recurring && (
                                <div className="space-y-2 pt-2 border-t border-indigo-100/70 animate-in fade-in duration-200">
                                    <p className="text-xs font-semibold text-indigo-900">
                                        Select repeat days:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {WEEKDAYS.map(({ key, label }) => {
                                            const selected = recurringDays.includes(key);

                                            return (
                                                <button
                                                    key={key}
                                                    type="button"
                                                    onClick={() => toggleRecurringDay(key)}
                                                    className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                                                        selected
                                                            ? "border-indigo-600 bg-indigo-600 text-white shadow-xs"
                                                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                                    }`}
                                                >
                                                    {label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {errors.recurringDays && (
                                        <p className="text-rose-600 text-xs font-medium">
                                            {String(errors.recurringDays.message)}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Items Grid */}
                        <div className="space-y-3 pt-2">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                                    <ShoppingBag className="w-4 h-4 text-indigo-600" />
                                    Ordered Eggs & Unit Prices
                                </h3>
                                <span className="text-xs text-slate-400">Cartons / Trays</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {eggSizes.map(({ key, label, color }) => (
                                    <div
                                        key={key}
                                        className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 space-y-3 hover:border-indigo-200 transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className={`px-2 py-0.5 rounded-md text-xs font-bold border ${color}`}>
                                                {label}
                                            </span>
                                            <span className="text-xs font-semibold text-slate-400">
                                                {formatCurrency(
                                                    (Number(values[key as keyof typeof values]) || 0) *
                                                    (Number(values[`${key}Price` as keyof typeof values]) || 0)
                                                )}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="text-[11px] font-semibold text-slate-500 mb-1 block">
                                                    Quantity
                                                </label>
                                                <Input
                                                    placeholder="0"
                                                    type="number"
                                                    step="0.5"
                                                    {...register(key as any, { valueAsNumber: true })}
                                                    className="h-9 bg-white border border-slate-200 text-slate-900 text-xs rounded-lg px-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[11px] font-semibold text-slate-500 mb-1 block">
                                                    Price / Unit
                                                </label>
                                                <PriceInput
                                                    placeholder="0"
                                                    control={control}
                                                    name={`${key}Price` as any}
                                                    className="h-9 bg-white border border-slate-200 text-slate-900 text-xs rounded-lg px-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Calculation Summary Card */}
                        <div className="bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-indigo-500/10 border border-indigo-200/80 rounded-2xl p-5 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-semibold text-slate-700">Estimated Total:</span>
                                <span className="text-2xl font-black text-slate-900">{formatCurrency(total)}</span>
                            </div>
                            <p className="text-xs text-slate-500">
                                Payment can be registered when fulfilling the order upon delivery.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                disabled={isSubmitting}
                                className="sm:w-1/3 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl h-12 font-semibold"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="sm:flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-12 font-bold shadow-sm hover:shadow transition active:scale-95 cursor-pointer disabled:opacity-50"
                            >
                                {isSubmitting ? "Creating Order..." : "Create Order"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
