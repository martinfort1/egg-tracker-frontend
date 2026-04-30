"use client"

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react";
import { Menu, X, Home, Users, BarChart3, UserCheck, Package, Box, Syringe, DollarSign, Egg, Bird, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "@/lib/auth";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/buyers", label: "Buyers", icon: Users },
    { href: "/sales", label: "Sales", icon: BarChart3 },
    { href: "/employees", label: "Employees", icon: UserCheck },
    { href: "/feed-bags", label: "Feed Bags", icon: Package },
    { href: "/cartons", label: "Cartons", icon: Box },
    { href: "/vaccines", label: "Vaccines", icon: Syringe },
    { href: "/expenses", label: "Other Expenses", icon: DollarSign },
    { href: "/eggs", label: "Egg Laying", icon: Egg },
    { href: "/chickens", label: "Chickens", icon: Bird },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const [showHamburger, setShowHamburger] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const currentScrollY = window.scrollY;

                    if (currentScrollY < 10) {
                        setShowHamburger(true);
                    } else if (currentScrollY > lastScrollY) {
                        setShowHamburger(false);
                    } else {
                        setShowHamburger(true);
                    }

                    setLastScrollY(currentScrollY);
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);

    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    const linkClass = (path: string) =>
        `flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border border-white/10 ${
            pathname === path
                ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg"
                : "text-white/80 hover:text-white hover:bg-white/10"
        }`;

    return (
        <>
            {/* Hamburger */}
            <motion.button
                initial={false}
                animate={showHamburger ? { y: 0, opacity: 1 } : { y: -72, opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => setOpen(!open)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-linear-to-b from-slate-900/95 via-slate-900/90 to-slate-900/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/10 text-white"
            >
                {open ? <X size={24} /> : <Menu size={24} />}
            </motion.button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                        onClick={() => setOpen(false)}
                    />
                )}
            </AnimatePresence>

            <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ duration: 0.3 }}
                style={{ touchAction: 'pan-y', WebkitOverflowScrolling: 'touch' }}
                className={`fixed z-50 top-0 left-0 bottom-0 w-72 p-6 md:w-64 overflow-y-auto overscroll-contain max-h-screen bg-linear-to-b from-slate-900/95 via-slate-900/90 to-slate-900/95 border-r border-white/10 shadow-xl ${
                    open ? "" : "-translate-x-full md:translate-x-0"
                }`}
            >
                <button
                    type="button"
                    onClick={handleLogout}
                    className="flex flex-row w-full justify-between align-center px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-tighter text-red-400 bg-red-500/10 border-red-500/30 hover:text-white hover:bg-red-500/20 transition-all border hover:border-red-500/30 cursor-pointer mb-4"
                >
                    <LogOut className="w-4 h-4" />
                    Exit
                </button>
                <div className="flex justify-between items-center mb-8">
                    <div className="flex flex-col gap-1">
                            <img src="/FullLogo_Transparent_NoBuffer.png" alt="Egg Tracker Logo"/>
                    </div>
                </div>

                <nav className="flex flex-col gap-2">
                    {navItems.map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className={linkClass(href)}
                            onClick={() => setOpen(false)}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </Link>
                    ))}
                </nav>



            </motion.aside>
        </>
    );
}
