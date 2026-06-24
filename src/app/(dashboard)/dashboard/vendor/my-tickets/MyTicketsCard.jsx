"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { IoTicketSharp } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { HiMiniSquares2X2 } from "react-icons/hi2";
import { MdBlock } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import MyAddedTicketCard from "./TicketsCard";
import { deleteMyAddedTicket } from "@/lib/actions/ticket";

const MyTicketsCard = ({ initialTickets, vendorId, isFraud = false }) => {
    const [tickets, setTickets] = useState(
        Array.isArray(initialTickets) ? initialTickets.filter(Boolean) : [],
    );
    const [deletingId, setDeletingId] = useState("");

    const handleDelete = async (id) => {
        setDeletingId(id);

        try {
            const result = await deleteMyAddedTicket(id);

            if (result?.success) {
                toast.success(result.message || "Ticket deleted successfully");
                setTickets((prev) =>
                    prev.filter((ticket) => {
                        const ticketId = ticket?._id?.$oid || ticket?._id;
                        return ticketId !== id;
                    }),
                );
            } else {
                toast.error(result?.message || "Failed to delete ticket");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setDeletingId("");
        }
    };

    const stats = useMemo(() => {
        const total = tickets.length;
        const pending = tickets.filter(
            (ticket) => ticket?.verificationStatus === "pending",
        ).length;
        const approved = tickets.filter(
            (ticket) => ticket?.verificationStatus === "approved",
        ).length;
        const rejected = tickets.filter(
            (ticket) => ticket?.verificationStatus === "rejected",
        ).length;

        return { total, pending, approved, rejected };
    }, [tickets]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 px-4 py-8 dark:from-[#070B14] dark:via-[#0A0F1C] dark:to-[#06140C] md:px-8">
            <div className="mx-auto max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 80, damping: 18 }}
                    className="relative hidden md:block mb-8 overflow-hidden rounded-[30px] bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-8 shadow-[0_20px_60px_-15px_rgba(16,185,129,0.45)]"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_35%)]" />

                    <motion.div
                        className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"
                        animate={{
                            x: [0, 25, 0],
                            y: [0, -15, 0],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 7,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                    <motion.div
                        className="absolute -bottom-8 left-1/3 h-32 w-32 rounded-full bg-white/10 blur-2xl"
                        animate={{
                            x: [0, -20, 0],
                            y: [0, 12, 0],
                            scale: [1, 1.25, 1],
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1,
                        }}
                    />

                    <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex items-center gap-4">
                            <motion.div
                                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-md"
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 150,
                                    damping: 14,
                                    delay: 0.2,
                                }}
                                whileHover={{
                                    scale: 1.1,
                                }}
                            >
                                <IoTicketSharp size={30} />
                            </motion.div>

                            <div>
                                <div className="flex flex-wrap items-center gap-3">
                                    <motion.h1
                                        className="text-2xl font-black text-white md:text-3xl"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            delay: 0.3,
                                            duration: 0.5,
                                        }}
                                    >
                                        My Added Tickets
                                    </motion.h1>
                                    <motion.span
                                        className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md"
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{
                                            delay: 0.5,
                                            type: "spring",
                                            stiffness: 200,
                                        }}
                                    >
                                        {stats.total} Tickets
                                    </motion.span>
                                </div>

                                <motion.p
                                    className="mt-1 text-sm text-white/80"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    Manage all your listed travel tickets in one
                                    place
                                </motion.p>
                            </div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                                delay: 0.4,
                                type: "spring",
                                stiffness: 100,
                            }}
                        >
                            {isFraud ? (
                                <button
                                    disabled
                                    className="inline-flex h-12 cursor-not-allowed items-center justify-center gap-2 rounded-2xl bg-white/20 px-5 font-bold text-white/70 backdrop-blur-md"
                                >
                                    <MdBlock size={18} />
                                    Add Disabled
                                </button>
                            ) : (
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        href="/dashboard/vendor/add-ticket"
                                        className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-5 font-bold text-green-700 shadow-lg transition hover:scale-[1.02]"
                                    >
                                        <FaPlus size={14} />
                                        Add New Ticket
                                    </Link>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                </motion.div>

                <AnimatePresence>
                    {isFraud && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, scaleY: 0.8 }}
                            animate={{ opacity: 1, y: 0, scaleY: 1 }}
                            exit={{ opacity: 0, y: -20, scaleY: 0.8 }}
                            transition={{
                                type: "spring",
                                stiffness: 100,
                                damping: 15,
                            }}
                            className="mb-8 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-4 text-sm font-medium text-rose-700 shadow-sm dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-300"
                        >
                            Your vendor account has been marked as fraud. You
                            cannot add new tickets, and your public tickets
                            should remain hidden according to platform rules.
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {[
                        {
                            title: "Total Tickets",
                            value: stats.total,
                            color: "green",
                        },
                        {
                            title: "Pending",
                            value: stats.pending,
                            color: "amber",
                        },
                        {
                            title: "Approved",
                            value: stats.approved,
                            color: "emerald",
                        },
                        {
                            title: "Rejected",
                            value: stats.rejected,
                            color: "rose",
                        },
                    ].map((stat, index) => (
                        <StatCard
                            key={stat.title}
                            title={stat.title}
                            value={stat.value}
                            color={stat.color}
                            index={index}
                        />
                    ))}
                </div>

                {tickets.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 100,
                            damping: 16,
                        }}
                        className="rounded-[28px] border border-dashed border-zinc-300 bg-white/80 p-12 text-center shadow-lg backdrop-blur-xl dark:border-zinc-700 dark:bg-zinc-900/40"
                    >
                        <motion.div
                            className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                            animate={{ y: [-6, 6, -6] }}
                            transition={{
                                duration: 3.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        >
                            <HiMiniSquares2X2 size={32} />
                        </motion.div>

                        <motion.h2
                            className="mt-5 text-2xl font-bold text-zinc-900 dark:text-white"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                        >
                            No tickets added yet
                        </motion.h2>

                        <motion.p
                            className="mt-2 text-sm text-zinc-500 dark:text-zinc-400"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.45 }}
                        >
                            Start adding your first ticket and manage it here.
                        </motion.p>

                        {!isFraud && (
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, type: "spring" }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    href="/dashboard/vendor/add-ticket"
                                    className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 px-5 font-semibold text-white shadow-lg"
                                >
                                    <FaPlus size={14} />
                                    Add Ticket
                                </Link>
                            </motion.div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.1,
                                    delayChildren: 0.15,
                                },
                            },
                        }}
                    >
                        <AnimatePresence mode="popLayout">
                            {tickets.map((ticket) => {
                                const ticketId =
                                    ticket?._id?.$oid || ticket?._id;

                                return (
                                    <motion.div
                                        key={ticketId}
                                        layout
                                        variants={{
                                            hidden: {
                                                opacity: 0,
                                                y: 30,
                                                scale: 0.95,
                                            },
                                            visible: {
                                                opacity: 1,
                                                y: 0,
                                                scale: 1,
                                                transition: {
                                                    type: "spring",
                                                    stiffness: 100,
                                                    damping: 15,
                                                },
                                            },
                                        }}
                                        exit={{
                                            opacity: 0,
                                            scale: 0.85,
                                            y: -15,
                                            transition: {
                                                duration: 0.3,
                                                ease: "easeInOut",
                                            },
                                        }}
                                    >
                                        <MyAddedTicketCard
                                            ticket={ticket}
                                            onDelete={handleDelete}
                                            deletingId={deletingId}
                                            isFraud={isFraud}
                                        />
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

const StatCard = ({ title, value, color = "green", index = 0 }) => {
    const styles = {
        green: "from-green-50 to-emerald-50 text-green-700 dark:from-green-900/10 dark:to-emerald-900/10 dark:text-green-400",
        amber: "from-amber-50 to-yellow-50 text-amber-700 dark:from-amber-900/10 dark:to-yellow-900/10 dark:text-amber-400",
        emerald: "from-emerald-50 to-teal-50 text-emerald-700 dark:from-emerald-900/10 dark:to-teal-900/10 dark:text-emerald-400",
        rose: "from-rose-50 to-red-50 text-rose-700 dark:from-rose-900/10 dark:to-red-900/10 dark:text-rose-400",
    };

    const glowMap = {
        green: "rgba(16,185,129,0.15)",
        amber: "rgba(245,158,11,0.15)",
        emerald: "rgba(5,150,105,0.15)",
        rose: "rgba(244,63,94,0.15)",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                type: "spring",
                stiffness: 100,
                damping: 14,
                delay: 0.15 + index * 0.1,
            }}
            whileHover={{
                scale: 1.04,
                y: -4,
                boxShadow: `0 20px 40px -12px ${glowMap[color]}`,
            }}
            whileTap={{ scale: 0.98 }}
            className={`cursor-default rounded-[24px] border border-zinc-200 bg-gradient-to-br p-5 shadow-md dark:border-zinc-800 ${styles[color]}`}
        >
            <p className="text-sm font-medium opacity-80">{title}</p>
            <motion.h3
                className="mt-2 text-3xl font-black"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    delay: 0.4 + index * 0.1,
                    type: "spring",
                    stiffness: 160,
                    damping: 12,
                }}
            >
                {value}
            </motion.h3>
        </motion.div>
    );
};

export default MyTicketsCard;