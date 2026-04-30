"use client"

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ShoppingBasket } from "lucide-react";
import { formatCurrency, formatUtcDate } from "@/lib/utils";
import LoadSpin from "@/components/load-spin";

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
        if (!confirm("Are you sure?")) return;

        try {
            await api.delete(`/expenses/${id}`);
            toast.success("Expense deleted successfully");
            fetchExpenses();
        } catch (error) {
            toast.error("Failed to delete expense");
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm("Are you sure? This will delete the category and all its expenses.")) return;

        try {
            await api.delete(`/expenses/categories/${id}`);
            toast.success("Category deleted successfully");
            fetchExpenses();
            fetchCategories();
        } catch (error) {
            toast.error("Failed to delete category");
        }
    };

    const filteredExpenses = selectedCategory
        ? expenses.filter((exp: any) => exp.categoryId === selectedCategory)
        : expenses;

    return (
        <div className="space-y-6 p-4 md:p-6 bg-linear-to-br from-slate-900/30 via-slate-900/20 to-slate-900/30 rounded-2xl border border-white/10 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h1 className="flex justify-center text-2xl sm:text-3xl font-['Playfair_Display'] font-black text-white text-shadow-lg">
                    Expenses
                </h1>
                <Link href="/expenses/new">
                    <Button className="bg-linear-to-r from-green-400/80 to-green-600/60 text-white hover:from-green-600 hover:to-green-700 rounded-full w-full sm:w-auto flex items-center gap-2 cursor-pointer">
                        + Add Expense
                    </Button>
                </Link>
            </div>

            {/* Categories */}
            {categories.length > 0 && (
                <div className="bg-slate-900/85 border border-white/10 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-white mb-3">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-3 py-1 mr-2 rounded-lg text-sm font-medium transition ${
                                selectedCategory === null
                                    ? "bg-linear-to-br from-orange-500 to-yellow-500 text-white"
                                    : "bg-white/10 text-indigo-200 hover:bg-white/20"
                            }`}
                        >
                            All
                        </button>
                        {categories.map((cat: any) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                                    selectedCategory === cat.id
                                        ? "bg-linear-to-br from-orange-500 to-yellow-500 text-white"
                                        : "bg-white/10 text-indigo-200 hover:bg-white/20"
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Expenses List */}
            {loading ? (
                <LoadSpin />
                ) : filteredExpenses.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <ShoppingBasket className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-400 text-lg">No extra expenses recorded yet</p>
                        <p className="text-slate-500 text-sm">Add your first expense record to get started</p>
                    </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredExpenses.map((expense: any) => (
                        <div
                            key={expense.id}
                            className="bg-linear-to-br from-rose-600/75 via-orange-400/55 to-yellow-500/55 border border-white/10 p-4 rounded-lg hover:bg-white/10 transition"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="text-white font-bold">{expense.name}</h3>
                                    <p className="text-xs text-slate-700">{expense.category?.name}</p>
                                </div>
                                <span className="text-xs text-slate-800">
                                    {formatUtcDate(expense.date)}
                                </span>
                            </div>

                            <div className="space-y-1 text-sm text-slate-900 mb-3">
                                <p>Quantity: {expense.quantity}</p>
                                <p>Price: {formatCurrency(expense.price)}</p>
                                <p className="text-green-700 font-extrabold">Total: {formatCurrency(expense.totalAmount)}</p>
                                {expense.description && (
                                    <p className="text-xs text-slate-700 italic">{expense.description}</p>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    onClick={() => handleDelete(expense.id)}
                                    className="flex-1 bg-red-600 hover:bg-red-800 text-white text-xs h-8 hover:scale-105 cursor-pointer"
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
