"use client";

import LoadSpin from "@/components/load-spin";
import { Button } from "@/components/ui/button";
import PaymentModal from "@/components/payment-modal";
import { api } from "@/lib/api";
import {
    MapPin,
    Phone,
    Edit,
    Trash2,
    Plus,
    ArrowLeft,
    Calendar,
    ShoppingCart,
    DollarSign,
    CheckCircle2,
    Clock,
    AlertCircle,
    User,
    FileText,
    Share2,
    TrendingUp,
    Table as TableIcon,
    LayoutGrid,
    Check,
    Eye,
    Box,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { formatCurrency, formatUtcDate } from "@/lib/utils";

export default function EggSupplierStatementPage() {
    const { id } = useParams();
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"ledger" | "cards">("ledger");
    const [filterOnlyDebt, setFilterOnlyDebt] = useState(false);
    const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/egg-purchases/suppliers/${id}/history`);
            setData(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Error al cargar estado de cuenta del proveedor");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleDeletePurchase = async (purchaseId: string) => {
        if (!confirm("¿Eliminar esta compra de huevos?")) return;

        try {
            await api.delete(`/egg-purchases/${purchaseId}`);
            toast.success("Compra eliminada con éxito");
            fetchData();
        } catch (error) {
            toast.error("Error al eliminar compra");
        }
    };

    const handleShareStatement = () => {
        if (!data) return;
        const { supplier, stats, purchases } = data;

        const unpaid = purchases.filter((p: any) => p.status !== "PAID" && p.remainingAmount > 0);

        let unpaidDetails = "";
        if (unpaid.length > 0) {
            unpaidDetails = "\n*Compras con saldo pendiente de pago:*\n" + unpaid.map((p: any) => (
                `• Compra ${p.purchaseNumber ? `N° ${p.purchaseNumber} ` : ""}del ${new Date(p.date).toLocaleDateString()}: Costo ${formatCurrency(p.totalCost)} | Saldo adeudado: ${formatCurrency(p.remainingAmount)}`
            )).join("\n");
        }

        const message = `*ESTADO DE CUENTA — COMPRA DE HUEVOS*
Proveedor: *${supplier.name}*
Fecha: ${new Date().toLocaleDateString()}

*Resumen de Operaciones:*
• Total Compras: ${stats.totalPurchases} operaciones
• Total Comprado: ${formatCurrency(stats.totalCost)}
• Total Pagado: ${formatCurrency(stats.totalPaid)}
• *Saldo Pendiente por Pagar: ${formatCurrency(stats.totalDebt)}*
${unpaidDetails}

Muchas gracias!`;

        const encoded = encodeURIComponent(message);
        window.open(`https://wa.me/${supplier.phone ? supplier.phone.replace(/[^0-9]/g, "") : ""}?text=${encoded}`, "_blank");
        setCopiedWhatsApp(true);
        setTimeout(() => setCopiedWhatsApp(false), 3000);
    };

    if (loading) return <LoadSpin />;
    if (!data) return null;

    const { supplier, stats, purchases } = data;

    const visiblePurchases = filterOnlyDebt
        ? purchases.filter((p: any) => p.status !== "PAID" && p.remainingAmount > 0)
        : purchases;

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

    const formatEggItems = (p: any) => {
        const items = [
            { label: "Extra", qty: p.Extra },
            { label: "N°1", qty: p.N1 },
            { label: "N°2", qty: p.N2 },
            { label: "N°3", qty: p.N3 },
            { label: "N°4", qty: p.N4 },
        ].filter((i) => Number(i.qty) > 0);

        if (items.length === 0) return "Sin detalle";
        return items.map((i) => `${i.label}: ${i.qty}`).join(" • ");
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 pb-12">
            {/* Top Navigation */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <button
                    type="button"
                    onClick={() => router.push("/egg-purchases")}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer self-start"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver a Compra de Huevos
                </button>

                <div className="flex items-center gap-2 flex-wrap">
                    <Button
                        type="button"
                        onClick={handleShareStatement}
                        variant="outline"
                        className="border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold h-9 flex items-center gap-1.5 shadow-2xs"
                    >
                        {copiedWhatsApp ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                        <span>Enviar Estado por WhatsApp</span>
                    </Button>

                    <Link href={`/egg-purchases/new?supplierId=${supplier.id}`}>
                        <Button className="bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold h-9 flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer">
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>+ Nueva Compra a este Proveedor</span>
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Supplier Profile Header Card */}
            <div className="relative bg-white rounded-2xl border border-amber-200/90 shadow-sm overflow-hidden p-6 sm:p-8">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-emerald-600" />

                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-3 py-0.5 rounded-full">
                                Proveedor de Huevos
                            </span>
                            {supplier.isBuyer && (
                                <Link
                                    href={`/buyers/${supplier.id}`}
                                    className="text-xs font-semibold text-indigo-700 hover:underline bg-indigo-50 border border-indigo-200 px-3 py-0.5 rounded-full"
                                >
                                    Ver Perfil de Ventas (También Cliente) →
                                </Link>
                            )}
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-bold text-slate-900">
                            {supplier.name}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600 pt-1">
                            {supplier.phone && (
                                <span className="flex items-center gap-1.5">
                                    <Phone className="w-4 h-4 text-amber-600" />
                                    <span>{supplier.phone}</span>
                                </span>
                            )}
                            {supplier.address && (
                                <span className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 text-amber-600" />
                                    <span>{supplier.address}</span>
                                </span>
                            )}
                        </div>

                        {supplier.notes && (
                            <p className="text-xs text-slate-500 italic max-w-xl">
                                "{supplier.notes}"
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-2 self-start">
                        <Link href={`/buyers/${supplier.id}/edit`}>
                            <Button
                                variant="outline"
                                className="border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold h-9 flex items-center gap-1.5"
                            >
                                <Edit className="w-3.5 h-3.5" />
                                <span>Editar Contacto</span>
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Financial Overview Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Total Comprado</span>
                    <span className="text-xl sm:text-2xl font-black text-slate-900 mt-1 block">
                        {formatCurrency(stats.totalCost)}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">{stats.totalPurchases} compras realizadas</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block">Total Pagado</span>
                    <span className="text-xl sm:text-2xl font-black text-emerald-700 mt-1 block">
                        {formatCurrency(stats.totalPaid)}
                    </span>
                    <span className="text-[11px] text-emerald-600 mt-0.5 block">Pagos emitidos</span>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block">Deuda Pendiente</span>
                    <span className={`text-xl sm:text-2xl font-black mt-1 block ${stats.totalDebt > 0 ? "text-rose-600" : "text-emerald-700"}`}>
                        {stats.totalDebt > 0 ? formatCurrency(stats.totalDebt) : "$0"}
                    </span>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">
                        {stats.totalDebt > 0 ? "Saldo por pagar al proveedor" : "Al día, sin deuda"}
                    </span>
                </div>

                <div className="bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-emerald-500/15 p-5 rounded-2xl border border-emerald-300 shadow-sm">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5" />
                        Ganancia Generada
                    </span>
                    <span className={`text-xl sm:text-2xl font-black mt-1 block ${stats.totalEstimatedProfit >= 0 ? "text-emerald-700" : "text-rose-600"}`}>
                        {formatCurrency(stats.totalEstimatedProfit)}
                    </span>
                    <span className="text-[11px] text-emerald-700 font-semibold mt-0.5 block">
                        Margen limpio proyectado
                    </span>
                </div>
            </div>

            {/* Filter and View Mode Switcher */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setFilterOnlyDebt(!filterOnlyDebt)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 ${
                            filterOnlyDebt
                                ? "bg-rose-50 text-rose-700 border-rose-300"
                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                    >
                        <span className={`w-2 h-2 rounded-full ${filterOnlyDebt ? "bg-rose-500 animate-pulse" : "bg-slate-300"}`} />
                        <span>Solo compras con saldo pendiente</span>
                    </button>
                </div>

                <div className="bg-slate-100 p-0.5 rounded-xl flex items-center border border-slate-200 self-end sm:self-auto">
                    <button
                        type="button"
                        onClick={() => setViewMode("ledger")}
                        className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                            viewMode === "ledger" ? "bg-white text-slate-900 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-900"
                        }`}
                    >
                        <TableIcon className="w-3.5 h-3.5" />
                        <span>Tabla</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setViewMode("cards")}
                        className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                            viewMode === "cards" ? "bg-white text-slate-900 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-900"
                        }`}
                    >
                        <LayoutGrid className="w-3.5 h-3.5" />
                        <span>Tarjetas</span>
                    </button>
                </div>
            </div>

            {/* History Content */}
            {visiblePurchases.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
                    <Box className="w-12 h-12 text-slate-300 mx-auto" />
                    <p className="text-slate-700 font-bold">No hay compras registradas para este proveedor</p>
                    <p className="text-xs text-slate-400">Creá tu primera compra para empezar a llevar el seguimiento.</p>
                </div>
            ) : viewMode === "ledger" ? (
                /* Table / Ledger View */
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                                <tr>
                                    <th className="py-3 px-4">Fecha</th>
                                    <th className="py-3 px-4">N° Compra</th>
                                    <th className="py-3 px-4">Detalle Cajones</th>
                                    <th className="py-3 px-4 text-right">Costo Compra</th>
                                    <th className="py-3 px-4 text-right">Venta Proyectada</th>
                                    <th className="py-3 px-4 text-right">Ganancia</th>
                                    <th className="py-3 px-4 text-right">Saldo Deuda</th>
                                    <th className="py-3 px-4 text-center">Estado</th>
                                    <th className="py-3 px-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {visiblePurchases.map((p: any) => {
                                    const badge = statusBadge[p.status] || {
                                        className: "bg-slate-100 text-slate-700 border-slate-200",
                                        icon: Clock,
                                    };
                                    const StatusIcon = badge.icon;

                                    return (
                                        <tr key={p.id} className="hover:bg-amber-50/25 transition-colors">
                                            <td className="py-3 px-4 font-semibold text-slate-700 whitespace-nowrap">
                                                {formatUtcDate(p.date)}
                                            </td>

                                            <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                                                {p.purchaseNumber ? `N° ${p.purchaseNumber}` : `#${p.id.slice(0, 8)}`}
                                            </td>

                                            <td className="py-3 px-4 text-slate-600 font-medium max-w-xs truncate">
                                                {formatEggItems(p)}
                                            </td>

                                            <td className="py-3 px-4 text-right font-bold text-slate-900 whitespace-nowrap">
                                                {formatCurrency(p.totalCost)}
                                            </td>

                                            <td className="py-3 px-4 text-right font-semibold text-indigo-700 whitespace-nowrap">
                                                {formatCurrency(p.expectedRevenue)}
                                            </td>

                                            <td className={`py-3 px-4 text-right font-extrabold whitespace-nowrap ${p.estimatedProfit >= 0 ? "text-emerald-700" : "text-rose-600"}`}>
                                                {formatCurrency(p.estimatedProfit)}
                                            </td>

                                            <td className="py-3 px-4 text-right font-black whitespace-nowrap">
                                                <span className={p.remainingAmount > 0 ? "text-rose-600" : "text-emerald-700"}>
                                                    {p.remainingAmount > 0 ? formatCurrency(p.remainingAmount) : "$0"}
                                                </span>
                                            </td>

                                            <td className="py-3 px-4 text-center whitespace-nowrap">
                                                {p.status !== "PAID" ? (
                                                    <PaymentModal
                                                        sale={p}
                                                        endpoint="egg-purchases"
                                                        onSuccess={fetchData}
                                                    >
                                                        <button
                                                            type="button"
                                                            title="Hacé clic para pagar"
                                                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 ${badge.className} hover:border-emerald-400 group/status`}
                                                        >
                                                            <StatusIcon className="w-3.5 h-3.5" />
                                                            <span>{p.status}</span>
                                                            <span className="text-[10px] bg-white/90 px-1.5 py-0.5 rounded-md font-bold text-emerald-800 border border-emerald-200 group-hover/status:bg-emerald-600 group-hover/status:text-white transition-colors flex items-center gap-0.5">
                                                                <DollarSign className="w-2.5 h-2.5" />
                                                                <span>Pagar</span>
                                                            </span>
                                                        </button>
                                                    </PaymentModal>
                                                ) : (
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${badge.className}`}>
                                                        <StatusIcon className="w-3.5 h-3.5" />
                                                        <span>{p.status}</span>
                                                    </span>
                                                )}
                                            </td>

                                            <td className="py-3 px-4 text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <Link href={`/egg-purchases/${p.id}`}>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 px-2 text-xs text-slate-600 hover:text-slate-900 rounded-lg cursor-pointer"
                                                            title="Ver detalle"
                                                        >
                                                            <Eye className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </Link>

                                                    <Link href={`/egg-purchases/${p.id}/edit`}>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 px-2 text-xs text-slate-600 hover:text-amber-800 rounded-lg cursor-pointer"
                                                            title="Editar compra"
                                                        >
                                                            <Edit className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </Link>

                                                    <Button
                                                        onClick={() => handleDeletePurchase(p.id)}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 px-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                                                        title="Eliminar compra"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* Cards View */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {visiblePurchases.map((p: any) => (
                        <div
                            key={p.id}
                            className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition space-y-3"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                                        {p.purchaseNumber ? `Compra N° ${p.purchaseNumber}` : "Compra"}
                                    </span>
                                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                        <Calendar className="w-3 h-3 text-slate-400" />
                                        <span>{formatUtcDate(p.date)}</span>
                                    </p>
                                </div>
                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusBadge[p.status]?.className}`}>
                                    {p.status}
                                </span>
                            </div>

                            <p className="text-xs text-slate-600 font-medium">
                                {formatEggItems(p)}
                            </p>

                            <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
                                <div className="flex justify-between text-slate-600">
                                    <span>Costo:</span>
                                    <span className="font-bold text-slate-900">{formatCurrency(p.totalCost)}</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>Venta Est.:</span>
                                    <span className="font-semibold text-indigo-700">{formatCurrency(p.expectedRevenue)}</span>
                                </div>
                                <div className="flex justify-between pt-1 border-t border-slate-200">
                                    <span className="font-bold text-emerald-800">Ganancia:</span>
                                    <span className={`font-black ${p.estimatedProfit >= 0 ? "text-emerald-700" : "text-rose-600"}`}>
                                        {formatCurrency(p.estimatedProfit)}
                                    </span>
                                </div>
                                <div className="flex justify-between pt-1 border-t border-slate-200 text-[11px]">
                                    <span className="text-slate-500">Saldo a Pagar:</span>
                                    <span className={`font-bold ${p.remainingAmount > 0 ? "text-rose-600" : "text-emerald-700"}`}>
                                        {p.remainingAmount > 0 ? formatCurrency(p.remainingAmount) : "Saldado"}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-1">
                                <Link href={`/egg-purchases/${p.id}`} className="flex-1">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full border-slate-200 text-xs font-bold h-8"
                                    >
                                        Ver Detalle
                                    </Button>
                                </Link>

                                {p.status !== "PAID" && (
                                    <PaymentModal
                                        sale={p}
                                        endpoint="egg-purchases"
                                        onSuccess={fetchData}
                                    >
                                        <Button
                                            size="sm"
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold h-8 px-3"
                                        >
                                            Pagar
                                        </Button>
                                    </PaymentModal>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
