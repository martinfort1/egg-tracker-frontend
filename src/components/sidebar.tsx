"use client"

import Link from "next/link";
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Sidebar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [showHamburger, setShowHamburger] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY < 10) {
                // Always show hamburger at the top of the page
                setShowHamburger(true);
            } else if (currentScrollY > lastScrollY) {
                // Scrolling down - hide hamburger
                setShowHamburger(false);
            } else {
                // Scrolling up - show hamburger
                setShowHamburger(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);

    const linkClass = (path: string) => 
        `flex items-center gap-2 px-4 py-2 rounded-lg transition
    ${
        pathname === path 
        ? 'bg-blue-500 text-white shadow font-bold' 
        : 'text-gray-600 hover:bg-gray-100'
    }`;
    
    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={() => setOpen(!open)}
                className={`md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg border transition-transform duration-300 ${
                    showHamburger ? 'translate-y-0' : '-translate-y-full'
                }`}
            >
                {open ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Overlay for mobile */}
            {open && (
                <div
                    className="md:hidden fixed inset-0 backdrop-blur-sm z-40"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                w-64 h-screen border-r p-4 space-y-2 bg-white
                fixed md:relative z-50 md:z-auto
                transform ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
                transition-transform duration-300 ease-in-out
            `}>
                <h1 className="text-3xl font-bold mb-6">Egg Tracker</h1>

                <Link href={'/dashboard'} className={linkClass("/dashboard")} onClick={() => setOpen(false)}>
                    Dashboard
                </Link>

                <Link href={'/buyers'} className={linkClass("/buyers")} onClick={() => setOpen(false)}>
                    Buyers
                </Link>

                <Link href={'/sales'} className={linkClass("/sales")} onClick={() => setOpen(false)}>
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
        </>
    )

}