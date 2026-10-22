import { Button } from "./ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { Phone, MapPin, Users, User, ArrowRight } from "lucide-react";
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

    const initials = (buyer.name || "Customer")
        .split(" ")
        .map((w: string) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="group relative bg-white rounded-2xl border border-indigo-100/90 p-5 sm:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden gap-4"
        >
            {/* Top Section Accent Line (Indigo) */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-400 via-indigo-500 to-indigo-600" />

            <div className="space-y-3">
                <div className="flex justify-between items-start gap-3">
                    <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                            <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                                Customer
                            </span>
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 truncate group-hover:text-indigo-700 transition-colors">
                            {buyer.name}
                        </h2>
                    </div>

                    <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                        {initials}
                    </div>
                </div>

                <div className="space-y-2 pt-1 text-xs">
                    <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
                        <Phone className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span className="truncate font-medium">{buyer.phone || "No phone registered"}</span>
                    </div>

                    <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-2 font-medium">{buyer.address || "No address provided"}</span>
                    </div>

                    {buyer.notes && (
                        <p className="text-[11px] text-slate-500 italic px-1 pt-1">
                            "{buyer.notes}"
                        </p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-2 pt-1">
                <Link href={`/buyers/${buyer.id}`} className="w-full">
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition active:scale-95 cursor-pointer rounded-lg font-medium text-xs h-9 flex items-center justify-center gap-1.5">
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
