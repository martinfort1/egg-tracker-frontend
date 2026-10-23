"use client";

import { useRouter, useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/api";
import { buyerSchema } from "@/lib/schemas/buyer.schema";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import LoadSpin from "@/components/load-spin";
import { pickContact } from "@/lib/contact-picker";
import { Smartphone, ArrowLeft, User, Phone, MapPin, FileText } from "lucide-react";

export default function EditBuyerPage() {
    const router = useRouter();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [isLoadingContact, setIsLoadingContact] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<any>({
        resolver: zodResolver(buyerSchema),
    });

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

    useEffect(() => {
        const fetchBuyer = async () => {
            try {
                const res = await api.get(`/buyers/${id}`);
                const buyer = res.data;
                setValue("name", buyer.name);
                setValue("phone", buyer.phone);
                setValue("address", buyer.address);
                setValue("notes", buyer.notes);
                setLoading(false);
            } catch (error) {
                toast.error("Failed to load buyer data");
                router.push("/buyers");
            }
        };

        fetchBuyer();
    }, [id, setValue, router]);

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            await api.put(`/buyers/${id}`, data);
            toast.success("Customer profile updated successfully");
            router.push(`/buyers/${id}`);
        } catch (error) {
            toast.error("Failed to update customer");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <LoadSpin />;

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
                    Back
                </button>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    Edit Customer
                </span>
            </div>

            {/* Main Form Card */}
            <div className="relative bg-white rounded-2xl border border-indigo-100 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
                <div className="h-1.5 bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600" />

                <div>
                    <h1 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-semibold text-slate-900">
                        Edit Customer Profile
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Update customer name, contact details or delivery address
                    </p>
                </div>

                <Button
                    type="button"
                    onClick={handleImportContact}
                    disabled={isLoadingContact}
                    variant="outline"
                    className="w-full border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 font-semibold rounded-xl h-11 flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                    <Smartphone className="w-4 h-4 text-indigo-600" />
                    {isLoadingContact ? "Importing..." : "Update from Phone Contacts"}
                </Button>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-indigo-600" />
                            Customer Name *
                        </label>
                        <Input
                            placeholder="e.g. Juan Pérez"
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
                            Phone Number
                        </label>
                        <Input
                            placeholder="e.g. +54 9 387 1234567"
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
                            Delivery Address
                        </label>
                        <Input
                            placeholder="e.g. Av. Belgrano 1234, Salta"
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
                            Notes
                        </label>
                        <Input
                            placeholder="Additional notes"
                            {...register("notes")}
                            className="h-11 bg-white border border-slate-200 text-slate-900 rounded-xl px-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                        />
                        {errors.notes && (
                            <p className="text-rose-600 text-xs font-medium">{String(errors.notes?.message)}</p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={isSubmitting}
                            className="flex-1 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl h-12 font-semibold"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl h-12 shadow-sm transition active:scale-95 cursor-pointer disabled:opacity-50"
                        >
                            {isSubmitting ? "Updating..." : "Update Customer"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
