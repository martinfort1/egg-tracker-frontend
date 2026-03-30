"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { saleSchema } from "@/lib/schemas/sales.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import LoadSpin from "@/components/load-spin";

export default function EditSalePage() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;
    const [buyers, setBuyers] = useState<any[]>([])
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm({
        resolver: zodResolver(saleSchema),
        defaultValues: {
            Extra: 0,
            N1: 0,
            N2: 0,
            N3: 0,
            N4: 0,
            ExtraPrice: 0,
            N1Price: 0,
            N2Price: 0,
            N3Price: 0,
            N4Price: 0,
            amountPaid: 0
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch buyers
                const buyersRes = await api.get("/buyers");
                setBuyers(buyersRes.data);

                // Fetch sale data
                const saleRes = await api.get(`/sales/${id}`);
                const sale = saleRes.data.sale || saleRes.data;

                // Set form values
                setValue("buyerId", sale.buyerId || sale.buyer?.id);
                setValue("Extra", sale.Extra || 0);
                setValue("N1", sale.N1 || 0);
                setValue("N2", sale.N2 || 0);
                setValue("N3", sale.N3 || 0);
                setValue("N4", sale.N4 || 0);
                setValue("ExtraPrice", sale.ExtraPrice || 0);
                setValue("N1Price", sale.N1Price || 0);
                setValue("N2Price", sale.N2Price || 0);
                setValue("N3Price", sale.N3Price || 0);
                setValue("N4Price", sale.N4Price || 0);
                setValue("amountPaid", sale.amountPaid || 0);

                setLoading(false);
            } catch (error) {
                toast.error("Failed to load sale data");
                router.push("/sales");
            }
        };

        fetchData();
    }, [id, setValue, router]);

    const values = watch();

    useEffect(() => {
        const totalCalculation =
        values.Extra * values.ExtraPrice +
        values.N1 * values.N1Price +
        values.N2 * values.N2Price +
        values.N3 * values.N3Price +
        values.N4 * values.N4Price;

        setTotal(totalCalculation || 0);
    }, [values]);

    const onSubmit = async (data: any) => {
        try {
            await api.patch(`/sales/${id}`, data);
            toast.success('Sale updated successfully');
            router.push(`/sales/${id}`);
        } catch (err) {
            console.error(err);
            toast.error('Failed to update sale');
        }
    };

    if (loading) return <LoadSpin />;

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900/50 via-slate-900/30 to-slate-900/50 p-4 md:p-6">
            <div className="w-full max-w-2xl mx-auto space-y-6 bg-linear-to-br from-slate-900/80 via-indigo-900/60 to-slate-900/90 border border-white/20 backdrop-blur-xl p-8 rounded-2xl shadow-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Edit Sale</h1>
                    <p className="text-indigo-200">Update sale information</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Client Selection */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-white">Client</label>
                        <select
                            {...register("buyerId")}
                            className="w-full bg-white/20 border border-white/30 text-white rounded-xl p-3 focus:border-indigo-400 focus:ring-indigo-400/20 focus:outline-none transition [&>option]:bg-slate-900 [&>option]:text-white"
                        >
                            <option value="" className="bg-slate-900 text-white">Select buyer</option>
                            {buyers.map((buyer) => (
                                <option key={buyer.id} value={buyer.id} className="bg-slate-900 text-white">
                                    {buyer.name}
                                </option>
                            ))}
                        </select>
                        {errors.buyerId && <p className="text-red-300 text-xs">{String(errors.buyerId?.message)}</p>}
                    </div>

                    <div className="flex justify-center">
                        <Link href="/buyers/new">
                            <Button className="bg-linear-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 rounded-full flex items-center gap-2 transition active:scale-95">
                                <Plus size={18} />
                                Add New Buyer
                            </Button>
                        </Link>
                    </div>

                    {/* Items Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
                        {/* Extra */}
                        <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/10">
                            <h3 className="text-sm font-bold text-white">Extra</h3>
                            <div>
                                <label className="text-xs font-semibold text-indigo-200 mb-1 block">Quantity</label>
                                <Input
                                    placeholder="0"
                                    type="number"
                                    {...register("Extra", {valueAsNumber: true})}
                                    className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-indigo-200 mb-1 block">Price per Unit</label>
                                <Input
                                    placeholder="0"
                                    type="number"
                                    {...register("ExtraPrice", {valueAsNumber: true})}
                                    className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                                />
                            </div>
                        </div>

                        {/* N1 */}
                        <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/10">
                            <h3 className="text-sm font-bold text-white">N1</h3>
                            <div>
                                <label className="text-xs font-semibold text-indigo-200 mb-1 block">Quantity</label>
                                <Input
                                    placeholder="0"
                                    type="number"
                                    {...register("N1", {valueAsNumber: true})}
                                    className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-indigo-200 mb-1 block">Price per Unit</label>
                                <Input
                                    placeholder="0"
                                    type="number"
                                    {...register("N1Price", {valueAsNumber: true})}
                                    className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                                />
                            </div>
                        </div>

                        {/* N2 */}
                        <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/10">
                            <h3 className="text-sm font-bold text-white">N2</h3>
                            <div>
                                <label className="text-xs font-semibold text-indigo-200 mb-1 block">Quantity</label>
                                <Input
                                    placeholder="0"
                                    type="number"
                                    {...register("N2", {valueAsNumber: true})}
                                    className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-indigo-200 mb-1 block">Price per Unit</label>
                                <Input
                                    placeholder="0"
                                    type="number"
                                    {...register("N2Price", {valueAsNumber: true})}
                                    className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                                />
                            </div>
                        </div>

                        {/* N3 */}
                        <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/10">
                            <h3 className="text-sm font-bold text-white">N3</h3>
                            <div>
                                <label className="text-xs font-semibold text-indigo-200 mb-1 block">Quantity</label>
                                <Input
                                    placeholder="0"
                                    type="number"
                                    {...register("N3", {valueAsNumber: true})}
                                    className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-indigo-200 mb-1 block">Price per Unit</label>
                                <Input
                                    placeholder="0"
                                    type="number"
                                    {...register("N3Price", {valueAsNumber: true})}
                                    className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                                />
                            </div>
                        </div>

                        {/* N4 */}
                        <div className="space-y-3 bg-white/5 p-4 rounded-xl border border-white/10">
                            <h3 className="text-sm font-bold text-white">N4</h3>
                            <div>
                                <label className="text-xs font-semibold text-indigo-200 mb-1 block">Quantity</label>
                                <Input
                                    placeholder="0"
                                    type="number"
                                    {...register("N4", {valueAsNumber: true})}
                                    className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-indigo-200 mb-1 block">Price per Unit</label>
                                <Input
                                    placeholder="0"
                                    type="number"
                                    {...register("N4Price", {valueAsNumber: true})}
                                    className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Amount Paid */}
                    <div className="space-y-2 pt-4 border-t border-white/10">
                        <label className="text-sm font-semibold text-white">Amount Paid</label>
                        <Input
                            placeholder="0"
                            type="number"
                            {...register("amountPaid", {valueAsNumber: true})}
                            className="bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:border-indigo-400 focus:ring-indigo-400/20"
                        />
                    </div>

                    {/* Total Display & Debt Calculation */}
                    <div className="space-y-3 bg-linear-to-r from-orange-600/30 to-yellow-600/30 border border-orange-400/30 rounded-xl p-4">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-white">Total:</span>
                            <span className="text-2xl font-black text-orange-200">${total}</span>
                        </div>
                        <div className="border-t border-orange-400/30 pt-3 flex justify-between items-center">
                            <span className="text-sm font-semibold text-white">Amount to Pay:</span>
                            <span className="text-lg font-bold text-orange-100">${values.amountPaid || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold text-white">Remaining Debt:</span>
                            <span className={`text-lg font-black ${
                                (total - (values.amountPaid || 0)) <= 0 ? 'text-green-300' : 'text-red-300'
                            }`}>${Math.max(0, total - (values.amountPaid || 0))}</span>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-3">
                        <Button
                            type="button"
                            onClick={() => router.back()}
                            className="flex-1 bg-gray-600 text-white hover:bg-gray-700 transition active:scale-95 rounded-xl cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-bold hover:from-indigo-700 hover:to-purple-700 transition active:scale-95 rounded-xl py-6 text-lg cursor-pointer"
                        >
                            Update Sale
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}