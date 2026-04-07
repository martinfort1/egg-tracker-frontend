"use client"

import { api } from "@/lib/api";
import { useState } from "react"
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Plus } from "lucide-react";

export default function PaymentModal ({ sale, onSuccess, endpoint = 'sales', className, children }: any) {
    const [amount, setAmount] = useState<number>(0);
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [open, setOpen] = useState(false);

    const handleSubmit = async ()=>{
        if (amount <= 0) {
            toast.error("Invalid amount: must be greater than 0");
            return;
        }

        try {
            await toast.promise(
                api.patch(`${endpoint}/${sale.id}/payment`, { amount, date }),
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
        } catch (err) {
            console.error(err);
            toast.error("Failed to add payment");
        }
    }

    return(
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children ? (
                    <Button className={'bg-linear-to-r from-green-500/35 to-green-950/40 hover:bg-gray-800 transition active:scale-95 gap-2 cursor-pointer'} size="sm">
                        {children}
                    </Button>
                ) : (
                    <Button className={'bg-linear-to-r from-green-500/35 to-green-950/40 hover:bg-gray-800 transition active:scale-95 gap-2 cursor-pointer'} size="sm">
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
                         (sale.remainingAmount > 0) ? `Debt: $${sale.remainingAmount}` : 'Add payment amount'
                        }    
                    </div>

                    <Input
                    className="text-lg" 
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    />
                    <Input
                    className="text-lg" 
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    />
                    <Button 
                        className="w-full hover:bg-gray-700 cursor-pointer"
                        onClick={handleSubmit}
                        >
                        Confirm Payment
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )

}