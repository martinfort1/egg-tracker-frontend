"use client"

import { api } from "@/lib/api";
import { useState } from "react"
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function PaymentModal ({ sale, onSuccess, endpoint = 'sales', owed: owedProp, className, children }: any) {
    const [amount, setAmount] = useState<number>(0);
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [open, setOpen] = useState(false);
    const [fullyPaid, setFullyPaid] = useState(false);
    const owed = Number(owedProp ?? sale?.remainingAmount ?? sale?.amountOwed ?? sale?.owed ?? 0);

    const handleSubmit = async ()=>{
        const paymentAmount = fullyPaid ? owed : amount;
        
        if (paymentAmount <= 0) {
            toast.error("Invalid amount: must be greater than 0");
            return;
        }

        try {
            await toast.promise(
                api.patch(`${endpoint}/${sale.id}/payment`, { amount: paymentAmount, date }),
                {
                    success: "Payment added",
                    loading: "Adding payment",
                    error: "An error occurred"
                }
            );
            onSuccess?.();
            setOpen(false); // Close the dialog after success
            setAmount(0); // Reset amount
            setDate(new Date().toISOString().split('T')[0]); // Reset date
            setFullyPaid(false); // Reset fully paid toggle
        } catch (err) {
            console.error(err);
            toast.error("Failed to add payment");
        }
    }

    return(
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children ? (
                    <Button className={'bg-linear-to-r from-green-500/35 to-green-950/40 hover:bg-gray-800 hover:scale-105 transition active:scale-95 gap-2 cursor-pointer'} size="sm">
                        {children}
                    </Button>
                ) : (
                    <Button className={'bg-linear-to-r from-green-500/35 to-green-950/40 hover:bg-gray-800 hover:scale-105 transition active:scale-95 gap-2 cursor-pointer'} size="sm">
                        <Plus size={18} /> Add Payment
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="rounded-2xl animate-in fade-in zoom-in-95 border border-white/20 bg-slate-900/90 backdrop-blur-xl text-white">

                <DialogHeader>
                    <DialogTitle className="text-lg font-bold text-white">
                        Add Payment
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">

                    {sale?.buyer?.name ? (
                        <div className="text-sm text-slate-200">
                            Buyer: <span className="font-semibold text-white">{sale.buyer.name}</span>
                        </div>
                    ) : (
                        <div className="text-sm text-slate-200">
                            ID: <span className="font-semibold text-white">{sale.id}</span>
                        </div>
                    )}
                    <div className="text-sm text-red-400 font-semibold">
                        {
                         (owed > 0) ? `Debt: ${formatCurrency(owed)}` : 'Add payment amount'
                        }    
                    </div>

                    {/* Fully Paid Toggle */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-white">Pay Full Amount?</label>
                        <div className="flex gap-2">
                            <Button
                                onClick={() => setFullyPaid(false)}
                                className={`flex-1 transition ${
                                    !fullyPaid
                                        ? 'bg-linear-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-700 text-white'
                                        : 'bg-white/10 text-slate-300 hover:bg-white/20 cursor-pointer'
                                }`}
                            >
                                No
                            </Button>
                            <Button
                                onClick={() => setFullyPaid(true)}
                                className={`flex-1 transition ${
                                    fullyPaid
                                        ? 'bg-linear-to-r from-green-500 via-green-700 to-green-900 hover:from-green-700 hover:to-green-800 text-white'
                                        : 'bg-white/10 text-slate-300 hover:bg-white/20 cursor-pointer'
                                }`}
                            >
                                Yes
                            </Button>
                        </div>
                    </div>

                    {/* Amount Input - Conditional */}
                    {!fullyPaid && (
                        <div className="animate-in fade-in duration-300">
                            <label className="text-sm font-semibold text-white">Payment Amount</label>
                            <Input
                            className="text-lg" 
                            type="number"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            />
                        </div>
                    )}

                    {/* Payment Summary */}
                    {fullyPaid && (
                        <div className="animate-in fade-in duration-300 bg-linear-to-r from-green-500/20 to-green-600/20 border border-green-400/30 rounded-lg p-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-semibold text-white">Payment Amount:</span>
                                <span className="text-lg font-bold text-green-300">{formatCurrency(owed)}</span>
                            </div>
                        </div>
                    )}

                    <Input
                    className="text-lg" 
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    />
                    <Button 
                        className="w-full hover:bg-linear-to-r from-yellow-400 to-orange-600 cursor-pointer transition"
                        onClick={handleSubmit}
                        >
                        Confirm Payment
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )

}