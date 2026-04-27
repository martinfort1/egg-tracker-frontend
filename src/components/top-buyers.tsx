import { formatCurrency } from "@/lib/utils";

export default function TopBuyers ( {topBuyers}: any ) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-2xl border border-slate-300">
            <h2 className="text-xl font-semibold mb-4">
                Top Buyers
            </h2>

            <div className="space-y-3">
                {topBuyers?.map((buyer: any) => (
                <div
                    key={buyer.buyerId}
                    className="flex justify-between items-center border-b pb-2"
                >
                    <span>{buyer.name}</span>
                    <span className="font-semibold">
                        {formatCurrency(buyer.totalRevenue)}
                    </span>
                </div>
                ))}
            </div>
        </div>
    )
}