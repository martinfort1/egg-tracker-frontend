"use client";

import OrderForm from "@/components/order-form";
import LoadSpin from "@/components/load-spin";
import { api } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

export default function EditOrderPage() {
    const { id } = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<any>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await api.get(`/orders/${id}`);
                setOrder(res.data);
            } catch (error) {
                console.error(error);
                toast.error("Failed fetching order");
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    if (loading) return <LoadSpin />;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Order
                </button>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    Edit Order #{id}
                </span>
            </div>

            {/* Main Card */}
            <div className="relative bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden">
                <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600" />

                <div className="p-6 sm:p-8 space-y-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-semibold text-slate-900">
                            Edit Order
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Update order customer, delivery date, repeat schedule or egg quantities
                        </p>
                    </div>

                    {order && <OrderForm initialData={order} isEdit={true} />}
                </div>
            </div>
        </div>
    );
}
