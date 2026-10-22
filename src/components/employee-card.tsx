import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { getEmployeePaymentStatus } from "@/lib/employee-payment-helpers";
import { toast } from "sonner";
import Link from "next/link";
import PaymentModal from "./payment-modal";
import { motion } from "framer-motion";
import { formatCurrency, formatUtcDate } from "@/lib/utils";
import { UserCheck, UserMinus, UserPlus, UserX, Phone, Calendar, ArrowRight } from "lucide-react";

export default function EmployeeCard({ employee, refresh }: any) {
  const handleDelete = async () => {
    await toast.promise(api.delete(`/employees/${employee.id}`), {
      loading: "Deleting employee...",
      success: "Employee deleted successfully",
      error: "Error deleting employee",
    });
    refresh?.();
  };

  const paymentInfo = getEmployeePaymentStatus(employee);
  const statusConfigMap: Record<string, { color: string; icon: any; label: string }> = {
    'Payment Due': {
      color: 'bg-rose-50 text-rose-700 border-rose-200', 
      icon: UserX,
      label: 'Due'
    },
    'Partially Paid': {
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: UserMinus,
      label: 'Partial'
    },
    'Paid': {
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: UserCheck,
      label: 'Paid'
    },
    'Advanced': {
      color: 'bg-teal-50 text-teal-700 border-teal-200',
      icon: UserPlus,
      label: 'Advanced'
    }
  };

  const currentStatus = statusConfigMap[paymentInfo.status] || {
    color: 'bg-slate-50 text-slate-700 border-slate-200',
    icon: UserCheck,
    label: paymentInfo.status
  };
  const StatusIcon = currentStatus.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-2xl border border-teal-100/90 p-5 sm:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden gap-4"
    >
      {/* Top Section Accent Line (Teal) */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-400 via-cyan-500 to-teal-600" />

      <div className="space-y-3">
        <div className="flex justify-between items-start gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
                Staff
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 truncate group-hover:text-teal-700 transition-colors">
              {employee.name}
            </h2>
          </div>

          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border shrink-0 ${currentStatus.color}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            {currentStatus.label}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Phone className="w-3.5 h-3.5 text-teal-600" />
          <span>{employee.phone || "No phone registered"}</span>
        </div>

        <div className="bg-teal-50/40 rounded-xl p-3.5 space-y-2 border border-teal-100/70 text-xs">
          <div className="flex justify-between items-center text-slate-600">
            <span>Monthly Salary:</span>
            <span className="text-sm font-bold text-slate-900">
              {formatCurrency(paymentInfo?.salary ?? employee.salary)}
            </span>
          </div>
          <div className="flex justify-between items-center text-slate-600">
            <span>Paid this month:</span>
            <span className="font-semibold text-teal-700">
              {formatCurrency(paymentInfo.paid)}
            </span>
          </div>

          {paymentInfo.text && (
            <div className="pt-1 border-t border-teal-200/50 flex justify-between items-center font-medium">
              <span className="text-slate-500">Status:</span>
              <span className={paymentInfo.color || "text-slate-700"}>{paymentInfo.text}</span>
            </div>
          )}

          {employee.lastPaidDate && (
            <div className="pt-1 border-t border-teal-200/40 flex justify-between items-center text-slate-500">
              <span>Last Paid:</span>
              <span className="font-medium text-slate-700">
                {formatUtcDate(employee.lastPaidDate)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 pt-1">
        <Link href={`/employees/${employee.id}`} className="w-full">
          <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white shadow-sm transition active:scale-95 cursor-pointer rounded-lg font-medium text-xs h-9 flex items-center justify-center gap-1.5">
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>

        <PaymentModal 
          sale={employee} 
          owed={paymentInfo.owed}
          endpoint="employees" 
          onSuccess={refresh}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-lg shadow-sm transition active:scale-95 cursor-pointer font-medium text-xs h-9 flex items-center justify-center"
        >
          <span className="w-full block text-center">{paymentInfo.owed > 0 ? 'Add Payment' : 'Advance Pay'}</span>
        </PaymentModal>

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
