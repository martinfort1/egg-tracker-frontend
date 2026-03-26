"use client"

import { Button } from "./ui/button";

export default function SalesFilter({ period, setPeriod }: any){
    const options = [
        { label: "7 days", value: "7d"},
        { label: "30 days", value: "30d"},
        { label: "90 days", value: "90d"},
        { label: "1 year", value: "1y"},
    ];

    
    return(
        <div className="flex gap-2">
            {options.map(option => (
                <Button 
                    key={option.value}
                    onClick={() => setPeriod(option.value)}
                    className={`px-3 py-1 rounded-full border transition
                    ${period === option.value ? "bg-linear-to-r from-yellow-400 to-orange-500 text-white scale-110": "bg-slate-800/95  hover:bg-gray-700 cursor-pointer"}
                    `}
                    >
                        {option.label}
                </Button>
            ))}
        </div>
    )
}