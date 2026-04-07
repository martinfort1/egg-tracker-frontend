"use client"

import LoadSpin from "@/components/load-spin";
import AddVaccineApplicationModal from "@/components/add-vaccine-application-modal";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Vaccine {
    id: string;
    name: string;
    durationDays: number;
    notes?: string;
    createdAt: string;
    updatedAt: string;
    applications?: any[];
}

export default function VaccineDetailPage() {
    const router = useRouter();
    const [vaccine, setVaccine] = useState<Vaccine | null>(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    const fetchVaccine = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/vaccines/${id}`);
            setVaccine(response.data);
        } catch (error) {
            toast.error("Failed to fetch vaccine");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVaccine();
    }, [id]);

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this vaccine record?")) return;

        try {
            await api.delete(`/vaccines/${id}`);
            toast.success("Vaccine deleted successfully");
            router.push("/vaccines");
        } catch (error) {
            toast.error("Failed to delete vaccine");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-900/50 via-slate-900/30 to-slate-900/50 p-4 md:p-6 flex items-center justify-center">
                <LoadSpin />
            </div>
        );
    }

    if (!vaccine) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-900/50 via-slate-900/30 to-slate-900/50 p-4 md:p-6 flex items-center justify-center">
                <div className="text-white">Vaccine not found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900/50 via-slate-900/30 to-slate-900/50 p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-linear-to-br from-slate-900/80 via-indigo-900/60 to-slate-900/90 border border-white/20 backdrop-blur-xl p-8 rounded-2xl shadow-2xl">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">{vaccine.name}</h1>
                            <p className="text-indigo-200">{vaccine.applications?.length || 0} application{vaccine.applications?.length !== 1 ? 's' : ''}</p>
                        </div>
                        <div className="flex gap-3">
                            <AddVaccineApplicationModal
                                vaccine={vaccine}
                                onSuccess={fetchVaccine}
                            >
                                <Button
                                    className="bg-linear-to-r from-green-500 to-green-600 text-white font-bold hover:from-green-600 hover:to-green-700 transition active:scale-95 rounded-xl cursor-pointer"
                                >
                                    Add Application
                                </Button>
                            </AddVaccineApplicationModal>
                            <Button
                                onClick={() => router.push(`/vaccines/${vaccine.id}/edit`)}
                                className="bg-linear-to-r from-blue-600 to-cyan-600 text-white font-bold hover:from-blue-700 hover:to-cyan-700 transition active:scale-95 rounded-xl cursor-pointer"
                            >
                                Edit
                            </Button>
                            <Button
                                onClick={handleDelete}
                                className="bg-linear-to-r from-red-600 to-pink-600 text-white font-bold hover:from-red-700 hover:to-pink-700 transition active:scale-95 rounded-xl cursor-pointer"
                            >
                                Delete
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                            <div className="bg-white/10 border border-white/20 p-6 rounded-xl">
                                <h3 className="text-lg font-bold text-white mb-4">Vaccine Information</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-semibold text-indigo-200">Vaccine Name</label>
                                        <p className="text-white font-medium">{vaccine.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-indigo-200">Duration Between Applications</label>
                                        <p className="text-white font-medium">{vaccine.durationDays} days</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-indigo-200">Applications</label>
                                        <p className="text-white font-medium">{vaccine.applications?.length || 0} total</p>
                                    </div>
                                    {vaccine.notes && (
                                        <div>
                                            <label className="text-sm font-semibold text-indigo-200">Notes</label>
                                            <p className="text-white font-medium">{vaccine.notes}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white/10 border border-white/20 p-6 rounded-xl">
                                <h3 className="text-lg font-bold text-white mb-4">Application Summary</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-semibold text-indigo-200">Total Applications</label>
                                        <p className="text-white font-medium">{vaccine.applications?.length || 0}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-indigo-200">Total Vaccine Cost</label>
                                        <p className="text-white font-medium">
                                            ${vaccine.applications?.reduce((total: number, app: any) => total + app.vaccineCost, 0).toLocaleString() || 0}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-indigo-200">Total Labour Cost</label>
                                        <p className="text-white font-medium">
                                            ${vaccine.applications?.reduce((total: number, app: any) => total + app.labourCost, 0).toLocaleString() || 0}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-indigo-200">Total Cost</label>
                                        <p className="text-green-300 font-medium">
                                            ${vaccine.applications?.reduce((total: number, app: any) => total + app.totalCost, 0).toLocaleString() || 0}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {vaccine.notes && (
                                <div className="bg-white/10 border border-white/20 p-6 rounded-xl">
                                    <h3 className="text-lg font-bold text-white mb-4">Notes</h3>
                                    <p className="text-indigo-100">{vaccine.notes}</p>
                                </div>
                            )}

                            {vaccine.applications && vaccine.applications.length > 0 && (
                                <div className="bg-white/10 border border-white/20 p-6 rounded-xl">
                                    <h3 className="text-lg font-bold text-white mb-4">Application History</h3>
                                    <div className="space-y-3 max-h-64 overflow-y-auto">
                                        {vaccine.applications
                                            .sort((a: any, b: any) => new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime())
                                            .map((application: any) => (
                                            <div key={application.id} className="bg-white/5 p-3 rounded-lg border border-white/10">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="text-white font-medium">Applied: {new Date(application.dateApplied).toLocaleDateString()}</p>
                                                        <p className="text-green-300 text-sm">Vaccine Cost: ${application.vaccineCost}</p>
                                                        <p className="text-blue-300 text-sm">Labour Cost: ${application.labourCost}</p>
                                                        <p className="text-yellow-300 text-sm font-medium">Total: ${application.totalCost}</p>
                                                        {application.notes && (
                                                            <p className="text-indigo-300 text-sm">{application.notes}</p>
                                                        )}
                                                    </div>
                                                    {application.nextApplicationDate && (
                                                        <p className="text-orange-300 text-sm">
                                                            Next: {new Date(application.nextApplicationDate).toLocaleDateString()}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="bg-white/10 border border-white/20 p-6 rounded-xl">
                                <h3 className="text-lg font-bold text-white mb-4">Timestamps</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-semibold text-indigo-200">Created</label>
                                        <p className="text-white font-medium">
                                            {new Date(vaccine.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-indigo-200">Last Updated</label>
                                        <p className="text-white font-medium">
                                            {new Date(vaccine.updatedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
