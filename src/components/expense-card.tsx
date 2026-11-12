"use client";

import { Button } from "./ui/button";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { formatCurrency, formatUtcDate } from "@/lib/utils";
import { Calendar, Trash2, Tag, ShoppingBag } from "lucide-react";

export default function ExpenseCard({ expense, refresh }: { expense: any; refresh?: () => void }) {
    const handleDelete = async () => {
        if (!confirm(`¿Estás seguro de que deseas eliminar el gasto "${expense.name}"?`)) return;

        await toast.promise(api.delete(`/expenses/${expense.id}`), {
            loading: "Eliminando gasto...",
            success: "Gasto eliminado exitosamente",
            error: "Error al eliminar gasto",
        });
        refresh?.();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="group relative bg-white rounded-2xl border border-rose-100/90 p-5 sm:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden gap-4"
        >
            {/* Top Section Accent Line (Rose / Red) */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-red-500 to-rose-600" />

            <div className="space-y-3">
                <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
                                Gasto Operativo
                            </span>
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 truncate group-hover:text-rose-700 transition-colors">
                            {expense.name}
                        </h2>
                    </div>

                    {expense.category?.name ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80 shrink-0">
                            <Tag className="w-3 h-3 text-rose-500" />
                            {expense.category.name}
                        </span>
                    ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                            General
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>{formatUtcDate(expense.date)}</span>
                </div>

                <div className="bg-rose-50/40 rounded-xl p-3.5 space-y-2 border border-rose-100/70 text-xs">
                    <div className="flex justify-between items-center text-slate-600">
                        <span>Cantidad:</span>
                        <span className="font-semibold text-slate-800">{expense.quantity}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-600">
                        <span>Precio Unitario:</span>
                        <span className="font-semibold text-slate-800">{formatCurrency(expense.price)}</span>
                    </div>
                    <div className="pt-1.5 border-t border-rose-200/60 flex justify-between items-center">
                        <span className="font-semibold text-slate-600">Total Gastado:</span>
                        <span className="text-base font-extrabold text-rose-600">
                            -{formatCurrency(expense.totalAmount)}
                        </span>
                    </div>
                    {expense.description && (
                        <p className="text-[11px] text-slate-500 italic pt-1 border-t border-rose-100 line-clamp-2">
                            {expense.description}
                        </p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-2 pt-1">
                <Button
                    onClick={handleDelete}
                    variant="outline"
                    className="w-full text-slate-500 hover:text-rose-600 hover:bg-rose-50 border-slate-200 hover:border-rose-200 transition active:scale-95 cursor-pointer rounded-lg font-medium text-xs h-9 flex items-center justify-center gap-1.5"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                    Eliminar Gasto
                </Button>
            </div>
        </motion.div>
    );
}
