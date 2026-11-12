"use client";

import LoadSpin from "@/components/load-spin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PriceInput } from "@/components/ui/price-input";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import {
    ArrowLeft,
    Calendar,
    Box,
    DollarSign,
    CheckCircle2,
} from "lucide-react";
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

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
        control,
    } = useForm<Carton>();

    const bigCartonsQuantity = Number(watch("bigCartonsQuantity") ?? 0);
    const smallCartonsQuantity = Number(watch("smallCartonsQuantity") ?? 0);
    const bigCartonPrice = Number(watch("bigCartonPrice") ?? 0);
    const smallCartonPrice = Number(watch("smallCartonPrice") ?? 0);
    const amountPaid = Number(watch("amountPaid") ?? 0);

    const calculatedTotal =
        bigCartonsQuantity * bigCartonPrice + smallCartonsQuantity * smallCartonPrice;
    const totalQuantity = bigCartonsQuantity + smallCartonsQuantity;
    const remainingDebt = Math.max(0, calculatedTotal - amountPaid);

    useEffect(() => {
        const fetchCarton = async () => {
            try {
                const response = await api.get(`/cartons/${cartonId}`);
                const carton = response.data;
                setValue("date", carton.date ? carton.date.split("T")[0] : "");
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
                toast.error("Error al cargar datos del cartón");
            }
        };

        if (cartonId) {
            fetchCarton();
        }
    }, [cartonId, setValue]);

    useEffect(() => {
        setValue("quantity", totalQuantity);
        setValue("price", calculatedTotal > 0 ? calculatedTotal / Math.max(totalQuantity, 1) : 0);
        setValue("totalAmount", calculatedTotal);
        setValue("remainingAmount", remainingDebt);
    }, [calculatedTotal, totalQuantity, remainingDebt, setValue]);

    const onSubmit = async (data: Carton) => {
        if (totalQuantity <= 0) {
            toast.error("Debes ingresar al menos un cartón (grande o chico)");
            return;
        }

        setIsSubmitting(true);
        try {
            await api.put(`/cartons/${cartonId}`, {
                ...data,
                bigCartonsQuantity: Number(data.bigCartonsQuantity ?? 0),
                smallCartonsQuantity: Number(data.smallCartonsQuantity ?? 0),
                bigCartonPrice: Number(data.bigCartonPrice ?? 0),
                smallCartonPrice: Number(data.smallCartonPrice ?? 0),
                totalAmount: calculatedTotal,
                amountPaid: Number(data.amountPaid ?? 0),
                remainingAmount: remainingDebt,
            });
            toast.success("Compra de cartones modificada exitosamente");
            router.push(`/cartons/${cartonId}`);
        } catch (error) {
            toast.error("Error al actualizar compra de cartones");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="py-20 flex justify-center">
                <LoadSpin />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header Navigation */}
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver
                </button>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Modificar Compra de Cartones
                </span>
            </div>

            {/* Main Form Card */}
            <div className="relative bg-white rounded-2xl border border-amber-100/90 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
                {/* Top Section Accent Line (Amber / Orange) */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500" />

                <div>
                    <h1 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-semibold text-slate-900">
                        Modificar Compra de Cartones
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Actualizá los datos de cantidades, precios unitarios o montos abonados
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Date */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-amber-600" />
                            Fecha de Compra
                        </label>
                        <Input
                            type="date"
                            {...register("date", { required: "La fecha es obligatoria" })}
                            className="h-11 bg-slate-50/60 border border-slate-200 text-slate-900 rounded-xl px-3 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                        />
                        {errors.date && (
                            <p className="text-rose-600 text-xs font-medium">
                                {String(errors.date?.message)}
                            </p>
                        )}
                    </div>

                    {/* Cartones Grandes Section */}
                    <div className="p-4 rounded-xl border border-amber-200/60 bg-amber-50/30 space-y-3">
                        <div className="flex items-center gap-2">
                            <Box className="w-4 h-4 text-amber-600" />
                            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                                Cartones Grandes (Maples Grandes)
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700">
                                    Cantidad de Grandes
                                </label>
                                <Input
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    {...register("bigCartonsQuantity", {
                                        valueAsNumber: true,
                                        min: 0,
                                    })}
                                    className="h-11 bg-white border border-slate-200 text-slate-900 rounded-xl px-3 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700">
                                    Precio Unitario Grande
                                </label>
                                <PriceInput
                                    min="0"
                                    placeholder="0.00"
                                    control={control}
                                    name="bigCartonPrice"
                                    className="h-11 bg-white border border-slate-200 text-slate-900 rounded-xl px-3 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Cartones Chicos Section */}
                    <div className="p-4 rounded-xl border border-orange-200/60 bg-orange-50/30 space-y-3">
                        <div className="flex items-center gap-2">
                            <Box className="w-4 h-4 text-orange-600" />
                            <h3 className="text-xs font-bold uppercase tracking-wider text-orange-900">
                                Cartones Chicos (Maples Chicos)
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700">
                                    Cantidad de Chicos
                                </label>
                                <Input
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    {...register("smallCartonsQuantity", {
                                        valueAsNumber: true,
                                        min: 0,
                                    })}
                                    className="h-11 bg-white border border-slate-200 text-slate-900 rounded-xl px-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-slate-700">
                                    Precio Unitario Chico
                                </label>
                                <PriceInput
                                    min="0"
                                    placeholder="0.00"
                                    control={control}
                                    name="smallCartonPrice"
                                    className="h-11 bg-white border border-slate-200 text-slate-900 rounded-xl px-3 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Financial Summary & Payment Box */}
                    <div className="bg-amber-50/40 rounded-xl p-4 border border-amber-200/70 space-y-3 text-xs">
                        <div className="flex justify-between items-center text-slate-600">
                            <span>Total de Cartones:</span>
                            <span className="font-bold text-slate-900">
                                {totalQuantity} unidades ({bigCartonsQuantity} grandes + {smallCartonsQuantity} chicos)
                            </span>
                        </div>

                        <div className="flex justify-between items-center text-slate-600">
                            <span>Costo Total Calculado:</span>
                            <span className="text-base font-extrabold text-slate-900">
                                {formatCurrency(calculatedTotal)}
                            </span>
                        </div>

                        <div className="pt-2 border-t border-amber-200/60 grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                            <div className="space-y-1">
                                <label className="text-[11px] font-semibold text-slate-700">
                                    Monto Abonado:
                                </label>
                                <PriceInput
                                    placeholder="0.00"
                                    control={control}
                                    name="amountPaid"
                                    className="h-10 bg-white border border-slate-200 text-slate-900 rounded-xl px-3 text-xs focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                                />
                            </div>
                            <div className="text-left sm:text-right sm:pt-4">
                                <span className="text-[11px] text-slate-500 block">
                                    Deuda Pendiente:
                                </span>
                                <span className={`text-sm font-bold ${remainingDebt === 0 ? "text-emerald-700" : "text-rose-600"}`}>
                                    {remainingDebt === 0 ? "Saldado" : formatCurrency(remainingDebt)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={isSubmitting}
                            className="flex-1 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl h-12 font-semibold cursor-pointer"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl h-12 shadow-sm transition active:scale-95 cursor-pointer disabled:opacity-50"
                        >
                            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
