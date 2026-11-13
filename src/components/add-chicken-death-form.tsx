"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar, FileText, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export function AddChickenDeathForm({
    chickenId,
    onSuccess,
}: {
    chickenId: string;
    onSuccess: () => void;
}) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split("T")[0],
        amount: 0,
        notes: "",
    });

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === "amount" ? parseInt(value) || 0 : value,
        });
    };

    const handleDateChange = (e: any) => {
        setFormData({
            ...formData,
            date: e.target.value,
        });
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (formData.amount <= 0) {
            toast.error("La cantidad de bajas debe ser mayor a 0");
            return;
        }

        setLoading(true);
        try {
            await api.post(`/chickens/${chickenId}/deaths`, {
                date: new Date(formData.date),
                amount: formData.amount,
                notes: formData.notes?.trim() || undefined,
            });

            toast.success("Baja registrada exitosamente");
            setOpen(false);
            setFormData({
                date: new Date().toISOString().split("T")[0],
                amount: 0,
                notes: "",
            });
            onSuccess();
        } catch (err) {
            toast.error("Error al registrar baja de gallinas");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-rose-700 bg-rose-50 hover:bg-rose-100 border-rose-200 rounded-xl transition active:scale-95 cursor-pointer text-xs font-semibold h-9 flex items-center justify-center gap-1.5"
                >
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>Registrar Bajas</span>
                </Button>
            </DialogTrigger>

            <DialogContent className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl text-slate-900 sm:max-w-md">
                <DialogHeader className="space-y-1 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                            Mortalidad
                        </span>
                    </div>
                    <DialogTitle className="text-xl font-['Playfair_Display'] font-semibold text-slate-900">
                        Registrar Bajas de Gallinas
                    </DialogTitle>
                    <p className="text-xs text-slate-500">
                        Ingresá la fecha, número de aves fallecidas y motivo (opcional)
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-rose-600" />
                            Fecha
                        </label>
                        <Input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleDateChange}
                            className="h-11 bg-slate-50/60 border border-slate-200 text-slate-900 rounded-xl px-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                            Cantidad de Gallinas Fallecidas
                        </label>
                        <Input
                            type="number"
                            name="amount"
                            min="1"
                            value={formData.amount || ""}
                            onChange={handleInputChange}
                            placeholder="0"
                            className="h-11 bg-slate-50/60 border border-slate-200 text-slate-900 rounded-xl px-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-rose-600" />
                            Motivo u Observación (opcional)
                        </label>
                        <Input
                            type="text"
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            placeholder="Ej: Golpe de calor, edad, enfermedad..."
                            className="h-11 bg-slate-50/60 border border-slate-200 text-slate-900 rounded-xl px-3 text-sm focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                        />
                    </div>

                    <div className="flex gap-2.5 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={loading}
                            className="flex-1 border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl h-11 font-semibold cursor-pointer"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl h-11 shadow-sm transition active:scale-95 cursor-pointer disabled:opacity-50"
                        >
                            {loading ? "Guardando..." : "Registrar Baja"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
