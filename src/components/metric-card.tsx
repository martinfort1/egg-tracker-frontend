import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";

export function MetricCard({ title, value }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="group relative bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col justify-between"
        >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 opacity-90" />
            
            <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {title}
                </p>
                <motion.h2
                    key={value}
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                    className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight group-hover:text-emerald-700 transition-colors"
                >
                    {formatCurrency(value || 0)}
                </motion.h2>
            </div>
        </motion.div>
    );
}
