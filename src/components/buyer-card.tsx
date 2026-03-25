import { Button } from "./ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { Phone, MapPin } from "lucide-react";

export default function BuyerCard({ buyer }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white p-4 sm:p-6 lg:p-7 rounded-xl shadow space-y-3 sm:space-y-4 hover:scale-105 hover:shadow-lg transition"
        >
            <div className="flex flex-col gap-2">
                <h2 className="text-lg sm:text-xl font-semibold">
                    {buyer.name}
                </h2>
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm sm:text-base text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{buyer.phone}</span>
                </div>
                <div className="flex items-start gap-2 text-sm sm:text-base text-gray-600">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{buyer.address}</span>
                </div>
            </div>

            <div className="pt-2">
                <Link href={`/buyers/${buyer.id}`}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 transition active:scale-95" size="sm">
                        More info
                    </Button>
                </Link>
            </div>
        </motion.div>
    );
}