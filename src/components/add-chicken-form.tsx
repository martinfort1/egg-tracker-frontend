"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PriceInput } from "@/components/ui/price-input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Plus,
    Bird,
    Calendar,
    DollarSign,
    Truck,
    Building2,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

export function AddChickenForm({ onSuccess }: { onSuccess: () => void }) {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fullyPaid, setFullyPaid] = useState(true);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        control,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            date: new Date().toISOString().split("T")[0],
            supplier: "",
            amount: 0,
            pricePerChicken: 0,
            shippingCost: 0,
            amountPaid: 0,
        },
    });

    const watchedAmount = Number(watch("amount") || 0);
    const watchedPrice = Number(watch("pricePerChicken") || 0);
    const watchedShipping = Number(watch("shippingCost") || 0);
    const watchedPaid = Number(watch("amountPaid") || 0);

    const totalCost = useMemo(() => {
        return watchedAmount * watchedPrice + watchedShipping;
    }, [watchedAmount, watchedPrice, watchedShipping]);

    const remainingDebt = useMemo(() => {
        if (fullyPaid) return 0;
        return Math.max(0, totalCost - watchedPaid);
    }, [fullyPaid, totalCost, watchedPaid]);

    const chickensPendingToPay = useMemo(() => {
        if (fullyPaid || remainingDebt <= 0) return 0;
        if (watchedPrice <= 0) return 0;
        return Math.min(watchedAmount, Math.ceil(remainingDebt / watchedPrice));
    }, [fullyPaid, remainingDebt, watchedPrice, watchedAmount]);

    const chickensPaid = useMemo(() => {
        return Math.max(0, watchedAmount - chickensPendingToPay);
    }, [watchedAmount, chickensPendingToPay]);

    const onSubmit = async (data: any) => {
        const amount = Number(data.amount);
        const pricePerChicken = Number(data.pricePerChicken);

        if (amount <= 0) {
            toast.error("La cantidad de gallinas debe ser mayor a 0");
            return;
        }

        if (pricePerChicken <= 0) {
            toast.error("El precio por gallina debe ser mayor a 0");
            return;
        }

        const shippingCost = Number(data.shippingCost) || 0;
        const total = amount * pricePerChicken + shippingCost;
        const paid = fullyPaid ? total : Number(data.amountPaid) || 0;

        setIsSubmitting(true);
        try {
            await api.post("/chickens", {
                date: new Date(data.date),
                supplier: data.supplier?.trim() || null,
                amount,
                pricePerChicken,
                shippingCost,
                totalCost: total,
                amountPaid: paid,
            });

            toast.success("Lote de gallinas registrado exitosamente");
            setOpen(false);
            reset({
                date: new Date().toISOString().split("T")[0],
                supplier: "",
                amount: 0,
                pricePerChicken: 0,
                shippingCost: 0,
                amountPaid: 0,
            });
            setFullyPaid(true);
            onSuccess();
        } catch (err) {
            toast.error("Error al registrar compra de gallinas");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl px-4 py-2 font-semibold shadow-sm transition active:scale-95 flex items-center gap-1.5 cursor-pointer">
                    <Plus className="w-4 h-4" />
                    <span>Nueva Compra de Gallinas</span>
                </Button>
            </DialogTrigger>

            <DialogContent className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-slate-900 sm:max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="space-y-1 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                            Lote de Aves
                        </span>
                    </div>
                    <DialogTitle className="text-2xl font-['Playfair_Display'] font-semibold text-slate-900">
                        Registrar Compra de Gallinas
                    </DialogTitle>
                    <p className="text-xs text-slate-500">
                        Ingresá el proveedor, cantidad, precio unitario y control de pago del lote
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
                    {/* Supplier & Date Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5 text-amber-600" />
                                Proveedor de Gallinas
                            </label>
                            <Input
                                placeholder="Ej: Cabaña Los Pinos, Avícola San Jorge..."
                                {...register("supplier")}
                                className="h-11 bg-slate-50/60 border border-slate-200 text-slate-900 rounded-xl px-3 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                            />
                        </div>

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
                    </div>

                    {/* Quantity & Unit Price Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                <Bird className="w-3.5 h-3.5 text-amber-600" />
                                Cantidad de Gallinas
                            </label>
                            <Input
                                type="number"
                                min="1"
                                placeholder="0"
                                {...register("amount", {
                                    valueAsNumber: true,
                                    required: "La cantidad es obligatoria",
                                })}
                                className="h-11 bg-slate-50/60 border border-slate-200 text-slate-900 rounded-xl px-3 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                            />
                            {errors.amount && (
                                <p className="text-rose-600 text-xs font-medium">
                                    {String(errors.amount?.message)}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                                Precio por Gallina
                            </label>
                            <PriceInput
                                placeholder="0.00"
                                control={control}
                                name="pricePerChicken"
                                className="h-11 bg-slate-50/60 border border-slate-200 text-slate-900 rounded-xl px-3 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                            />
                        </div>
                    </div>

                    {/* Shipping Cost */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                            <Truck className="w-3.5 h-3.5 text-amber-600" />
                            Flete / Costo de Envío (opcional)
                        </label>
                        <PriceInput
                            placeholder="0.00"
                            control={control}
                            name="shippingCost"
                            className="h-11 bg-slate-50/60 border border-slate-200 text-slate-900 rounded-xl px-3 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                        />
                    </div>

                    {/* Live Financial & Lot Completion Box */}
                    <div className="bg-amber-50/40 rounded-xl p-4 border border-amber-200/70 space-y-3 text-xs">
                        <div className="flex justify-between items-center text-slate-600">
                            <span>Subtotal Gallinas:</span>
                            <span className="font-semibold text-slate-800">
                                {watchedAmount} gallinas × {formatCurrency(watchedPrice)}
                            </span>
                        </div>

                        {watchedShipping > 0 && (
                            <div className="flex justify-between items-center text-slate-600">
                                <span>Flete / Envío:</span>
                                <span className="font-semibold text-slate-800">
                                    {formatCurrency(watchedShipping)}
                                </span>
                            </div>
                        )}

                        <div className="pt-2 border-t border-amber-200/60 flex justify-between items-center">
                            <span className="font-bold text-slate-800 text-sm">
                                Costo Total del Lote:
                            </span>
                            <span className="text-lg font-black text-slate-900">
                                {formatCurrency(totalCost)}
                            </span>
                        </div>

                        {/* Payment Condition Toggle */}
                        <div className="pt-2 border-t border-amber-200/60 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <span className="font-semibold text-slate-700">
                                Condición de Pago:
                            </span>
                            <div className="inline-flex rounded-xl bg-white p-0.5 border border-slate-200">
                                <button
                                    type="button"
                                    onClick={() => setFullyPaid(false)}
                                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                        !fullyPaid
                                            ? "bg-amber-600 text-white shadow-2xs"
                                            : "text-slate-600 hover:text-slate-900"
                                    }`}
                                >
                                    Pago Parcial / Pendiente
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFullyPaid(true)}
                                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                        fullyPaid
                                            ? "bg-emerald-600 text-white shadow-2xs"
                                            : "text-slate-600 hover:text-slate-900"
                                    }`}
                                >
                                    Lote Pagado Completo
                                </button>
                            </div>
                        </div>

                        {!fullyPaid ? (
                            <div className="pt-2 border-t border-amber-200/60 space-y-2">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-semibold text-slate-700">
                                            Monto Abonado Inicial:
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
                                            Saldo Adeudado:
                                        </span>
                                        <span className="text-sm font-bold text-rose-600">
                                            {formatCurrency(remainingDebt)}
                                        </span>
                                    </div>
                                </div>

                                {/* Banner showing chickens remaining to be paid */}
                                <div className="p-2.5 rounded-lg bg-amber-100/70 border border-amber-300 text-amber-900 flex justify-between items-center text-xs">
                                    <span className="font-semibold">
                                        Quedan por pagar para completar el lote:
                                    </span>
                                    <span className="font-extrabold text-sm text-amber-950">
                                        {chickensPendingToPay} gallinas
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="pt-2 border-t border-emerald-200 flex items-center justify-between text-emerald-800">
                                <span className="flex items-center gap-1 font-semibold text-xs">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    Lote Completamente Pagado:
                                </span>
                                <span className="font-bold text-sm text-emerald-700">
                                    0 gallinas pendientes
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2.5 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isSubmitting}
                            className="flex-1 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl h-11 font-semibold cursor-pointer"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl h-11 shadow-sm transition active:scale-95 cursor-pointer disabled:opacity-50"
                        >
                            {isSubmitting ? "Registrando..." : "Registrar Lote"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
