"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PriceInput } from "@/components/ui/price-input";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import {
    ArrowLeft,
    Calendar,
    User,
    ShoppingCart,
    TrendingUp,
    CheckCircle2,
    Plus,
    DollarSign,
    Box,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo, Suspense } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

function NewEggPurchaseForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const preselectedSupplierId = searchParams.get("supplierId");

    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [fullyPaid, setFullyPaid] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        control,
        formState: { errors },
    } = useForm<any>({
        defaultValues: {
            supplierId: preselectedSupplierId || "",
            date: new Date().toISOString().split("T")[0],
            Extra: 0,
            N1: 0,
            N2: 0,
            N3: 0,
            N4: 0,
            ExtraBuyPrice: 0,
            N1BuyPrice: 0,
            N2BuyPrice: 0,
            N3BuyPrice: 0,
            N4BuyPrice: 0,
            ExtraSellPrice: 0,
            N1SellPrice: 0,
            N2SellPrice: 0,
            N3SellPrice: 0,
            N4SellPrice: 0,
            amountPaid: 0,
            notes: "",
        },
    });

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const res = await api.get("/buyers?type=supplier");
                setSuppliers(res.data || []);
                if (preselectedSupplierId) {
                    setValue("supplierId", preselectedSupplierId);
                } else if (res.data?.length > 0) {
                    setValue("supplierId", res.data[0].id);
                }
            } catch (err) {
                console.error(err);
                toast.error("Error al cargar proveedores de huevos");
            }
        };

        fetchSuppliers();
    }, [preselectedSupplierId, setValue]);

    const values = watch();

    const eggSizes = [
        {
            key: "Extra",
            label: "Extra",
            badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
            qtyKey: "Extra",
            buyPriceKey: "ExtraBuyPrice",
            sellPriceKey: "ExtraSellPrice",
        },
        {
            key: "N1",
            label: "N° 1",
            badge: "bg-teal-50 text-teal-800 border-teal-200",
            qtyKey: "N1",
            buyPriceKey: "N1BuyPrice",
            sellPriceKey: "N1SellPrice",
        },
        {
            key: "N2",
            label: "N° 2",
            badge: "bg-cyan-50 text-cyan-800 border-cyan-200",
            qtyKey: "N2",
            buyPriceKey: "N2BuyPrice",
            sellPriceKey: "N2SellPrice",
        },
        {
            key: "N3",
            label: "N° 3",
            badge: "bg-blue-50 text-blue-800 border-blue-200",
            qtyKey: "N3",
            buyPriceKey: "N3BuyPrice",
            sellPriceKey: "N3SellPrice",
        },
        {
            key: "N4",
            label: "N° 4",
            badge: "bg-slate-100 text-slate-800 border-slate-200",
            qtyKey: "N4",
            buyPriceKey: "N4BuyPrice",
            sellPriceKey: "N4SellPrice",
        },
    ] as const;

    // Financial calculations
    const calculations = useMemo(() => {
        let totalCajones = 0;
        let totalCost = 0;
        let totalExpectedRevenue = 0;

        const breakdown = eggSizes.map((size) => {
            const qty = Number(values[size.qtyKey]) || 0;
            const buyPrice = Number(values[size.buyPriceKey]) || 0;
            const sellPrice = Number(values[size.sellPriceKey]) || 0;

            const subtotalCost = qty * buyPrice;
            const subtotalRevenue = qty * sellPrice;
            const profit = subtotalRevenue - subtotalCost;

            totalCajones += qty;
            totalCost += subtotalCost;
            totalExpectedRevenue += subtotalRevenue;

            return {
                ...size,
                qty,
                buyPrice,
                sellPrice,
                subtotalCost,
                subtotalRevenue,
                profit,
            };
        });

        const estimatedProfit = totalExpectedRevenue - totalCost;
        const profitMargin = totalCost > 0 ? (estimatedProfit / totalCost) * 100 : 0;

        return {
            totalCajones,
            totalCost,
            totalExpectedRevenue,
            estimatedProfit,
            profitMargin,
            breakdown,
        };
    }, [values, eggSizes]);

    // Handle fullyPaid toggle
    useEffect(() => {
        if (fullyPaid) {
            setValue("amountPaid", calculations.totalCost);
        }
    }, [fullyPaid, calculations.totalCost, setValue]);

    const remainingDebt = Math.max(0, calculations.totalCost - (Number(values.amountPaid) || 0));

    const onSubmit = async (data: any) => {
        if (!data.supplierId) {
            toast.error("Seleccioná un proveedor de huevos");
            return;
        }

        if (calculations.totalCajones <= 0) {
            toast.error("Ingresá al menos una cantidad de cajones");
            return;
        }

        if (calculations.totalCost <= 0) {
            toast.error("Ingresá el precio de compra de los cajones");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                ...data,
                Extra: Number(data.Extra) || 0,
                N1: Number(data.N1) || 0,
                N2: Number(data.N2) || 0,
                N3: Number(data.N3) || 0,
                N4: Number(data.N4) || 0,
                ExtraBuyPrice: Number(data.ExtraBuyPrice) || 0,
                N1BuyPrice: Number(data.N1BuyPrice) || 0,
                N2BuyPrice: Number(data.N2BuyPrice) || 0,
                N3BuyPrice: Number(data.N3BuyPrice) || 0,
                N4BuyPrice: Number(data.N4BuyPrice) || 0,
                ExtraSellPrice: Number(data.ExtraSellPrice) || 0,
                N1SellPrice: Number(data.N1SellPrice) || 0,
                N2SellPrice: Number(data.N2SellPrice) || 0,
                N3SellPrice: Number(data.N3SellPrice) || 0,
                N4SellPrice: Number(data.N4SellPrice) || 0,
                amountPaid: fullyPaid ? calculations.totalCost : Number(data.amountPaid) || 0,
            };

            const res = await api.post("/egg-purchases", payload);
            toast.success("Compra de huevos registrada exitosamente");
            router.push(`/egg-purchases/${res.data?.id || ""}`);
        } catch (err: any) {
            console.error(err);
            toast.error(err?.response?.data?.message || "Error al registrar la compra de huevos");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
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
                    Compra de Huevos a Terceros
                </span>
            </div>

            {/* Main Form Card */}
            <div className="relative bg-white rounded-2xl border border-amber-200/90 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-emerald-600" />

                <div>
                    <h1 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-semibold text-slate-900 flex items-center gap-2">
                        <ShoppingCart className="w-7 h-7 text-amber-600" />
                        <span>Nueva Compra de Huevos</span>
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Registrá los cajones comprados, tu precio de costo y precio de venta estimado para calcular la ganancia neta.
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Supplier & Date Selection */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
                        {/* Supplier Selector */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                    <User className="w-3.5 h-3.5 text-amber-600" />
                                    Proveedor / Vendedor *
                                </label>
                                <Link
                                    href="/buyers/new?role=supplier"
                                    className="text-xs font-semibold text-amber-700 hover:text-amber-800 hover:underline flex items-center gap-0.5"
                                >
                                    <Plus className="w-3 h-3" />
                                    <span>Crear nuevo</span>
                                </Link>
                            </div>

                            {suppliers.length === 0 ? (
                                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-2">
                                    <p>No tenés proveedores de huevos registrados todavía.</p>
                                    <Link href="/buyers/new?role=supplier" className="inline-block font-bold underline">
                                        + Agregar tu primer proveedor
                                    </Link>
                                </div>
                            ) : (
                                <select
                                    {...register("supplierId", { required: true })}
                                    className="w-full h-11 bg-white border border-slate-200 text-slate-900 rounded-xl px-3 text-sm font-semibold focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 cursor-pointer shadow-2xs"
                                >
                                    {suppliers.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.name} {s.phone ? `(${s.phone})` : ""}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* Date Picker */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                                Fecha de la Compra *
                            </label>
                            <Input
                                type="date"
                                {...register("date", { required: true })}
                                className="h-11 bg-white border border-slate-200 text-slate-900 rounded-xl px-3 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-2xs"
                            />
                        </div>
                    </div>

                    {/* Egg Boxes / Cajones Breakdown Table */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                    <Box className="w-4 h-4 text-amber-600" />
                                    <span>Detalle de Cajones, Precio de Compra y Precio de Venta</span>
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Ingresá los cajones de cada tamaño, a cuánto los compraste y a cuánto proyectás venderlos.
                                </p>
                            </div>
                            <span className="text-xs font-bold bg-amber-100/80 text-amber-800 px-3 py-1 rounded-full border border-amber-200">
                                Total: {calculations.totalCajones} cajones
                            </span>
                        </div>

                        <div className="space-y-3">
                            {calculations.breakdown.map((item) => (
                                <div
                                    key={item.key}
                                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 transition-colors shadow-2xs space-y-3"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                                        <span className={`px-2.5 py-0.5 rounded-lg text-xs font-extrabold border ${item.badge} self-start sm:self-auto`}>
                                            Tamaño {item.label}
                                        </span>

                                        <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
                                            <span>
                                                Costo: <strong className="text-slate-900">{formatCurrency(item.subtotalCost)}</strong>
                                            </span>
                                            <span className="text-slate-300">•</span>
                                            <span>
                                                Venta: <strong className="text-indigo-700">{formatCurrency(item.subtotalRevenue)}</strong>
                                            </span>
                                            <span className="text-slate-300">•</span>
                                            <span className="flex items-center gap-1">
                                                Ganancia:{" "}
                                                <strong className={item.profit >= 0 ? "text-emerald-700 font-bold" : "text-rose-600 font-bold"}>
                                                    {formatCurrency(item.profit)}
                                                </strong>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-slate-600">
                                                Cajones ({item.label})
                                            </label>
                                            <Input
                                                type="number"
                                                min="0"
                                                step="any"
                                                placeholder="0"
                                                {...register(item.qtyKey, { valueAsNumber: true })}
                                                className="h-10 bg-slate-50/70 border border-slate-200 rounded-xl px-3 text-sm font-bold text-slate-900 focus:bg-white focus:border-amber-500"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-slate-600">
                                                Precio Compra / Cajón ($)
                                            </label>
                                            <PriceInput
                                                placeholder="0"
                                                control={control}
                                                name={item.buyPriceKey}
                                                className="h-10 bg-slate-50/70 border border-slate-200 rounded-xl px-3 text-sm font-bold text-slate-900 focus:bg-white focus:border-amber-500"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-slate-600">
                                                Precio Venta Estimado / Cajón ($)
                                            </label>
                                            <PriceInput
                                                placeholder="0"
                                                control={control}
                                                name={item.sellPriceKey}
                                                className="h-10 bg-slate-50/70 border border-slate-200 rounded-xl px-3 text-sm font-bold text-indigo-900 focus:bg-white focus:border-indigo-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Live Financial Summary Card */}
                    <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-emerald-500/15 border-2 border-amber-300/80 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
                        <div className="flex items-center justify-between pb-2 border-b border-amber-200/70">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-emerald-700" />
                                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                                    Resumen de Ganancia de esta Compra
                                </h3>
                            </div>
                            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-0.5 rounded-full">
                                Margen: {calculations.profitMargin.toFixed(1)}%
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-white/80 p-3.5 rounded-xl border border-amber-200 shadow-2xs">
                                <span className="text-xs font-semibold text-slate-500 block">Costo Total Compra:</span>
                                <span className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5 block">
                                    {formatCurrency(calculations.totalCost)}
                                </span>
                                <span className="text-[11px] text-slate-400">Lo que pagás por los cajones</span>
                            </div>

                            <div className="bg-white/80 p-3.5 rounded-xl border border-amber-200 shadow-2xs">
                                <span className="text-xs font-semibold text-indigo-700 block">Venta Total Proyectada:</span>
                                <span className="text-xl sm:text-2xl font-black text-indigo-900 mt-0.5 block">
                                    {formatCurrency(calculations.totalExpectedRevenue)}
                                </span>
                                <span className="text-[11px] text-indigo-400">Al venderlos a los precios ingresados</span>
                            </div>

                            <div className="bg-emerald-50/90 p-3.5 rounded-xl border border-emerald-300 shadow-2xs">
                                <span className="text-xs font-bold text-emerald-800 block">Ganancia Neta Estimada:</span>
                                <span className={`text-xl sm:text-2xl font-black mt-0.5 block ${calculations.estimatedProfit >= 0 ? "text-emerald-700" : "text-rose-600"}`}>
                                    {formatCurrency(calculations.estimatedProfit)}
                                </span>
                                <span className="text-[11px] text-emerald-700 font-semibold">
                                    {calculations.estimatedProfit >= 0 ? "Ganancia limpia proyectada" : "Pérdida proyectada"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Terms to Supplier */}
                    <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200 space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                                Condición de Pago al Proveedor:
                            </label>
                            <span className="text-xs text-slate-500">
                                Total a abonar: <strong>{formatCurrency(calculations.totalCost)}</strong>
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setFullyPaid(false)}
                                className={`p-3 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-2 ${
                                    !fullyPaid
                                        ? "bg-amber-600 text-white border-amber-600 shadow-2xs"
                                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                }`}
                            >
                                <DollarSign className="w-4 h-4" />
                                <span>Pago Parcial / Pendiente</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setFullyPaid(true)}
                                className={`p-3 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-2 ${
                                    fullyPaid
                                        ? "bg-emerald-600 text-white border-emerald-600 shadow-2xs"
                                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                }`}
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Pagado Totalmente</span>
                            </button>
                        </div>

                        {!fullyPaid ? (
                            <div className="space-y-1.5 animate-in fade-in duration-200 pt-1">
                                <label className="text-xs font-semibold text-slate-700">
                                    Monto Inicial Abonado al Proveedor ($)
                                </label>
                                <PriceInput
                                    placeholder="0"
                                    control={control}
                                    name="amountPaid"
                                    className="h-11 bg-white border border-slate-200 text-slate-900 rounded-xl px-3 py-2 text-sm font-bold focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-xs"
                                />
                                <div className="flex justify-between items-center text-xs pt-1">
                                    <span className="text-slate-500">Saldo que le quedás debiendo:</span>
                                    <span className="font-black text-rose-600">
                                        {formatCurrency(remainingDebt)}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs animate-in fade-in duration-200">
                                <span className="font-semibold text-emerald-800">
                                    Pago completo de {formatCurrency(calculations.totalCost)} registrado
                                </span>
                                <span className="font-bold text-emerald-700">Sin deuda pendiente</span>
                            </div>
                        )}
                    </div>

                    {/* Notes */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">
                            Notas u Observaciones
                        </label>
                        <Input
                            placeholder="Detalles del lote, transportista, etc."
                            {...register("notes")}
                            className="h-11 bg-white border border-slate-200 text-slate-900 rounded-xl px-3 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
                        />
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={isSubmitting}
                            className="sm:w-1/3 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl h-12 font-semibold"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="sm:flex-1 bg-amber-600 hover:bg-amber-700 text-white rounded-xl h-12 font-bold shadow-sm hover:shadow transition active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            <ShoppingCart className="w-4 h-4" />
                            <span>{isSubmitting ? "Registrando Compra..." : "Registrar Compra de Huevos"}</span>
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function NewEggPurchasePage() {
    return (
        <Suspense fallback={<div className="text-center py-12 text-sm text-slate-400">Cargando formulario...</div>}>
            <NewEggPurchaseForm />
        </Suspense>
    );
}
