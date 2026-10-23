"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
    Menu,
    X,
    Home,
    Users,
    BarChart3,
    UserCheck,
    Package,
    Box,
    Syringe,
    DollarSign,
    Egg,
    Bird,
    ClipboardList,
    LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "@/lib/auth";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/buyers", label: "Buyers", icon: Users },
    { href: "/orders", label: "Orders", icon: ClipboardList },
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

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [lastScrollY]);

    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push("/login");
    };

    return (
        <>
            {/* Mobile Hamburger Button */}
            <motion.button
                initial={false}
                animate={showHamburger ? { y: 0, opacity: 1 } : { y: -72, opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => setOpen(!open)}
                className="md:hidden fixed top-4 left-4 z-50 p-2.5 bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-slate-200 text-slate-800 cursor-pointer"
            >
                {open ? <X size={22} /> : <Menu size={22} />}
            </motion.button>

            {/* Mobile Backdrop */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40"
                        onClick={() => setOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Aside */}
            <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ duration: 0.3 }}
                style={{ touchAction: "pan-y", WebkitOverflowScrolling: "touch" }}
                className={`fixed z-50 top-0 left-0 bottom-0 w-72 md:w-64 p-4 overflow-y-auto overscroll-contain max-h-screen bg-slate-50/80 border-r border-slate-200 shadow-xs flex flex-col justify-between ${
                    open ? "" : "-translate-x-full md:translate-x-0"
                }`}
            >
                <div className="space-y-4">
                    {/* Brand Logo Header Card */}
                    <Link
                        href="/dashboard"
                        onClick={() => setOpen(false)}
                        className="block p-3 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-amber-300 hover:shadow-sm transition-all duration-200 group"
                    >
                        <img
                            src="/huevos-noa.png"
                            alt="Huevos NOA"
                            className="w-full h-auto object-contain max-h-16 mx-auto transition-transform duration-200 group-hover:scale-[1.02]"
                        />
                    </Link>

                    {/* Navigation Menu Cards */}
                    <nav className="flex flex-col gap-2">
                        {navItems.map(({ href, label, icon: Icon }) => {
                            const isActive = pathname === href;

                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    onClick={() => setOpen(false)}
                                    className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 border ${
                                        isActive
                                            ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                                            : "bg-white text-slate-700 border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 hover:text-slate-950 shadow-2xs hover:shadow-xs"
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon
                                            className={`w-4 h-4 shrink-0 transition-colors ${
                                                isActive
                                                    ? "text-amber-400"
                                                    : "text-slate-400 group-hover:text-amber-500"
                                            }`}
                                        />
                                        <span>{label}</span>
                                    </div>

                                    {isActive ? (
                                        <span className="w-2 h-2 rounded-full bg-amber-400 ring-2 ring-amber-400/30 shrink-0" />
                                    ) : (
                                        <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-amber-300/80 transition-colors shrink-0" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Footer / Exit Session Card */}
                <div className="pt-4 mt-4 border-t border-slate-200">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-white text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 shadow-2xs transition-all cursor-pointer"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Exit session</span>
                    </button>
                </div>
            </motion.aside>
        </>
    );
}
