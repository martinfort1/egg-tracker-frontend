"use client";

import { Button } from "./ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { Phone, MapPin, ArrowRight, ShoppingCart, Edit, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function EggSupplierCard({ supplier, refresh }: any) {
    const handleDelete = async () => {
        if (!confirm(`¿Eliminar proveedor ${supplier.name}?`)) return;

        await toast.promise(api.delete(`/buyers/${supplier.id}`), {
            loading: "Eliminando proveedor...",
            success: "Proveedor eliminado exitosamente",
            error: "Error al eliminar proveedor",
        });
        refresh?.();
    };

    const initials = (supplier.name || "Proveedor")
        .split(" ")
        .map((w: string) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="group relative bg-white rounded-2xl border border-amber-200/80 p-5 sm:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden gap-4"
        >
            {/* Top Section Accent Line (Amber/Orange) */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600" />

            <div className="space-y-3">
                <div className="flex justify-between items-start gap-3">
                    <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                                Proveedor de Huevos
                            </span>
                            {supplier.isBuyer && (
                                <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.2 rounded-full">
                                    También Cliente
                                </span>
                            )}
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 truncate group-hover:text-amber-700 transition-colors">
                            {supplier.name}
                        </h2>
                    </div>

                    <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                        {initials}
                    </div>
                </div>

                <div className="space-y-2 pt-1 text-xs">
                    <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
                        <Phone className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="truncate font-medium">{supplier.phone || "Sin teléfono"}</span>
                    </div>

                    <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-2 font-medium">{supplier.address || "Sin dirección"}</span>
                    </div>

                    {supplier.notes && (
                        <p className="text-[11px] text-slate-500 italic px-1 pt-1 line-clamp-2">
                            "{supplier.notes}"
                        </p>
                    )}
                </div>
            </div>

            <div className="space-y-2 pt-1">
                <Link href={`/egg-purchases/new?supplierId=${supplier.id}`} className="w-full block">
                    <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white shadow-sm transition active:scale-95 cursor-pointer rounded-xl font-bold text-xs h-9 flex items-center justify-center gap-1.5">
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Nueva Compra</span>
                    </Button>
                </Link>

                <div className="grid grid-cols-2 gap-2">
                    <Link href={`/egg-purchases/suppliers/${supplier.id}`} className="w-full">
                        <Button
                            variant="outline"
                            className="w-full border-slate-200 text-slate-700 hover:bg-amber-50 hover:text-amber-800 rounded-xl font-semibold text-xs h-9 flex items-center justify-center gap-1"
                        >
                            <span>Detalle</span>
                            <ArrowRight className="w-3 h-3" />
                        </Button>
                    </Link>

                    <Link href={`/buyers/${supplier.id}/edit`} className="w-full">
                        <Button
                            variant="outline"
                            className="w-full border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-semibold text-xs h-9 flex items-center justify-center gap-1"
                        >
                            <Edit className="w-3 h-3" />
                            <span>Editar</span>
                        </Button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
