import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { getEmployeePaymentStatus } from "@/lib/employee-payment-helpers";
import { toast } from "sonner";
import Link from "next/link";
import PaymentModal from "./payment-modal";
import { motion } from "framer-motion";

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
  const statusColorMap: any = {
    'Payment Due': 'bg-orange-100 text-orange-700 border-orange-700',
    'Partially Paid': 'bg-yellow-100 text-yellow-700 border-yellow-700',
    'Paid': 'bg-green-100 text-green-700 border-green-700',
    'Advanced': 'bg-cyan-100 text-cyan-700 border-cyan-700',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-linear-to-br from-slate-900/50 via-cyan-800/70 to-slate-900/50 border border-white/20 backdrop-blur-xl p-6 md:p-7 rounded-2xl shadow-2xl space-y-4 hover:-translate-y-1 hover:shadow-2xl transition-transform duration-300"
    >
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-bold text-white">{employee.name}</h2>
        <span className={`px-2 py-1 rounded text-sm ${statusColorMap[paymentInfo.status]}`}>
          {paymentInfo.status === 'Payment Due'
            ? '🔴 Due'
            : paymentInfo.status === 'Partially Paid'
              ? '🟡 Partial'
              : paymentInfo.status === 'Paid'
                ? '🟢 Paid'
                : '🔵 Advanced'}
        </span>
      </div>

      <p className="text-sm text-indigo-100">📞 {employee.phone}</p>

      <div className="space-y-1 text-indigo-100">
        <p>Monthly Salary: <span className="font-medium text-white">${new Intl.NumberFormat("es-AR").format(employee.salary)}</span></p>
        <p>
          Paid this month:{" "}
          <span className="text-green-300">
            ${new Intl.NumberFormat("es-AR").format(paymentInfo.paid)}
          </span>
        </p>

        <p className={`text-sm ${paymentInfo.color}`}>{paymentInfo.text}</p>
        {employee.lastPaidDate && (
          <p>Last Paid: <span className="font-medium text-blue-200">
            {new Date(employee.lastPaidDate).toLocaleDateString()}
          </span></p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2 pt-2">
        <Link href={`/employees/${employee.id}`}>
          <Button size="sm" className="w-full">View Details</Button>
        </Link>

        {paymentInfo.owed > 0 && (
          <PaymentModal 
            sale={employee} 
            endpoint="employees" 
            onSuccess={refresh}
            className="w-full rounded-2xl shadow-xl hover:bg-gray-600"
          >
            <span className="w-full block text-center">Add Payment</span>
          </PaymentModal>
        )}

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
