"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api";
import { buyerSchema } from "@/lib/schemas/buyer.schema";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { pickContact } from "@/lib/contact-picker";
import { Smartphone, ArrowLeft, User, Phone, MapPin, FileText, CheckCircle2 } from "lucide-react";
import { useState, Suspense } from "react";

function NewBuyerForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const roleParam = searchParams.get("role");

    const [isLoadingContact, setIsLoadingContact] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isDefaultSupplier = roleParam === "supplier";

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<any>({
        resolver: zodResolver(buyerSchema),
        defaultValues: {
            isBuyer: !isDefaultSupplier,
            isEggSupplier: isDefaultSupplier,
        },
    });

    const isBuyerValue = watch("isBuyer");
    const isEggSupplierValue = watch("isEggSupplier");

    const handleImportContact = async () => {
        setIsLoadingContact(true);
        try {
            const contact = await pickContact();
            if (contact) {
                if (contact.name) setValue("name", contact.name);
                if (contact.phone) setValue("phone", contact.phone);
                if (contact.address) setValue("address", contact.address);
                toast.success("Contact imported successfully");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to import contact");
        } finally {
            setIsLoadingContact(false);
        }
    };

    const onSubmit = async (data: any) => {
        if (!data.isBuyer && !data.isEggSupplier) {
            toast.error("Debes seleccionar al menos un rol (Comprador o Proveedor)");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await api.post("/buyers", data);
            toast.success("Contacto creado exitosamente");
            if (isDefaultSupplier) {
                router.push(`/egg-purchases`);
            } else {
                router.push(`/buyers/${res.data.id || ""}`);
            }
        } catch (error) {
            toast.error("Failed to create customer");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver
                </button>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    {isDefaultSupplier ? "Nuevo Proveedor" : "Nuevo Cliente"}
                </span>
            </div>

            {/* Main Form Card */}
            <div className="relative bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600" />

                <div>
                    <h1 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-semibold text-slate-900">
                        {isDefaultSupplier ? "Registrar Proveedor de Huevos" : "Registrar Cliente / Contacto"}
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        {isDefaultSupplier
                            ? "Registrá los datos del contacto a quien le compras huevos"
                            : "Registrá los datos para seguimiento de ventas, entregas o compras"}
                    </p>
                </div>

                {/* Import Contact Button */}
                <Button
                    type="button"
                    onClick={handleImportContact}
                    disabled={isLoadingContact}
                    variant="outline"
                    className="w-full border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 font-semibold rounded-xl h-11 flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                    <Smartphone className="w-4 h-4 text-indigo-600" />
                    {isLoadingContact ? "Importando..." : "Importar desde Contactos del Celular"}
                </Button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                        <span className="px-3 bg-white text-slate-400 font-medium uppercase tracking-wider">
                            o completá los datos manualmente
                        </span>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-indigo-600" />
                            Nombre o Razón Social *
                        </label>
                        <Input
                            placeholder="Ej: Juan Pérez"
                            {...register("name")}
                            className="h-11 bg-white border border-slate-200 text-slate-900 rounded-xl px-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                        />
                        {errors.name && (
                            <p className="text-rose-600 text-xs font-medium">{String(errors.name?.message)}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-indigo-600" />
                            Teléfono / WhatsApp
                        </label>
                        <Input
                            placeholder="Ej: +54 9 387 1234567"
                            {...register("phone")}
                            className="h-11 bg-white border border-slate-200 text-slate-900 rounded-xl px-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                        />
                        {errors.phone && (
                            <p className="text-rose-600 text-xs font-medium">{String(errors.phone?.message)}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                            Dirección / Ubicación
                        </label>
                        <Input
                            placeholder="Ej: Av. Belgrano 1234, Salta"
                            {...register("address")}
                            className="h-11 bg-white border border-slate-200 text-slate-900 rounded-xl px-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                        />
                        {errors.address && (
                            <p className="text-rose-600 text-xs font-medium">{String(errors.address?.message)}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-indigo-600" />
                            Notas Adicionales
                        </label>
                        <Input
                            placeholder="Observaciones o notas"
                            {...register("notes")}
                            className="h-11 bg-white border border-slate-200 text-slate-900 rounded-xl px-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                        />
                        {errors.notes && (
                            <p className="text-rose-600 text-xs font-medium">{String(errors.notes?.message)}</p>
                        )}
                    </div>

                    {/* Roles: Buyer vs Supplier */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                            Rol del Contacto (podés marcar uno o ambos):
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <label className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                                isBuyerValue ? "bg-indigo-50/70 border-indigo-300 text-indigo-950 font-semibold" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}>
                                <input
                                    type="checkbox"
                                    {...register("isBuyer")}
                                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                />
                                <div className="text-xs">
                                    <p className="font-bold">Cliente Comprador</p>
                                    <p className="text-[11px] opacity-75">Aparece en Ventas / Clientes</p>
                                </div>
                            </label>

                            <label className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                                isEggSupplierValue ? "bg-amber-50/70 border-amber-300 text-amber-950 font-semibold" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                            }`}>
                                <input
                                    type="checkbox"
                                    {...register("isEggSupplier")}
                                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                                />
                                <div className="text-xs">
                                    <p className="font-bold">Proveedor de Huevos</p>
                                    <p className="text-[11px] opacity-75">Aparece en Compra de Huevos</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={isSubmitting}
                            className="flex-1 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl h-12 font-semibold"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl h-12 shadow-sm transition active:scale-95 cursor-pointer disabled:opacity-50"
                        >
                            {isSubmitting ? "Guardando..." : "Guardar Contacto"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function NewBuyerPage() {
    return (
        <Suspense fallback={<div className="text-center py-12 text-sm text-slate-400">Cargando...</div>}>
            <NewBuyerForm />
        </Suspense>
    );
}

