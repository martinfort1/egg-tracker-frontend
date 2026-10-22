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
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-semibold text-slate-900">
                        Vaccines & Health
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Track poultry vaccination schedules, application history and upcoming due dates
                    </p>
                </div>
                <Link href="/vaccines/new">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-4 py-2 font-medium shadow-sm transition active:scale-95 flex items-center gap-2 cursor-pointer w-full sm:w-auto">
                        <Plus size={16} />
                        Add Vaccine
                    </Button>
                </Link>
            </div>

            {loading ? (
                <LoadSpin />
            ) : vaccines.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-purple-100 shadow-sm">
                    <Syringe className="w-14 h-14 text-purple-300 mx-auto mb-4" />
                    <p className="text-slate-700 text-lg font-medium">No vaccines recorded yet</p>
                    <p className="text-slate-400 text-sm mt-1">Add your flock's immunization schedule to track doses</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {vaccines.map((vaccine: any) => (
                        <VaccineCard key={vaccine.id} vaccine={vaccine} refresh={fetchVaccines} />
                    ))}
                </div>
            )}
        </div>
    );
}
