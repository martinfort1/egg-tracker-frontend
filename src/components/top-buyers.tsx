import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

export default function TopBuyers ( {topBuyers}: any ) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-2xl border border-slate-300">
            <h2 className="text-xl font-semibold mb-4">
                Top Buyers
            </h2>

            <div className="space-y-3">
                <div className="flex justify-between items-center border-b-2 pb-2 px-4 border-black">
                    <span className="font-bold">
                        Buyer
                    </span>
                    <span className="font-bold">
                        Total Revenue
                    </span>
                </div>
                {topBuyers?.map((buyer: any) => (
                <div
                    key={buyer.buyerId}
                    className="flex justify-between items-center border-b pb-2"
                >
                    <Link href={`/buyers/${buyer.buyerId}`} className="text-blue-600 hover:underline">
                        {buyer.name}
                    </Link>
                    <span className="font-semibold">
                        {formatCurrency(buyer.totalRevenue)}
                    </span>
                </div>
                ))}
            </div>
        </div>
    )
}