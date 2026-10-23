"use client";

import LoadSpin from "@/components/load-spin";
import { Button } from "@/components/ui/button";
import PaymentModal from "@/components/payment-modal";
import { api } from "@/lib/api";
import {
    MapPin,
    Phone,
    Edit,
    Trash2,
    Plus,
    ArrowLeft,
    Calendar,
    ShoppingBag,
    DollarSign,
    CheckCircle2,
    Clock,
    AlertCircle,
    User,
    FileText,
    Share2,
    Printer,
    Table as TableIcon,
    LayoutGrid,
    Check,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { formatCurrency, formatUtcDate } from "@/lib/utils";

export default function BuyerAccountStatementPage() {
    const { id } = useParams();
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"ledger" | "cards">("ledger");
    const [filterOnlyDebt, setFilterOnlyDebt] = useState(false);
    const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/buyers/${id}/history`);
            setData(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load customer profile");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleDeleteBuyer = async () => {
        if (!confirm("Are you sure you want to delete this customer?")) return;

        await toast.promise(api.delete(`/buyers/${id}`), {
            loading: "Deleting customer...",
            success: "Customer deleted successfully",
            error: "Error deleting customer",
        });
        router.push("/buyers");
    };

    const handleDeleteSale = async (saleId: string) => {
        if (!confirm("Are you sure you want to delete this operation?")) return;

        try {
            await api.delete(`/sales/${saleId}`);
            toast.success("Operation deleted successfully");
            fetchData();
        } catch (error) {
            toast.error("Error deleting operation");
        }
    };

    const handleShareStatement = () => {
        if (!data) return;
        const { buyer, stats, sales } = data;

        const unpaidSales = sales.filter((s: any) => s.status !== "PAID" && s.remainingAmount > 0);

        let unpaidDetails = "";
        if (unpaidSales.length > 0) {
            unpaidDetails = "\n*Operaciones con saldo pendiente:*\n" + unpaidSales.map((s: any) => (
                `• Venta ${s.saleNumber ? `N° ${s.saleNumber} ` : ""}del ${new Date(s.date).toLocaleDateString()}: Total ${formatCurrency(s.totalAmount)} | Saldo adeudado: ${formatCurrency(s.remainingAmount)}`
            )).join("\n");
        }

        const message = `*ESTADO DE CUENTA — HUEVOS NOA*
Cliente: *${buyer.name}*
Fecha: ${new Date().toLocaleDateString()}

*Resumen de Cuenta:*
• Total Comprado: ${formatCurrency(stats.totalSpent)}
• Total Abonado: ${formatCurrency(stats.totalPaid)}
• *SALDO ACTUAL ADEUDADO: ${formatCurrency(stats.totalDebt)}*
${unpaidDetails}

_Para cualquier consulta sobre este estado de cuenta, quedamos a su disposición._
Muchas gracias. *Huevos NOA*`;

        const encoded = encodeURIComponent(message);
        let phone = buyer?.phone?.replace(/\D/g, "");
        if (phone && !phone.startsWith("54")) {
            phone = `549${phone}`;
        }

        const url = phone
            ? `https://wa.me/${phone}?text=${encoded}`
            : `https://wa.me/?text=${encoded}`;

        window.open(url, "_blank");
    };

    if (loading) return <LoadSpin />;
    if (!data) return <div className="text-center py-12 text-slate-500">Customer not found</div>;

    const { buyer, stats, sales } = data;

    const filteredSales = filterOnlyDebt
        ? sales.filter((s: any) => s.status !== "PAID" && s.remainingAmount > 0)
        : sales;

    const statusBadge: Record<string, { className: string; icon: any }> = {
        PAID: {
            className: "bg-emerald-50 text-emerald-700 border-emerald-200",
            icon: CheckCircle2,
        },
        PARTIAL: {
            className: "bg-amber-50 text-amber-700 border-amber-200",
            icon: Clock,
        },
        UNPAID: {
            className: "bg-rose-50 text-rose-700 border-rose-200",
            icon: AlertCircle,
        },
    };

    const formatSaleItems = (sale: any) => {
        const items = [];
        if (sale.Extra > 0) items.push(`Extra: ${sale.Extra}`);
        if (sale.N1 > 0) items.push(`N°1: ${sale.N1}`);
        if (sale.N2 > 0) items.push(`N°2: ${sale.N2}`);
        if (sale.N3 > 0) items.push(`N°3: ${sale.N3}`);
        if (sale.N4 > 0) items.push(`N°4: ${sale.N4}`);
        return items.length > 0 ? items.join(" • ") : "Cartons not specified";
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Top Navigation Bar & Action Chips */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <button
                    type="button"
                    onClick={() => router.push("/buyers")}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer w-fit"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Customers
                </button>

                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        onClick={handleShareStatement}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#25D366] hover:bg-[#1EBE5D] text-white shadow-2xs transition active:scale-95 cursor-pointer"
                    >
                        <Share2 className="w-3.5 h-3.5" />
                        Send Statement on WhatsApp
                    </button>

                    <button
                        type="button"
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-2xs transition active:scale-95 cursor-pointer"
                    >
                        <Printer className="w-3.5 h-3.5 text-slate-500" />
                        Print / PDF
                    </button>
                </div>
            </div>

            {/* Official Customer Statement Header Card */}
            <div className="relative bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden p-6 sm:p-8">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600" />

                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 pt-1">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                                Customer Account Statement
                            </span>
                            <span className="text-xs text-slate-400">
                                As of {new Date().toLocaleDateString()}
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-black text-xl flex items-center justify-center">
                                {buyer.name?.slice(0, 2).toUpperCase() || "CL"}
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-semibold text-slate-900">
                                    {buyer.name}
                                </h1>
                                <p className="text-xs text-slate-400">Cliente #{buyer.id.slice(0, 8)}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-indigo-600 shrink-0" />
                                <span>{buyer.phone || "No phone registered"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
                                <span>{buyer.address || "No address provided"}</span>
                            </div>
                        </div>

                        {buyer.notes && (
                            <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
                                <span className="font-semibold text-slate-700">Commercial Notes:</span> {buyer.notes}
                            </p>
                        )}
                    </div>

                    {/* Quick Customer Action Buttons */}
                    <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
                        <Link href={`/sales/new?buyerId=${buyer.id}`} className="flex-1 md:flex-none">
                            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-10 px-4 text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 cursor-pointer">
                                <Plus className="w-4 h-4" />
                                Record New Sale
                            </Button>
                        </Link>
                        <Link href={`/buyers/${buyer.id}/edit`} className="flex-1 md:flex-none">
                            <Button
                                variant="outline"
                                className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl h-10 px-4 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                                <Edit className="w-3.5 h-3.5" />
                                Edit Customer
                            </Button>
                        </Link>
                        <Button
                            onClick={handleDeleteBuyer}
                            variant="outline"
                            className="border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 rounded-xl h-10 px-4 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                        </Button>
                    </div>
                </div>
            </div>

            {/* Account Balances Summary (Estado de Saldos) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Total Invoiced
                    </p>
                    <p className="text-2xl font-black text-slate-900">
                        {formatCurrency(stats.totalSpent)}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">{sales.length} operations total</p>
                </div>

                <div className="bg-emerald-50/60 rounded-2xl border border-emerald-200/80 p-4 shadow-sm">
                    <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
                        Total Collected
                    </p>
                    <p className="text-2xl font-black text-emerald-800">
                        {formatCurrency(stats.totalPaid)}
                    </p>
                    <p className="text-[11px] text-emerald-600 mt-1">Paid amounts to date</p>
                </div>

                <div className={`rounded-2xl border p-4 shadow-sm col-span-2 ${
                    stats.totalDebt > 0
                        ? "bg-rose-50/70 border-rose-200/90"
                        : "bg-emerald-50/70 border-emerald-200/90"
                }`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${
                                stats.totalDebt > 0 ? "text-rose-700" : "text-emerald-700"
                            }`}>
                                Current Balance (Total Outstanding Debt)
                            </p>
                            <p className={`text-3xl font-black ${
                                stats.totalDebt > 0 ? "text-rose-700" : "text-emerald-700"
                            }`}>
                                {stats.totalDebt > 0 ? formatCurrency(stats.totalDebt) : "Account Settled ($0)"}
                            </p>
                        </div>
                        {stats.totalDebt > 0 && (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                                Pending Payment
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Account Movement Controls (Filters & View Toggles) */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                <div>
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-indigo-600" />
                        Account Ledger & Statement Movements
                    </h2>
                    <p className="text-xs text-slate-500">
                        Detailed breakdown of each sale and payment. Modify or register payments for each operation independently.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {/* Filter only debt */}
                    <button
                        type="button"
                        onClick={() => setFilterOnlyDebt(!filterOnlyDebt)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                            filterOnlyDebt
                                ? "bg-rose-50 border-rose-300 text-rose-700"
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                    >
                        {filterOnlyDebt ? "Showing Debts Only" : "Filter Unpaid"}
                    </button>

                    {/* View Switcher: Table vs Cards */}
                    <div className="bg-slate-100 p-0.5 rounded-xl flex items-center border border-slate-200">
                        <button
                            type="button"
                            onClick={() => setViewMode("ledger")}
                            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                                viewMode === "ledger"
                                    ? "bg-white text-slate-900 shadow-2xs"
                                    : "text-slate-500 hover:text-slate-900"
                            }`}
                            title="Table View (Libro Diario)"
                        >
                            <TableIcon className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Ledger</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode("cards")}
                            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                                viewMode === "cards"
                                    ? "bg-white text-slate-900 shadow-2xs"
                                    : "text-slate-500 hover:text-slate-900"
                            }`}
                            title="Cards View"
                        >
                            <LayoutGrid className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Cards</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Empty State */}
            {filteredSales.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-3">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto" />
                    <p className="text-base font-semibold text-slate-700">No account movements found</p>
                    <p className="text-xs text-slate-400">
                        {filterOnlyDebt
                            ? "This customer has no outstanding debts on record"
                            : "Create the first sale to start recording operations on this account"}
                    </p>
                </div>
            ) : viewMode === "ledger" ? (
                /* LEDGER / TABLE VIEW (Libro Diario / Estado de Cuenta Contable) */
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50/90 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                                <tr>
                                    <th className="py-3 px-4">Fecha</th>
                                    <th className="py-3 px-4">N° Venta</th>
                                    <th className="py-3 px-4">Detalle Huevos</th>
                                    <th className="py-3 px-4 text-right">Facturado</th>
                                    <th className="py-3 px-4 text-right">Abonado</th>
                                    <th className="py-3 px-4 text-right">Saldo</th>
                                    <th className="py-3 px-4 text-center">Estado</th>
                                    <th className="py-3 px-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredSales.map((sale: any) => {
                                    const badge = statusBadge[sale.status] || {
                                        className: "bg-slate-100 text-slate-700 border-slate-200",
                                        icon: Clock,
                                    };
                                    const StatusIcon = badge.icon;

                                    return (
                                        <tr
                                            key={sale.id}
                                            className="hover:bg-indigo-50/30 transition-colors"
                                        >
                                            <td className="py-3 px-4 font-medium text-slate-700 whitespace-nowrap">
                                                {formatUtcDate(sale.date)}
                                            </td>
                                            <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                                                {sale.saleNumber ? `N° ${sale.saleNumber}` : `#${sale.id.slice(0, 8)}`}
                                            </td>
                                            <td className="py-3 px-4 text-xs text-slate-600 max-w-xs truncate font-medium">
                                                {formatSaleItems(sale)}
                                            </td>
                                            <td className="py-3 px-4 text-right font-bold text-slate-900 whitespace-nowrap">
                                                {formatCurrency(sale.totalAmount)}
                                            </td>
                                            <td className="py-3 px-4 text-right font-semibold text-emerald-700 whitespace-nowrap">
                                                {formatCurrency(sale.amountPaid)}
                                            </td>
                                            <td className="py-3 px-4 text-right font-black whitespace-nowrap">
                                                <span
                                                    className={
                                                        sale.remainingAmount > 0
                                                            ? "text-rose-600"
                                                            : "text-emerald-700"
                                                    }
                                                >
                                                    {sale.remainingAmount > 0
                                                        ? formatCurrency(sale.remainingAmount)
                                                        : "$0"}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-center whitespace-nowrap">
                                                <span
                                                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.className}`}
                                                >
                                                    <StatusIcon className="w-3 h-3" />
                                                    {sale.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    {/* Modify Operation by itself */}
                                                    <Link href={`/sales/${sale.id}/edit`}>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            title="Modify this operation separately"
                                                            className="h-8 px-2.5 text-xs font-semibold border-slate-200 text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-lg flex items-center gap-1 cursor-pointer"
                                                        >
                                                            <Edit className="w-3 h-3" />
                                                            <span>Modify</span>
                                                        </Button>
                                                    </Link>

                                                    {/* Add payment to this operation */}
                                                    {sale.status !== "PAID" && (
                                                        <PaymentModal
                                                            sale={{ ...sale, buyer }}
                                                            onSuccess={fetchData}
                                                        >
                                                            <Button
                                                                size="sm"
                                                                title="Pay this operation"
                                                                className="h-8 px-2 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg flex items-center gap-1 cursor-pointer"
                                                            >
                                                                <DollarSign className="w-3 h-3" />
                                                                <span>Pay</span>
                                                            </Button>
                                                        </PaymentModal>
                                                    )}

                                                    {/* Details */}
                                                    <Link href={`/sales/${sale.id}`}>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 px-2 text-xs text-slate-500 hover:text-slate-900 rounded-lg"
                                                        >
                                                            View
                                                        </Button>
                                                    </Link>

                                                    {/* Delete */}
                                                    <Button
                                                        onClick={() => handleDeleteSale(sale.id)}
                                                        variant="ghost"
                                                        size="sm"
                                                        title="Delete operation"
                                                        className="h-8 px-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* CARDS VIEW */
                <div className="space-y-3">
                    {filteredSales.map((sale: any) => {
                        const badge = statusBadge[sale.status] || {
                            className: "bg-slate-100 text-slate-700 border-slate-200",
                            icon: Clock,
                        };
                        const StatusIcon = badge.icon;

                        return (
                            <div
                                key={sale.id}
                                className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-200 p-5 shadow-xs transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                            >
                                <div className="space-y-2 min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md">
                                            {sale.saleNumber ? `Venta N° ${sale.saleNumber}` : `Operación #${sale.id.slice(0, 8)}`}
                                        </span>
                                        <span className="text-slate-300">•</span>
                                        <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                            {formatUtcDate(sale.date)}
                                        </span>
                                        <span
                                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.className}`}
                                        >
                                            <StatusIcon className="w-3 h-3" />
                                            {sale.status}
                                        </span>
                                    </div>

                                    <p className="text-xs text-slate-600 font-medium">
                                        <span className="text-slate-400">Merchandise:</span>{" "}
                                        {formatSaleItems(sale)}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                                        <div>
                                            <span className="text-slate-400">Invoiced:</span>{" "}
                                            <span className="font-bold text-slate-900 text-sm">
                                                {formatCurrency(sale.totalAmount)}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-slate-400">Paid:</span>{" "}
                                            <span className="font-semibold text-emerald-700">
                                                {formatCurrency(sale.amountPaid)}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-slate-400">Balance:</span>{" "}
                                            <span
                                                className={`font-bold ${
                                                    sale.remainingAmount > 0
                                                        ? "text-rose-600"
                                                        : "text-emerald-700"
                                                }`}
                                            >
                                                {sale.remainingAmount > 0
                                                    ? formatCurrency(sale.remainingAmount)
                                                    : "Settled"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 shrink-0">
                                    <Link href={`/sales/${sale.id}/edit`}>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-slate-200 text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-lg text-xs font-semibold h-8.5 px-3 flex items-center gap-1 cursor-pointer"
                                        >
                                            <Edit className="w-3.5 h-3.5" />
                                            Modify Operation
                                        </Button>
                                    </Link>

                                    {sale.status !== "PAID" && (
                                        <PaymentModal
                                            sale={{ ...sale, buyer }}
                                            onSuccess={fetchData}
                                        >
                                            <Button
                                                size="sm"
                                                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold h-8.5 px-3 flex items-center gap-1 cursor-pointer"
                                            >
                                                <DollarSign className="w-3.5 h-3.5" />
                                                Pay
                                            </Button>
                                        </PaymentModal>
                                    )}

                                    <Link href={`/sales/${sale.id}`}>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-xs font-semibold h-8.5 px-3 cursor-pointer"
                                        >
                                            Details
                                        </Button>
                                    </Link>

                                    <Button
                                        onClick={() => handleDeleteSale(sale.id)}
                                        variant="ghost"
                                        size="sm"
                                        className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg h-8.5 px-2 cursor-pointer"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
