"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export function AddChickenDeathForm({ chickenId, onSuccess }: { chickenId: string; onSuccess: () => void }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        amount: 0,
        notes: '',
    });

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'amount' ? parseInt(value) || 0 : value,
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
        setLoading(true);

        try {
            await api.post(`/chickens/${chickenId}/deaths`, {
                date: new Date(formData.date),
                amount: formData.amount,
                notes: formData.notes,
            });

            toast.success('Death record added successfully!');
            setOpen(false);
            setFormData({
                date: new Date().toISOString().split('T')[0],
                amount: 0,
                notes: '',
            });
            onSuccess();
        } catch (err) {
            toast.error('Failed to record death');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="text-red-400 border-red-400/30 hover:bg-red-500/20 cursor-pointer">
                    <Trash2 size={16} className="mr-2" />
                    Add Death Record
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-106.25 bg-slate-900 border border-white/10">
                <DialogHeader>
                    <DialogTitle className="text-white">Register Chicken Death</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Date</label>
                        <Input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleDateChange}
                            className="bg-slate-800 border border-white/20 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Number of Deaths</label>
                        <Input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleInputChange}
                            placeholder="0"
                            className="bg-slate-800 border border-white/20 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Notes (Optional)</label>
                        <Input
                            type="text"
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            placeholder="Reason or notes..."
                            className="bg-slate-800 border border-white/20 text-white"
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-linear-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
                    >
                        {loading ? 'Recording...' : 'Record Death'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
