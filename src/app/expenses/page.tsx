"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import Link from "next/link";
import { toast } from "sonner";
import {
    ShoppingBasket,
    Plus,
    Calendar,
    Tag,
    Trash2,
    Printer,
    Table as TableIcon,
    LayoutGrid,
    Search,
    DollarSign,
} from "lucide-react";
import { formatCurrency, formatUtcDate } from "@/lib/utils";
import LoadSpin from "@/components/load-spin";
import { motion } from "framer-motion";
import DateRangeFilter, { DateFilterPreset } from "@/components/date-range-filter";

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [preset, setPreset] = useState<DateFilterPreset>("all");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [viewMode, setViewMode] = useState<"ledger" | "cards">("ledger");
    const [searchTerm, setSearchTerm] = useState("");

    const fetchExpenses = async (sDate = startDate, eDate = endDate) => {
        try {
            setLoading(true);
            const params: any = {};
            if (sDate) params.startDate = sDate;
            if (eDate) params.endDate = eDate;
            const response = await api.get("/expenses", { params });
            setExpenses(response.data);
        } catch (error) {
            toast.error("Error al cargar gastos");
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get("/expenses/categories");
            setCategories(response.data);
        } catch (error) {
            console.error("Error al cargar categorías");
        }
    };

    useEffect(() => {
        fetchExpenses(startDate, endDate);
        fetchCategories();
    }, [startDate, endDate]);

    const handleDelete = async (id: string) => {
        if (!confirm("¿Estás seguro de que deseas eliminar este gasto?")) return;

        try {
            await api.delete(`/expenses/${id}`);
            toast.success("Gasto eliminado exitosamente");
            fetchExpenses(startDate, endDate);
        } catch (error) {
            toast.error("Error al eliminar gasto");
        }
    };

    const visibleExpenses = useMemo(() => {
        let list = expenses;

        if (selectedCategory) {
            list = list.filter((exp: any) => exp.categoryId === selectedCategory);
        }

        if (searchTerm.trim()) {
            const query = searchTerm.toLowerCase().trim();
            list = list.filter((exp: any) => {
                const nameMatch = exp.name?.toLowerCase().includes(query);
                const descMatch = exp.description?.toLowerCase().includes(query);
                const catMatch = exp.category?.name?.toLowerCase().includes(query);
                return nameMatch || descMatch || catMatch;
            });
        }

        return list;
    }, [expenses, selectedCategory, searchTerm]);

    const totalSpent = useMemo(() => {
        return visibleExpenses.reduce((acc, exp) => acc + (Number(exp.totalAmount) || 0), 0);
    }, [visibleExpenses]);

    const averageSpent = useMemo(() => {
        return visibleExpenses.length > 0 ? totalSpent / visibleExpenses.length : 0;
    }, [visibleExpenses, totalSpent]);

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                            Egresos Operativos
                        </span>
                        <span className="text-xs text-slate-400">Insumos, Mantenimiento & Otros Gastos</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-semibold text-slate-900">
                        Historial de Gastos Operativos
                    </h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        Registro cronológico de gastos de la granja, insumos y compras operativas
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs transition active:scale-95 cursor-pointer"
                    >
                        <Printer className="w-3.5 h-3.5 text-slate-500" />
                        <span>Imprimir / PDF</span>
                    </button>

                    <Link href="/expenses/new">
                        <Button className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-4 py-2 font-semibold shadow-sm transition active:scale-95 flex items-center gap-1.5 cursor-pointer">
                            <Plus className="w-4 h-4" />
                            Nuevo Gasto
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Financial Summary Cards */}
            {!loading && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                            Total Egresos en Período
                        </p>
                        <p className="text-xl sm:text-2xl font-bold text-rose-600">
                            -{formatCurrency(totalSpent)}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                            {visibleExpenses.length} {visibleExpenses.length === 1 ? "registro" : "registros"}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                            Gasto Promedio
                        </p>
                        <p className="text-xl sm:text-2xl font-bold text-slate-800">
                            {formatCurrency(averageSpent)}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                            Por cada egreso registrado
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                            Categorías Activas
                        </p>
                        <p className="text-xl sm:text-2xl font-bold text-indigo-600">
                            {categories.length}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                            Tipos de gastos registrados
                        </p>
                    </div>
                </div>
            )}

            {/* Date Range & Controls */}
            <div className="space-y-3">
                <DateRangeFilter
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    activePreset={preset}
                    onSelectPreset={setPreset}
                    accentColor="orange"
                    totalCount={visibleExpenses.length}
                />

                {/* Categories Pills */}
                {categories.length > 0 && (
                    <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
                            <Tag className="w-3.5 h-3.5 text-rose-600" />
                            <span>Filtrar por Categoría</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            <button
                                type="button"
                                onClick={() => setSelectedCategory(null)}
                                className={`px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
                                    selectedCategory === null
                                        ? "bg-rose-600 text-white shadow-2xs"
                                        : "bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700"
                                }`}
                            >
                                Todas ({expenses.length})
                            </button>
                            {categories.map((cat: any) => {
                                const count = expenses.filter((e: any) => e.categoryId === cat.id).length;
                                return (
                                    <button
                                        type="button"
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`px-3 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
                                            selectedCategory === cat.id
                                                ? "bg-rose-600 text-white shadow-2xs"
                                                : "bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700"
                                        }`}
                                    >
                                        {cat.name} ({count})
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Search & View Mode Switcher */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, categoría o nota..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-slate-700"
                        />
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-auto">
                        <span className="text-xs text-slate-500 font-medium mr-1 hidden sm:inline">
                            Vista:
                        </span>
                        <div className="inline-flex rounded-xl bg-slate-100 p-0.5 border border-slate-200">
                            <button
                                type="button"
                                onClick={() => setViewMode("ledger")}
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                    viewMode === "ledger"
                                        ? "bg-white text-rose-700 shadow-2xs font-bold"
                                        : "text-slate-600 hover:text-slate-900"
                                }`}
                            >
                                <TableIcon className="w-3.5 h-3.5" />
                                <span>Libro Diario</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode("cards")}
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                    viewMode === "cards"
                                        ? "bg-white text-rose-700 shadow-2xs font-bold"
                                        : "text-slate-600 hover:text-slate-900"
                                }`}
                            >
                                <LayoutGrid className="w-3.5 h-3.5" />
                                <span>Tarjetas</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <LoadSpin />
            ) : visibleExpenses.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-rose-100 shadow-sm">
                    <ShoppingBasket className="w-14 h-14 text-rose-300 mx-auto mb-4" />
                    <p className="text-slate-700 text-lg font-medium">No se encontraron gastos</p>
                    <p className="text-slate-400 text-sm mt-1">
                        {expenses.length > 0
                            ? "Prueba cambiando las fechas o categoría seleccionada"
                            : "Registra tu primer gasto operativo para comenzar"}
                    </p>
                </div>
            ) : viewMode === "ledger" ? (
                /* Ledger View */
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div className="flex items-center gap-2">
                            <TableIcon className="w-4 h-4 text-rose-600" />
                            <h3 className="font-semibold text-slate-800 text-sm">
                                Historial de Gastos & Compras
                            </h3>
                            <span className="text-xs bg-rose-100 text-rose-800 font-semibold px-2 py-0.5 rounded-full">
                                {visibleExpenses.length}
                            </span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 font-semibold">
                                    <th className="py-3 px-4">Fecha</th>
                                    <th className="py-3 px-4">Concepto / Nombre</th>
                                    <th className="py-3 px-4">Categoría</th>
                                    <th className="py-3 px-4 text-center">Cant.</th>
                                    <th className="py-3 px-4 text-right">Precio Unit.</th>
                                    <th className="py-3 px-4 text-right">Total Gastado</th>
                                    <th className="py-3 px-4">Nota / Detalle</th>
                                    <th className="py-3 px-4 text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                {visibleExpenses.map((expense: any) => (
                                    <tr
                                        key={expense.id}
                                        className="hover:bg-rose-50/30 transition-colors"
                                    >
                                        <td className="py-3.5 px-4 font-medium text-slate-900 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                                                <span>{formatUtcDate(expense.date)}</span>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                                            {expense.name}
                                        </td>
                                        <td className="py-3.5 px-4 whitespace-nowrap">
                                            {expense.category?.name ? (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                                                    {expense.category.name}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 italic">General</span>
                                            )}
                                        </td>
                                        <td className="py-3.5 px-4 text-center text-slate-700">
                                            {expense.quantity}
                                        </td>
                                        <td className="py-3.5 px-4 text-right font-medium text-slate-600 whitespace-nowrap">
                                            {formatCurrency(expense.price)}
                                        </td>
                                        <td className="py-3.5 px-4 text-right font-extrabold text-rose-600 whitespace-nowrap">
                                            -{formatCurrency(expense.totalAmount)}
                                        </td>
                                        <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate">
                                            {expense.description || "—"}
                                        </td>
                                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                            <button
                                                type="button"
                                                title="Eliminar Gasto"
                                                onClick={() => handleDelete(expense.id)}
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition cursor-pointer"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* Cards View */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {visibleExpenses.map((expense: any) => (
                        <motion.div
                            key={expense.id}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="group relative bg-white rounded-2xl border border-rose-100/90 p-5 sm:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden gap-4"
                        >
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-red-500 to-rose-600" />

                            <div className="space-y-3">
                                <div className="flex justify-between items-start gap-2">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-1.5 mb-1">
                                            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                                            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
                                                Gasto
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
                                    Eliminar Gasto
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
