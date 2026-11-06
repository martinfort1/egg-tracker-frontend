"use client";

import LoadSpin from "@/components/load-spin";
import { Button } from "@/components/ui/button";
import PaymentModal from "@/components/payment-modal";
import { api } from "@/lib/api";
import {
    ArrowLeft,
    Calendar,
    User,
    Phone,
    MapPin,
    DollarSign,
    CheckCircle2,
    AlertCircle,
    Clock,
    ShoppingCart,
    Edit,
    Trash2,
    TrendingUp,
    Box,
    ArrowUpRight,
    Plus,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { formatCurrency, formatUtcDate } from "@/lib/utils";

export default function EggPurchaseDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [purchase, setPurchase] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/egg-purchases/${id}`);
            setPurchase(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Error al cargar detalle de compra");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleDelete = async () => {
        if (!confirm("¿Estás seguro de eliminar esta compra de huevos?")) return;

        try {
            await api.delete(`/egg-purchases/${id}`);
            toast.success("Compra eliminada exitosamente");
            router.push("/egg-purchases");
        } catch (error) {
            toast.error("Error al eliminar compra");
        }
    };

    if (loading) return <LoadSpin />;
    if (!purchase) return null;

    const supplier = purchase.supplier;

    const statusBadge: Record<string, { className: string; icon: any }> = {
        PAID: {
            className: "bg-emerald-50 text-emerald-700 border-emerald-200",
            icon: CheckCircle2,
        },
        PARTIAL: {
            className: "bg-amber-50 text-amber-700 border-amber-200",
            icon: Clock,
        },
        UNPAID: {
            className: "bg-rose-50 text-rose-700 border-rose-200",
            icon: AlertCircle,
        },
    };

    const StatusIcon = statusBadge[purchase.status]?.icon || AlertCircle;
    const badgeClass = statusBadge[purchase.status]?.className || "bg-slate-100 text-slate-700 border-slate-200";

    const items = [
        { label: "Extra", qty: purchase.Extra, buyPrice: purchase.ExtraBuyPrice, sellPrice: purchase.ExtraSellPrice },
        { label: "N° 1", qty: purchase.N1, buyPrice: purchase.N1BuyPrice, sellPrice: purchase.N1SellPrice },
        { label: "N° 2", qty: purchase.N2, buyPrice: purchase.N2BuyPrice, sellPrice: purchase.N2SellPrice },
        { label: "N° 3", qty: purchase.N3, buyPrice: purchase.N3BuyPrice, sellPrice: purchase.N3SellPrice },
        { label: "N° 4", qty: purchase.N4, buyPrice: purchase.N4BuyPrice, sellPrice: purchase.N4SellPrice },
    ].filter((item) => Number(item.qty) > 0);

    const totalCajones = items.reduce((sum, it) => sum + it.qty, 0);
    const profitMargin = purchase.totalCost > 0 ? (purchase.estimatedProfit / purchase.totalCost) * 100 : 0;

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            {/* Navigation & Section Tag */}
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => router.push("/egg-purchases")}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver a Compras de Huevos
                </button>

                <div className="flex items-center gap-2">
                    {supplier?.name && (
                        <Link
                            href={`/egg-purchases/suppliers/${supplier.id}`}
                            className="text-xs font-bold text-slate-700 bg-slate-100 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-200 px-3 py-1 rounded-full border border-slate-200 flex items-center gap-1.5 transition-colors"
                            title={`Ver perfil de ${supplier.name}`}
                        >
                            <User className="w-3.5 h-3.5 text-amber-600" />
                            <span>{supplier.name}</span>
                        </Link>
                    )}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        {purchase.purchaseNumber ? `Compra N° ${purchase.purchaseNumber}` : `Compra #${purchase.id.slice(0, 8)}`}
                    </span>
                </div>
            </div>

            {/* Header Card with Prominent Supplier Name */}
            <div className="relative bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden p-6 sm:p-8">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-emerald-600" />

                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pt-1">
                    <div className="space-y-2">
                        {/* Pre-title Tag */}
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                                {purchase.purchaseNumber ? `Compra N° ${purchase.purchaseNumber}` : "Compra"}
                            </span>
                            <span className="text-xs text-slate-400">Proveedor de Huevos</span>
                        </div>

                        {/* Supplier Name Prominently Displayed on Top */}
                        <div className="flex items-center gap-3 flex-wrap">
                            {supplier?.id ? (
                                <Link
                                    href={`/egg-purchases/suppliers/${supplier.id}`}
                                    className="group/name flex items-center gap-2 hover:opacity-95 transition-opacity"
                                    title={`Ir al perfil y datos de ${supplier.name}`}
                                >
                                    <h1 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-bold text-slate-900 group-hover/name:text-amber-700 group-hover/name:underline flex items-center gap-2 transition-colors">
                                        <User className="w-7 h-7 text-amber-600 shrink-0" />
                                        <span>{supplier?.name || "Proveedor no especificado"}</span>
                                        <ArrowUpRight className="w-5 h-5 text-amber-600 opacity-60 group-hover/name:opacity-100 group-hover/name:translate-x-0.5 group-hover/name:-translate-y-0.5 transition-all" />
                                    </h1>
                                </Link>
                            ) : (
                                <h1 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-bold text-slate-900 flex items-center gap-2">
                                    <User className="w-7 h-7 text-amber-600 shrink-0" />
                                    <span>{supplier?.name || "Proveedor no especificado"}</span>
                                </h1>
                            )}

                            {purchase.status !== "PAID" ? (
                                <PaymentModal
                                    sale={purchase}
                                    endpoint="egg-purchases"
                                    onSuccess={fetchData}
                                >
                                    <button
                                        type="button"
                                        title="Hacé clic para registrar pago al proveedor"
                                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 ${badgeClass} hover:border-emerald-400 group/status`}
                                    >
                                        <StatusIcon className="w-3.5 h-3.5" />
                                        <span>{purchase.status}</span>
                                        <span className="text-[10px] bg-white/90 px-1.5 py-0.5 rounded-md font-bold text-emerald-800 border border-emerald-200 group-hover/status:bg-emerald-600 group-hover/status:text-white transition-colors flex items-center gap-0.5">
                                            <DollarSign className="w-2.5 h-2.5" />
                                            <span>Pagar</span>
                                        </span>
                                    </button>
                                </PaymentModal>
                            ) : (
                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${badgeClass}`}>
                                    <StatusIcon className="w-3.5 h-3.5" />
                                    {purchase.status}
                                </span>
                            )}
                        </div>

                        {/* Date and Metadata */}
                        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500 pt-1">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4 text-amber-600" />
                                <span>Comprado el {formatUtcDate(purchase.date)}</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Box className="w-4 h-4 text-amber-600" />
                                <span>{totalCajones} cajones en total</span>
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <Link href={`/egg-purchases/${id}/edit`}>
                            <Button
                                variant="outline"
                                className="border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-amber-800 rounded-xl flex items-center gap-1.5 text-sm font-semibold"
                            >
                                <Edit className="w-4 h-4" />
                                <span>Editar</span>
                            </Button>
                        </Link>

                        <Button
                            onClick={handleDelete}
                            variant="outline"
                            className="border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 rounded-xl p-2.5"
                            title="Eliminar compra"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Key Financial Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Costo Total Compra
                    </p>
                    <p className="text-xl sm:text-2xl font-black text-slate-900">
                        {formatCurrency(purchase.totalCost)}
                    </p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
                    <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-1">
                        Venta Proyectada
                    </p>
                    <p className="text-xl sm:text-2xl font-black text-indigo-900">
                        {formatCurrency(purchase.expectedRevenue)}
                    </p>
                </div>

                <div className="bg-emerald-50/70 rounded-2xl border border-emerald-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                            Ganancia Neta
                        </p>
                        <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded-full">
                            {profitMargin.toFixed(1)}%
                        </span>
                    </div>
                    <p className={`text-xl sm:text-2xl font-black ${purchase.estimatedProfit >= 0 ? "text-emerald-700" : "text-rose-600"}`}>
                        {formatCurrency(purchase.estimatedProfit)}
                    </p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Saldo a Pagar
                    </p>
                    <p className={`text-xl sm:text-2xl font-black ${purchase.remainingAmount > 0 ? "text-rose-600" : "text-emerald-700"}`}>
                        {purchase.remainingAmount > 0 ? formatCurrency(purchase.remainingAmount) : "$0"}
                    </p>
                </div>
            </div>

            {/* Detailed Table of Cajones */}
            <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Box className="w-4 h-4 text-amber-600" />
                        <span>Detalle de Cajones Comprados y Margen de Ganancia</span>
                    </h2>
                    <span className="text-xs font-semibold text-slate-500">
                        {items.length} {items.length === 1 ? "categoría" : "categorías"}
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                            <tr>
                                <th className="py-2.5 px-3">Tamaño</th>
                                <th className="py-2.5 px-3 text-right">Cajones</th>
                                <th className="py-2.5 px-3 text-right">Precio Compra / Cajón</th>
                                <th className="py-2.5 px-3 text-right">Subtotal Costo</th>
                                <th className="py-2.5 px-3 text-right">Precio Venta / Cajón</th>
                                <th className="py-2.5 px-3 text-right">Subtotal Venta</th>
                                <th className="py-2.5 px-3 text-right">Ganancia Estimada</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {items.map((it, idx) => {
                                const cost = it.qty * it.buyPrice;
                                const rev = it.qty * it.sellPrice;
                                const diff = rev - cost;

                                return (
                                    <tr key={idx} className="hover:bg-amber-50/30 transition-colors">
                                        <td className="py-3 px-3 font-bold text-slate-900">
                                            {it.label}
                                        </td>
                                        <td className="py-3 px-3 text-right font-extrabold text-slate-900">
                                            {it.qty}
                                        </td>
                                        <td className="py-3 px-3 text-right text-slate-600 font-semibold">
                                            {formatCurrency(it.buyPrice)}
                                        </td>
                                        <td className="py-3 px-3 text-right font-bold text-slate-900">
                                            {formatCurrency(cost)}
                                        </td>
                                        <td className="py-3 px-3 text-right text-indigo-700 font-semibold">
                                            {formatCurrency(it.sellPrice)}
                                        </td>
                                        <td className="py-3 px-3 text-right font-bold text-indigo-900">
                                            {formatCurrency(rev)}
                                        </td>
                                        <td className={`py-3 px-3 text-right font-black ${diff >= 0 ? "text-emerald-700" : "text-rose-600"}`}>
                                            {formatCurrency(diff)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Calculation Banner */}
                <div className="flex flex-col sm:flex-row justify-between items-center bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-emerald-500/15 border border-amber-300 p-4 rounded-xl gap-3">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-700" />
                        <div>
                            <p className="text-xs font-bold text-slate-700 uppercase">Resultado Neto Proyectado:</p>
                            <p className="text-[11px] text-slate-500">Costo total {formatCurrency(purchase.totalCost)} vs Venta proyectada {formatCurrency(purchase.expectedRevenue)}</p>
                        </div>
                    </div>
                    <span className={`text-2xl font-black ${purchase.estimatedProfit >= 0 ? "text-emerald-700" : "text-rose-600"}`}>
                        {formatCurrency(purchase.estimatedProfit)}
                    </span>
                </div>
            </div>

            {/* Supplier Information Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <User className="w-4 h-4 text-amber-600" />
                        <span>Datos del Proveedor de Huevos</span>
                    </h2>
                    {supplier?.id && (
                        <Link
                            href={`/egg-purchases/suppliers/${supplier.id}`}
                            className="text-xs font-semibold text-amber-700 hover:text-amber-800 hover:underline"
                        >
                            Ver Estado de Cuenta del Proveedor →
                        </Link>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
                    <div className="space-y-1">
                        <span className="text-xs text-slate-400 font-medium">Nombre</span>
                        <p className="text-base font-bold text-slate-900">
                            {supplier?.name || "Sin nombre registrado"}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <span className="text-xs text-slate-400 font-medium">Teléfono</span>
                        <p className="text-slate-700 font-medium flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            {supplier?.phone || "Sin teléfono"}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <span className="text-xs text-slate-400 font-medium">Dirección</span>
                        <p className="text-slate-700 font-medium flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {supplier?.address || "Sin dirección"}
                        </p>
                    </div>
                </div>

                {purchase.notes && (
                    <div className="pt-2 border-t border-slate-100 text-xs">
                        <span className="text-slate-400 font-medium">Notas de la compra:</span>
                        <p className="text-slate-700 italic mt-0.5">"{purchase.notes}"</p>
                    </div>
                )}
            </div>

            {/* Payment History & Ledger for this purchase */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-emerald-600" />
                            <span>Historial de Pagos Emitidos para esta Compra</span>
                        </h2>
                        <p className="text-xs text-slate-500">
                            Abonado: <strong className="text-emerald-700">{formatCurrency(purchase.amountPaid)}</strong> de{" "}
                            {formatCurrency(purchase.totalCost)} (Saldo adeudado: {formatCurrency(purchase.remainingAmount)})
                        </p>
                    </div>

                    {purchase.remainingAmount > 0 && (
                        <PaymentModal
                            sale={purchase}
                            endpoint="egg-purchases"
                            onSuccess={fetchData}
                        >
                            <Button
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Abonar / Pagar</span>
                            </Button>
                        </PaymentModal>
                    )}
                </div>

                {(!purchase.payments || purchase.payments.length === 0) ? (
                    <p className="text-xs text-slate-400 py-3 text-center">
                        No hay pagos registrados para esta compra.
                    </p>
                ) : (
                    <div className="divide-y divide-slate-100 text-xs">
                        {purchase.payments.map((p: any, idx: number) => (
                            <div key={p.id || idx} className="py-2.5 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-800 font-bold flex items-center justify-center text-[10px] border border-emerald-200">
                                        #{p.paymentNumber || idx + 1}
                                    </span>
                                    <div>
                                        <span className="font-semibold text-slate-800">{formatUtcDate(p.date)}</span>
                                        {p.note && <span className="text-slate-400 ml-2 italic">"{p.note}"</span>}
                                    </div>
                                </div>
                                <span className="font-extrabold text-emerald-700 text-sm">
                                    {formatCurrency(p.amount)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
