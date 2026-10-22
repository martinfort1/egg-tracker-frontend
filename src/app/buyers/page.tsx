"use client"

import { Button } from "@/components/ui/button";
import BuyerCard from "@/components/buyer-card";
import LoadSpin from "@/components/load-spin";
import { api } from "@/lib/api";
import { Plus, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function BuyersPage() {
    const [buyers, setBuyers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchBuyers = async () => {
        try {
            setIsLoading(true);
            const res = await api.get("/buyers");
            setBuyers(res.data);
        } catch (err) {
            console.error("Failed to fetch buyers:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBuyers();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-semibold text-slate-900">
                        Customers & Buyers
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Manage customer contact details, delivery addresses and sales history
                    </p>
                </div>
                <Link href="/buyers/new">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 font-medium shadow-sm transition active:scale-95 flex items-center gap-2 cursor-pointer w-full sm:w-auto">
                        <Plus className="w-4 h-4" />
                        Add Customer
                    </Button>
                </Link>
            </div>

            {isLoading ? (
                <LoadSpin />
            ) : buyers.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-indigo-100 shadow-sm">
                    <Users className="w-14 h-14 text-indigo-300 mx-auto mb-4" />
                    <p className="text-slate-700 text-lg font-medium">No customers registered yet</p>
                    <p className="text-slate-400 text-sm mt-1">Add your first buyer or client to start selling</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {buyers.map((buyer: any) => (
                        <BuyerCard key={buyer.id} buyer={buyer} refresh={fetchBuyers} />
                    ))}
                </div>
            )}
        </div>
    );
}
