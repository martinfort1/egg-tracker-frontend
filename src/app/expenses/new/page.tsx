"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function NewExpensePage() {
    const router = useRouter();
    const [categories, setCategories] = useState<any[]>([]);
    const [showNewCategory, setShowNewCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            date: new Date().toISOString().split('T')[0],
            name: "",
            quantity: 0,
            price: 0,
            description: "",
            categoryId: ""
        }
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get("/expenses/categories");
            setCategories(response.data);
        } catch (error) {
            toast.error("Failed to fetch categories");
        }
    };

    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) {
            toast.error("Category name cannot be empty");
            return;
        }

        try {
            const response = await api.post("/expenses/categories", { name: newCategoryName });
            setCategories([response.data, ...categories]);
            setSelectedCategory(response.data.id);
            setNewCategoryName("");
            setShowNewCategory(false);
            toast.success("Category created successfully");
        } catch (error) {
            toast.error("Failed to create category");
        }
    };

    const onSubmit = async (data: any) => {
        if (!selectedCategory) {
            toast.error("Please select or create a category");
            return;
        }

        try {
            await api.post("/expenses", {
                ...data,
                categoryId: selectedCategory,
                quantity: parseFloat(data.quantity),
                price: parseFloat(data.price)
            });
            toast.success("Expense created successfully");
            router.push("/expenses");
        } catch (error) {
            toast.error("Failed to create expense");
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900/50 via-slate-900/30 to-slate-900/50 p-4 md:p-6 flex items-center justify-center">
            <div className="w-full max-w-md space-y-6 bg-linear-to-br from-slate-900/80 via-indigo-900/60 to-slate-900/90 border border-white/20 backdrop-blur-xl p-8 rounded-2xl shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Add Expense</h1>
                    <p className="text-indigo-200">Register a new expense</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-white">Date</label>
                        <Input
                            type="date"
                            {...register("date", { required: "Date is required" })}
                            className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                        />
                        {errors.date && <p className="text-red-300 text-xs">{String(errors.date?.message)}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-white">Category</label>
                        <div className="space-y-2">
                            <div className="flex gap-2">
                                {!showNewCategory ? (
                                    <>
                                        <select
                                            value={selectedCategory}
                                            onChange={(e) => setSelectedCategory(e.target.value)}
                                            className="flex-1 px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-slate-900 focus:border-indigo-400"
                                        >
                                            <option value="">Select a category...</option>
                                            {categories.map((cat: any) => (
                                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                                            ))}
                                        </select>
                                        <Button
                                            type="button"
                                            onClick={() => setShowNewCategory(true)}
                                            className="bg-indigo-600 hover:bg-indigo-700"
                                        >
                                            +
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Input
                                            placeholder="Category name"
                                            value={newCategoryName}
                                            onChange={(e) => setNewCategoryName(e.target.value)}
                                            className="bg-white/20 border-white/30 text-white placeholder:text-gray-300"
                                        />
                                        <Button
                                            type="button"
                                            onClick={handleCreateCategory}
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            Create
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-white">Expense Name</label>
                        <Input
                            placeholder="e.g., Poison for rats"
                            {...register("name", { required: "Expense name is required" })}
                            className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                        />
                        {errors.name && <p className="text-red-300 text-xs">{String(errors.name?.message)}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-white">Quantity</label>
                            <Input
                                type="number"
                                step="0.01"
                                placeholder="0"
                                {...register("quantity", { valueAsNumber: true, required: "Quantity is required" })}
                                className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                            />
                            {errors.quantity && <p className="text-red-300 text-xs">{String(errors.quantity?.message)}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-white">Price per Unit</label>
                            <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                {...register("price", { valueAsNumber: true, required: "Price is required" })}
                                className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                            />
                            {errors.price && <p className="text-red-300 text-xs">{String(errors.price?.message)}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-white">Description</label>
                        <textarea
                            placeholder="Brief description (optional)"
                            {...register("description")}
                            className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder:text-gray-300 focus:outline-none focus:border-indigo-400 resize-none"
                            rows={3}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white font-bold hover:from-indigo-700 hover:to-purple-700 transition active:scale-95 rounded-xl cursor-pointer"
                    >
                        Create Expense
                    </Button>
                </form>
            </div>
        </div>
    )
}
