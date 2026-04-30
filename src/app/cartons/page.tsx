"use client"

import CartonCard from "@/components/carton-card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { Box, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartonsPage() {
    const [cartons, setCartons] = useState([]);

    const fetchCartons = async () => {
        try {
            const response = await api.get("/cartons");
            setCartons(response.data);
        } catch (err) {
            console.error("Failed to fetch cartons:", err);
        }
    };

    useEffect(() => { fetchCartons(); }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PAID': return 'text-green-300 bg-green-500/20 border-green-500/30';
            case 'PARTIAL': return 'text-yellow-300 bg-yellow-500/20 border-yellow-500/30';
            case 'UNPAID': return 'text-red-300 bg-red-500/20 border-red-500/30';
            default: return 'text-gray-300 bg-gray-500/20 border-gray-500/30';
        }
    };

    return (
        <div className="space-y-6 p-4 md:p-6 bg-linear-to-br from-slate-900/30 via-slate-900/20 to-slate-900/30 rounded-2xl border border-white/10 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h1 className="flex justify-center text-2xl sm:text-3xl font-['Playfair_Display'] font-black text-white text-shadow-lg">
                    Cartons
                </h1>
                <Link href="/cartons/new">
                    <Button className="bg-linear-to-br from-green-400/80 to-green-600/60 text-indigo-100 hover:bg-green-600 rounded-full w-full sm:w-auto flex items-center gap-2 cursor-pointer">
                        <Plus size={18} />
                        Add Carton Purchase
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {cartons.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <Box className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-400 text-lg">No carton purchases yet</p>
                        <p className="text-slate-500 text-sm">Add your first carton purchase to get started</p>
                    </div>
                ) : (
                    cartons.map((carton: any) => (
                        <CartonCard key={carton.id} carton={carton} refresh={fetchCartons} />
                    ))
                )}
            </div>
        </div>
    )
}