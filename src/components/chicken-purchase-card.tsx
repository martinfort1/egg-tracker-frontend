"use client"

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { AddChickenDeathForm } from "@/components/add-chicken-death-form";
import { formatCurrency, formatNumber, formatUtcDate } from "@/lib/utils";

interface ChickenCardProps {
    chicken: any;
    onDelete: (id: string) => void;
    onRefresh: () => void;
}

export function ChickenPurchaseCard({ chicken, onDelete, onRefresh }: ChickenCardProps) {
    const totalDeaths = chicken.deaths.reduce((sum: number, d: any) => sum + d.amount, 0);
    const remaining = chicken.amount - totalDeaths;

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-blue-500">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4 sm:grid-cols-1">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        Purchase on {formatUtcDate(chicken.date)}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">ID: {chicken.id.slice(0, 8)}</p>
                </div>
                <div className="flex gap-2">
                    <AddChickenDeathForm chickenId={chicken.id} onSuccess={onRefresh} />
                    <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                        onClick={() => onDelete(chicken.id)}
                    >
                        <Trash2 size={16} />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-xs font-semibold text-gray-600 uppercase">Purchased</p>
                    <p className="text-xl md:text-2xl font-bold text-blue-600 mt-1">{formatNumber(chicken.amount)}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-xs font-semibold text-gray-600 uppercase">Deaths</p>
                    <p className="text-xl md:text-2xl font-bold text-red-600 mt-1">{formatNumber(totalDeaths)}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-xs font-semibold text-gray-600 uppercase">Remaining</p>
                    <p className="text-xl md:text-2xl font-bold text-green-600 mt-1">{formatNumber(remaining)}</p>
                </div>
                <div className="bg-purple-100 p-4 rounded-lg">
                    <p className="text-xs font-semibold text-gray-600 uppercase">Total Cost</p>
                    <p className="text-xl md:text-2xl font-bold text-purple-700">{formatCurrency(chicken.totalCost.toFixed(0))}</p>
                </div>
            </div>
            

            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div>
                    <p className="text-xs text-gray-500">Price per Unit</p>
                    <p className="text-sm font-semibold text-gray-900">{formatCurrency(chicken.pricePerChicken)}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500">Shipping Cost</p>
                    <p className="text-sm font-semibold text-gray-900">{formatCurrency(chicken.shippingCost)}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500">Survival Rate</p>
                    <p className="text-sm font-semibold text-gray-900">
                        {chicken.amount > 0 ? ((remaining / chicken.amount) * 100).toFixed(2) : 0}%
                    </p>
                </div>
            </div>

            {chicken.deaths.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm font-semibold text-gray-900 mb-2">Death Records</p>
                    <div className="space-y-2">
                        {chicken.deaths.map((death: any) => (
                            <div key={death.id} className="bg-red-50 p-2 rounded text-sm">
                                <div className="flex justify-between">
                                    <span className="font-medium text-red-700">{formatNumber(death.amount)} deaths</span>
                                    <span className="text-gray-500">{formatUtcDate(death.date)}</span>
                                </div>
                                {death.notes && <p className="text-gray-600 text-xs mt-1">{death.notes}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
