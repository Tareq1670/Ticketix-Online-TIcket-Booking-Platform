"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import {
    BsTicketPerforated,
    BsPersonCircle,
    BsCart3,
    BsClockHistory,
    BsPlusCircle,
    BsListUl,
    BsGraphUp,
    BsPeople,
    BsBoxSeam,
    BsMegaphone,
    BsGear,
    BsQuestionCircle,
    BsBoxArrowRight,
    BsChevronLeft,
    BsChevronRight,
    BsX,
} from "react-icons/bs";
import { IoTicketOutline } from "react-icons/io5";
import { Avatar, Button } from "@heroui/react";

const DashboardSidebar = ({ user, isOpen, onClose }) => {
    const pathname = usePathname();
    const router = useRouter();
    const [isMinimized, setIsMinimized] = useState(false);

    const role = user?.role || "user";

    const NAV_LINKS = {
        user: [
            {
                section: "MAIN MENU",
                items: [
                    {
                        label: "My Profile",
                        href: "/dashboard/user/profile",
                        icon: BsPersonCircle,
                    },
                    {
                        label: "My Bookings",
                        href: "/dashboard/user/my-bookings",
                        icon: BsCart3,
                    },
                    {
                        label: "Transaction History",
                        href: "/dashboard/user/transactions",
                        icon: BsClockHistory,
                    },
                ],
            },
        ],
        vendor: [
            {
                section: "MAIN MENU",
                items: [
                    {
                        label: "Vendor Profile",
                        href: "/dashboard/vendor/profile",
                        icon: BsPersonCircle,
                    },
                    {
                        label: "Add Ticket",
                        href: "/dashboard/vendor/add-ticket",
                        icon: BsPlusCircle,
                    },
                    {
                        label: "My Tickets",
                        href: "/dashboard/vendor/my-tickets",
                        icon: BsListUl,
                    },
                    {
                        label: "Booking Requests",
                        href: "/dashboard/vendor/booking-requests",
                        icon: BsBoxSeam,
                    },
                ],
            },
            {
                section: "ANALYTICS",
                items: [
                    {
                        label: "Revenue Overview",
                        href: "/dashboard/vendor/revenue",
                        icon: BsGraphUp,
                    },
                ],
            },
        ],
        admin: [
            {
                section: "MAIN MENU",
                items: [
                    {
                        label: "Admin Profile",
                        href: "/dashboard/admin/profile",
                        icon: BsPersonCircle,
                    },
                ],
            },
            {
                section: "MANAGEMENT",
                items: [
                    {
                        label: "Manage Tickets",
                        href: "/dashboard/admin/manage-tickets",
                        icon: BsTicketPerforated,
                    },
                    {
                        label: "Manage Users",
                        href: "/dashboard/admin/manage-users",
                        icon: BsPeople,
                    },
                    {
                        label: "Advertise Tickets",
                        href: "/dashboard/admin/advertise",
                        icon: BsMegaphone,
                    },
                ],
            },
        ],
    };

    const handleLogout = async () => {
        try {
            await authClient.signOut();
            toast.success("Logged out successfully");
            router.refresh();
        } catch (err) {
            toast.error("Logout failed");
        }
    };

    const navSections = NAV_LINKS[role] || NAV_LINKS.user;

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:sticky top-0 left-0 h-screen bg-zinc-900 border-r border-zinc-800 z-50 transition-all duration-300 flex flex-col ${
                    isMinimized ? "lg:w-20" : "lg:w-72"
                } w-[280px] ${
                    isOpen
                        ? "translate-x-0 shadow-2xl shadow-black/50"
                        : "-translate-x-full lg:translate-x-0"
                }`}
            >
                {/* Mobile Close Button */}
                <Button
                    variant="none"
                    onClick={onClose}
                    className="lg:hidden absolute top-4 right-4 w-9 h-9 rounded-xl bg-zinc-800 hover:bg-red-500 text-white flex items-center justify-center transition-all active:scale-95 z-10"
                    aria-label="Close menu"
                >
                    <BsX size={22} />
                </Button>

                {/* Header */}
                <div className="p-5 border-b border-zinc-800">
                    <div className="flex items-center justify-between">
                        <Link
                            href="/"
                            onClick={onClose}
                            className={`flex items-center gap-2.5 group ${
                                isMinimized ? "lg:justify-center lg:w-full" : ""
                            }`}
                        >
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform flex-shrink-0">
                                <IoTicketOutline
                                    className="text-white"
                                    size={24}
                                />
                            </div>
                            <div className={isMinimized ? "lg:hidden" : ""}>
                                <h1 className="text-xl font-black tracking-tight">
                                    <span className="text-white">Ticket</span>
                                    <span className="text-green-500">ix</span>
                                </h1>
                                <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                                    {role} Dashboard
                                </p>
                            </div>
                        </Link>
                    </div>

                    {/* Minimize Toggle - Desktop Only */}
                    <Button
                        variant="none"
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="hidden lg:flex items-center gap-1.5 mt-4 w-full justify-center text-zinc-400 hover:text-white text-xs font-semibold py-2 rounded-lg hover:bg-zinc-800 transition-all"
                    >
                        {isMinimized ? (
                            <BsChevronRight size={14} />
                        ) : (
                            <>
                                <BsChevronLeft size={14} />
                                <span>Minimize</span>
                            </>
                        )}
                    </Button>
                </div>

                {/* Scrollable Nav */}
                <div className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                    {navSections.map((section) => (
                        <div key={section.section} className="mb-6">
                            <p
                                className={`text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-3 mb-2 ${
                                    isMinimized ? "lg:hidden" : ""
                                }`}
                            >
                                {section.section}
                            </p>

                            <nav className="flex flex-col gap-1">
                                {section.items.map((item) => {
                                    const isActive =
                                        pathname === item.href ||
                                        (item.href !== "/dashboard" &&
                                            pathname.startsWith(item.href));

                                    const Icon = item.icon;

                                    return (
                                        <Link
                                            key={item.label}
                                            href={item.href}
                                            onClick={onClose}
                                            className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all ${
                                                isActive
                                                    ? "bg-gradient-to-r from-green-500/20 to-emerald-500/10 text-green-400 shadow-lg shadow-green-500/10"
                                                    : "text-zinc-400 hover:text-white hover:bg-zinc-800 active:bg-zinc-700"
                                            } ${
                                                isMinimized
                                                    ? "lg:justify-center"
                                                    : ""
                                            }`}
                                            title={
                                                isMinimized ? item.label : ""
                                            }
                                        >
                                            {isActive && (
                                                <div
                                                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-green-400 to-emerald-500 rounded-r-full ${
                                                        isMinimized
                                                            ? "lg:hidden"
                                                            : ""
                                                    }`}
                                                />
                                            )}

                                            <Icon
                                                className={`flex-shrink-0 transition-transform ${
                                                    isActive
                                                        ? "scale-110"
                                                        : "group-hover:scale-110"
                                                }`}
                                                size={20}
                                            />

                                            <span
                                                className={`flex-1 truncate ${
                                                    isMinimized
                                                        ? "lg:hidden"
                                                        : ""
                                                }`}
                                            >
                                                {item.label}
                                            </span>

                                            {isMinimized && (
                                                <div className="hidden lg:block absolute left-full ml-3 px-3 py-1.5 rounded-lg bg-zinc-800 text-white text-xs font-semibold opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-2xl z-50">
                                                    {item.label}
                                                    {item.badge && (
                                                        <span className="ml-2 px-1.5 py-0.5 rounded-full bg-pink-500 text-[9px] font-black">
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    ))}
                </div>

                {/* User Profile Section */}
                <div className="border-t border-zinc-800 p-4">
                    <div
                        className={`bg-zinc-800/50 rounded-2xl p-3 mb-3 hover:bg-zinc-800 transition-colors ${
                            isMinimized ? "lg:hidden" : ""
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className="relative">
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
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-zinc-900" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white truncate">
                                    {user?.name || "User"}
                                </p>
                                <p className="text-[10px] text-zinc-400 capitalize font-medium">
                                    {role}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Minimized Avatar - Desktop Only */}
                    {isMinimized && (
                        <div className="hidden lg:flex justify-center mb-3">
                            <div className="relative">
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
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-zinc-900" />
                            </div>
                        </div>
                    )}

                    {/* Logout Button - Pure HTML button (No HeroUI) */}
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className={`group w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-zinc-400 hover:text-red-400 hover:bg-red-500/10 active:bg-red-500/20 transition-all ${
                            isMinimized ? "lg:justify-center" : ""
                        }`}
                        title={isMinimized ? "Log Out" : ""}
                    >
                        <BsBoxArrowRight
                            className="flex-shrink-0 group-hover:scale-110 transition-transform"
                            size={20}
                        />
                        <span className={isMinimized ? "lg:hidden" : ""}>
                            Log Out
                        </span>
                    </Button>
                </div>
            </aside>
        </>
    );
};

export default DashboardSidebar;
