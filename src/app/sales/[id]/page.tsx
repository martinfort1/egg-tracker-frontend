"use client"

import LoadSpin from "@/components/load-spin";
import { Button } from "@/components/ui/button";
import PaymentModal from "@/components/payment-modal";
import { api } from "@/lib/api";
import { Copy, Trash2, Edit, Send } from "lucide-react";
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { formatCurrency, formatUtcDate } from "@/lib/utils";

export default function SalePage(){
    const { id } = useParams();
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [copied, setCopied] = useState(false);

    const fetchData = async () => {
        const res = await api.get(`/sales/${id}`);
        setData(res.data);
    };

    useEffect(() =>{
        fetchData()
    }, [id]);

    const handleDelete = async () => {
        try {
            await api.delete(`/sales/${id}`);
            toast.success("Sale deleted successfully");
            router.push("/sales");
        } catch (error) {
            toast.error("Error deleting sale");
        }
    };

    const buildSaleDetails = (sale: any) => {
          const items = [
            { label: "Extra", qty: sale.Extra, price: sale.ExtraPrice },
            { label: "N1", qty: sale.N1, price: sale.N1Price },
            { label: "N2", qty: sale.N2, price: sale.N2Price },
            { label: "N3", qty: sale.N3, price: sale.N3Price },
            { label: "N4", qty: sale.N4, price: sale.N4Price },
        ];

        return items.filter(item => item.qty > 0 ).map(item => {
            const subtotal = item.qty * item.price;
            return `-${item.label}: ${item.qty} * $${item.price} = $${subtotal}`;
        })
        .join("\n");
    }

    const generateMessage = () => {
        if(!data) return null;

        const sale = data.sale || data;
        const buyer = data.buyer || data?.buyer;

        if(!buyer?.name) return null;

        const details = buildSaleDetails(sale)

        const message = `Hola ${buyer.name}! Te paso la venta:
Fecha: *_${new Date(sale.date).toLocaleDateString()}_*

${details}

- Total: *_$${sale.totalAmount}_*
- Pagado: _$${sale.amountPaid}_

- Deuda Restante: *$${sale.remainingAmount}*
Muchas gracias!`;

        return message;
    }

    const handleCopyToClipboard = () => {
        
        const message = generateMessage()
        if(!message) return toast.error("No se pudo generar el mensaje");

        navigator.clipboard.writeText(message)

        setCopied(true);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSendWhatsApp = () => {
        const message = generateMessage();
        if(!message) return toast.error("No se pudo generar el mensaje");

        const buyer = data.buyer || data?.buyer;

        const encodedMessage = encodeURIComponent(message);

        let phone = buyer?.phone?.replace(/\D/g, "");

        if(phone && !phone.startsWith("54")){
            phone = `549${phone}`;
        }

        const url = phone 
        ? `https://wa.me/${phone}?text=${encodedMessage}`
        : `https://wa.me/?text=${encodedMessage}`

        window.open(url, "_blank");
    }

    if(!data) return <LoadSpin /> 

    const sale = data.sale || data;
    const buyer = data.buyer || data?.buyer;

    const statusColor: any = {
        PAID: "bg-green-500/20 border-green-400 text-green-200",
        PARTIAL: "bg-yellow-500/20 border-yellow-400 text-yellow-200",
        UNPAID: "bg-red-500/20 border-red-400 text-red-200"
    };

    return (
        <div className="grid grid-cols-1 space-y-8 bg-linear-to-br from-slate-900/30 via-slate-900/20 to-slate-900/30 p-4 md:p-6 rounded-2xl border border-white/10 shadow-xl max-w-2xl">
            
            {/* Header */}
            <div className="bg-linear-to-br from-indigo-900/30 via-violet-900/25 to-slate-900/40 p-6 rounded-2xl border border-white/20 shadow-lg">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-3xl font-black text-white mb-1">Sale Details</h1>
                        <p className="text-indigo-200 text-sm">ID: {sale.id}</p>
                    </div>
                    <Link href={`/sales/${id}/edit`}>
                        <Button className="bg-linear-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition active:scale-95 flex items-center gap-2">
                            <Edit size={16} />
                            Edit
                        </Button>
                    </Link>
                </div>
                <div className="grid grid-cols-1 text-center">
                    <p className="text-indigo-100 text-lg font-semibold">Buyer: {buyer.name}</p>
                    <span className={`px-4 py-2 rounded-lg border text-sm font-bold ${statusColor[sale.status]}`}>
                        {sale.status}
                    </span>
                </div>
            </div>

            {/* Sale Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-linear-to-br from-cyan-600/30 via-cyan-700/20 to-slate-900/40 border border-cyan-400/30 p-4 rounded-2xl">
                    <p className="text-cyan-100 text-sm mb-1">Date</p>
                    <p className="text-white font-bold">{formatUtcDate(sale.date)}</p>
                </div>

                <div className="bg-linear-to-br from-orange-600/30 via-orange-700/20 to-slate-900/40 border border-orange-400/30 p-4 rounded-2xl">
                    <p className="text-orange-100 text-sm mb-1">Total</p>
                    <p className="text-white font-bold">{formatCurrency(sale.totalAmount)}</p>
                </div>

                <div className="bg-linear-to-br from-green-600/30 via-green-700/20 to-slate-900/40 border border-green-400/30 p-4 rounded-2xl">
                    <p className="text-green-100 text-sm mb-1">Paid</p>
                    <p className="text-white font-bold">{formatCurrency(sale.amountPaid)}</p>
                </div>

                <div className="bg-linear-to-br from-red-600/30 via-red-700/20 to-slate-900/40 border border-red-400/30 p-4 rounded-2xl">
                    <p className="text-red-100 text-sm mb-1">Debt</p>
                    <p className="text-white font-bold">{formatCurrency(sale.remainingAmount)}</p>
                </div>
            </div>

            {/* Items Breakdown */}
            <div className="bg-linear-to-br from-slate-900/80 via-indigo-900/50 to-slate-900/90 border border-white/20 backdrop-blur-xl p-6 rounded-2xl shadow-lg">
                <h2 className="text-lg font-black text-white mb-4">Items Breakdown</h2>
                <div className="space-y-3">
                    {sale.Extra > 0 && (
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                            <span className="grid text-indigo-100">Extra:</span>
                            <div className="grid-cols-1">
                                <span className="grid text-indigo-100">{sale.Extra} units</span>
                                <span className="grid text-indigo-100 text-xs">{formatCurrency(sale.ExtraPrice)}</span>
                            </div>
                            <span className="text-white font-bold">{formatCurrency(sale.Extra * sale.ExtraPrice)}</span>
                        </div>
                    )}
                    {sale.N1 > 0 && (
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                            <span className="grid text-indigo-100">N1:</span>
                            <div className="grid-cols-1">
                                <span className="grid text-indigo-100">{sale.N1} units</span>
                                <span className="grid text-indigo-100 text-xs">{formatCurrency(sale.N1Price)}</span>
                            </div>
                            <span className="text-white font-bold">{formatCurrency(sale.N1 * sale.N1Price)}</span>
                        </div>
                    )}
                    {sale.N2 > 0 && (
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                            <span className="grid text-indigo-100">N2:</span>
                            <div className="grid-cols-1">
                                <span className="grid text-indigo-100">{sale.N2} units</span>
                                <span className="grid text-indigo-100 text-xs">{formatCurrency(sale.N2Price)}</span>
                            </div>
                            <span className="text-white font-bold">{formatCurrency(sale.N2 * sale.N2Price)}</span>
                        </div>
                    )}
                    {sale.N3 > 0 && (
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                            <span className="grid text-indigo-100">N3:</span>
                            <div className="grid-cols-1">
                                <span className="grid text-indigo-100">{sale.N3} units</span>
                                <span className="grid text-indigo-100 text-xs">{formatCurrency(sale.N3Price)}</span>
                            </div>
                            <span className="text-white font-bold">{formatCurrency(sale.N3 * sale.N3Price)}</span>
                        </div>
                    )}
                    {sale.N4 > 0 && (
                        <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg border border-white/10">
                            <span className="grid text-indigo-100">N4:</span>
                            <div className="grid-cols-1">
                                <span className="grid text-indigo-100">{sale.N4} units</span>
                                <span className="grid text-indigo-100 text-xs">{formatCurrency(sale.N4Price)}</span>
                            </div>
                            <span className="text-white font-bold">{formatCurrency(sale.N4 * sale.N4Price)}</span>
                        </div>
                    )}
                    <div className="flex justify-between bg-linear-to-br from-orange-600/30 via-orange-700/20 to-slate-900/40 border border-orange-400/30 p-4 rounded-2xl">
                        <p className="flex text-orange-100 text-xl mb-1 font-bold">Total:</p>
                        <p className="flex text-white font-bold text-2xl">{formatCurrency(sale.totalAmount)}</p>
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

            {/* Actions */}
            <div className="flex flex-col gap-3">
                    {sale.status !== "PAID" && (
                        <PaymentModal 
                            sale={sale} 
                            onSucess={fetchData}
                        >
                            <span className="w-full block text-center">
                                Add Payment
                            </span>
                        </PaymentModal>
                    )}
                <div className="flex gap-3">
                    <Button
                    onClick={handleSendWhatsApp}
                    size={"sm"}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white cursor-pointer"
                    >
                        <Send size={18} /> Send WhatsApp
                    </Button>
                    <Button
                        onClick={handleCopyToClipboard}
                        className={`flex-1 flex items-center justify-center gap-2 transition active:scale-95 ${
                            copied 
                                ? "bg-green-500/90 text-white" 
                                : "bg-linear-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 cursor-pointer"
                        }`}size="sm"
                    >
                        <Copy size={18} />
                        {copied ? "Copied!" : "Copy Message"}
                    </Button>
                </div>
                <Button
                    onClick={handleDelete}
                    className="w-full bg-linear-to-r from-red-600/90 to-red-700/90 text-white hover:from-red-700 hover:to-red-800 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer" size="sm"
                >
                    <Trash2 size={18} />
                    Delete Sale
                </Button>
            </div>
        </div>
    )
}
