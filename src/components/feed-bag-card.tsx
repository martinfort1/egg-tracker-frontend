import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { toast } from "sonner";
import Link from "next/link";
import PaymentModal from "./payment-modal";
import { motion } from "framer-motion";
import { formatCurrency, formatUtcDate } from "@/lib/utils";
import { Package, Calendar, CheckCircle2, AlertCircle, Clock } from "lucide-react";

export default function FeedBagCard({ feedBag, refresh }: any) {
  const handleDelete = async () => {
    await toast.promise(api.delete(`/feed-bags/${feedBag.id}`), {
      loading: "Deleting feed bag...",
      success: "Feed bag deleted successfully",
      error: "Error deleting feed bag",
    });
    refresh?.();
  };

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

  const StatusIcon = statusBadge[feedBag.status]?.icon || AlertCircle;
  const badgeClass = statusBadge[feedBag.status]?.className || "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-2xl border border-orange-100/90 p-5 sm:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden gap-4"
    >
      {/* Top Section Accent Line (Orange) */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-400 via-amber-500 to-orange-600" />

      <div className="space-y-3">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-orange-700">
                Feed Bags
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 truncate group-hover:text-orange-800 transition-colors">
              {feedBag.amount} Bags
            </h2>
          </div>

          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border shrink-0 ${badgeClass}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            {feedBag.status}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-orange-600" />
            <span>{formatUtcDate(feedBag.date)}</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-orange-100 text-orange-800 font-semibold text-[11px]">
            Phase {feedBag.phase}
          </span>
        </div>

        <div className="bg-orange-50/40 rounded-xl p-3.5 space-y-2 border border-orange-100/70 text-xs">
          <div className="flex justify-between items-center text-slate-600">
            <span>Price per bag:</span>
            <span className="font-semibold text-slate-800">{formatCurrency(feedBag.price)}</span>
          </div>
          <div className="flex justify-between items-center text-slate-600">
            <span>Total Purchase:</span>
            <span className="text-sm font-bold text-slate-900">{formatCurrency(feedBag.totalAmount)}</span>
          </div>
          <div className="flex justify-between items-center text-slate-600">
            <span>Amount Paid:</span>
            <span className="font-semibold text-emerald-700">{formatCurrency(feedBag.amountPaid)}</span>
          </div>
          <div className="pt-1.5 border-t border-orange-200/60 flex justify-between items-center">
            <span className="text-slate-500">Remaining Debt:</span>
            {feedBag.status === "PAID" ? (
              <span className="font-semibold text-emerald-700">No debt</span>
            ) : (
              <span className="font-bold text-rose-600">{formatCurrency(feedBag.remainingAmount)}</span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 pt-1">
        <Link href={`/feed-bags/${feedBag.id}`} className="w-full">
          <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white shadow-sm transition active:scale-95 cursor-pointer rounded-lg font-medium text-xs h-9">
            View Details
          </Button>
        </Link>

        {feedBag.status !== "PAID" && (
          <PaymentModal
            sale={feedBag}
            endpoint="feed-bags"
            onSuccess={refresh}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-lg shadow-sm transition active:scale-95 cursor-pointer font-medium text-xs h-9 flex items-center justify-center"
          >
            <span className="w-full block text-center">Add Payment</span>
          </PaymentModal>
        )}

        <Button
          onClick={handleDelete}
          variant="outline"
          className="w-full text-slate-500 hover:text-rose-600 hover:bg-rose-50 border-slate-200 hover:border-rose-200 transition active:scale-95 cursor-pointer rounded-lg font-medium text-xs h-9"
        >
          Delete
        </Button>
      </div>
    </motion.div>
  );
}
