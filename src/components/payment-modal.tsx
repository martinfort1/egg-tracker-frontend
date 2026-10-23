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
import { Plus, DollarSign, CheckCircle2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

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
    const [open, setOpen] = useState(false);
    const [fullyPaid, setFullyPaid] = useState(false);
    const owed = Number(
        owedProp ?? sale?.remainingAmount ?? sale?.amountOwed ?? sale?.owed ?? 0
    );

    const handleSubmit = async () => {
        const paymentAmount = fullyPaid ? owed : amount;

        if (paymentAmount <= 0) {
            toast.error("Invalid amount: must be greater than 0");
            return;
        }

        try {
            const method = isBulkPayment ? "post" : "patch";
            await toast.promise(
                method === "post"
                    ? api.post(endpoint, { amount: paymentAmount, date })
                    : api.patch(`${endpoint}/${sale.id}/payment`, {
                          amount: paymentAmount,
                          date,
                      }),
                {
                    success: "Payment added successfully",
                    loading: "Registering payment...",
                    error: "An error occurred while adding payment",
                }
            );
            onSuccess?.();
            setOpen(false);
            setAmount(0);
            setDate(new Date().toISOString().split("T")[0]);
            setFullyPaid(false);
        } catch (err) {
            console.error(err);
            toast.error("Failed to add payment");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children ? (
                    <div className="cursor-pointer">{children}</div>
                ) : (
                    <Button
                        className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition active:scale-95 gap-1.5 cursor-pointer font-semibold rounded-lg text-xs h-9 shadow-xs"
                        size="sm"
                    >
                        <Plus size={14} /> Add Payment
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl text-slate-900 sm:max-w-md">
                <DialogHeader className="space-y-1">
                    <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-emerald-600" />
                        {isBulkPayment ? "Pay All Orders" : "Register Payment"}
                    </DialogTitle>
                    <p className="text-xs text-slate-500">
                        {isBulkPayment
                            ? "Register a single payment for all unpaid orders"
                            : `Record payment for ${sale?.buyer?.name || `Sale #${sale?.id}`}`}
                    </p>
                </DialogHeader>

                <div className="space-y-4 pt-2">
                    {/* Buyer Information & Debt Info */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex justify-between items-center text-xs">
                        <div>
                            <span className="text-slate-400 font-medium block">
                                {isBulkPayment ? "Scope" : "Customer"}
                            </span>
                            <span className="text-sm font-bold text-slate-900">
                                {!isBulkPayment && sale?.buyer?.name
                                    ? sale.buyer.name
                                    : isBulkPayment
                                    ? "All unpaid orders"
                                    : `Sale #${sale?.id}`}
                            </span>
                        </div>
                        <div className="text-right">
                            <span className="text-slate-400 font-medium block">
                                Current Debt
                            </span>
                            <span className="text-sm font-black text-rose-600">
                                {owed > 0 ? formatCurrency(owed) : "$0"}
                            </span>
                        </div>
                    </div>

                    {/* Fully Paid Toggle */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-700">
                            Pay full remaining debt ({formatCurrency(owed)})?
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => setFullyPaid(false)}
                                className={`py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                                    !fullyPaid
                                        ? "bg-amber-50 border-amber-300 text-amber-800 shadow-xs"
                                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                }`}
                            >
                                Custom Amount
                            </button>
                            <button
                                type="button"
                                onClick={() => setFullyPaid(true)}
                                className={`py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                                    fullyPaid
                                        ? "bg-emerald-600 border-emerald-600 text-white shadow-xs"
                                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                }`}
                            >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Full Debt
                            </button>
                        </div>
                    </div>

                    {/* Amount Input */}
                    {!fullyPaid ? (
                        <div className="space-y-1 animate-in fade-in duration-200">
                            <label className="text-xs font-semibold text-slate-600">
                                Payment Amount
                            </label>
                            <NumericFormat
                                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition-colors outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 shadow-xs"
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
                    ) : (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs animate-in fade-in duration-200">
                            <span className="font-medium text-emerald-800">
                                Paying entire remaining debt
                            </span>
                            <span className="font-bold text-emerald-700">
                                {formatCurrency(owed)}
                            </span>
                        </div>
                    )}

                    {/* Date Input */}
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600">
                            Payment Date
                        </label>
                        <Input
                            className="h-10 bg-white border border-slate-200 text-slate-900 rounded-xl px-3 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    <Button
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl h-11 text-sm shadow-sm transition active:scale-95 cursor-pointer mt-2"
                        onClick={handleSubmit}
                    >
                        Confirm Payment
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
