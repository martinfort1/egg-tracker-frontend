"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { InboxIcon, Layers } from "lucide-react";
import { formatUtcDate } from "@/lib/utils";

export default function EggLayingPage() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [days, setDays] = useState<any[]>([]);
    const [eggData, setEggData] = useState<{ [key: string]: { boxes: number, cartons: number } }>({});
    const [editingDate, setEditingDate] = useState<string | null>(null);
    const [tempBoxes, setTempBoxes] = useState(0);
    const [tempCartons, setTempCartons] = useState(0);
    const [open, setOpen] = useState(false);

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
            const response = await api.get(`/egg-laying/by-month/${currentMonth.getFullYear()}/${currentMonth.getMonth() + 1}`);
            const dataMap: { [key: string]: { boxes: number, cartons: number } } = {};
            response.data.forEach((item: any) => {
                const date = item.date;
                dataMap[date] = { boxes: item.boxes, cartons: item.cartons };
            });
            setEggData(dataMap);
        } catch (error) {
            toast.error("Failed to fetch egg data");
        }
    };

    const handleSaveEgg = async () => {
        if (!editingDate) return;

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
        <div className="space-y-6 p-2 md:p-6 bg-linear-to-br from-slate-900/30 via-slate-900/20 to-slate-900/30 rounded-2xl border border-white/10 shadow-xl">
            <div className="text-center max-w-lg mx-auto mb-4 bg-linear-to-br from-orange-500/90 to-yellow-500/90 rounded-4xl p-2 border border-white/20">
                <h1 className="text-3xl font-black text-slate-800 mb-2 ">Egg Laying Calendar</h1>
                <p className="text-slate-700">Track daily egg collection</p>
            </div>

            {/* Month Navigation */}
            <div className="bg-slate-900/90 border border-white/10 rounded-xl p-4">
                <div className="flex justify-between items-center mb-4">
                    <Button
                        onClick={prevMonth}
                        className="bg-linear-to-br from-orange-500/90 to-yellow-500/90 rounded-xl hover:scale-105 cursor-pointer"
                    >
                        ← Previous
                    </Button>
                    <h2 className="text-xl font-bold text-white">{monthName}</h2>
                    <Button
                        onClick={nextMonth}
                        className="bg-linear-to-br from-orange-500/90 to-yellow-500/90 rounded-xl hover:scale-105 cursor-pointer"
                    >
                        Next →
                    </Button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                    {/* Week days header */}
                    {weekDays.map(day => (
                        <div key={day} className="text-center text-sm font-bold text-indigo-300 py-2">
                            {day}
                        </div>
                    ))}

                    {/* Calendar days */}
                    {days.map((date, index) => {
                        if (!date) {
                            return <div key={`empty-${index}`} className="bg-white/5 rounded-2xl p-2"></div>;
                        }

                        const dateStr = formatDate(date);
                        const hasData = eggData[dateStr];
                        const today = isToday(date);

                        let bgClass = '';
                        if (today) {
                            bgClass = 'bg-linear-to-br from-orange-500/90 to-yellow-500/90';
                        } else if (hasData) {
                            bgClass = 'bg-linear-to-bl from-green-500 via-green-700 to-green-500 text-white hover:bg-green-700';
                        } else {
                            bgClass = 'bg-white/10 text-slate-300 hover:bg-white/20 border-orange-500/35 border-2';
                        }

                        let textClass = hasData ? 'text-slate-800 font-semibold underline' : (today ? 'text-slate-800 font-semibold' : 'text-slate-300');

                        return (
                            <Dialog key={index} open={open && editingDate === formatDate(date)} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                    <button
                                        onClick={() => openEditDialog(date)}
                                        className={`p-2 rounded text-sm font-medium transition cursor-pointer ${bgClass}`}
                                    >
                                        <div className={hasData ? 'text-slate-800 font-semibold underline' : (today ? 'text-slate-800 font-semibold' : 'text-slate-300')}>{date.getDate()}</div>
                                        {hasData && (
                                            <div className="text-xs mt-3">
                                                <Layers className="w-4 h-4 inline md:mr-1 text-yellow-500"/> {hasData.boxes}
                                                <br />
                                                <InboxIcon className="w-4 h-4 inline md:mr-1 text-orange-500"/> {hasData.cartons}
                                            </div>
                                        )}
                                    </button>
                                </DialogTrigger>

                                {editingDate === formatDate(date) && (
                                    <DialogContent className="bg-slate-900 border border-white/20">
                                        <DialogHeader>
                                            <DialogTitle className="text-white">
                                                Egg Collection - {formatUtcDate(dateStr)}
                                            </DialogTitle>
                                        </DialogHeader>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm font-semibold text-indigo-200">Egg Boxes</label>
                                                <Input
                                                    type="number"
                                                    value={tempBoxes}
                                                    onChange={(e) => setTempBoxes(Number(e.target.value))}
                                                    className="bg-white/20 border-white/30 text-white"
                                                    min="0"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-sm font-semibold text-indigo-200">Cartons</label>
                                                <Input
                                                    type="number"
                                                    value={tempCartons}
                                                    onChange={(e) => setTempCartons(Number(e.target.value))}
                                                    className="bg-white/20 border-white/30 text-white"
                                                    min="0"
                                                />
                                            </div>

                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={handleSaveEgg}
                                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                                >
                                                    Save
                                                </Button>
                                                {hasData && (
                                                    <Button
                                                        onClick={() => {
                                                            handleDelete(dateStr);
                                                            setOpen(false);
                                                        }}
                                                        className="flex-1 bg-red-600 hover:bg-red-700"
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
        </div>
    );
}
