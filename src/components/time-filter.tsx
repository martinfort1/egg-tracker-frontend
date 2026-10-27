"use client";

import { Calendar, Filter } from "lucide-react";

type TimeFilterProps = {
    period: string;
    setPeriod: (value: string) => void;
    showOutstandingOnly?: boolean;
    setShowOutstandingOnly?: (value: boolean | ((prev: boolean) => boolean)) => void;
    showOutstandingToggle?: boolean;
};

export default function TimeFilter({
    period,
    setPeriod,
    showOutstandingOnly,
    setShowOutstandingOnly,
    showOutstandingToggle = false,
}: TimeFilterProps) {
    const options = [
        { label: "7 days", value: "7d" },
        { label: "30 days", value: "30d" },
        { label: "90 days", value: "90d" },
        { label: "1 year", value: "1y" },
        { label: "All data", value: "all" },
    ];

    const handleOutstandingToggle = () => {
        if (setShowOutstandingOnly) {
            setShowOutstandingOnly((prev: boolean) => !prev);
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-500/20 shrink-0">
                    <Calendar className="w-5 h-5" />
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                            Time Period Filter
                        </h3>
                        <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                            Dashboard
                        </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Filter metrics, margins, and financial reports
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
                <div className="inline-flex p-1 bg-slate-100/90 rounded-xl border border-slate-200/70 shadow-inner">
                    {options.map((option) => {
                        const active = period === option.value;
                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => setPeriod(option.value)}
                                className={`px-3 sm:px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                                    active
                                        ? "bg-white text-indigo-600 shadow-sm border border-slate-200/80 font-bold scale-[1.02]"
                                        : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                                }`}
                            >
                                {option.label}
                            </button>
                        );
                    })}
                </div>

                {showOutstandingToggle && setShowOutstandingOnly && (
                    <button
                        type="button"
                        onClick={handleOutstandingToggle}
                        className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
                            showOutstandingOnly
                                ? "bg-rose-50 text-rose-700 border-rose-300 font-bold"
                                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                        }`}
                    >
                        <span
                            className={`w-2 h-2 rounded-full ${
                                showOutstandingOnly ? "bg-rose-500 animate-pulse" : "bg-slate-300"
                            }`}
                        />
                        {showOutstandingOnly ? "Showing unpaid only" : "Show unpaid only"}
                    </button>
                )}
            </div>
        </div>
    );
}
