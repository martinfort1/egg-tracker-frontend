
export default function TopBuyers ( {topBuyers}: any ) {
    return (
        <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">
                Top Buyers
            </h2>

            <div className="space-y-3">
                {topBuyers?.map((buyer: any) => (
                <div
                    key={buyer.id}
                    className="flex justify-between items-center border-b pb-2"
                >
                    <span>{buyer.name}</span>
                    <span className="font-semibold">
                    ${buyer.totalRevenue}
                    </span>
                </div>
                ))}
            </div>
        </div>
    )
}