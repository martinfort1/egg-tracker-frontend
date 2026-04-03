"use client"

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { toast } from "sonner";
import Link from "next/link";
import { motion } from "framer-motion";

const statusColor: any = {
  urgent: "bg-red-100 text-red-700 border-red-700",
  upcoming: "bg-yellow-100 text-yellow-700 border-yellow-700",
  completed: "bg-green-100 text-green-700 border-green-700",
};

export default function VaccineCard({ vaccine, refresh }: any) {
  const handleDelete = async () => {
    await toast.promise(api.delete(`/vaccines/${vaccine.id}`), {
      loading: "Deleting vaccine...",
      success: "Vaccine deleted successfully",
      error: "Error deleting vaccine",
    });
    refresh?.();
  };

  const getStatus = () => {
    const now = new Date();
    if (vaccine.nextApplicationDate) {
      const nextDate = new Date(vaccine.nextApplicationDate);
      const daysUntil = Math.ceil((nextDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntil < 0) return "urgent";
      if (daysUntil <= 30) return "upcoming";
    }
    return "completed";
  };

  const status = getStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-linear-to-br from-slate-900/50 via-cyan-800/70 to-slate-900/50 border border-white/20 backdrop-blur-xl p-6 md:p-7 rounded-2xl shadow-2xl space-y-4 hover:-translate-y-1 hover:shadow-2xl transition-transform duration-300"
    >
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-bold text-white">{vaccine.name}</h2>
        <span className={`px-2 py-1 rounded text-sm ${statusColor[status]}`}>
          {status === "urgent" ? "🚨 Overdue" : status === "upcoming" ? "⏰ Upcoming" : "✅ Covered"}
        </span>
      </div>

      <p className="text-sm text-indigo-100">Applied: {new Date(vaccine.dateApplied).toLocaleDateString()}</p>

      <div className="space-y-1 text-indigo-100">
        <p>Vaccine Cost: <span className="font-medium text-white">${vaccine.vaccineCost}</span></p>
        <p>Labour Cost: <span className="font-medium text-white">${vaccine.labourCost}</span></p>
        <p>Total: <span className="font-medium text-green-200">${vaccine.totalCost}</span></p>
        {vaccine.nextApplicationDate && (
          <p>Next Due: <span className="font-medium text-orange-200">{new Date(vaccine.nextApplicationDate).toLocaleDateString()}</span></p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2 pt-2">
        <Link href={`/vaccines/${vaccine.id}`}>
          <Button size="sm" className="w-full">View Details</Button>
        </Link>
        <Button
          size="sm"
          onClick={handleDelete}
          className="w-full bg-linear-to-r from-red-500/95 to-red-900/95 text-white hover:bg-red-600"
        >
          Delete
        </Button>
      </div>
    </motion.div>
  );
}
