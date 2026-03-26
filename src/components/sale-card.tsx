import { api } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "./ui/button";
import Link from "next/link";
import PaymentModal from "./payment-modal";
import { motion } from "framer-motion"


export default function SaleCard({ sale, refresh }: any) {

    const handleDelete = async () => {
        await toast.promise(
            api.delete(`/sales/${sale.id}`),
            {
                loading: "Deleting sale...",
                success: "Sale deleted successfully",
                error: "Error deleting sale",
            }
        );
    }

    const statusColor: any = {
        PAID: "bg-green-100 text-green-700 border-green-700 shadow shadow-green-700",
        PARTIAL: "bg-yellow-100 text-yellow-700 border-yellow-700 shadow shadow-yellow-700",
        UNPAID: "bg-red-100 text-red-700 border-red-700 shadow shadow-red-700"
    };

    return(
        <motion.div 
        initial={{ opacity: 0, y: 20}}
        animate={{ opacity: 1, y: 0}}
        transition={{ duration: 0.4 }}
        className="bg-linear-to-br from-slate-900/50 via-cyan-800/70 to-slate-900/50 border border-white/20 backdrop-blur-xl p-6 md:p-7 rounded-2xl shadow-2xl space-y-4 hover:-translate-y-1 hover:shadow-2xl transition-transform duration-300">
            <div className="flex justify-between items-start">
                <h2 className="text-lg font-bold text-white">
                    {sale.buyer.name}
                </h2>

                <span className={`px-2 py-1 rounded text-sm ${statusColor[sale.status]}`}>
                    {sale.status}
                </span>
            </div>

            <div className="text-sm text-slate-950">
                {new Date(sale.date).toLocaleDateString()}
            </div>

            <div className="space-y-1 text-indigo-100">
                <p>Total: <span className="font-medium text-white">${sale.totalAmount}</span></p>
                <p>Paid: <span className="font-medium text-white">${sale.amountPaid}</span></p>
                <p className="font-semibold text-orange-100">
                    Debt: <span className="font-bold text-orange-200">${sale.remainingAmount}</span>
                </p>
            </div>

            <div className="grid grid-cols-1 gap-2 pt-2">
                    <Link href={`/sales/${sale.id}`}>
                        <Button className="w-full transition active:scale-95 cursor-pointer" size="sm">
                            Sale Details
                        </Button>
                    </Link>
                {sale.status !== "PAID" &&(
                    <PaymentModal 
                    className="w-full rounded-2xl shadow-xl hover:bg-gray-600"
                    sale={sale} 
                    onSucess={refresh} >
                        <span className="w-full block text-center">
                            Add payment
                        </span>
                    </PaymentModal>
                )}
                    <Button className="w-full bg-linear-to-r from-red-500/95 to-red-900/95 text-white hover:bg-red-500 transition active:scale-95 cursor-pointer" onClick={handleDelete} variant="outline" size="sm">
                        Delete
                    </Button>

            </div>
        </motion.div>
    )
}