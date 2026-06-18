"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import DashboardSidebar from "@/components/Dashboard/DashboardSidebar";
import { IoTicketOutline } from "react-icons/io5";
import { BsList } from "react-icons/bs";
import { Avatar, Button } from "@heroui/react";

const DashboardLayout = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname();
    const { data, isPending } = authClient.useSession();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const user = data?.user;

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isPending && !user) {
            router.push("/login?redirect=/dashboard");
        }
    }, [user, isPending, router]);

    // Auto close sidebar on route change (mobile)
    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    // Lock body scroll when sidebar is open on mobile
    useEffect(() => {
        if (sidebarOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [sidebarOpen]);

    // Loading State
    if (isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-2xl shadow-green-500/30 animate-pulse">
                        <svg
                            className="w-8 h-8 text-white animate-spin"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                        </svg>
                    </div>
                    <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                        Loading your dashboard...
                    </p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 lg:flex">
            {/* Sidebar */}
            <DashboardSidebar
                user={user}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Top Bar */}
                <header className="lg:hidden sticky top-0 z-30 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 shadow-sm">
                    <div className="flex items-center justify-between gap-3">
                        {/* Left: Hamburger + Logo */}
                        <div className="flex items-center gap-3">
                            {/* Hamburger Menu */}
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:bg-green-500 hover:text-white active:scale-95 transition-all"
                                aria-label="Open menu"
                            >
                                <BsList size={22} />
                            </button>

                            {/* Logo */}
                            <Link
                                href="/"
                                className="flex items-center gap-2 group"
                            >
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                                    <IoTicketOutline
                                        className="text-white"
                                        size={20}
                                    />
                                </div>
                                <span className="text-lg font-black tracking-tight">
                                    <span className="text-zinc-900 dark:text-white">
                                        Ticket
                                    </span>
                                    <span className="text-green-500">ix</span>
                                </span>
                            </Link>
                        </div>

                        {/* Right: Notification + Avatar */}
                        <div className="flex items-center gap-2">
                            {/* User Avatar */}
                            <Button
                                variant="none"
                                onClick={() => setSidebarOpen(true)}
                            >
                                <Avatar className="w-9 h-9 group-hover:ring-2 ring-blue-500/70 transition-all cursor-pointer">
                                    <Avatar.Image
                                        className="object-cover"
                                        src={user?.image}
                                        alt={user?.name || "User"}
                                    />
                                    <Avatar.Fallback className="uppercase bg-success text-white">
                                        {user?.name?.slice(" ")[0] || "U"}
                                    </Avatar.Fallback>
                                </Avatar>
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
};

export default DashboardLayout;
