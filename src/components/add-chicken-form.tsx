"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export function AddChickenForm({ onSuccess }: { onSuccess: () => void }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        amount: 0,
        pricePerChicken: 0,
        shippingCost: 0,
        totalCost: 0,
    });

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        const numValue = parseFloat(value) || 0;
        
        const newFormData = {
            ...formData,
            [name]: numValue,
        };

        // Calculate total cost
        if (name === 'amount' || name === 'pricePerChicken' || name === 'shippingCost') {
            newFormData.totalCost = (newFormData.amount * newFormData.pricePerChicken) + newFormData.shippingCost;
        }

        setFormData(newFormData);
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
            await api.post('/chickens', {
                date: new Date(formData.date),
                amount: formData.amount,
                pricePerChicken: formData.pricePerChicken,
                shippingCost: formData.shippingCost,
                totalCost: formData.totalCost,
            });

            toast.success('Chicken purchase recorded successfully!');
            setOpen(false);
            setFormData({
                date: new Date().toISOString().split('T')[0],
                amount: 0,
                pricePerChicken: 0,
                shippingCost: 0,
                totalCost: 0,
            });
            onSuccess();
        } catch (err) {
            toast.error('Failed to record chicken purchase');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-linear-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 rounded-full w-full flex items-center gap-2 cursor-pointer">
                    <Plus size={18} />
                    Add Chickens
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-slate-900 border border-white/10">
                <DialogHeader>
                    <DialogTitle className="text-white">Register Chicken Purchase</DialogTitle>
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
                        <label className="block text-sm font-medium text-white/80 mb-2">Amount (Number of Chickens)</label>
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
                        <label className="block text-sm font-medium text-white/80 mb-2">Price Per Chicken ($)</label>
                        <Input
                            type="number"
                            step="0.01"
                            name="pricePerChicken"
                            value={formData.pricePerChicken}
                            onChange={handleInputChange}
                            placeholder="0.00"
                            className="bg-slate-800 border border-white/20 text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white/80 mb-2">Shipping Cost ($)</label>
                        <Input
                            type="number"
                            step="0.01"
                            name="shippingCost"
                            value={formData.shippingCost}
                            onChange={handleInputChange}
                            placeholder="0.00"
                            className="bg-slate-800 border border-white/20 text-white"
                        />
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-lg border border-white/10">
                        <div className="flex justify-between items-center">
                            <span className="text-white/80">Total Cost:</span>
                            <span className="text-xl font-bold text-yellow-400">${formData.totalCost.toFixed(2)}</span>
                        </div>
                    </div>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-linear-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700"
                    >
                        {loading ? 'Recording...' : 'Record Purchase'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
