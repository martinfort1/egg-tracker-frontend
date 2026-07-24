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

export default function FulfillOrderModal({
  order,
  onSuccess,
  children,
}: any) {
  const [open, setOpen] = useState(false);
  const [fullyPaid, setFullyPaid] = useState(false);
  const [amountPaid, setAmountPaid] = useState(0);

  const total = order.totalAmount;

  const handleSubmit = async () => {
    const paymentAmount = fullyPaid
      ? total
      : amountPaid;

    if (
      paymentAmount < 0 ||
      paymentAmount > total
    ) {
      toast.error(
        "Amount paid must be between 0 and total amount"
      );
      return;
    }

    try {
      const res = await api.post(
        `/orders/${order.id}/fulfill`,
        {
          amountPaid: paymentAmount,
        }
      );

      toast.success(
        "Order fulfilled successfully"
      );

      setOpen(false);

      onSuccess?.(res.data);
    } catch (err) {
      console.error(err);
      toast.error(
        "Failed to fulfill order"
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent className="rounded-2xl animate-in fade-in zoom-in-95 border border-white/20 bg-slate-900/90 backdrop-blur-xl text-white">

        <DialogHeader>
          <DialogTitle>
            Complete Delivery
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">

          <div>
            Buyer:
            <span className="ml-2 font-semibold">
              {order.buyer?.name}
            </span>
          </div>

          <div className="bg-orange-500/10 border border-orange-400/30 rounded-lg p-3">
            <div className="flex justify-between">
              <span>Total Amount</span>
              <span className="font-bold">
                {formatCurrency(total)}
              </span>
            </div>
          </div>

          {/* Fully Paid */}

          <div className="space-y-2">
            <label className="text-sm font-semibold">
              Was it fully paid?
            </label>

            <div className="flex gap-2">

              <Button
                type="button"
                onClick={() =>
                  setFullyPaid(false)
                }
                className={`flex-1 ${
                  !fullyPaid
                    ? "bg-linear-to-r from-yellow-400 to-orange-500"
                    : "bg-white/10 cursor-pointer"
                }`}
              >
                No
              </Button>

              <Button
                type="button"
                onClick={() =>
                  setFullyPaid(true)
                }
                className={`flex-1 ${
                  fullyPaid
                    ? "bg-linear-to-r from-green-500 via-green-700 to-green-900"
                    : "bg-white/10 cursor-pointer"
                }`}
              >
                Yes
              </Button>

            </div>
          </div>

          {!fullyPaid && (
            <div>
              <label className="text-sm font-semibold">
                Amount Paid
              </label>

              <Input
                type="number"
                value={amountPaid}
                onChange={(e) =>
                  setAmountPaid(
                    Number(e.target.value)
                  )
                }
              />
            </div>
          )}

          {fullyPaid && (
            <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-3">
              <div className="flex justify-between">
                <span>
                  Payment Amount
                </span>

                <span className="font-bold text-green-300">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>
          )}

          <Button
            onClick={handleSubmit}
            className="w-full bg-green-600 hover:bg-green-700 cursor-pointer"
          >
            Complete Delivery
          </Button>

        </div>
      </DialogContent>
    </Dialog>
  );
}