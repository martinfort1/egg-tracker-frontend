"use client"

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import LoadSpin from "@/components/load-spin";
import PaymentModal from "@/components/payment-modal";

interface Carton {
    id: string;
    date: string;
    quantity: number;
    price: number;
    totalAmount: number;
    amountPaid: number;
    remainingAmount: number;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export default function CartonDetailPage() {
    const router = useRouter();
    const [carton, setCarton] = useState<Carton | null>(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    const fetchCarton = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/cartons/${id}`);
            setCarton(response.data);
        } catch (error) {
            toast.error("Failed to fetch carton");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCarton();
    }, [id]);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this carton purchase?")) return;

        try {
            await api.delete(`/cartons/${id}`);
            toast.success("Carton purchase deleted successfully");
            router.push("/cartons");
        } catch (error) {
            toast.error("Failed to delete carton purchase");
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PAID': return 'bg-green-500/20 text-green-300 border-green-500/30';
            case 'PARTIAL': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
            case 'UNPAID': return 'bg-red-500/20 text-red-300 border-red-500/30';
            default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-900/50 via-slate-900/30 to-slate-900/50 p-4 md:p-6 flex items-center justify-center">
                <LoadSpin />
            </div>
        );
    }

    if (!carton) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-900/50 via-slate-900/30 to-slate-900/50 p-4 md:p-6 flex items-center justify-center">
                <div className="text-white">Carton purchase not found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900/50 via-slate-900/30 to-slate-900/50 p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-linear-to-br from-slate-900/80 via-indigo-900/60 to-slate-900/90 border border-white/20 backdrop-blur-xl p-8 rounded-2xl shadow-2xl">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Carton Purchase Details</h1>
                            <p className="text-indigo-200">{carton.quantity} cartons • {new Date(carton.date).toLocaleDateString()}</p>
                        </div>
                        <div className="flex gap-3">
                            {carton.status !== 'PAID' && (
                                <PaymentModal
                                    sale={carton}
                                    endpoint="cartons"
                                    onSuccess={fetchCarton}
                                >
                                    Add Payment
                                </PaymentModal>
                            )}
                            <Button
                                onClick={() => router.push(`/cartons/${carton.id}/edit`)}
                                className="bg-linear-to-r from-blue-600 to-cyan-600 text-white font-bold hover:from-blue-700 hover:to-cyan-700 transition active:scale-95 rounded-xl cursor-pointer"
                            >
                                Edit
                            </Button>
                            <Button
                                onClick={handleDelete}
                                className="bg-linear-to-r from-red-600 to-pink-600 text-white font-bold hover:from-red-700 hover:to-pink-700 transition active:scale-95 rounded-xl cursor-pointer"
                            >
                                Delete
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                            <div className="bg-white/10 border border-white/20 p-6 rounded-xl">
                                <h3 className="text-lg font-bold text-white mb-4">Purchase Information</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-semibold text-indigo-200">Purchase Date</label>
                                        <p className="text-white font-medium">{new Date(carton.date).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-indigo-200">Quantity</label>
                                        <p className="text-white font-medium">{carton.quantity} cartons</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-indigo-200">Price per carton</label>
                                        <p className="text-white font-medium">${carton.price}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/10 border border-white/20 p-6 rounded-xl">
                                <h3 className="text-lg font-bold text-white mb-4">Payment Information</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-semibold text-indigo-200">Total Amount</label>
                                        <p className="text-white font-medium">${carton.totalAmount.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-indigo-200">Amount Paid</label>
                                        <p className="text-green-300 font-medium">${carton.amountPaid.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-indigo-200">Remaining Amount</label>
                                        <p className="text-orange-300 font-medium">${carton.remainingAmount.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-indigo-200">Payment Status</label>
                                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(carton.status)}`}>
                                            {carton.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white/10 border border-white/20 p-6 rounded-xl">
                                <h3 className="text-lg font-bold text-white mb-4">Timestamps</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-semibold text-indigo-200">Created</label>
                                        <p className="text-white font-medium">
                                            {new Date(carton.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-indigo-200">Last Updated</label>
                                        <p className="text-white font-medium">
                                            {new Date(carton.updatedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}