import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { Users, ArrowUpRight } from "lucide-react";

export default function TopBuyers({ topBuyers }: any) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/90 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    <h2 className="text-lg font-bold text-slate-900">
                        Top Customers by Revenue
                    </h2>
                </div>
                <span className="text-xs text-slate-400 font-medium">Ranked by sales volume</span>
            </div>

            <div className="space-y-1">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100 px-3">
                    <span>Customer</span>
                    <span>Total Revenue</span>
                </div>
                
                {(!topBuyers || topBuyers.length === 0) ? (
                    <p className="text-xs text-slate-400 py-4 text-center">No sales registered yet</p>
                ) : (
                    topBuyers.map((buyer: any, idx: number) => (
                        <div
                            key={buyer.buyerId}
                            className="flex justify-between items-center py-2.5 px-3 rounded-xl hover:bg-slate-50 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <span className="w-5 text-xs font-bold text-slate-400">#{idx + 1}</span>
                                <Link
                                    href={`/buyers/${buyer.buyerId}`}
                                    className="text-sm font-semibold text-slate-800 hover:text-indigo-600 transition-colors flex items-center gap-1 group"
                                >
                                    <span>{buyer.name}</span>
                                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-indigo-500" />
                                </Link>
                            </div>
                            <span className="text-sm font-bold text-emerald-700">
                                {formatCurrency(buyer.totalRevenue)}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
