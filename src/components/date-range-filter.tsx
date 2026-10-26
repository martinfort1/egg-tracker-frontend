"use client";

import { Calendar, X, Filter, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export type DateFilterPreset =
    | "all"
    | "today"
    | "7d"
    | "30d"
    | "this-month"
    | "custom";

interface DateRangeFilterProps {
    startDate: string;
    setStartDate: (val: string) => void;
    endDate: string;
    setEndDate: (val: string) => void;
    activePreset?: DateFilterPreset;
    onSelectPreset?: (preset: DateFilterPreset) => void;
    showDebtToggle?: boolean;
    showDebtOnly?: boolean;
    setShowDebtOnly?: (val: boolean | ((p: boolean) => boolean)) => void;
    debtLabel?: string;
    accentColor?: "emerald" | "orange" | "amber" | "indigo";
    totalCount?: number;
}

export default function DateRangeFilter({
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    activePreset = "all",
    onSelectPreset,
    showDebtToggle = false,
    showDebtOnly = false,
    setShowDebtOnly,
    debtLabel = "Solo deudas pendientes",
    accentColor = "emerald",
    totalCount,
}: DateRangeFilterProps) {
    const handlePreset = (preset: DateFilterPreset) => {
        const today = new Date();
        const formatDate = (d: Date) => d.toISOString().split("T")[0];

        onSelectPreset?.(preset);

        if (preset === "all") {
            setStartDate("");
            setEndDate("");
        } else if (preset === "today") {
            const todayStr = formatDate(today);
            setStartDate(todayStr);
            setEndDate(todayStr);
        } else if (preset === "7d") {
            const past = new Date();
            past.setDate(today.getDate() - 7);
            setStartDate(formatDate(past));
            setEndDate(formatDate(today));
        } else if (preset === "30d") {
            const past = new Date();
            past.setDate(today.getDate() - 30);
            setStartDate(formatDate(past));
            setEndDate(formatDate(today));
        } else if (preset === "this-month") {
            const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
            setStartDate(formatDate(firstDay));
            setEndDate(formatDate(today));
        }
    };

    const handleClearDates = () => {
        setStartDate("");
        setEndDate("");
        onSelectPreset?.("all");
    };

    const accentClasses = {
        emerald: {
            activeBtn: "bg-emerald-600 text-white border-emerald-600 shadow-2xs",
            border: "border-emerald-200/90",
            focus: "focus:border-emerald-500 focus:ring-emerald-500/20",
            badge: "bg-emerald-50 text-emerald-800 border-emerald-200",
            icon: "text-emerald-600",
        },
        orange: {
            activeBtn: "bg-orange-600 text-white border-orange-600 shadow-2xs",
            border: "border-orange-200/90",
            focus: "focus:border-orange-500 focus:ring-orange-500/20",
            badge: "bg-orange-50 text-orange-800 border-orange-200",
            icon: "text-orange-600",
        },
        amber: {
            activeBtn: "bg-amber-600 text-white border-amber-600 shadow-2xs",
            border: "border-amber-200/90",
            focus: "focus:border-amber-500 focus:ring-amber-500/20",
            badge: "bg-amber-50 text-amber-800 border-amber-200",
            icon: "text-amber-600",
        },
        indigo: {
            activeBtn: "bg-indigo-600 text-white border-indigo-600 shadow-2xs",
            border: "border-indigo-200/90",
            focus: "focus:border-indigo-500 focus:ring-indigo-500/20",
            badge: "bg-indigo-50 text-indigo-800 border-indigo-200",
            icon: "text-indigo-600",
        },
    }[accentColor];

    const presets: { id: DateFilterPreset; label: string }[] = [
        { id: "all", label: "Todo el Historial" },
        { id: "today", label: "Hoy" },
        { id: "7d", label: "Últimos 7 días" },
        { id: "30d", label: "Últimos 30 días" },
        { id: "this-month", label: "Este Mes" },
    ];

    const hasCustomDates = Boolean(startDate || endDate);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3.5">
            {/* Top row: Presets & Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1 flex items-center gap-1">
                        <Filter className={`w-3.5 h-3.5 ${accentClasses.icon}`} />
                        Período:
                    </span>

                    {presets.map((p) => {
                        const isActive =
                            !hasCustomDates && activePreset === p.id;
                        return (
                            <button
                                key={p.id}
                                type="button"
                                onClick={() => handlePreset(p.id)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                                    isActive
                                        ? accentClasses.activeBtn
                                        : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                                }`}
                            >
                                {p.label}
                            </button>
                        );
                    })}
                </div>

                {/* Optional Debt Filter Toggle */}
                {showDebtToggle && setShowDebtOnly && (
                    <button
                        type="button"
                        onClick={() => setShowDebtOnly((prev) => !prev)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center gap-1.5 w-fit ${
                            showDebtOnly
                                ? "bg-rose-50 border-rose-300 text-rose-700 shadow-2xs"
                                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                    >
                        <Clock className="w-3.5 h-3.5" />
                        <span>{debtLabel}</span>
                    </button>
                )}
            </div>

            {/* Bottom row: Exact Date Pickers (Desde / Hasta) */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-slate-500 font-semibold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Filtrar por Fechas Específicas:
                    </span>

                    <div className="flex items-center gap-1.5">
                        <label className="text-slate-400 font-medium text-[11px]">Desde:</label>
                        <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => {
                                setStartDate(e.target.value);
                                onSelectPreset?.("custom");
                            }}
                            className={`h-8 w-34 bg-slate-50/70 border-slate-200 rounded-lg text-xs font-medium px-2 ${accentClasses.focus}`}
                        />
                    </div>

                    <div className="flex items-center gap-1.5">
                        <label className="text-slate-400 font-medium text-[11px]">Hasta:</label>
                        <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => {
                                setEndDate(e.target.value);
                                onSelectPreset?.("custom");
                            }}
                            className={`h-8 w-34 bg-slate-50/70 border-slate-200 rounded-lg text-xs font-medium px-2 ${accentClasses.focus}`}
                        />
                    </div>

                    {hasCustomDates && (
                        <button
                            type="button"
                            onClick={handleClearDates}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 border border-rose-200 transition cursor-pointer"
                            title="Limpiar fechas y ver todo el historial"
                        >
                            <X className="w-3 h-3" />
                            Limpiar fechas
                        </button>
                    )}
                </div>

                {/* Active filter summary pill */}
                {totalCount !== undefined && (
                    <span className="text-xs font-semibold text-slate-500">
                        {totalCount} {totalCount === 1 ? "operación encontrada" : "operaciones encontradas"}
                    </span>
                )}
            </div>
        </div>
    );
}
