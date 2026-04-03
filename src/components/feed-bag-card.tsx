import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { toast } from "sonner";
import Link from "next/link";
import PaymentModal from "./payment-modal";
import { motion } from "framer-motion";

const statusColor: any = {
  PAID: "bg-green-100 text-green-700 border-green-700 shadow shadow-green-700",
  PARTIAL: "bg-yellow-100 text-yellow-700 border-yellow-700 shadow shadow-yellow-700",
  UNPAID: "bg-red-100 text-red-700 border-red-700 shadow shadow-red-700",
};

export default function FeedBagCard({ feedBag, refresh }: any) {
  const handleDelete = async () => {
    await toast.promise(api.delete(`/feed-bags/${feedBag.id}`), {
      loading: "Deleting feed bag...",
      success: "Feed bag deleted successfully",
      error: "Error deleting feed bag",
    });
    refresh?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-linear-to-br from-slate-900/50 via-cyan-800/70 to-slate-900/50 border border-white/20 backdrop-blur-xl p-6 md:p-7 rounded-2xl shadow-2xl space-y-4 hover:-translate-y-1 hover:shadow-2xl transition-transform duration-300"
    >
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-bold text-white">{new Date(feedBag.date).toLocaleDateString()}</h2>
        <span className={`px-2 py-1 rounded text-sm ${statusColor[feedBag.status]}`}>
          {feedBag.status}
        </span>
      </div>


      <div className="space-y-1 text-indigo-100">
        <h2 className="text-xl font-semibold">Amount: <span className="font-medium text-white">{feedBag.amount} bags</span></h2>
      <p className="text-sm text-indigo-100">Phase {feedBag.phase}</p>
        <p>Price: <span className="font-medium text-white">${feedBag.price}</span></p>
        <p>Total: <span className="font-medium text-white">${feedBag.totalAmount}</span></p>
        <p>Paid: <span className="font-medium text-green-200">${feedBag.amountPaid}</span></p>
        <p>Remaining: <span className="font-medium text-orange-200">${feedBag.remainingAmount}</span></p>
      </div>

      <div className="grid grid-cols-1 gap-2 pt-2">
        <Link href={`/feed-bags/${feedBag.id}`}>
          <Button size="sm" className="w-full hover:bg-slate-600 cursor-pointer">View Details</Button>
        </Link>

        {feedBag.status !== "PAID" && (
          <PaymentModal sale={feedBag} endpoint="feed-bags" onSuccess={refresh} className="w-full rounded-2xl shadow-xl hover:bg-gray-600">
            <span className="w-full block text-center">Add payment</span>
          </PaymentModal>
        )}

        <Button
          size="sm"
          onClick={handleDelete}
          className="w-full bg-linear-to-r from-red-500/95 to-red-900/95 text-white hover:bg-red-200 cursor-pointer"
        >
          Delete
        </Button>
      </div>
    </motion.div>
  );
}
