"use client"

import Link from "next/link";
import { usePathname } from "next/navigation"
import { useState } from "react";

export default function Sidebar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const linkClass = (path: string) => 
        `flex items-center gap-2 px-4 py-2 rounded-lg transition
    ${
        pathname === path 
        ? 'bg-blue-500 text-white shadow font-bold' 
        : 'text-gray-600 hover:bg-gray-100'
    }`;
    
    return (
        <div className="w-64 h-screen border-r p-4 space-y-2">
            <h1 className="text-3xl font-bold mb-6">Egg Tracker</h1>

            <Link href={'/dashboard'} className={linkClass("/dashboard")} >
                Dashboard
            </Link>

            <Link href={'/buyers'} className={linkClass("/buyers")} >
                Buyers
            </Link>

            <Link href={'/sales'} className={linkClass("/sales")} >
                Sales
            </Link>

            {/* <Link href={'/sales'} className={linkClass("/employees")} >
                Employees
            </Link>

            <Link href={'/sales'} className={linkClass("/feed")} >
                Feed supply
            </Link>
            
            <Link href={'/sales'} className={linkClass("/egglaying")} >
                Egg laying
            </Link>
            <Link href={'/sales'} className={linkClass("/carton")} >
                Carton packets
            </Link> */}
        </div>
    )

}