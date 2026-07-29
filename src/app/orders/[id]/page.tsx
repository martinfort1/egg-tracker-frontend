"use client"

import LoadSpin from "@/components/load-spin";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { Copy, Trash2, Edit, Send, PackageCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { formatCurrency, formatUtcDate } from "@/lib/utils";
import FulfillOrderModal from "@/components/fulfill-order-modal";

export default function OrderPage(){
    const { id } = useParams();
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    const fetchData = async () => {
        const res = await api.get(`/orders/${id}`);
        setData(res.data);
    };

    useEffect(() =>{
        fetchData()
    }, [id]);

    const handleDelete = async () => {
        try {
            await api.delete(`/orders/${id}`);
            toast.success("Order cancelled successfully");
            router.push("/orders");
        } catch (error) {
            toast.error("Error deleting order");
        }
    };

    if(!data) return <LoadSpin /> 

    const order = data.order || data;
    const buyer = data.buyer || data?.buyer;

    const statusColor: any = {
        FULFILLED: "bg-green-500/20 border-green-400 text-green-200",
        PENDING: "bg-yellow-500/20 border-yellow-400 text-yellow-200",
        CANCELLED: "bg-red-500/20 border-red-400 text-red-200"
    };

    return (
        <div className="grid grid-cols-1 space-y-8 bg-linear-to-br from-slate-900/30 via-slate-900/20 to-slate-900/30 p-4 md:p-6 rounded-2xl border border-white/10 shadow-xl align-center mx-auto">
            
            {/* Header */}
            <div className="bg-linear-to-br from-indigo-900/30 via-violet-900/25 to-slate-900/40 p-6 rounded-2xl border border-white/20 shadow-lg">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-3xl font-black text-white mb-1">
                        Order Details
                        </h1>

                        <p className="text-indigo-200 text-sm">
                        ID: {order.id}
                        </p>
                    </div>
                    <Link href={`/orders/${id}/edit`}>
                        <Button className="bg-linear-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition active:scale-95 flex items-center gap-2">
                            <Edit size={16} />
                            Edit order
                        </Button>
                    </Link>
                </div>
                <div className="grid grid-cols-1 text-center gap-2">
                    <p className="text-indigo-100 text-lg font-semibold">Buyer: {buyer.name}</p>
                    <span className={`px-4 py-2 rounded-lg border text-sm font-bold ${statusColor[order.status]} w-full md:w-1/2 mx-auto mb-2`}>
                        {order.status}
                    </span>
                    <div className="bg-linear-to-br from-cyan-600/30 via-cyan-700/20 to-slate-900/40 border border-cyan-400/30 p-4 rounded-2xl w-full md:w-1/2 mx-auto">
                    <p className="text-cyan-100 text-sm mb-1">Date</p>
                    <p className="text-white font-bold">{formatUtcDate(order.date)}</p>
                </div>
                </div>
            </div>
{/* Actions */}
        <div className="flex flex-col md:flex-col-2 gap-3">
                <FulfillOrderModal
                    order={order}
                    onSuccess={(payload: any) => {
                        const saleId = payload?.sale?.id ?? payload?.id ?? payload?.saleId;
                        router.push(saleId ? `/sales/${saleId}` : "/orders");
                    }}
                >
                    <Button
                        size="lg"
                        className="w-full md:w-1/2 md:mx-auto bg-linear-to-r from-green-600/90 to-green-700/90 text-white hover:from-green-700 hover:to-green-800 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <PackageCheck size={18} />
                        Fulfill Order
                    </Button>
                </FulfillOrderModal>
                    <Button
                        onClick={handleDelete}
                        className="w-full md:w-1/2 md:mx-auto bg-linear-to-r from-red-600/90 to-red-700/90 text-white hover:from-red-700 hover:to-red-800 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer" 
                        size="lg"
                        >
                        <Trash2 size={18} />
                        Cancel Order
                    </Button>
            </div>
                <div className="bg-linear-to-br from-slate-900/70 via-purple-900/40 to-slate-900/80 border border-white/20 backdrop-blur-xl p-6 w-full md:w-2/3 mx-auto rounded-2xl shadow-lg">
                    <p className="text-indigo-100 text-lg font-bold mb-1 text-center">Recurring Schedule</p>

                    {order.recurring ? (
                        <div className="flex flex-wrap justify-center gap-2">
                        {order.recurringDays.map((day: string) => (
                            <span
                            key={day}
                            className="px-3 py-1 rounded-full bg-gray-600/45 border border-indigo-400/30 text-indigo-100"
                            >
                            {day}
                            </span>
                        ))}
                        </div>
                    ) : (
                        <p className="text-indigo-100">
                        One-time order
                        </p>
                    )}
                </div>  

            {/* Items Breakdown */}
            <div className="bg-linear-to-br from-slate-900/80 via-indigo-900/50 to-slate-900/90 border border-white/20 backdrop-blur-xl p-6 rounded-2xl shadow-lg">
                <h2 className="text-lg font-black text-white mb-4">Items Breakdown</h2>
                <div className="space-y-3">
                    {order.Extra > 0 && (
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                            <span className="grid text-indigo-100">Extra:</span>
                            <div className="grid-cols-1">
                                <span className="grid text-indigo-100">{order.Extra} units</span>
                                <span className="grid text-indigo-100 text-xs">{formatCurrency(order.ExtraPrice)}</span>
                            </div>
                            <span className="text-white font-bold">{formatCurrency(order.Extra * order.ExtraPrice)}</span>
                        </div>
                    )}
                    {order.N1 > 0 && (
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                            <span className="grid text-indigo-100">N1:</span>
                            <div className="grid-cols-1">
                                <span className="grid text-indigo-100">{order.N1} units</span>
                                <span className="grid text-indigo-100 text-xs">{formatCurrency(order.N1Price)}</span>
                            </div>
                            <span className="text-white font-bold">{formatCurrency(order.N1 * order.N1Price)}</span>
                        </div>
                    )}
                    {order.N2 > 0 && (
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                            <span className="grid text-indigo-100">N2:</span>
                            <div className="grid-cols-1">
                                <span className="grid text-indigo-100">{order.N2} units</span>
                                <span className="grid text-indigo-100 text-xs">{formatCurrency(order.N2Price)}</span>
                            </div>
                            <span className="text-white font-bold">{formatCurrency(order.N2 * order.N2Price)}</span>
                        </div>
                    )}
                    {order.N3 > 0 && (
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                            <span className="grid text-indigo-100">N3:</span>
                            <div className="grid-cols-1">
                                <span className="grid text-indigo-100">{order.N3} units</span>
                                <span className="grid text-indigo-100 text-xs">{formatCurrency(order.N3Price)}</span>
                            </div>
                            <span className="text-white font-bold">{formatCurrency(order.N3 * order.N3Price)}</span>
                        </div>
                    )}
                    {order.N4 > 0 && (
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                            <span className="grid text-indigo-100">N4:</span>
                            <div className="grid-cols-1">
                                <span className="grid text-indigo-100">{order.N4} units</span>
                                <span className="grid text-indigo-100 text-xs">{formatCurrency(order.N4Price)}</span>
                            </div>
                            <span className="text-white font-bold">{formatCurrency(order.N4 * order.N4Price)}</span>
                        </div>
                    )}
                    <div className="flex justify-between bg-linear-to-br from-orange-600/30 via-orange-700/20 to-slate-900/40 border border-orange-400/30 p-4 rounded-2xl">
                        <p className="flex text-orange-100 text-xl mb-1 font-bold">Total:</p>
                        <p className="flex text-white font-bold text-2xl">{formatCurrency(order.totalAmount)}</p>
                    </div>
                </div>
            </div>

            {/* Buyer Info */}
            <div className="bg-linear-to-br from-slate-900/70 via-purple-900/40 to-slate-900/80 border border-white/20 backdrop-blur-xl p-6 rounded-2xl shadow-lg">
                <h2 className="text-lg font-black text-white mb-3">Buyer Information</h2>
                <div className="space-y-2 text-indigo-100">
                    <p><span className="text-white font-bold">Name:</span> {buyer.name}</p>
                    <p><span className="text-white font-bold">Phone:</span> {buyer.phone}</p>
                    <p><span className="text-white font-bold">Address:</span> {buyer.address}</p>
                </div>
            </div>

        </div>
    )
}
