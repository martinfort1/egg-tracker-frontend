"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PriceInput } from "@/components/ui/price-input";
import LoadSpin from "@/components/load-spin";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import {
    ArrowLeft,
    Calendar,
    Tag,
    ShoppingBag,
    Hash,
    DollarSign,
    FileText,
    Plus,
    X,
    Check,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function EditExpensePage() {
    const router = useRouter();
    const { id } = useParams();
    const expenseId = Array.isArray(id) ? id[0] : id;

    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const [showNewCategory, setShowNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        watch,
        setValue,
    } = useForm({
        defaultValues: {
            date: new Date().toISOString().split("T")[0],
            name: "",
            quantity: 1,
            price: 0,
            description: "",
            categoryId: "",
        },
    });

    const watchedQuantity = watch("quantity");
    const watchedPrice = watch("price");

    const totalCalculated = useMemo(() => {
        const q = Number(watchedQuantity) || 0;
        const p = Number(watchedPrice) || 0;
        return q * p;
    }, [watchedQuantity, watchedPrice]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [catsRes, expRes] = await Promise.all([
                    api.get("/expenses/categories"),
                    api.get(`/expenses/${expenseId}`),
                ]);

                setCategories(catsRes.data || []);
                const exp = expRes.data;

                if (exp) {
                    setValue("date", exp.date ? exp.date.split("T")[0] : "");
                    setValue("name", exp.name || "");
                    setValue("quantity", exp.quantity ?? 1);
                    setValue("price", exp.price ?? 0);
                    setValue("description", exp.description || "");
                    setValue("categoryId", exp.categoryId || "");
                    setSelectedCategory(exp.categoryId || "");
                }
            } catch (error) {
                toast.error("Error al cargar datos del gasto");
            } finally {
                setLoading(false);
            }
        };

        if (expenseId) {
            fetchData();
        }
    }, [expenseId, setValue]);

    const handleCreateCategory = async () => {
        const trimmed = newCategoryName.trim();
        if (!trimmed) {
            toast.error("El nombre de la categoría no puede estar vacío");
            return;
        }

        setIsCreatingCategory(true);
        try {
            const response = await api.post("/expenses/categories", { name: trimmed });
            setCategories([response.data, ...categories]);
            setSelectedCategory(response.data.id);
            setValue("categoryId", response.data.id);
            setNewCategoryName("");
            setShowNewCategory(false);
            toast.success("Categoría creada exitosamente");
        } catch (error) {
            toast.error("Error al crear categoría");
        } finally {
            setIsCreatingCategory(false);
        }
    };

    const onSubmit = async (data: any) => {
        if (!selectedCategory) {
            toast.error("Por favor seleccioná o creá una categoría");
            return;
        }

        const qty = parseFloat(data.quantity);
        if (isNaN(qty) || qty <= 0) {
            toast.error("La cantidad debe ser mayor a 0");
            return;
        }

        const prc = parseFloat(data.price);
        if (isNaN(prc) || prc < 0) {
            toast.error("El precio no puede ser negativo");
            return;
        }

        setIsSubmitting(true);
        try {
            await api.patch(`/expenses/${expenseId}`, {
                ...data,
                categoryId: selectedCategory,
                quantity: qty,
                price: prc,
            });
            toast.success("Gasto modificado exitosamente");
            router.push("/expenses");
        } catch (error) {
            toast.error("Error al modificar gasto");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="py-20 flex justify-center">
                <LoadSpin />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header Navigation */}
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver
                </button>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Modificar Gasto
                </span>
            </div>

            {/* Main Card Form */}
            <div className="relative bg-white rounded-2xl border border-rose-100/90 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
                {/* Top Section Accent Line (Rose / Red) */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-red-500 to-rose-600" />

                <div>
                    <h1 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-semibold text-slate-900">
                        Modificar Gasto Operativo
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Actualizá los datos del concepto, fecha, categoría o importes del gasto
                    </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Date and Category Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Date */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-rose-600" />
                                Fecha del Gasto
                            </label>
                            <Input
                                type="date"
                                {...register("date", { required: "La fecha es obligatoria" })}
                                className="h-11 bg-slate-50/60 border border-slate-200 text-slate-900 rounded-xl px-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                            />
                            {errors.date && (
                                <p className="text-rose-600 text-xs font-medium">
                                    {String(errors.date?.message)}
                                </p>
                            )}
                        </div>

                        {/* Category */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                    <Tag className="w-3.5 h-3.5 text-rose-600" />
                                    Categoría
                                </label>
                                {!showNewCategory && (
                                    <button
                                        type="button"
                                        onClick={() => setShowNewCategory(true)}
                                        className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                                    >
                                        <Plus className="w-3 h-3" />
                                        Nueva Categoría
                                    </button>
                                )}
                            </div>

                            {!showNewCategory ? (
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => {
                                        setSelectedCategory(e.target.value);
                                        setValue("categoryId", e.target.value);
                                    }}
                                    className="w-full h-11 px-3 bg-slate-50/60 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 cursor-pointer"
                                >
                                    <option value="">Seleccionar categoría...</option>
                                    {categories.map((cat: any) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <div className="flex gap-1.5">
                                    <Input
                                        placeholder="Nombre de la categoría..."
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                handleCreateCategory();
                                            }
                                        }}
                                        className="h-11 bg-slate-50/60 border border-slate-200 text-slate-900 rounded-xl px-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 flex-1"
                                        autoFocus
                                    />
                                    <Button
                                        type="button"
                                        onClick={handleCreateCategory}
                                        disabled={isCreatingCategory}
                                        className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl px-3 h-11 font-semibold text-xs transition active:scale-95 cursor-pointer"
                                    >
                                        <Check className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setShowNewCategory(false);
                                            setNewCategoryName("");
                                        }}
                                        className="border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl px-3 h-11 cursor-pointer"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Expense Concept / Name */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                            <ShoppingBag className="w-3.5 h-3.5 text-rose-600" />
                            Concepto / Nombre del Gasto
                        </label>
                        <Input
                            placeholder="Ej: Veneno para roedores, Flete de maples, Reparación de jaulas..."
                            {...register("name", { required: "El concepto del gasto es obligatorio" })}
                            className="h-11 bg-slate-50/60 border border-slate-200 text-slate-900 rounded-xl px-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                        />
                        {errors.name && (
                            <p className="text-rose-600 text-xs font-medium">
                                {String(errors.name?.message)}
                            </p>
                        )}
                    </div>

                    {/* Quantity & Unit Price Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                <Hash className="w-3.5 h-3.5 text-rose-600" />
                                Cantidad
                            </label>
                            <Input
                                type="number"
                                step="any"
                                min="0"
                                placeholder="1"
                                {...register("quantity", {
                                    valueAsNumber: true,
                                    required: "La cantidad es obligatoria",
                                })}
                                className="h-11 bg-slate-50/60 border border-slate-200 text-slate-900 rounded-xl px-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                            />
                            {errors.quantity && (
                                <p className="text-rose-600 text-xs font-medium">
                                    {String(errors.quantity?.message)}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                <DollarSign className="w-3.5 h-3.5 text-rose-600" />
                                Precio Unitario
                            </label>
                            <PriceInput
                                placeholder="0.00"
                                control={control}
                                name="price"
                                className="h-11 bg-slate-50/60 border border-slate-200 text-slate-900 rounded-xl px-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                            />
                            {errors.price && (
                                <p className="text-rose-600 text-xs font-medium">
                                    {String(errors.price?.message)}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Live Calculation Preview Banner */}
                    <div className="bg-rose-50/40 rounded-xl p-4 border border-rose-100/80 space-y-2">
                        <div className="flex justify-between items-center text-xs text-slate-600">
                            <span>Cálculo Total:</span>
                            <span className="font-medium text-slate-700">
                                {Number(watchedQuantity) || 0} u. × {formatCurrency(Number(watchedPrice) || 0)}
                            </span>
                        </div>
                        <div className="pt-2 border-t border-rose-200/60 flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-800">
                                Total Calculado:
                            </span>
                            <span className="text-lg font-extrabold text-rose-600">
                                -{formatCurrency(totalCalculated)}
                            </span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-rose-600" />
                            Nota o Detalle Adicional (opcional)
                        </label>
                        <textarea
                            placeholder="Comentarios adicionales, proveedor o número de factura/recibo..."
                            {...register("description")}
                            className="w-full p-3 bg-slate-50/60 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 resize-none"
                            rows={3}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={isSubmitting}
                            className="flex-1 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl h-12 font-semibold cursor-pointer"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl h-12 shadow-sm transition active:scale-95 cursor-pointer disabled:opacity-50"
                        >
                            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
