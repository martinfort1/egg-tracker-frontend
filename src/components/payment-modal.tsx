"use client";

import { api } from "@/lib/api";
import { useState } from "react";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";
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
    Plus,
    DollarSign,
    CheckCircle2,
    Receipt,
    Calendar,
    ArrowRight,
    FileText,
    CreditCard,
} from "lucide-react";
import { formatCurrency, formatUtcDate } from "@/lib/utils";

export default function PaymentModal({
    sale,
    onSuccess,
    endpoint = "sales",
    owed: owedProp,
    className,
    children,
    isBulkPayment = false,
}: any) {
    const [amount, setAmount] = useState<number>(0);
    const [date, setDate] = useState<string>(
        new Date().toISOString().split("T")[0]
    );
    const [note, setNote] = useState<string>("");
    const [open, setOpen] = useState(false);
    const [fullyPaid, setFullyPaid] = useState(true);

    const owed = Number(
        owedProp ?? sale?.remainingAmount ?? sale?.amountOwed ?? sale?.owed ?? 0
    );

    // Identify transaction type
    const isFeedBag =
        endpoint.includes("feed-bags") ||
        sale?.phase !== undefined ||
        sale?.price !== undefined;

    const isEggSale = !isFeedBag && !isBulkPayment;

    const orderNumberText = isFeedBag
        ? (sale?.purchaseNumber ? `Compra N° ${sale.purchaseNumber}` : `Compra #${sale?.id?.slice(0, 8)}`)
        : isEggSale
        ? (sale?.saleNumber ? `Venta N° ${sale.saleNumber}` : `Venta #${sale?.id?.slice(0, 8)}`)
        : "Liquidación General";

    const paymentAmount = fullyPaid ? owed : amount;
    const remainingAfter = Math.max(0, owed - paymentAmount);

    const handleSubmit = async () => {
        if (paymentAmount <= 0) {
            toast.error("El monto a abonar debe ser mayor a 0");
            return;
        }

        try {
            const method = isBulkPayment ? "post" : "patch";
            await toast.promise(
                method === "post"
                    ? api.post(endpoint, { amount: paymentAmount, date, note: note.trim() || undefined })
                    : api.patch(`${endpoint}/${sale.id}/payment`, {
                          amount: paymentAmount,
                          date,
                          note: note.trim() || undefined,
                      }),
                {
                    success: "Orden de pago registrada con éxito",
                    loading: "Procesando pago de la orden...",
                    error: "Ocurrió un error al registrar el pago",
                }
            );
            onSuccess?.();
            setOpen(false);
            setAmount(0);
            setNote("");
            setDate(new Date().toISOString().split("T")[0]);
            setFullyPaid(true);
        } catch (err) {
            console.error(err);
            toast.error("Error al registrar el pago");
        }
    };

    // Format egg items if present
    const eggItems = isEggSale
        ? [
              { label: "Extra", qty: sale?.Extra, price: sale?.ExtraPrice },
              { label: "N° 1", qty: sale?.N1, price: sale?.N1Price },
              { label: "N° 2", qty: sale?.N2, price: sale?.N2Price },
              { label: "N° 3", qty: sale?.N3, price: sale?.N3Price },
              { label: "N° 4", qty: sale?.N4, price: sale?.N4Price },
          ].filter((it) => Number(it.qty) > 0)
        : [];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children ? (
                    <div className="cursor-pointer">{children}</div>
                ) : (
                    <Button
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition active:scale-95 gap-1.5 cursor-pointer font-semibold rounded-lg text-xs h-9 shadow-2xs"
                        size="sm"
                    >
                        <Plus size={14} /> Registrar Pago
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-slate-900 sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader className="space-y-1.5 pb-2 border-b border-slate-100">
                    <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Receipt className="w-3.5 h-3.5" />
                            Orden de Pago
                        </span>

                        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md">
                            {orderNumberText}
                        </span>
                    </div>

                    <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2 pt-1">
                        <CreditCard className="w-5 h-5 text-emerald-600" />
                        {isBulkPayment ? "Liquidación General de Deuda" : "Comprobante / Orden de Pago"}
                    </DialogTitle>

                    <p className="text-xs text-slate-500">
                        {isBulkPayment
                            ? "Registrar un pago global a cuenta de todas las órdenes pendientes"
                            : `Liquidación de pago para la operación correspondiente a ${sale?.buyer?.name ? `cliente ${sale.buyer.name}` : isFeedBag ? "compra de alimento balanceado" : orderNumberText}`}
                    </p>
                </DialogHeader>

                <div className="space-y-4 pt-2">
                    {/* Official Order Summary Card (Ficha de la Orden con todos los datos) */}
                    <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 pb-1.5 border-b border-slate-200/80">
                            <span className="flex items-center gap-1">
                                <FileText className="w-3.5 h-3.5 text-slate-400" />
                                Datos de la Orden Original
                            </span>
                            {sale?.date && (
                                <span className="text-slate-600 font-semibold flex items-center gap-1">
                                    <Calendar className="w-3 h-3 text-slate-400" />
                                    {formatUtcDate(sale.date)}
                                </span>
                            )}
                        </div>

                        {/* Order specifics */}
                        {isFeedBag ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                                <div className="bg-white p-2 rounded-lg border border-slate-200/70">
                                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Concepto</span>
                                    <span className="font-bold text-slate-900">Alimento Fase {sale?.phase ?? "N/A"}</span>
                                </div>
                                <div className="bg-white p-2 rounded-lg border border-slate-200/70">
                                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Cantidad</span>
                                    <span className="font-bold text-slate-900">{sale?.amount ?? 0} Bolsas</span>
                                </div>
                                <div className="bg-white p-2 rounded-lg border border-slate-200/70">
                                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Precio Unitario</span>
                                    <span className="font-bold text-slate-900">{formatCurrency(sale?.price ?? 0)}</span>
                                </div>
                            </div>
                        ) : isEggSale && eggItems.length > 0 ? (
                            <div className="bg-white p-2.5 rounded-lg border border-slate-200/70 text-xs space-y-1">
                                <span className="text-slate-400 block text-[10px] uppercase font-bold">Detalle de Huevos:</span>
                                <div className="flex flex-wrap gap-2">
                                    {eggItems.map((item, i) => (
                                        <span key={i} className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded text-[11px] font-semibold">
                                            {item.label}: {item.qty} × {formatCurrency(item.price)}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ) : isEggSale && sale?.buyer?.name ? (
                            <div className="bg-white p-2 rounded-lg border border-slate-200/70 text-xs flex justify-between items-center">
                                <span className="text-slate-400 text-[10px] uppercase font-bold">Cliente</span>
                                <span className="font-bold text-slate-900">{sale.buyer.name}</span>
                            </div>
                        ) : null}

                        {/* Financial Ledger Breakdown of the Order */}
                        <div className="pt-2 border-t border-slate-200/80 space-y-1.5 text-xs">
                            {sale?.totalAmount !== undefined && (
                                <div className="flex justify-between items-center text-slate-600">
                                    <span>Total Facturado de la Orden:</span>
                                    <span className="font-bold text-slate-900">{formatCurrency(sale.totalAmount)}</span>
                                </div>
                            )}
                            {sale?.amountPaid !== undefined && (
                                <div className="flex justify-between items-center text-slate-600">
                                    <span>Abonado Previamente:</span>
                                    <span className="font-semibold text-emerald-700">{formatCurrency(sale.amountPaid)}</span>
                                </div>
                            )}
                            <div className="pt-1.5 border-t border-slate-200 flex justify-between items-center">
                                <span className="font-bold text-slate-800">Saldo Adeudado Actual:</span>
                                <span className="font-black text-sm text-rose-600">{formatCurrency(owed)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Execution Section */}
                    <div className="space-y-3 pt-1">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                            Modalidad de Pago para esta Orden:
                        </label>

                        {/* Full vs Partial selector */}
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setFullyPaid(true)}
                                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                                    fullyPaid
                                        ? "bg-emerald-600 border-emerald-600 text-white shadow-2xs"
                                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                }`}
                            >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Saldar Deuda ({formatCurrency(owed)})
                            </button>

                            <button
                                type="button"
                                onClick={() => setFullyPaid(false)}
                                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                                    !fullyPaid
                                        ? "bg-amber-500 border-amber-500 text-white shadow-2xs"
                                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                }`}
                            >
                                Pago Parcial
                            </button>
                        </div>

                        {/* Custom amount input if partial */}
                        {!fullyPaid && (
                            <div className="space-y-1 animate-in fade-in duration-200">
                                <label className="text-xs font-semibold text-slate-600">
                                    Monto a Abonar ($)
                                </label>
                                <NumericFormat
                                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-900 transition-colors outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-2xs"
                                    thousandSeparator="."
                                    decimalSeparator=","
                                    allowNegative={false}
                                    placeholder="0"
                                    value={amount}
                                    onValueChange={(values) =>
                                        setAmount(values.floatValue ?? 0)
                                    }
                                    customInput={Input}
                                    type="text"
                                    inputMode="decimal"
                                />
                            </div>
                        )}

                        {/* Payment Date */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600">
                                Fecha de Emisión del Pago
                            </label>
                            <Input
                                className="h-10 bg-white border border-slate-200 text-slate-900 rounded-xl px-3 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-2xs"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>

                        {/* Note / Comment */}
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-600 flex items-center justify-between">
                                <span>Nota o Comentario</span>
                                <span className="text-[10px] text-slate-400 font-normal">Opcional</span>
                            </label>
                            <Input
                                className="h-10 bg-white border border-slate-200 text-slate-900 rounded-xl px-3 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-2xs placeholder:text-slate-400"
                                type="text"
                                placeholder="Ej: Transferencia Banco Galicia, Cheque N° 1234, Efectivo..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </div>

                        {/* Live Calculation / Order Settlement Preview */}
                        <div className="bg-slate-100/90 rounded-xl p-3 border border-slate-200/90 space-y-2 text-xs">
                            <div className="flex justify-between items-center text-slate-600">
                                <span>Saldo Adeudado Antes:</span>
                                <span className="font-semibold text-slate-800">{formatCurrency(owed)}</span>
                            </div>
                            <div className="flex justify-between items-center text-emerald-700 font-medium">
                                <span className="flex items-center gap-1">
                                    <ArrowRight className="w-3 h-3 text-emerald-600" />
                                    Monto a Abonar Ahora:
                                </span>
                                <span className="font-bold">-{formatCurrency(paymentAmount)}</span>
                            </div>
                            <div className="pt-2 border-t border-slate-200 flex justify-between items-center font-bold">
                                <span className="text-slate-800">Saldo Restante Posterior:</span>
                                <span className={remainingAfter > 0 ? "text-rose-600 font-black text-sm" : "text-emerald-700 font-black text-sm"}>
                                    {remainingAfter > 0 ? formatCurrency(remainingAfter) : "$0 (Saldado)"}
                                </span>
                            </div>

                            {remainingAfter <= 0 && paymentAmount > 0 && (
                                <div className="mt-1 p-2 bg-emerald-50 text-emerald-800 rounded-lg text-center font-bold text-xs flex items-center justify-center gap-1.5 border border-emerald-200">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                    ¡La orden quedará completamente cancelada sin deuda restante!
                                </div>
                            )}
                        </div>

                        {/* Submit Order Action Button */}
                        <Button
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl h-12 text-sm shadow-sm transition active:scale-95 cursor-pointer mt-2 flex items-center justify-center gap-2"
                            onClick={handleSubmit}
                        >
                            <Receipt className="w-4 h-4" />
                            Confirmar y Registrar Orden de Pago
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
