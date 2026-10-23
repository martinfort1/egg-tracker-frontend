"use client";

import { useState, useEffect, useMemo } from "react";
import { api } from "@/lib/api";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
    History,
    Calendar,
    Receipt,
    DollarSign,
    CheckCircle2,
    Clock,
    MessageSquare,
    Search,
    Printer,
    FileSpreadsheet,
    ArrowUpRight,
    Package,
} from "lucide-react";
import { formatCurrency, formatUtcDate } from "@/lib/utils";
import LoadSpin from "./load-spin";
import Link from "next/link";

interface FeedBagPaymentWithBag {
    id: string;
    amount: number;
    date: string;
    note?: string | null;
    createdAt?: string;
    feedBag?: {
        id: string;
        purchaseNumber?: number;
        date: string;
        amount: number;
        phase: number;
        price: number;
        totalAmount: number;
        remainingAmount: number;
        status: string;
    };
}

export default function AllFeedPaymentsModal({
    children,
}: {
    children?: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const [payments, setPayments] = useState<FeedBagPaymentWithBag[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    const fetchAllPayments = async () => {
        setLoading(true);
        try {
            const res = await api.get("/feed-bags/payments/all");
            setPayments(res.data || []);
        } catch (err) {
            console.error("Error fetching all feed payments", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            fetchAllPayments();
        }
    }, [open]);

    // Calculate totals
    const totalPaid = useMemo(() => {
        return payments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
    }, [payments]);

    // Filter payments
    const filteredPayments = useMemo(() => {
        const query = search.toLowerCase().trim();
        if (!query) return payments;

        return payments.filter((p) => {
            const noteMatch = p.note?.toLowerCase().includes(query);
            const purchaseNumMatch = p.feedBag?.purchaseNumber?.toString().includes(query);
            const amountMatch = p.amount.toString().includes(query);
            const dateMatch = formatUtcDate(p.date).toLowerCase().includes(query);
            return noteMatch || purchaseNumMatch || amountMatch || dateMatch;
        });
    }, [payments, search]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children ? (
                    <div className="cursor-pointer">{children}</div>
                ) : (
                    <Button className="bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl text-xs h-10 px-4 flex items-center gap-2 shadow-sm cursor-pointer transition active:scale-95">
                        <History className="w-4 h-4" />
                        <span>Historial Completo de Pagos</span>
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-slate-900 sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader className="space-y-2 pb-3 border-b border-slate-100">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-50 text-orange-700 border border-orange-200">
                            <History className="w-3.5 h-3.5" />
                            Control de Pagos a Proveedores
                        </span>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.print()}
                            className="h-8 px-3 text-xs font-semibold rounded-lg flex items-center gap-1.5 border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
                        >
                            <Printer className="w-3.5 h-3.5 text-slate-500" />
                            <span>Imprimir / PDF</span>
                        </Button>
                    </div>

                    <div>
                        <DialogTitle className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2 pt-1">
                            <Receipt className="w-6 h-6 text-orange-600" />
                            Historial Completo de Pagos de Alimento
                        </DialogTitle>
                        <p className="text-xs text-slate-500 mt-1">
                            Consolidado general de todos los abonos y pagos realizados para compras de alimento balanceado con sus fechas, compras vinculadas y notas.
                        </p>
                    </div>
                </DialogHeader>

                {/* Metrics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 space-y-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                            Total Histórico Abonado
                        </span>
                        <span className="text-xl font-black text-emerald-700">
                            {formatCurrency(totalPaid)}
                        </span>
                    </div>

                    <div className="bg-orange-50/70 border border-orange-200 rounded-xl p-3.5 space-y-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-800 block">
                            Cantidad Total de Pagos
                        </span>
                        <span className="text-xl font-black text-orange-900">
                            {payments.length} <span className="text-xs font-semibold text-slate-500">registros</span>
                        </span>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                            Promedio por Pago
                        </span>
                        <span className="text-xl font-black text-slate-900">
                            {payments.length > 0
                                ? formatCurrency(Math.round(totalPaid / payments.length))
                                : "$0"}
                        </span>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative pt-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                        type="text"
                        placeholder="Buscar por comentario/nota, N° de compra, fecha..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 h-10 rounded-xl bg-slate-50 border-slate-200 text-xs focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                    />
                </div>

                {/* Payments Table / List */}
                <div className="space-y-3">
                    {loading ? (
                        <div className="py-12">
                            <LoadSpin />
                        </div>
                    ) : filteredPayments.length === 0 ? (
                        <div className="text-center py-12 bg-slate-50/60 rounded-xl border border-dashed border-slate-200 space-y-2">
                            <Receipt className="w-10 h-10 text-slate-300 mx-auto" />
                            <p className="text-sm font-semibold text-slate-700">
                                No se encontraron pagos
                            </p>
                            <p className="text-xs text-slate-400 max-w-sm mx-auto">
                                {search
                                    ? "No hay resultados para la búsqueda ingresada."
                                    : "Todavía no se ha registrado ningún pago en el sistema."}
                            </p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                            <div className="overflow-x-auto max-h-[48vh]">
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 sticky top-0 z-10">
                                        <tr>
                                            <th className="py-3 px-4">Fecha de Pago</th>
                                            <th className="py-3 px-4">Operación</th>
                                            <th className="py-3 px-4">Detalle de Compra</th>
                                            <th className="py-3 px-4 text-right">Monto Abonado</th>
                                            <th className="py-3 px-4">Nota / Comentario</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {filteredPayments.map((p, index) => {
                                            const bag = p.feedBag;
                                            const purchaseLabel = bag?.purchaseNumber
                                                ? `Compra N° ${bag.purchaseNumber}`
                                                : `Compra #${p.feedBag?.id?.slice(0, 8) || "N/A"}`;

                                            return (
                                                <tr
                                                    key={p.id || index}
                                                    className="hover:bg-orange-50/20 transition-colors"
                                                >
                                                    <td className="py-3 px-4 font-semibold text-slate-800 whitespace-nowrap">
                                                        <div className="flex items-center gap-1.5">
                                                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                            <span>{formatUtcDate(p.date)}</span>
                                                        </div>
                                                    </td>

                                                    <td className="py-3 px-4 whitespace-nowrap">
                                                        {bag ? (
                                                            <Link
                                                                href={`/feed-bags/${bag.id}`}
                                                                className="font-bold text-slate-900 hover:text-orange-600 inline-flex items-center gap-1 transition-colors"
                                                            >
                                                                <span>{purchaseLabel}</span>
                                                                <ArrowUpRight className="w-3 h-3 text-slate-400" />
                                                            </Link>
                                                        ) : (
                                                            <span className="text-slate-400">{purchaseLabel}</span>
                                                        )}
                                                    </td>

                                                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                                                        {bag ? (
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="font-semibold text-slate-800">
                                                                    {bag.amount} bolsas
                                                                </span>
                                                                <span className="text-slate-300">•</span>
                                                                <span className="bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded text-[10px] font-bold border border-orange-200">
                                                                    Fase {bag.phase}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            "-"
                                                        )}
                                                    </td>

                                                    <td className="py-3 px-4 text-right whitespace-nowrap">
                                                        <span className="font-black text-emerald-700 text-sm bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md">
                                                            +{formatCurrency(p.amount)}
                                                        </span>
                                                    </td>

                                                    <td className="py-3 px-4 max-w-xs">
                                                        {p.note ? (
                                                            <div className="inline-flex items-start gap-1.5 bg-slate-50 border border-slate-200/70 rounded-lg px-2.5 py-1 text-slate-700 font-medium italic text-[11px]">
                                                                <MessageSquare className="w-3 h-3 text-indigo-500 shrink-0 mt-0.5" />
                                                                <span>&ldquo;{p.note}&rdquo;</span>
                                                            </div>
                                                        ) : (
                                                            <span className="text-slate-400 italic text-[11px]">
                                                                Sin nota
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span>
                        Mostrando {filteredPayments.length} de {payments.length} pagos registrados
                    </span>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        className="text-xs font-semibold rounded-xl cursor-pointer"
                    >
                        Cerrar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
