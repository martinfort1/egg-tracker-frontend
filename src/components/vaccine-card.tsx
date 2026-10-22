"use client"

import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { toast } from "sonner";
import Link from "next/link";
import { motion } from "framer-motion";
import { useVaccineStatus } from "@/hooks/useVaccineStatus";
import { formatCurrency, formatUtcDate } from "@/lib/utils";
import { Syringe, Calendar, Clock, AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";

const statusConfig: Record<string, { color: string; label: string; icon: any }> = {
  urgent: {
    color: "bg-rose-50 text-rose-700 border-rose-200",
    label: "Overdue",
    icon: AlertTriangle,
  },
  upcoming: {
    color: "bg-amber-50 text-amber-700 border-amber-200",
    label: "Upcoming",
    icon: Clock,
  },
  completed: {
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    label: "Covered",
    icon: CheckCircle,
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

  const { status, daysLeft, lastApplied } = useVaccineStatus(vaccine);
  const currentStatus = statusConfig[status] || statusConfig.completed;
  const StatusIcon = currentStatus.icon;

  const totalCost = vaccine.applications && vaccine.applications.length > 0
    ? vaccine.applications.reduce((total: number, app: any) => total + app.totalCost, 0)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-2xl border border-purple-100/90 p-5 sm:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden gap-4"
    >
      {/* Top Section Accent Line (Purple) */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-400 via-fuchsia-500 to-purple-600" />

      <div className="space-y-3">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700">
                Vaccine
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 truncate group-hover:text-purple-700 transition-colors">
              {vaccine.name}
            </h2>
          </div>

          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border shrink-0 ${currentStatus.color}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            {currentStatus.label}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <Syringe className="w-3.5 h-3.5 text-purple-600" />
            <span>{vaccine.applications?.length || 0} application{(vaccine.applications?.length !== 1) ? 's' : ''}</span>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 font-semibold text-[11px]">
            Every {vaccine.durationDays}d
          </span>
        </div>

        <div className="bg-purple-50/40 rounded-xl p-3.5 space-y-2 border border-purple-100/70 text-xs">
          <div className="flex justify-between items-center text-slate-600">
            <span>Days remaining:</span>
            <span className={`font-bold ${status === 'urgent' ? 'text-rose-600' : 'text-slate-900'}`}>
              {daysLeft !== undefined ? `${daysLeft} days` : 'N/A'}
            </span>
          </div>
          {totalCost > 0 && (
            <div className="flex justify-between items-center text-slate-600">
              <span>Total Cost Invested:</span>
              <span className="font-semibold text-slate-900">{formatCurrency(totalCost)}</span>
            </div>
          )}
          {lastApplied && (
            <div className="pt-1 border-t border-purple-200/50 flex justify-between items-center text-slate-500">
              <span>Last Application:</span>
              <span className="font-medium text-slate-700">{formatUtcDate(lastApplied)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 pt-1">
        <Link href={`/vaccines/${vaccine.id}`} className="w-full">
          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition active:scale-95 cursor-pointer rounded-lg font-medium text-xs h-9 flex items-center justify-center gap-1.5">
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>

        <Button
          onClick={handleDelete}
          variant="outline"
          className="w-full text-slate-500 hover:text-rose-600 hover:bg-rose-50 border-slate-200 hover:border-rose-200 transition active:scale-95 cursor-pointer rounded-lg font-medium text-xs h-9"
        >
          Delete
        </Button>
      </div>
    </motion.div>
  );
}
