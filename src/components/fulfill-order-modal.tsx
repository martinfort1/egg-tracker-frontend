"use client";

import { useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, DollarSign, PackageCheck } from "lucide-react";

export default function FulfillOrderModal({
    order,
    onSuccess,
    children,
}: any) {
    const [open, setOpen] = useState(false);
    const [fullyPaid, setFullyPaid] = useState(false);
    const [amountPaid, setAmountPaid] = useState<number | string>(0);

    const total = Number(order.totalAmount) || 0;

    const handleSubmit = async () => {
        const paymentAmount = fullyPaid ? total : Number(amountPaid) || 0;

        if (paymentAmount < 0 || paymentAmount > total) {
            toast.error("Amount paid must be between 0 and total amount");
            return;
        }

        try {
            const res = await api.post(`/orders/${order.id}/fulfill`, {
                amountPaid: paymentAmount,
            });

            toast.success("Order fulfilled and sale registered successfully");
            setOpen(false);
            onSuccess?.(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to fulfill order");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>

            <DialogContent className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl text-slate-900 sm:max-w-md">
                <DialogHeader className="space-y-1">
                    <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <PackageCheck className="w-5 h-5 text-emerald-600" />
                        Complete Delivery
                    </DialogTitle>
                    <p className="text-xs text-slate-500">
                        Convert this order into a completed sale and register received payment
                    </p>
                </DialogHeader>

                <div className="space-y-4 pt-2">
                    {/* Buyer Information Box */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs space-y-1">
                        <span className="text-slate-400 font-medium">Customer</span>
                        <p className="text-sm font-bold text-slate-900">
                            {order.buyer?.name || "Customer not specified"}
                        </p>
                    </div>

                    {/* Total Amount Banner */}
                    <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-4 flex justify-between items-center">
                        <span className="text-sm font-semibold text-emerald-900">Total Order Amount:</span>
                        <span className="text-xl font-black text-emerald-700">
                            {formatCurrency(total)}
                        </span>
                    </div>

                    {/* Fully Paid Toggle */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                            <DollarSign className="w-4 h-4 text-emerald-600" />
                            Was it fully paid upon delivery?
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
                                Partial / Debt
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
                                Fully Paid
                            </button>
                        </div>
                    </div>

                    {!fullyPaid ? (
                        <div className="space-y-1 animate-in fade-in duration-200">
                            <label className="text-xs font-semibold text-slate-600">
                                Amount Paid Now
                            </label>
                            <Input
                                type="number"
                                step="any"
                                value={amountPaid}
                                onChange={(e) => setAmountPaid(e.target.value)}
                                className="h-10 bg-white border border-slate-200 text-slate-900 rounded-xl px-3 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                                placeholder="0"
                            />
                        </div>
                    ) : (
                        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs animate-in fade-in duration-200">
                            <span className="font-medium text-emerald-800">
                                Full payment of {formatCurrency(total)}
                            </span>
                            <span className="font-bold text-emerald-700">No debt</span>
                        </div>
                    )}

                    <Button
                        onClick={handleSubmit}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl h-11 text-sm shadow-sm transition active:scale-95 cursor-pointer mt-2"
                    >
                        Confirm & Complete Delivery
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
