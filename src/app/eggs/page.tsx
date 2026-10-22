"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { InboxIcon, Layers } from "lucide-react";
import { formatUtcDate } from "@/lib/utils";
import LoadSpin from "@/components/load-spin";
export default function EggLayingPage() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [days, setDays] = useState<any[]>([]);
    const [eggData, setEggData] = useState<{ [key: string]: { boxes: number, cartons: number } }>({});
    const [editingDate, setEditingDate] = useState<string | null>(null);
    const [tempBoxes, setTempBoxes] = useState(0);
    const [tempCartons, setTempCartons] = useState(0);
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        generateCalendarDays();
        fetchEggData();
    }, [currentMonth]);

    const generateCalendarDays = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const calendarDays = [];
        for (let i = 0; i < startingDayOfWeek; i++) {
            calendarDays.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            calendarDays.push(new Date(year, month, i));
        }

        setDays(calendarDays);
    };

    const fetchEggData = async () => {
        try {
            setIsLoading(true);
            const response = await api.get(`/egg-laying/by-month/${currentMonth.getFullYear()}/${currentMonth.getMonth() + 1}`);
            const dataMap: { [key: string]: { boxes: number, cartons: number } } = {};
            response.data.forEach((item: any) => {
                const date = item.date;
                dataMap[date] = { boxes: item.boxes, cartons: item.cartons };
            });
            setEggData(dataMap);
        } catch (error) {
            toast.error("Failed to fetch egg data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveEgg = async () => {
        if (!editingDate) return;
        setIsSubmitting(true);
        try {
            await api.post("/egg-laying", {
                date: editingDate,
                boxes: tempBoxes,
                cartons: tempCartons
            });
            toast.success("Egg data saved");
            setOpen(false);
            fetchEggData();
        } catch (error) {
            toast.error("Failed to save egg data");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const formatDate = (date: Date) =>  date.toLocaleDateString('en-CA');        
    
    const openEditDialog = (date: Date) => {
        const dateStr = formatDate(date);
        const existing = eggData[formatDate(date)];
        setEditingDate(dateStr);
        setTempBoxes(existing?.boxes || 0);
        setTempCartons(existing?.cartons || 0);
        setOpen(true);
    };

    
    const handleDelete = async (date: string) => {
        if (!confirm("Delete this entry?")) return;

        try {
            // Find the ID by fetching and matching the date
            const data = await api.get(`/egg-laying`);
            const item = data.data.find((e: any) => e.date === date);
            if (item) {
                await api.delete(`/egg-laying/${item.id}`);
                toast.success("Entry deleted");
                fetchEggData();
            } else {
                toast.error("Entry not found");
            }
        } catch (error) {
            toast.error("Failed to delete entry");
        }
    };

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const isToday = (date: Date) => {
    const today = new Date();
    
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
};
const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];


return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-['Playfair_Display'] font-semibold text-slate-900">
                        Egg Laying Calendar
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Track daily egg collection, boxes and cartons gathered from your flock
                    </p>
                </div>
            </div>

            {/* Month Navigation & Calendar */}
            {isLoading ? (
                <LoadSpin />
            ) : (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <Button
                        onClick={prevMonth}
                        variant="outline"
                        className="text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold px-3 py-1.5 transition cursor-pointer"
                    >
                        ← Previous
                    </Button>
                    <h2 className="text-xl font-bold text-slate-900">{monthName}</h2>
                    <Button
                        onClick={nextMonth}
                        variant="outline"
                        className="text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold px-3 py-1.5 transition cursor-pointer"
                    >
                        Next →
                    </Button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                    {/* Week days header */}
                    {weekDays.map(day => (
                        <div key={day} className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider py-2">
                            {day}
                        </div>
                    ))}

                    {/* Calendar days */}
                    {days.map((date, index) => {
                        if (!date) {
                            return <div key={`empty-${index}`} className="bg-slate-50/50 rounded-xl p-2 min-h-16"></div>;
                        }

                        const dateStr = formatDate(date);
                        const hasData = eggData[dateStr];
                        const today = isToday(date);

                        let bgClass = '';
                        if (today) {
                            bgClass = 'bg-amber-50 text-amber-900 border-2 border-amber-400 font-bold shadow-xs';
                        } else if (hasData) {
                            bgClass = 'bg-emerald-50 text-emerald-900 border border-emerald-200/90 hover:bg-emerald-100/70';
                        } else {
                            bgClass = 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60';
                        }

                        return (
                            <Dialog key={index} open={open && editingDate === formatDate(date)} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                    <button
                                        onClick={() => openEditDialog(date)}
                                        className={`p-2.5 rounded-xl text-sm font-medium transition cursor-pointer min-h-16 flex flex-col justify-between ${bgClass}`}
                                    >
                                        <div className="flex justify-between items-center w-full">
                                            <span className="font-bold text-xs">{date.getDate()}</span>
                                            {today && <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>}
                                        </div>
                                        {hasData ? (
                                            <div className="text-[11px] font-semibold mt-1 space-y-0.5 text-left">
                                                <div className="flex items-center gap-1 text-emerald-800">
                                                    <Layers className="w-3 h-3 text-emerald-600"/> {hasData.boxes}b
                                                </div>
                                                <div className="flex items-center gap-1 text-emerald-800">
                                                    <InboxIcon className="w-3 h-3 text-emerald-600"/> {hasData.cartons}c
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] text-slate-300 self-end mt-2">+</span>
                                        )}
                                    </button>
                                </DialogTrigger>

                                {editingDate === formatDate(date) && (
                                    <DialogContent className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl">
                                        <DialogHeader>
                                            <DialogTitle className="text-slate-900 font-bold text-lg">
                                                Egg Collection - {formatUtcDate(dateStr)}
                                            </DialogTitle>
                                        </DialogHeader>

                                        <div className="space-y-4 pt-2">
                                            <div>
                                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5">Egg Boxes</label>
                                                <Input
                                                    type="number"
                                                    value={tempBoxes}
                                                    onChange={(e) => setTempBoxes(Number(e.target.value))}
                                                    className="bg-slate-50 border-slate-200 text-slate-900 rounded-lg"
                                                    min="0"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1.5">Cartons</label>
                                                <Input
                                                    type="number"
                                                    value={tempCartons}
                                                    onChange={(e) => setTempCartons(Number(e.target.value))}
                                                    className="bg-slate-50 border-slate-200 text-slate-900 rounded-lg"
                                                    min="0"
                                                />
                                            </div>

                                            <div className="flex gap-2 pt-2">
                                                <Button
                                                    disabled={isSubmitting}
                                                    onClick={handleSaveEgg}
                                                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer"
                                                >
                                                    {isSubmitting ? 'Saving...' : 'Save Collection'}
                                                </Button>
                                                {hasData && (
                                                    <Button
                                                        onClick={() => {
                                                             handleDelete(dateStr);
                                                            setOpen(false);
                                                        }}
                                                        variant="outline"
                                                        className="text-rose-600 hover:bg-rose-50 border-rose-200 rounded-lg cursor-pointer"
                                                    >
                                                        Delete
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </DialogContent>
                                )}
                            </Dialog>
                        );
                    })}
                </div>
            </div>
            )}
        </div>
    );
}
