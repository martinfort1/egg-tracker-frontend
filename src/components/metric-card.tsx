import { motion } from "framer-motion"

export function MetricCard({ title, value}: any){
    return (
        <motion.div
            initial={{ opacity: 0, y: 20}}
            animate={{ opacity: 1, y: 0}}
            className="bg-white p-6 rounded-xl shadow"
        >
            <p className="text-sm text-gray-500">
                {title}
            </p>
            <motion.h2
                key={value}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="text-2xl font-bold"
            >
                ${value}
            </motion.h2>
        </motion.div>
    )
}