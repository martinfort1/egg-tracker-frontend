"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import {
    History,
    Calendar,
    Receipt,
    DollarSign,
    CheckCircle2,
    Clock,
    MessageSquare,
    AlertCircle,
} from "lucide-react";
import { formatCurrency, formatUtcDate } from "@/lib/utils";
import LoadSpin from "./load-spin";

interface PaymentRecord {
    id: string;
    amount: number;
    date: string;
    note?: string | null;
    createdAt?: string;
}

interface PaymentHistoryModalProps {
    item: any;
    endpoint?: string;
    children?: React.ReactNode;
    onPaymentUpdated?: () => void;
}

export default function PaymentHistoryModal({
    item,
    endpoint = "feed-bags",
    children,
}: PaymentHistoryModalProps) {
    const [open, setOpen] = useState(false);
    const [payments, setPayments] = useState<PaymentRecord[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchHistory = async () => {
        if (!item?.id) return;
        setLoading(true);
        try {
            const res = await api.get(`/${endpoint}/${item.id}/payments`);
            setPayments(res.data || []);
        } catch (err) {
            console.error("Error fetching payment history", err);
            // Fallback to item.payments if available
            if (item.payments) {
                setPayments(item.payments);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            fetchHistory();
        }
    }, [open, item?.id]);

    const purchaseTitle = item?.purchaseNumber
        ? `Compra N° ${item.purchaseNumber}`
        : item?.saleNumber
        ? `Venta N° ${item.saleNumber}`
        : `Operación #${item?.id?.slice(0, 8)}`;

    const paymentsCount = payments.length > 0 ? payments.length : (item?.payments?.length ?? (item?.amountPaid > 0 ? 1 : 0));

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children ? (
                    <div className="cursor-pointer">{children}</div>
                ) : (
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 px-2.5 text-xs font-semibold border-slate-200 text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/50 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        title="Ver historial de pagos"
                    >
                        <History className="w-3.5 h-3.5 text-slate-500" />
                        <span>Historial ({paymentsCount})</span>
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-slate-900 sm:max-w-lg max-h-[85vh] overflow-y-auto">
                <DialogHeader className="space-y-1.5 pb-3 border-b border-slate-100">
                    <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-orange-50 text-orange-700 border border-orange-200">
                            <History className="w-3.5 h-3.5" />
                            Historial de Pagos
                        </span>

                        <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md">
                            {purchaseTitle}
                        </span>
                    </div>

                    <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2 pt-1">
                        <Receipt className="w-5 h-5 text-orange-600" />
                        Registro de Pagos y Abonos
                    </DialogTitle>

                    <p className="text-xs text-slate-500">
                        Detalle de todas las entregas de dinero registradas para esta compra con fecha y comentarios.
                    </p>
                </DialogHeader>

                {/* Operation Financial Summary */}
                <div className="bg-slate-50/90 rounded-xl p-3.5 border border-slate-200/80 grid grid-cols-3 gap-2 text-xs">
                    <div>
                        <span className="text-slate-400 font-medium block text-[10px] uppercase">Facturado</span>
                        <span className="font-bold text-slate-900 text-sm">
                            {formatCurrency(item?.totalAmount ?? 0)}
                        </span>
                    </div>
                    <div>
                        <span className="text-slate-400 font-medium block text-[10px] uppercase">Total Abonado</span>
                        <span className="font-bold text-emerald-700 text-sm">
                            {formatCurrency(item?.amountPaid ?? 0)}
                        </span>
                    </div>
                    <div>
                        <span className="text-slate-400 font-medium block text-[10px] uppercase">Saldo Deuda</span>
                        <span className={`font-black text-sm ${
                            (item?.remainingAmount ?? 0) > 0 ? "text-rose-600" : "text-emerald-700"
                        }`}>
                            {(item?.remainingAmount ?? 0) > 0
                                ? formatCurrency(item.remainingAmount)
                                : "$0 (Saldado)"}
                        </span>
                    </div>
                </div>

                {/* Payments List */}
                <div className="space-y-3 pt-1">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            Pagos Registrados ({payments.length})
                        </h3>
                    </div>

                    {loading ? (
                        <div className="py-8">
                            <LoadSpin />
                        </div>
                    ) : payments.length === 0 ? (
                        <div className="text-center py-8 bg-slate-50/60 rounded-xl border border-dashed border-slate-200 space-y-2">
                            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
                            <p className="text-sm font-semibold text-slate-600">
                                Sin pagos registrados
                            </p>
                            <p className="text-xs text-slate-400 max-w-xs mx-auto">
                                Todavía no se ha registrado ningún pago para esta orden.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2.5 max-h-[40vh] overflow-y-auto pr-1">
                            {payments.map((payment, index) => (
                                <div
                                    key={payment.id || index}
                                    className="bg-white rounded-xl border border-slate-200/90 hover:border-emerald-200 p-3.5 shadow-2xs space-y-2 transition-all"
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-black text-xs shrink-0">
                                                #{payments.length - index}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                    <span>{formatUtcDate(payment.date)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <span className="text-sm font-black text-emerald-700 bg-emerald-50/70 border border-emerald-100 px-2.5 py-1 rounded-lg">
                                            +{formatCurrency(payment.amount)}
                                        </span>
                                    </div>

                                    {/* Note / Comment Display */}
                                    {payment.note ? (
                                        <div className="flex items-start gap-2 bg-slate-50 rounded-lg p-2 text-xs border border-slate-100">
                                            <MessageSquare className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                                            <span className="text-slate-700 font-medium italic">
                                                &ldquo;{payment.note}&rdquo;
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="text-[11px] text-slate-400 italic pl-1">
                                            Sin comentarios agregados
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-end">
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
