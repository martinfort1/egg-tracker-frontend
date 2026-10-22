"use client"

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ShoppingBasket, Plus, Calendar, Tag, Trash2 } from "lucide-react";
import { formatCurrency, formatUtcDate } from "@/lib/utils";
import LoadSpin from "@/components/load-spin";
import { motion } from "framer-motion";

export default function ExpensesPage() {
    const router = useRouter();
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchExpenses();
        fetchCategories();
    }, []);

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            const response = await api.get("/expenses");
            setExpenses(response.data);
        } catch (error) {
            toast.error("Failed to fetch expenses");
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get("/expenses/categories");
            setCategories(response.data);
        } catch (error) {
            console.error("Failed to fetch categories");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this expense?")) return;

        try {
            await api.delete(`/expenses/${id}`);
            toast.success("Expense deleted successfully");
            fetchExpenses();
        } catch (error) {
            toast.error("Failed to delete expense");
        }
    };

    const filteredExpenses = selectedCategory
        ? expenses.filter((exp: any) => exp.categoryId === selectedCategory)
        : expenses;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-semibold text-slate-900">
                        Other Expenses
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Track extra operational expenses, supplies and maintenance costs
                    </p>
                </div>
                <Link href="/expenses/new">
                    <Button className="bg-rose-600 hover:bg-rose-700 text-white rounded-lg px-4 py-2 font-medium shadow-sm transition active:scale-95 flex items-center gap-2 cursor-pointer w-full sm:w-auto">
                        <Plus className="w-4 h-4" />
                        Add Expense
                    </Button>
                </Link>
            </div>

            {/* Categories Filter */}
            {categories.length > 0 && (
                <div className="bg-white border border-rose-100 rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
                        <Tag className="w-3.5 h-3.5 text-rose-600" />
                        <span>Filter by Category</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                selectedCategory === null
                                    ? "bg-rose-600 text-white shadow-sm"
                                    : "bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600"
                            }`}
                        >
                            All ({expenses.length})
                        </button>
                        {categories.map((cat: any) => {
                            const count = expenses.filter((e: any) => e.categoryId === cat.id).length;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                                        selectedCategory === cat.id
                                            ? "bg-rose-600 text-white shadow-sm"
                                            : "bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-600"
                                    }`}
                                >
                                    {cat.name} ({count})
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Expenses List */}
            {loading ? (
                <LoadSpin />
            ) : filteredExpenses.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-rose-100 shadow-sm">
                    <ShoppingBasket className="w-14 h-14 text-rose-300 mx-auto mb-4" />
                    <p className="text-slate-700 text-lg font-medium">No expenses recorded yet</p>
                    <p className="text-slate-400 text-sm mt-1">Add your first expense record to get started</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {filteredExpenses.map((expense: any) => (
                        <motion.div
                            key={expense.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="group relative bg-white rounded-2xl border border-rose-100/90 p-5 sm:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden gap-4"
                        >
                            {/* Top Section Accent Line (Rose/Red) */}
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-red-500 to-rose-600" />

                            <div className="space-y-3">
                                <div className="flex justify-between items-start gap-2">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                                            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
                                                Expense
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 truncate group-hover:text-rose-700 transition-colors">
                                            {expense.name}
                                        </h3>
                                    </div>

                                    {expense.category?.name && (
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80 shrink-0">
                                            {expense.category.name}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                    <Calendar className="w-3.5 h-3.5 text-rose-600" />
                                    <span>{formatUtcDate(expense.date)}</span>
                                </div>

                                <div className="bg-rose-50/50 rounded-xl p-3.5 space-y-2 border border-rose-100/70 text-xs">
                                    <div className="flex justify-between items-center text-slate-600">
                                        <span>Quantity:</span>
                                        <span className="font-semibold text-slate-800">{expense.quantity}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-slate-600">
                                        <span>Unit Price:</span>
                                        <span className="font-semibold text-slate-800">{formatCurrency(expense.price)}</span>
                                    </div>
                                    <div className="pt-1.5 border-t border-rose-200/60 flex justify-between items-center">
                                        <span className="font-semibold text-slate-600">Total Spent:</span>
                                        <span className="text-base font-extrabold text-rose-600">
                                            -{formatCurrency(expense.totalAmount)}
                                        </span>
                                    </div>
                                    {expense.description && (
                                        <p className="text-[11px] text-slate-500 italic pt-1 border-t border-rose-100">
                                            {expense.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="pt-1">
                                <Button
                                    onClick={() => handleDelete(expense.id)}
                                    variant="outline"
                                    className="w-full text-slate-500 hover:text-rose-600 hover:bg-rose-50 border-slate-200 hover:border-rose-200 transition active:scale-95 cursor-pointer rounded-lg font-medium text-xs h-9 flex items-center justify-center gap-1.5"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Delete Expense
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
