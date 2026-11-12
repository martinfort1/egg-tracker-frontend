"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import LoadSpin from "@/components/load-spin";
import PaymentModal from "@/components/payment-modal";
import { formatCurrency, formatUtcDate } from "@/lib/utils";
import Link from "next/link";
import {
    ArrowLeft,
    Calendar,
    Box,
    DollarSign,
    CheckCircle2,
    Clock,
    AlertCircle,
    Edit,
    Trash2,
} from "lucide-react";

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
    createdAt: string;
    updatedAt: string;
}

export default function CartonDetailPage() {
    const router = useRouter();
    const [carton, setCarton] = useState<Carton | null>(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const cartonId = Array.isArray(id) ? id[0] : id;

    const fetchCarton = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/cartons/${cartonId}`);
            setCarton(response.data);
        } catch (error) {
            toast.error("Error al cargar datos del cartón");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (cartonId) {
            fetchCarton();
        }
    }, [cartonId]);

    const handleDelete = async () => {
        if (!confirm("¿Estás seguro de que deseas eliminar esta compra de cartones?")) return;

        try {
            await api.delete(`/cartons/${cartonId}`);
            toast.success("Compra de cartones eliminada exitosamente");
            router.push("/cartons");
        } catch (error) {
            toast.error("Error al eliminar compra de cartones");
        }
    };

    const statusBadge: Record<string, { className: string; icon: any; label: string }> = {
        PAID: {
            className: "bg-emerald-50 text-emerald-700 border-emerald-200",
            icon: CheckCircle2,
            label: "Totalmente Pagado",
        },
        PARTIAL: {
            className: "bg-amber-50 text-amber-700 border-amber-200",
            icon: Clock,
            label: "Pago Parcial",
        },
        UNPAID: {
            className: "bg-rose-50 text-rose-700 border-rose-200",
            icon: AlertCircle,
            label: "Pendiente de Pago",
        },
    };

    if (loading) {
        return (
            <div className="py-20 flex justify-center">
                <LoadSpin />
            </div>
        );
    }

    if (!carton) {
        return (
            <div className="max-w-xl mx-auto py-20 text-center">
                <p className="text-slate-500">Compra de cartones no encontrada</p>
                <Button
                    onClick={() => router.push("/cartons")}
                    className="mt-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl"
                >
                    Volver a Cartones
                </Button>
            </div>
        );
    }

    const totalQuantity =
        (Number(carton.bigCartonsQuantity ?? 0) + Number(carton.smallCartonsQuantity ?? 0)) ||
        Number(carton.quantity ?? 0);

    const badge = statusBadge[carton.status] || {
        className: "bg-slate-100 text-slate-700 border-slate-200",
        icon: Clock,
        label: carton.status,
    };
    const StatusIcon = badge.icon;

    const bigSubtotal = Number(carton.bigCartonsQuantity ?? 0) * Number(carton.bigCartonPrice ?? 0);
    const smallSubtotal =
        Number(carton.smallCartonsQuantity ?? 0) * Number(carton.smallCartonPrice ?? 0);

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-12">
            {/* Header Navigation */}
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => router.push("/cartons")}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver al Listado
                </button>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Compra de Cartones
                </span>
            </div>

            {/* Main Details Card */}
            <div className="relative bg-white rounded-2xl border border-amber-100/90 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
                {/* Top Section Accent Line (Amber / Orange) */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500" />

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${badge.className}`}>
                                <StatusIcon className="w-3.5 h-3.5" />
                                {badge.label}
                            </span>
                            <span className="text-xs text-slate-400">
                                {formatUtcDate(carton.date)}
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-semibold text-slate-900">
                            Detalle de Compra de Cartones
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Total de {totalQuantity} cartones adquiridos
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {carton.status !== "PAID" && (
                            <PaymentModal
                                sale={carton}
                                endpoint="cartons"
                                onSuccess={fetchCarton}
                            >
                                <Button className="bg-amber-500 hover:bg-amber-600 text-white rounded-xl px-4 py-2 text-xs font-semibold shadow-sm transition active:scale-95 cursor-pointer">
                                    <DollarSign className="w-3.5 h-3.5 mr-1" />
                                    Registrar Pago
                                </Button>
                            </PaymentModal>
                        )}
                        <Link href={`/cartons/${carton.id}/edit`}>
                            <Button className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl px-4 py-2 text-xs font-semibold shadow-sm transition active:scale-95 cursor-pointer flex items-center gap-1.5">
                                <Edit className="w-3.5 h-3.5" />
                                Modificar
                            </Button>
                        </Link>
                        <Button
                            onClick={handleDelete}
                            variant="outline"
                            className="border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 rounded-xl px-4 py-2 text-xs font-semibold transition active:scale-95 cursor-pointer flex items-center gap-1.5"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            Eliminar
                        </Button>
                    </div>
                </div>

                {/* Financial Summary 3-Card Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-amber-50/50 rounded-2xl border border-amber-200/60 p-4">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                            Costo Total
                        </span>
                        <p className="text-2xl font-black text-slate-900 mt-1">
                            {formatCurrency(carton.totalAmount)}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {totalQuantity} unidades totales
                        </p>
                    </div>

                    <div className="bg-emerald-50/50 rounded-2xl border border-emerald-200/60 p-4">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                            Monto Pagado
                        </span>
                        <p className="text-2xl font-black text-emerald-700 mt-1">
                            {formatCurrency(carton.amountPaid)}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Abonado hasta la fecha
                        </p>
                    </div>

                    <div className="bg-rose-50/40 rounded-2xl border border-rose-200/60 p-4">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800">
                            Saldo Pendiente
                        </span>
                        <p className={`text-2xl font-black mt-1 ${carton.remainingAmount === 0 ? "text-emerald-700" : "text-rose-600"}`}>
                            {carton.remainingAmount === 0 ? "Saldado" : formatCurrency(carton.remainingAmount)}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Deuda actual de la compra
                        </p>
                    </div>
                </div>

                {/* Cartons Breakdown Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Grandes */}
                    <div className="rounded-2xl border border-amber-200/80 bg-white p-5 space-y-3 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Box className="w-4 h-4 text-amber-600" />
                                <h3 className="font-bold text-slate-900 text-sm">
                                    Cartones Grandes
                                </h3>
                            </div>
                            <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                                {carton.bigCartonsQuantity ?? 0} u.
                            </span>
                        </div>

                        <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                            <div className="flex justify-between">
                                <span>Precio Unitario:</span>
                                <span className="font-semibold text-slate-800">
                                    {formatCurrency(carton.bigCartonPrice)}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm pt-1 border-t border-slate-100 font-bold text-slate-900">
                                <span>Subtotal Grandes:</span>
                                <span>{formatCurrency(bigSubtotal)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Chicos */}
                    <div className="rounded-2xl border border-orange-200/80 bg-white p-5 space-y-3 shadow-2xs">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Box className="w-4 h-4 text-orange-600" />
                                <h3 className="font-bold text-slate-900 text-sm">
                                    Cartones Chicos
                                </h3>
                            </div>
                            <span className="text-xs font-bold text-orange-800 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
                                {carton.smallCartonsQuantity ?? 0} u.
                            </span>
                        </div>

                        <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                            <div className="flex justify-between">
                                <span>Precio Unitario:</span>
                                <span className="font-semibold text-slate-800">
                                    {formatCurrency(carton.smallCartonPrice)}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm pt-1 border-t border-slate-100 font-bold text-slate-900">
                                <span>Subtotal Chicos:</span>
                                <span>{formatCurrency(smallSubtotal)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
