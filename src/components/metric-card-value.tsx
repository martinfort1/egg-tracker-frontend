import { motion } from "framer-motion"
import { formatNumber, formatCurrency } from "@/lib/utils"

export function MetricCardValue({ title, value, unit = "", isCurrency = false }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-linear-to-br from-yellow-600/50 via-violet-600/40 to-green-900/35 border border-white/20 backdrop-blur-xl p-6 rounded-2xl shadow-2xl text-white"
        >
            <p className="text-xl text-slate-900/90 tracking-wide">
                {title}
            </p>
            <motion.h2
                key={value}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-3xl md:text-4xl font-extrabold text-black"
            >
                {isCurrency ? formatCurrency(value) : formatNumber(value) + unit}
            </motion.h2>
        </motion.div>
    )
}
