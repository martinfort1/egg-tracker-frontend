"use client"

import CartonCard from "@/components/carton-card";
import { Button } from "@/components/ui/button";
import LoadSpin from "@/components/load-spin";
import { api } from "@/lib/api";
import { Box, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartonsPage() {
    const [cartons, setCartons] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCartons = async () => {
        try {
            setIsLoading(true);
            const response = await api.get("/cartons");
            setCartons(response.data);
        } catch (err) {
            console.error("Failed to fetch cartons:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchCartons(); }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-semibold text-slate-900">
                        Cartons & Packaging
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Manage inventory purchases for egg cartons and packaging boxes
                    </p>
                </div>
                <Link href="/cartons/new">
                    <Button className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg px-4 py-2 font-medium shadow-sm transition active:scale-95 flex items-center gap-2 cursor-pointer w-full sm:w-auto">
                        <Plus size={16} />
                        Add Carton Purchase
                    </Button>
                </Link>
            </div>

            {isLoading ? (
                <LoadSpin />
            ) : cartons.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-amber-100 shadow-sm">
                    <Box className="w-14 h-14 text-amber-300 mx-auto mb-4" />
                    <p className="text-slate-700 text-lg font-medium">No carton purchases yet</p>
                    <p className="text-slate-400 text-sm mt-1">Add your first carton purchase to get started</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {cartons.map((carton: any) => (
                        <CartonCard key={carton.id} carton={carton} refresh={fetchCartons} />
                    ))}
                </div>
            )}
        </div>
    );
}
