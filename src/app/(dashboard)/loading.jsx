"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaBus, FaTrain, FaPlane, FaShip } from "react-icons/fa";
import { BsTicketPerforated } from "react-icons/bs";

const transportIcons = [FaBus, FaTrain, FaPlane, FaShip];

const loadingMessages = [
    "Preparing your journey...",
    "Checking live routes...",
    "Securing seat availability...",
    "Getting Ticketix ready...",
];

const LoadingPage = () => {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        const originalBodyOverflow = document.body.style.overflow;
        const originalHtmlOverflow = document.documentElement.style.overflow;

        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";

        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
        }, 1800);

        return () => {
            document.body.style.overflow = originalBodyOverflow;
            document.documentElement.style.overflow = originalHtmlOverflow;
            clearInterval(interval);
        };
    }, []);

    return (
        <div
            role="status"
            aria-live="polite"
            aria-label="Loading Ticketix"
            className="fixed inset-0 z-[999999] isolate flex min-h-screen items-center justify-center overflow-hidden bg-white dark:bg-[#040f09]"
        >
            <span className="sr-only">Loading Ticketix, please wait...</span>

            <div className="absolute inset-0 bg-gradient-to-br from-white via-emerald-50 to-green-100 dark:from-[#040f09] dark:via-[#06160e] dark:to-[#041210]" />

            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.05] dark:opacity-[0.08]"
                style={{
                    backgroundImage:
                        "linear-gradient(to right, #10b981 1px, transparent 1px), linear-gradient(to bottom, #10b981 1px, transparent 1px)",
                    backgroundSize: "56px 56px",
                }}
            />

            <motion.div
                aria-hidden
                animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.18, 0.35, 0.18],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="pointer-events-none absolute top-[18%] left-[12%] h-72 w-72 rounded-full bg-green-400/20 blur-3xl dark:bg-emerald-500/15"
            />

            <motion.div
                aria-hidden
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.16, 0.32, 0.16],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                }}
                className="pointer-events-none absolute right-[10%] bottom-[14%] h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl dark:bg-green-500/15"
            />

            <div className="relative z-10 flex w-full max-w-md flex-col items-center px-6 text-center">
                <div className="relative mb-8 flex h-72 w-72 items-center justify-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 12,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="absolute h-44 w-44 rounded-full border-2 border-dashed border-green-500/25 dark:border-emerald-400/30"
                    />

                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{
                            duration: 18,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="absolute h-60 w-60 rounded-full border border-dashed border-emerald-500/20 dark:border-emerald-400/20"
                    />

                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 14,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="absolute h-36 w-36"
                    >
                        {transportIcons.map((Icon, i) => {
                            const angle = (i * 360) / transportIcons.length;

                            return (
                                <motion.div
                                    key={i}
                                    animate={{ y: [0, -4, 0] }}
                                    transition={{
                                        duration: 2.2,
                                        repeat: Infinity,
                                        delay: i * 0.15,
                                        ease: "easeInOut",
                                    }}
                                    style={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: `rotate(${angle}deg) translateY(-98px) rotate(-${angle}deg) translate(-50%, -50%)`,
                                    }}
                                    className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/80 bg-white text-green-600 shadow-xl shadow-green-500/10 dark:border-emerald-500/20 dark:bg-[#0a1f15] dark:text-emerald-300 dark:shadow-emerald-500/20"
                                >
                                    <Icon size={18} />
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    <motion.div
                        animate={{
                            scale: [1, 1.06, 1],
                            boxShadow: [
                                "0 0 0 0 rgba(16,185,129,0.35)",
                                "0 0 0 26px rgba(16,185,129,0)",
                                "0 0 0 0 rgba(16,185,129,0.35)",
                            ],
                        }}
                        transition={{
                            duration: 2.2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="relative flex h-28 w-28 items-center justify-center rounded-[28px] bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 shadow-2xl shadow-green-500/30 dark:from-emerald-400 dark:via-green-500 dark:to-emerald-600 dark:shadow-emerald-500/40"
                    >
                        <motion.div
                            animate={{ rotate: [0, -8, 8, -8, 0] }}
                            transition={{
                                duration: 2.6,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        >
                            <BsTicketPerforated
                                className="text-white drop-shadow-md"
                                size={46}
                            />
                        </motion.div>

                        <motion.div
                            animate={{
                                opacity: [0, 1, 0],
                                x: ["-120%", "220%"],
                            }}
                            transition={{
                                duration: 2.2,
                                repeat: Infinity,
                                ease: "easeInOut",
                                repeatDelay: 0.7,
                            }}
                            className="absolute inset-0 rounded-[28px] bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12"
                        />
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-3 flex items-center gap-1"
                >
                    <span className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
                        Ticket
                    </span>
                    <motion.span
                        animate={{
                            color: ["#10b981", "#34d399", "#10b981"],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="text-4xl font-black tracking-tight"
                    >
                        ix
                    </motion.span>
                </motion.div>

                <div className="mb-6 h-6">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={messageIndex}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.35 }}
                            className="text-sm font-medium text-zinc-600 dark:text-emerald-100/70"
                        >
                            {loadingMessages[messageIndex]}
                        </motion.p>
                    </AnimatePresence>
                </div>

                <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 240 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative h-1.5 overflow-hidden rounded-full bg-zinc-200 dark:bg-emerald-950/60"
                >
                    <motion.div
                        animate={{ x: ["-100%", "220%"] }}
                        transition={{
                            duration: 1.8,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute inset-y-0 w-1/2 rounded-full bg-gradient-to-r from-green-500 via-emerald-400 to-green-500 dark:from-emerald-400 dark:via-green-300 dark:to-emerald-400"
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.35 }}
                    className="mt-5 flex items-center gap-2 rounded-full border border-emerald-500/10 bg-white/95 px-4 py-2 shadow-md shadow-emerald-500/5 dark:border-emerald-500/30 dark:bg-[#0a1f15]/95 dark:shadow-emerald-500/20"
                >
                    <motion.span
                        animate={{
                            scale: [1, 1.35, 1],
                            opacity: [1, 0.45, 1],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="h-2.5 w-2.5 rounded-full bg-green-500 dark:bg-emerald-400"
                    />
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-700 dark:text-emerald-100">
                        Loading
                    </span>
                </motion.div>
            </div>
        </div>
    );
};

export default LoadingPage;