"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import DashboardSidebar from "@/components/Dashboard/DashboardSidebar";
import { IoTicketOutline } from "react-icons/io5";
import { BsList } from "react-icons/bs";
import { Avatar, Button } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";

const pageVariants = {
    initial: {
        opacity: 0,
        y: 30,
        scale: 0.98,
        filter: "blur(8px)",
    },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: {
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
            staggerChildren: 0.08,
        },
    },
    exit: {
        opacity: 0,
        y: -20,
        scale: 0.98,
        filter: "blur(6px)",
        transition: {
            duration: 0.35,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

const headerVariants = {
    initial: {
        y: -80,
        opacity: 0,
    },
    animate: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
            delay: 0.1,
        },
    },
};

const logoVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: {
        scale: 1,
        rotate: 0,
        transition: {
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2,
        },
    },
};

const textVariants = {
    initial: { opacity: 0, x: -20 },
    animate: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.4,
            delay: 0.35,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

const hamburgerVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
        scale: 1,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 15,
            delay: 0.15,
        },
    },
    tap: { scale: 0.85, rotate: 90 },
    hover: { scale: 1.1, backgroundColor: "rgb(34 197 94)" },
};

const avatarVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: {
        scale: 1,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: 0.4,
        },
    },
    hover: { scale: 1.15, rotate: 5 },
    tap: { scale: 0.9 },
};

const sidebarContainerVariants = {
    initial: { x: -320, opacity: 0 },
    animate: {
        x: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
            delay: 0.05,
        },
    },
};

const layoutVariants = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
            staggerChildren: 0.1,
        },
    },
};

const pulseRing = {
    initial: { scale: 1, opacity: 0.5 },
    animate: {
        scale: [1, 1.4, 1],
        opacity: [0.5, 0, 0.5],
        transition: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
};

const spinnerVariants = {
    initial: { scale: 0, opacity: 0, rotate: 0 },
    animate: {
        scale: [0, 1.2, 1],
        opacity: 1,
        rotate: 360,
        transition: {
            scale: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
            rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
        },
    },
};

const loadingTextVariants = {
    initial: { opacity: 0, y: 15 },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            delay: 0.4,
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

const dotVariants = {
    animate: (i) => ({
        opacity: [0.3, 1, 0.3],
        y: [0, -6, 0],
        transition: {
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
        },
    }),
};

const shimmerVariants = {
    initial: { x: "-100%" },
    animate: {
        x: "100%",
        transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 0.5,
        },
    },
};

const DashboardLayout = ({ children }) => {
    const router = useRouter();
    const pathname = usePathname();
    const { data, isPending } = authClient.useSession();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    const user = data?.user;

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!isPending && !user) {
            router.push("/login?redirect=/dashboard");
        }
    }, [user, isPending, router]);

    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

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

    if (isPending) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                <motion.div
                    className="flex flex-col items-center gap-5"
                    initial="initial"
                    animate="animate"
                >
                    <div className="relative">
                        <motion.div
                            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600"
                            variants={pulseRing}
                        />
                        <motion.div
                            className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-2xl shadow-green-500/30 overflow-hidden"
                            variants={spinnerVariants}
                        >
                            <svg
                                className="w-8 h-8 text-white"
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
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                variants={shimmerVariants}
                            />
                        </motion.div>
                    </div>
                    <motion.div
                        className="flex items-center gap-1"
                        variants={loadingTextVariants}
                    >
                        <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                            Loading your dashboard
                        </span>
                        {[0, 1, 2].map((i) => (
                            <motion.span
                                key={i}
                                className="text-sm font-semibold text-green-500"
                                custom={i}
                                variants={dotVariants}
                                animate="animate"
                            >
                                .
                            </motion.span>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <motion.div
            className="min-h-screen bg-zinc-50 dark:bg-zinc-950 lg:flex"
            variants={layoutVariants}
            initial="initial"
            animate={mounted ? "animate" : "initial"}
        >
            <motion.div
                variants={sidebarContainerVariants}
                className="hidden lg:block"
            >
                <DashboardSidebar
                    user={user}
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />
            </motion.div>

            <div className="lg:hidden">
                <DashboardSidebar
                    user={user}
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                />
            </div>

            <div className="flex-1 flex flex-col min-w-0">
                <motion.header
                    className="lg:hidden sticky top-0 z-30 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 shadow-sm"
                    variants={headerVariants}
                    initial="initial"
                    animate="animate"
                >
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <motion.button
                                onClick={() => setSidebarOpen(true)}
                                className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 transition-colors"
                                variants={hamburgerVariants}
                                whileHover="hover"
                                whileTap="tap"
                                aria-label="Open menu"
                            >
                                <BsList size={22} />
                            </motion.button>

                            <Link
                                href="/"
                                className="flex items-center gap-2 group"
                            >
                                <motion.div
                                    className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30"
                                    variants={logoVariants}
                                    whileHover={{
                                        scale: 1.15,
                                        rotate: 10,
                                        transition: {
                                            type: "spring",
                                            stiffness: 400,
                                        },
                                    }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <IoTicketOutline
                                        className="text-white"
                                        size={20}
                                    />
                                </motion.div>
                                <motion.span
                                    className="text-lg font-black tracking-tight"
                                    variants={textVariants}
                                >
                                    <span className="text-zinc-900 dark:text-white">
                                        Ticket
                                    </span>
                                    <motion.span
                                        className="text-green-500 inline-block"
                                        whileHover={{
                                            scale: 1.2,
                                            color: "#10b981",
                                            transition: { duration: 0.2 },
                                        }}
                                    >
                                        ix
                                    </motion.span>
                                </motion.span>
                            </Link>
                        </div>

                        <div className="flex items-center gap-2">
                            <motion.div
                                variants={avatarVariants}
                                whileHover="hover"
                                whileTap="tap"
                            >
                                <Button
                                    variant="none"
                                    onClick={() => setSidebarOpen(true)}
                                >
                                    <Avatar className="w-9 h-9 ring-2 ring-transparent hover:ring-green-500/50 transition-all cursor-pointer">
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
                            </motion.div>
                        </div>
                    </div>
                </motion.header>

                <AnimatePresence mode="wait">
                    <motion.main
                        key={pathname}
                        className="flex-1 overflow-y-auto"
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                    >
                        {children}
                    </motion.main>
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default DashboardLayout;