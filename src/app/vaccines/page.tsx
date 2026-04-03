"use client"

import VaccineCard from "@/components/vaccine-card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { Syringe, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import LoadSpin from "@/components/load-spin";

export default function VaccinesPage() {
    const [vaccines, setVaccines] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchVaccines = async () => {
        try {
            setLoading(true);
            const response = await api.get("/vaccines");
            setVaccines(response.data);
        } catch (err) {
            console.error("Failed to fetch vaccines:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchVaccines(); }, []);


    return (
        <div className="space-y-6 p-4 md:p-6 bg-linear-to-br from-slate-900/30 via-slate-900/20 to-slate-900/30 rounded-2xl border border-white/10 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h1 className="flex justify-center text-2xl sm:text-3xl font-black text-white">
                    Vaccines
                </h1>
                <Link href="/vaccines/new">
                    <Button className="bg-linear-to-br from-green-400/80 to-green-600/60 text-indigo-100 hover:bg-green-600 rounded-full w-full sm:w-auto cursor-pointer">
                        <Plus size={18} />
                        Add Vaccine
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {vaccines.length === 0 ? (
                    <div className="col-span-full text-center py-12">
                        <Syringe className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                        <p className="text-slate-400 text-lg">No vaccines recorded yet</p>
                        <p className="text-slate-500 text-sm">Add your first vaccine record to get started</p>
                    </div>
                ) : (
                    vaccines.map((vaccine: any) => (
                        <VaccineCard key={vaccine.id} vaccine={vaccine} refresh={fetchVaccines} />
                    ))
                )}
            </div>
        </div>
    )
}
