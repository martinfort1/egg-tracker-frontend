"use client";

import { api } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "./ui/button";
import Link from "next/link";
import PaymentModal from "./payment-modal";
import { motion } from "framer-motion";
import { formatCurrency, formatUtcDate } from "@/lib/utils";
import { Calendar, CheckCircle2, AlertCircle, Clock, ArrowUpRight, DollarSign, TrendingUp, ShoppingCart, Eye, Trash2 } from "lucide-react";

export default function EggPurchaseCard({ purchase, refresh }: any) {
    const handleDelete = async () => {
        if (!confirm(`¿Eliminar la compra de huevos #${purchase.purchaseNumber || purchase.id.slice(0, 8)}?`)) return;

        await toast.promise(api.delete(`/egg-purchases/${purchase.id}`), {
            loading: "Eliminando compra...",
            success: "Compra eliminada exitosamente",
            error: "Error al eliminar la compra",
        });
        refresh?.();
    };

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
    ].filter((i) => Number(i.qty) > 0);

    const totalCajones = items.reduce((acc, i) => acc + i.qty, 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="group relative bg-white rounded-2xl border border-amber-200/80 p-5 sm:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden gap-4"
        >
            {/* Top Section Accent Line (Amber/Emerald) */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-600" />

            <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                        {purchase.supplier?.id ? (
                            <Link
                                href={`/egg-purchases/suppliers/${purchase.supplier.id}`}
                                className="group/supplier inline-block max-w-full"
                                title={`Ver proveedor ${purchase.supplier?.name ?? ""}`}
                            >
                                <h2 className="text-lg font-bold text-slate-900 truncate group-hover/supplier:text-amber-700 group-hover/supplier:underline transition-colors flex items-center gap-1.5">
                                    <span className="truncate">{purchase.supplier?.name ?? "Proveedor"}</span>
                                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover/supplier:opacity-100 text-amber-600 transition-opacity shrink-0" />
                                </h2>
                            </Link>
                        ) : (
                            <h2 className="text-lg font-bold text-slate-900 truncate">
                                {purchase.supplier?.name ?? "Proveedor"}
                            </h2>
                        )}

                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                                {purchase.purchaseNumber ? `Compra N° ${purchase.purchaseNumber}` : "Compra"}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="text-xs text-slate-500 font-semibold">
                                {totalCajones} {totalCajones === 1 ? "cajón" : "cajones"}
                            </span>
                        </div>
                    </div>

                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border shrink-0 ${badgeClass}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {purchase.status}
                    </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    <span>{formatUtcDate(purchase.date)}</span>
                </div>

                {/* Cajones pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                    {items.map((it, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-semibold text-slate-700">
                            {it.label}: <span className="font-bold text-slate-900">{it.qty}</span>
                        </span>
                    ))}
                </div>

                {/* Financial Summary Card */}
                <div className="bg-amber-50/40 rounded-xl p-3.5 space-y-2 border border-amber-200/60 text-xs">
                    <div className="flex justify-between items-center text-slate-600">
                        <span>Costo de Compra:</span>
                        <span className="text-sm font-bold text-slate-900">{formatCurrency(purchase.totalCost)}</span>
                    </div>

                    <div className="flex justify-between items-center text-slate-600">
                        <span>Venta Proyectada:</span>
                        <span className="font-semibold text-indigo-700">{formatCurrency(purchase.expectedRevenue)}</span>
                    </div>

                    <div className="pt-1.5 border-t border-amber-200/70 flex justify-between items-center">
                        <span className="font-bold text-emerald-800 flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                            Ganancia Estimada:
                        </span>
                        <span className={`font-black text-sm ${purchase.estimatedProfit >= 0 ? "text-emerald-700" : "text-rose-600"}`}>
                            {formatCurrency(purchase.estimatedProfit)}
                        </span>
                    </div>

                    <div className="pt-1 border-t border-slate-200/60 flex justify-between items-center text-[11px]">
                        <span className="text-slate-500">Saldo a Pagar al Proveedor:</span>
                        {purchase.status === "PAID" ? (
                            <span className="font-semibold text-emerald-700">Saldado</span>
                        ) : (
                            <span className="font-bold text-rose-600">{formatCurrency(purchase.remainingAmount)}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 gap-2 pt-1">
                <Link href={`/egg-purchases/${purchase.id}`} className="w-full">
                    <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition active:scale-95 cursor-pointer rounded-xl font-bold text-xs h-9 flex items-center justify-center gap-1.5">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver Detalle de Compra</span>
                    </Button>
                </Link>

                {purchase.status !== "PAID" && (
                    <PaymentModal
                        sale={purchase}
                        endpoint="egg-purchases"
                        onSuccess={refresh}
                    >
                        <Button
                            variant="outline"
                            className="w-full border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl font-bold text-xs h-9 flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                        >
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>Pagar / Registrar Pago</span>
                        </Button>
                    </PaymentModal>
                )}
            </div>
        </motion.div>
    );
}
