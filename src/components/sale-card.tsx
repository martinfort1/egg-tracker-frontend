import { api } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "./ui/button";
import Link from "next/link";
import PaymentModal from "./payment-modal";
import { motion } from "framer-motion";
import { formatCurrency, formatUtcDate } from "@/lib/utils";
import { Calendar, CheckCircle2, AlertCircle, Clock } from "lucide-react";

export default function SaleCard({ sale, refresh }: any) {
    const handleDelete = async () => {
        await toast.promise(
            api.delete(`/sales/${sale.id}`),
            {
                loading: "Deleting sale...",
                success: "Sale deleted successfully",
                error: "Error deleting sale",
            }
        );
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

    const StatusIcon = statusBadge[sale.status]?.icon || AlertCircle;
    const badgeClass = statusBadge[sale.status]?.className || "bg-slate-100 text-slate-700 border-slate-200";

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="group relative bg-white rounded-2xl border border-emerald-100/90 p-5 sm:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden gap-4"
        >
            {/* Top Section Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600" />

            <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                                Sale
                            </span>
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                            {sale.buyer?.name ?? "Customer"}
                        </h2>
                    </div>

                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border shrink-0 ${badgeClass}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {sale.status}
                    </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{formatUtcDate(sale.date)}</span>
                </div>

                {/* Amount Summary */}
                <div className="bg-emerald-50/50 rounded-xl p-3.5 space-y-2 border border-emerald-100/70 text-xs">
                    <div className="flex justify-between items-center text-slate-600">
                        <span>Total Amount:</span>
                        <span className="text-sm font-bold text-slate-900">{formatCurrency(sale.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                        <span>Amount Paid:</span>
                        <span className="font-semibold text-emerald-700">{formatCurrency(sale.amountPaid)}</span>
                    </div>
                    <div className="pt-1.5 border-t border-emerald-200/60 flex justify-between items-center">
                        <span className="text-slate-500">Remaining Debt:</span>
                        {sale.status === "PAID" ? (
                            <span className="font-semibold text-emerald-700">No debt</span>
                        ) : (
                            <span className="font-bold text-rose-600">{formatCurrency(sale.remainingAmount)}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 gap-2 pt-1">
                <Link href={`/sales/${sale.id}`} className="w-full">
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition active:scale-95 cursor-pointer rounded-lg font-medium text-xs h-9">
                        Sale Details
                    </Button>
                </Link>

                {sale.status !== "PAID" && (
                    <PaymentModal
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-lg shadow-sm transition active:scale-95 cursor-pointer font-medium text-xs h-9 flex items-center justify-center"
                        sale={sale}
                        onSuccess={refresh}
                    >
                        <span className="w-full block text-center">
                            Add Payment
                        </span>
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
