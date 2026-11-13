"use client";

import { Button } from "@/components/ui/button";
import {
    Trash2,
    Bird,
    Calendar,
    Building2,
    DollarSign,
    CheckCircle2,
    Clock,
    AlertCircle,
    Truck,
} from "lucide-react";
import { AddChickenDeathForm } from "@/components/add-chicken-death-form";
import PaymentModal from "@/components/payment-modal";
import { formatCurrency, formatNumber, formatUtcDate } from "@/lib/utils";
import { motion } from "framer-motion";

interface ChickenCardProps {
    chicken: any;
    onDelete: (id: string) => void;
    onRefresh: () => void;
}

export function ChickenPurchaseCard({ chicken, onDelete, onRefresh }: ChickenCardProps) {
    const totalDeaths = (chicken.deaths || []).reduce(
        (sum: number, d: any) => sum + (Number(d.amount) || 0),
        0
    );
    const remainingAlive = Math.max(0, chicken.amount - totalDeaths);
    const survivalRate =
        chicken.amount > 0 ? ((remainingAlive / chicken.amount) * 100).toFixed(1) : "0";

    const price = Number(chicken.pricePerChicken) || 0;
    const remainingDebt = Number(chicken.remainingAmount ?? (chicken.totalCost - (chicken.amountPaid || 0)));
    const isPaid = chicken.status === "PAID" || remainingDebt <= 0;

    const chickensPendingToPay = isPaid
        ? 0
        : price > 0
        ? Math.min(chicken.amount, Math.ceil(remainingDebt / price))
        : 0;

    const chickensPaid = Math.max(0, chicken.amount - chickensPendingToPay);
    const percentPaid =
        chicken.totalCost > 0
            ? Math.min(100, Math.max(0, ((chicken.amountPaid || 0) / chicken.totalCost) * 100))
            : 100;

    const statusBadge: Record<string, { className: string; icon: any; label: string }> = {
        PAID: {
            className: "bg-emerald-50 text-emerald-700 border-emerald-200",
            icon: CheckCircle2,
            label: "Lote Saldado",
        },
        PARTIAL: {
            className: "bg-amber-50 text-amber-700 border-amber-200",
            icon: Clock,
            label: "Pago Parcial",
        },
        UNPAID: {
            className: "bg-rose-50 text-rose-700 border-rose-200",
            icon: AlertCircle,
            label: "Pendiente",
        },
    };

    const currentStatus = isPaid ? "PAID" : chicken.status || "UNPAID";
    const badge = statusBadge[currentStatus] || statusBadge.UNPAID;
    const StatusIcon = badge.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="group relative bg-white rounded-2xl border border-amber-200/80 p-5 sm:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden gap-4"
        >
            {/* Top Section Accent Line (Gold / Warm Amber) */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600" />

            <div className="space-y-3.5">
                {/* Header: Lot Number & Supplier & Status Badge */}
                <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                                {chicken.purchaseNumber
                                    ? `Lote N° ${chicken.purchaseNumber}`
                                    : "Lote de Gallinas"}
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="text-xs text-slate-500 font-semibold">
                                {formatNumber(chicken.amount)} gallinas
                            </span>
                        </div>

                        <h2 className="text-lg font-bold text-slate-900 truncate group-hover:text-amber-800 transition-colors flex items-center gap-1.5">
                            <Building2 className="w-4 h-4 text-amber-600 shrink-0" />
                            <span className="truncate">
                                {chicken.supplier?.trim() ? chicken.supplier : "Proveedor no especificado"}
                            </span>
                        </h2>
                    </div>

                    <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border shrink-0 ${badge.className}`}
                    >
                        <StatusIcon className="w-3.5 h-3.5" />
                        {badge.label}
                    </span>
                </div>

                {/* Date */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Fecha de Compra: {formatUtcDate(chicken.date)}</span>
                </div>

                {/* Main Box: Lot Economics & Completion Status */}
                <div className="bg-amber-50/40 rounded-xl p-3.5 space-y-2.5 border border-amber-200/60 text-xs">
                    <div className="flex justify-between items-center text-slate-600">
                        <span>Precio por Gallina:</span>
                        <span className="font-bold text-slate-800">
                            {formatCurrency(chicken.pricePerChicken)}
                        </span>
                    </div>

                    <div className="flex justify-between items-center text-slate-600">
                        <span>Inversión Total del Lote:</span>
                        <span className="text-sm font-extrabold text-slate-900">
                            {formatCurrency(chicken.totalCost)}
                        </span>
                    </div>

                    {/* KEY FEATURE: Cuántas gallinas quedan por pagar para completar el lote */}
                    {isPaid ? (
                        <div className="pt-2 border-t border-emerald-200/70 flex justify-between items-center text-emerald-800 font-bold bg-emerald-50/80 p-2 rounded-lg">
                            <span className="flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                Lote completado al 100%:
                            </span>
                            <span>0 gallinas pendientes</span>
                        </div>
                    ) : (
                        <div className="pt-2 border-t border-amber-200/70 space-y-1.5">
                            <div className="p-2.5 rounded-lg bg-amber-100/70 border border-amber-300 space-y-1">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-amber-950 text-xs">
                                        Quedan por pagar:
                                    </span>
                                    <span className="font-black text-rose-700 text-sm">
                                        {formatNumber(chickensPendingToPay)} gallinas
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-[11px] text-slate-600">
                                    <span>Saldo adeudado:</span>
                                    <span className="font-bold text-rose-600">
                                        {formatCurrency(remainingDebt)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-[11px] text-slate-500 pt-0.5">
                                    <span>Gallinas ya pagadas:</span>
                                    <span className="font-bold text-emerald-700">
                                        {formatNumber(chickensPaid)} gallinas ({formatCurrency(chicken.amountPaid || 0)})
                                    </span>
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="space-y-0.5">
                                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                    <div
                                        className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                                        style={{ width: `${percentPaid}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-[10px] text-slate-400">
                                    <span>Progreso del Lote</span>
                                    <span>{percentPaid.toFixed(0)}% pagado</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Flock Mortality & Vital Stats */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                    <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-2">
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">
                            Vivas
                        </span>
                        <span className="font-bold text-slate-800 text-sm">
                            {formatNumber(remainingAlive)}
                        </span>
                    </div>

                    <div className="bg-rose-50/60 border border-rose-200/60 rounded-xl p-2">
                        <span className="text-[10px] font-bold uppercase text-rose-600 block">
                            Bajas
                        </span>
                        <span className="font-bold text-rose-700 text-sm">
                            {formatNumber(totalDeaths)}
                        </span>
                    </div>

                    <div className="bg-emerald-50/60 border border-emerald-200/60 rounded-xl p-2">
                        <span className="text-[10px] font-bold uppercase text-emerald-700 block">
                            Superv.
                        </span>
                        <span className="font-bold text-emerald-800 text-sm">
                            {survivalRate}%
                        </span>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 gap-2 pt-1 border-t border-slate-100">
                {!isPaid && (
                    <PaymentModal
                        sale={chicken}
                        endpoint="chickens"
                        onSuccess={onRefresh}
                    >
                        <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-xs h-9 flex items-center justify-center gap-1.5 shadow-2xs transition active:scale-95 cursor-pointer">
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>Pagar / Abonar al Lote</span>
                        </Button>
                    </PaymentModal>
                )}

                <div className="flex gap-2">
                    <div className="flex-1">
                        <AddChickenDeathForm chickenId={chicken.id} onSuccess={onRefresh} />
                    </div>

                    <Button
                        variant="outline"
                        onClick={() => onDelete(chicken.id)}
                        className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 border-slate-200 hover:border-rose-200 rounded-xl transition active:scale-95 cursor-pointer h-9 px-3"
                        title="Eliminar lote"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}
