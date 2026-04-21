"use client"

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { toast } from "sonner";
import Link from "next/link";
import { motion } from "framer-motion";
import { useVaccineStatus } from "@/hooks/useVaccineStatus";
import { formatCurrency, formatUtcDate } from "@/lib/utils";

const statusConfig: any = {
  urgent: {
    color: "bg-red-100 text-red-700 border-red-700",
    emoji: "🚨 Overdue",
  },
  upcoming: {
    color: "bg-yellow-100 text-yellow-700 border-yellow-700",
    emoji: "⏰ Upcoming",
  },
  completed: {
    color: "bg-green-100 text-green-700 border-green-700",
    emoji: "✅ Covered",
  },
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

  const {status, daysLeft, lastApplied, nextDueDate  } = useVaccineStatus(vaccine);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-linear-to-br from-slate-900/50 via-cyan-800/70 to-slate-900/50 border border-white/20 backdrop-blur-xl p-6 md:p-7 rounded-2xl shadow-2xl space-y-4 hover:-translate-y-1 hover:shadow-2xl transition-transform duration-300"
    >
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-bold text-white">{vaccine.name}</h2>
        <span className={`px-2 py-1 rounded text-sm ${statusConfig[status].color}`}>
          {statusConfig[status].emoji}
        </span>
      </div>

      <p className="text-sm text-indigo-100">
        {vaccine.applications?.length || 0} application{vaccine.applications?.length !== 1 ? 's' : ''}
      </p>

      <div className="space-y-1 text-indigo-100">
        <p>Duration: <span className="font-medium text-white">{vaccine.durationDays} days</span></p>
        <p>Days left: <span className="font-medium text-white">{daysLeft || 0}</span></p>
        <p>Total Applications: <span className="font-medium text-white">{vaccine.applications?.length || 0}</span></p>
        {vaccine.applications && vaccine.applications.length > 0 && (
          <p>Total Cost: <span className="font-medium text-green-200">
            {formatCurrency(vaccine.applications.reduce((total: number, app: any) => total + app.totalCost, 0))}
          </span></p>
        )}
        {vaccine.applications && vaccine.applications.length > 0 && (
          <p>Last Applied: <span className="font-medium text-green-200">
            {lastApplied ? formatUtcDate(lastApplied) : 'N/A'}
          </span></p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2 pt-2">
        <Link href={`/vaccines/${vaccine.id}`}>
          <Button size="sm" className="w-full hover:scale-105 cursor-pointer">View Details</Button>
        </Link>
        <Button
          size="sm"
          onClick={handleDelete}
          className="w-full bg-linear-to-r from-red-500/95 to-red-900/95 text-white hover:bg-red-600 hover:scale-105 cursor-pointer"
        >
          Delete
        </Button>
      </div>
    </motion.div>
  );
}
