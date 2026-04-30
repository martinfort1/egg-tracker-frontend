"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AddVaccineApplicationModalProps {
  vaccine: any;
  onSuccess: () => void;
  children: React.ReactNode;
}

export default function AddVaccineApplicationModal({ vaccine, onSuccess, children }: AddVaccineApplicationModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    dateApplied: new Date().toISOString().split('T')[0],
    vaccineCost: '',
    labourCost: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        dateApplied: formData.dateApplied,
        vaccineCost: parseFloat(formData.vaccineCost) || 0,
        labourCost: parseFloat(formData.labourCost) || 0,
        notes: formData.notes,
      };

      await api.post(`/vaccines/${vaccine.id}/applications`, payload);
      toast.success("Vaccine application added successfully!");
      setOpen(false);
      setFormData({
        dateApplied: new Date().toISOString().split('T')[0],
        vaccineCost: '',
        labourCost: '',
        notes: '',
      });
      onSuccess();
    } catch (error) {
      toast.error("Failed to add vaccine application");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add Vaccine Application</DialogTitle>
          <DialogDescription className="text-slate-300">
            Record a new application for {vaccine.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-200">Application Date *</label>
            <Input
              type="date"
              value={formData.dateApplied}
              onChange={(e) => handleInputChange('dateApplied', e.target.value)}
              className="bg-slate-800 border-slate-600 text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-200">Vaccine Cost *</label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.vaccineCost}
                onChange={(e) => handleInputChange('vaccineCost', e.target.value)}
                className="bg-slate-800 border-slate-600 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-200">Labour Cost *</label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.labourCost}
                onChange={(e) => handleInputChange('labourCost', e.target.value)}
                className="bg-slate-800 border-slate-600 text-white"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-200">Notes</label>
            <textarea
              placeholder="Optional notes about this application..."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:border-slate-500 resize-none"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-linear-to-r from-green-400/80 to-green-600/60 text-white hover:from-green-600 hover:to-green-700 w-full sm:w-auto flex items-center gap-2 cursor-pointer"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}