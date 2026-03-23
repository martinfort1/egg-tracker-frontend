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
                    ${period === option.value ? "bg-blue-950 text-white scale-105": "hover:bg-gray-700"}
                    `}
                    >
                        {option.label}
                </Button>
            ))}
        </div>
    )
}