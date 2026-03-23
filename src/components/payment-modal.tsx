"use client"

import { api } from "@/lib/api";
import { useState } from "react"
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function PaymentModal ({ sale, onSuccess}: any) {
    const [amount, setAmount] = useState<number>(0);

    const handleSubmit = async ()=>{
        if (amount <= 0) {
            toast.error("Invalid amount: must be greater than 0");
            return;
        }

        try {
            await toast.promise(
                api.patch(`sales/${sale.id}/payment`, { amount }),
                {
                    success: "Payment added",
                    loading: "Adding payment",
                    error: "An error occurred"
                }
            );
            onSuccess?.();
        } catch (err) {
            console.error(err);
            toast.error("Failed to add payment");
        }
    }

    return(
        <Dialog>
            <DialogTrigger asChild>
                <Button className="hover:bg-gray-800 transition active:scale-95" size="sm">
                    Add Payment
                </Button>
            </DialogTrigger>

            <DialogContent className="rounded-2xl animate-in fade-in zoom-in-95">

                <DialogHeader>
                    <DialogTitle>
                        Add Payment
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">

                    <div className="text-sm text-gray-500">
                        Buyer: {sale.buyer.name}
                    </div>
                    <div>
                        Debt: {sale.remainingAmount}
                    </div>

                    <Input
                    className="text-lg" 
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    />
                    <Button 
                        className="w-full"
                        onClick={handleSubmit}
                        >
                        Confirm Payment
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )

}