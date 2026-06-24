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
import { motion, AnimatePresence } from "framer-motion";

const DashboardSidebar = ({ user, isOpen, onClose }) => {
    const pathname = usePathname();
    const router = useRouter();
    const [isMinimized, setIsMinimized] = useState(false);
    const [hoveredItem, setHoveredItem] = useState(null);

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

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
    };

    const sidebarMobileVariants = {
        hidden: { x: "-100%" },
        visible: {
            x: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
                staggerChildren: 0.03,
                delayChildren: 0.1,
            },
        },
        exit: {
            x: "-100%",
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 40,
            },
        },
    };

    const sectionVariants = {
        hidden: { opacity: 0, y: 12 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 25,
                staggerChildren: 0.04,
            },
        },
    };

    const navItemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 25,
            },
        },
    };

    const logoVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 500,
                damping: 25,
            },
        },
    };

    const profileVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 25,
                delay: 0.2,
            },
        },
    };

    const activeIndicatorVariants = {
        hidden: { height: 0, opacity: 0 },
        visible: {
            height: 24,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 500,
                damping: 30,
            },
        },
    };

    const tooltipVariants = {
        hidden: { opacity: 0, x: -8, scale: 0.9 },
        visible: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 500,
                damping: 25,
            },
        },
        exit: {
            opacity: 0,
            x: -8,
            scale: 0.9,
            transition: { duration: 0.15 },
        },
    };

    const pulseGlow = {
        animate: {
            boxShadow: [
                "0 0 0 0 rgba(34, 197, 94, 0.4)",
                "0 0 0 8px rgba(34, 197, 94, 0)",
            ],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
            },
        },
    };

    const iconHoverVariants = {
        rest: { rotate: 0, scale: 1 },
        hover: {
            scale: 1.2,
            rotate: 8,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 15,
            },
        },
        tap: { scale: 0.9 },
    };

    const minimizeButtonVariants = {
        rest: { scale: 1 },
        hover: { scale: 1.05 },
        tap: { scale: 0.95 },
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.3 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            <motion.aside
                animate={{
                    width: isMinimized ? 80 : 288,
                }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                }}
                className="hidden lg:flex fixed lg:sticky top-0 left-0 h-screen bg-zinc-900 border-r border-zinc-800 z-50 flex-col overflow-hidden"
            >
                <motion.div
                    className="p-5 border-b border-zinc-800"
                    initial="hidden"
                    animate="visible"
                    variants={logoVariants}
                >
                    <div className="flex items-center justify-between">
                        <Link
                            href="/"
                            className={`flex items-center gap-2.5 group ${
                                isMinimized ? "lg:justify-center lg:w-full" : ""
                            }`}
                        >
                            <motion.div
                                whileHover={{
                                    scale: 1.1,
                                    rotate: 8,
                                }}
                                whileTap={{ scale: 0.95 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 15,
                                }}
                                className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30 flex-shrink-0"
                            >
                                <IoTicketOutline
                                    className="text-white"
                                    size={24}
                                />
                            </motion.div>
                            <AnimatePresence mode="wait">
                                {!isMinimized && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 400,
                                            damping: 25,
                                        }}
                                    >
                                        <h1 className="text-xl font-black tracking-tight">
                                            <span className="text-white">
                                                Ticket
                                            </span>
                                            <span className="text-green-500">
                                                ix
                                            </span>
                                        </h1>
                                        <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                                            {role} Dashboard
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Link>
                    </div>

                    <motion.div
                        variants={minimizeButtonVariants}
                        initial="rest"
                        whileHover="hover"
                        whileTap="tap"
                    >
                        <Button
                            variant="none"
                            onClick={() => setIsMinimized(!isMinimized)}
                            className="flex items-center gap-1.5 mt-4 w-full justify-center text-zinc-400 hover:text-white text-xs font-semibold py-2 rounded-lg hover:bg-zinc-800 transition-colors"
                        >
                            <motion.div
                                animate={{ rotate: isMinimized ? 180 : 0 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 20,
                                }}
                            >
                                <BsChevronLeft size={14} />
                            </motion.div>
                            <AnimatePresence mode="wait">
                                {!isMinimized && (
                                    <motion.span
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: "auto" }}
                                        exit={{ opacity: 0, width: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        Minimize
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Button>
                    </motion.div>
                </motion.div>

                <div className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                    {navSections.map((section, sectionIdx) => (
                        <motion.div
                            key={section.section}
                            initial="hidden"
                            animate="visible"
                            variants={sectionVariants}
                            className="mb-6"
                        >
                            <AnimatePresence mode="wait">
                                {!isMinimized && (
                                    <motion.p
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-3 mb-2"
                                    >
                                        {section.section}
                                    </motion.p>
                                )}
                            </AnimatePresence>

                            {isMinimized && sectionIdx > 0 && (
                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    className="h-px bg-zinc-800 mx-2 mb-3"
                                />
                            )}

                            <nav className="flex flex-col gap-1">
                                {section.items.map((item) => {
                                    const isActive =
                                        pathname === item.href ||
                                        (item.href !== "/dashboard" &&
                                            pathname.startsWith(item.href));

                                    const Icon = item.icon;
                                    const itemKey = `${section.section}-${item.label}`;

                                    return (
                                        <motion.div
                                            key={item.label}
                                            variants={navItemVariants}
                                            className="relative"
                                            onHoverStart={() =>
                                                setHoveredItem(itemKey)
                                            }
                                            onHoverEnd={() =>
                                                setHoveredItem(null)
                                            }
                                        >
                                            <Link
                                                href={item.href}
                                                className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${
                                                    isActive
                                                        ? "text-green-400"
                                                        : "text-zinc-400 hover:text-white"
                                                } ${
                                                    isMinimized
                                                        ? "justify-center"
                                                        : ""
                                                }`}
                                            >
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="activeNavBg-desktop"
                                                        className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/10 rounded-xl shadow-lg shadow-green-500/10"
                                                        transition={{
                                                            type: "spring",
                                                            stiffness: 350,
                                                            damping: 30,
                                                        }}
                                                    />
                                                )}

                                                {!isActive &&
                                                    hoveredItem === itemKey && (
                                                        <motion.div
                                                            initial={{
                                                                opacity: 0,
                                                                scale: 0.95,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                scale: 1,
                                                            }}
                                                            exit={{
                                                                opacity: 0,
                                                                scale: 0.95,
                                                            }}
                                                            className="absolute inset-0 bg-zinc-800 rounded-xl"
                                                        />
                                                    )}

                                                <AnimatePresence>
                                                    {isActive &&
                                                        !isMinimized && (
                                                            <motion.div
                                                                variants={
                                                                    activeIndicatorVariants
                                                                }
                                                                initial="hidden"
                                                                animate="visible"
                                                                exit="hidden"
                                                                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 bg-gradient-to-b from-green-400 to-emerald-500 rounded-r-full"
                                                            />
                                                        )}
                                                </AnimatePresence>

                                                <motion.div
                                                    className="relative z-10 flex-shrink-0"
                                                    variants={
                                                        iconHoverVariants
                                                    }
                                                    initial="rest"
                                                    whileHover="hover"
                                                    whileTap="tap"
                                                >
                                                    <Icon size={20} />
                                                </motion.div>

                                                <AnimatePresence mode="wait">
                                                    {!isMinimized && (
                                                        <motion.span
                                                            initial={{
                                                                opacity: 0,
                                                                x: -8,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                x: 0,
                                                            }}
                                                            exit={{
                                                                opacity: 0,
                                                                x: -8,
                                                            }}
                                                            transition={{
                                                                duration: 0.2,
                                                            }}
                                                            className="relative z-10 flex-1 truncate"
                                                        >
                                                            {item.label}
                                                        </motion.span>
                                                    )}
                                                </AnimatePresence>
                                            </Link>

                                            <AnimatePresence>
                                                {isMinimized &&
                                                    hoveredItem === itemKey && (
                                                        <motion.div
                                                            variants={
                                                                tooltipVariants
                                                            }
                                                            initial="hidden"
                                                            animate="visible"
                                                            exit="exit"
                                                            className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 rounded-lg bg-zinc-800 text-white text-xs font-semibold whitespace-nowrap shadow-2xl z-50 border border-zinc-700"
                                                        >
                                                            {item.label}
                                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-zinc-800 rotate-45 border-l border-b border-zinc-700" />
                                                        </motion.div>
                                                    )}
                                            </AnimatePresence>
                                        </motion.div>
                                    );
                                })}
                            </nav>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={profileVariants}
                    className="border-t border-zinc-800 p-4"
                >
                    <AnimatePresence mode="wait">
                        {!isMinimized ? (
                            <motion.div
                                key="expanded-profile"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 25,
                                }}
                                className="bg-zinc-800/50 rounded-2xl p-3 mb-3 hover:bg-zinc-800 transition-colors"
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
                                                {user?.name?.slice(" ")[0] ||
                                                    "U"}
                                            </Avatar.Fallback>
                                        </Avatar>
                                        <motion.div
                                            animate={pulseGlow.animate}
                                            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-zinc-900"
                                        />
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
                            </motion.div>
                        ) : (
                            <motion.div
                                key="minimized-profile"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 25,
                                }}
                                className="flex justify-center mb-3"
                            >
                                <div className="relative">
                                    <Avatar className="w-9 h-9 cursor-pointer">
                                        <Avatar.Image
                                            className="object-cover"
                                            src={user?.image}
                                            alt={user?.name || "User"}
                                        />
                                        <Avatar.Fallback className="uppercase bg-success text-white">
                                            {user?.name?.slice(" ")[0] || "U"}
                                        </Avatar.Fallback>
                                    </Avatar>
                                    <motion.div
                                        animate={pulseGlow.animate}
                                        className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-zinc-900"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <Button
                            variant="ghost"
                            onClick={handleLogout}
                            className={`group w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-zinc-400 hover:text-red-400 hover:bg-red-500/10 active:bg-red-500/20 transition-colors ${
                                isMinimized ? "justify-center" : ""
                            }`}
                            title={isMinimized ? "Log Out" : ""}
                        >
                            <motion.div
                                whileHover={{
                                    x: 4,
                                    transition: {
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 15,
                                    },
                                }}
                            >
                                <BsBoxArrowRight
                                    className="flex-shrink-0"
                                    size={20}
                                />
                            </motion.div>
                            <AnimatePresence mode="wait">
                                {!isMinimized && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -8 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -8 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        Log Out
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Button>
                    </motion.div>
                </motion.div>
            </motion.aside>

            <AnimatePresence>
                {isOpen && (
                    <motion.aside
                        variants={sidebarMobileVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="lg:hidden fixed top-0 left-0 h-screen w-[280px] bg-zinc-900 border-r border-zinc-800 z-50 flex flex-col shadow-2xl shadow-black/50"
                    >
                        <motion.div
                            initial={{ opacity: 0, rotate: -90 }}
                            animate={{
                                opacity: 1,
                                rotate: 0,
                                transition: { delay: 0.2 },
                            }}
                            className="absolute top-4 right-4 z-10"
                        >
                            <Button
                                variant="none"
                                onClick={onClose}
                                className="w-9 h-9 rounded-xl bg-zinc-800 hover:bg-red-500 text-white flex items-center justify-center transition-colors"
                                aria-label="Close menu"
                            >
                                <BsX size={22} />
                            </Button>
                        </motion.div>

                        <motion.div
                            variants={logoVariants}
                            className="p-5 border-b border-zinc-800"
                        >
                            <div className="flex items-center justify-between">
                                <Link
                                    href="/"
                                    onClick={onClose}
                                    className="flex items-center gap-2.5 group"
                                >
                                    <motion.div
                                        whileHover={{
                                            scale: 1.1,
                                            rotate: 8,
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30 flex-shrink-0"
                                    >
                                        <IoTicketOutline
                                            className="text-white"
                                            size={24}
                                        />
                                    </motion.div>
                                    <div>
                                        <h1 className="text-xl font-black tracking-tight">
                                            <span className="text-white">
                                                Ticket
                                            </span>
                                            <span className="text-green-500">
                                                ix
                                            </span>
                                        </h1>
                                        <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                                            {role} Dashboard
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        </motion.div>

                        <div className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                            {navSections.map((section) => (
                                <motion.div
                                    key={section.section}
                                    variants={sectionVariants}
                                    className="mb-6"
                                >
                                    <motion.p
                                        variants={navItemVariants}
                                        className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-3 mb-2"
                                    >
                                        {section.section}
                                    </motion.p>

                                    <nav className="flex flex-col gap-1">
                                        {section.items.map((item) => {
                                            const isActive =
                                                pathname === item.href ||
                                                (item.href !== "/dashboard" &&
                                                    pathname.startsWith(
                                                        item.href
                                                    ));

                                            const Icon = item.icon;

                                            return (
                                                <motion.div
                                                    key={item.label}
                                                    variants={navItemVariants}
                                                    whileTap={{ scale: 0.97 }}
                                                >
                                                    <Link
                                                        href={item.href}
                                                        onClick={onClose}
                                                        className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${
                                                            isActive
                                                                ? "bg-gradient-to-r from-green-500/20 to-emerald-500/10 text-green-400 shadow-lg shadow-green-500/10"
                                                                : "text-zinc-400 hover:text-white hover:bg-zinc-800 active:bg-zinc-700"
                                                        }`}
                                                    >
                                                        {isActive && (
                                                            <motion.div
                                                                layoutId="activeNavMobile"
                                                                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-green-400 to-emerald-500 rounded-r-full"
                                                                transition={{
                                                                    type: "spring",
                                                                    stiffness: 500,
                                                                    damping: 30,
                                                                }}
                                                            />
                                                        )}

                                                        <motion.div
                                                            variants={
                                                                iconHoverVariants
                                                            }
                                                            initial="rest"
                                                            whileHover="hover"
                                                            whileTap="tap"
                                                            className="flex-shrink-0"
                                                        >
                                                            <Icon size={20} />
                                                        </motion.div>

                                                        <span className="flex-1 truncate">
                                                            {item.label}
                                                        </span>
                                                    </Link>
                                                </motion.div>
                                            );
                                        })}
                                    </nav>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            variants={profileVariants}
                            className="border-t border-zinc-800 p-4"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    transition: { delay: 0.3 },
                                }}
                                className="bg-zinc-800/50 rounded-2xl p-3 mb-3 hover:bg-zinc-800 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Avatar className="w-9 h-9 cursor-pointer">
                                            <Avatar.Image
                                                className="object-cover"
                                                src={user?.image}
                                                alt={user?.name || "User"}
                                            />
                                            <Avatar.Fallback className="uppercase bg-success text-white">
                                                {user?.name?.slice(" ")[0] ||
                                                    "U"}
                                            </Avatar.Fallback>
                                        </Avatar>
                                        <motion.div
                                            animate={pulseGlow.animate}
                                            className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-zinc-900"
                                        />
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
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <Button
                                    variant="ghost"
                                    onClick={handleLogout}
                                    className="group w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-zinc-400 hover:text-red-400 hover:bg-red-500/10 active:bg-red-500/20 transition-colors"
                                >
                                    <motion.div
                                        whileHover={{
                                            x: 4,
                                            transition: {
                                                type: "spring",
                                                stiffness: 400,
                                                damping: 15,
                                            },
                                        }}
                                    >
                                        <BsBoxArrowRight
                                            className="flex-shrink-0"
                                            size={20}
                                        />
                                    </motion.div>
                                    <span>Log Out</span>
                                </Button>
                            </motion.div>
                        </motion.div>
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
    );
};

export default DashboardSidebar;