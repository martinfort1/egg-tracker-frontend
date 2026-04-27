import { Button } from "./ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { Phone, MapPin } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function BuyerCard({ buyer, refresh }: any) {
    const handleDelete = async () => {
        await toast.promise(api.delete(`/buyers/${buyer.id}`), {
            loading: "Deleting buyer...",
            success: "Buyer deleted successfully",
            error: "Error deleting buyer",
        });
        refresh?.();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-linear-to-br from-slate-900/40 via-indigo-800/45 to-slate-900/40 border border-white/20 backdrop-blur-xl p-5 sm:p-6 lg:p-7 rounded-2xl shadow-2xl space-y-3 sm:space-y-4 hover:-translate-y-1 hover:shadow-2xl transition-transform duration-300"
        >
            <div className="flex flex-col gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white">
                    {buyer.name}
                </h2>
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm sm:text-base text-indigo-100">
                    <Phone className="w-4 h-4 text-indigo-100" />
                    <span>{buyer.phone}</span>
                </div>
                <div className="flex items-start gap-2 text-sm sm:text-base text-indigo-100">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-indigo-100" />
                    <span>{buyer.address}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-2 pt-2">
                <Link href={`/buyers/${buyer.id}`}>
                    <Button size="sm" className="w-full hover:bg-slate-700 cursor-pointer">View Details</Button>
                </Link>

                <Button
                    size="sm"
                    onClick={handleDelete}
                    className="w-full bg-linear-to-r from-red-500/95 to-red-900/95 text-white hover:bg-red-400 cursor-pointer"
                >
                    Delete
                </Button>
            </div>
        </motion.div>
    )
}