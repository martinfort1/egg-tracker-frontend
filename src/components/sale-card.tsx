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
        PAID: "bg-green-100 text-green-700",
        PARTIAL: "bg-yellow-100 text-yellow-700",
        UNPAID: "bg-red-100 text-red-700"
    };

    return(
        <motion.div 
        initial={{ opacity: 0, y: 20}}
        animate={{ opacity: 1, y: 0}}
        transition={{ duration: 0.4 }}
        className="bg-white p-7 rounded-xl shadow space-y-4 hover:scale-105 hover:shadow-lg transition">
            <div className="flex justify-between">
                <h2>
                    {sale.buyer.name}
                </h2>

                <span className={`px-2 py-1 rounded text-sm ${statusColor[sale.status]}`}>
                    {sale.status}
                </span>
            </div>

            <div className="text-sm text-gray-500">
                {new Date(sale.date).toLocaleDateString()}
            </div>

            <div>
                <p>Total: ${sale.totalAmount}</p>
                <p>Paid: ${sale.amountPaid}</p>
                <p className="font-semibold">
                    Debt: ${sale.remainingAmount}
                </p>
            </div>

            <div className="flex gap-2">
                {sale.status !== "PAID" &&(
                    <PaymentModal 
                    className="rounded-2xl shadow-xl hover:bg-gray-600"
                    sale={sale} 
                    onSucess={refresh} >
                        Add payment
                    </PaymentModal>
                )}
                    <Button className="bg-red-600 text-white hover:bg-red-500 transition active:scale-95" onClick={handleDelete} variant="outline" size="sm">
                        Delete
                    </Button>
                    <Link href={`/sales/${sale.id}`}>
                        <Button className="transition active:scale-95" size="sm">
                            View
                        </Button>
                    </Link>

            </div>
        </motion.div>
    )



}