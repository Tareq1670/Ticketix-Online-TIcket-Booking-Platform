"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Chip } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
    FaBus,
    FaTrain,
    FaPlane,
    FaShip,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaClock,
    FaTimesCircle,
    FaCheckCircle,
    FaArrowLeft,
    FaArrowRight,
    FaShieldAlt,
    FaHeadset,
    FaUndo,
} from "react-icons/fa";
import { IoTicketSharp } from "react-icons/io5";
import { TbCurrencyTaka } from "react-icons/tb";
import { createBooking } from "@/lib/actions/booking";

const icons = {
    Bus: FaBus,
    Train: FaTrain,
    Plane: FaPlane,
    Launch: FaShip,
};

const Countdown = ({ target }) => {
    const [now, setNow] = useState(null);

    useEffect(() => {
        setNow(Date.now());
        const id = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(id);
    }, []);

    if (!now) {
        return (
            <div className="flex items-center gap-2">
                {["Days", "Hrs", "Min", "Sec"].map((unit) => (
                    <div
                        key={unit}
                        className="flex flex-col items-center justify-center rounded-lg bg-white px-3 py-2 shadow-md min-w-[50px] border border-emerald-100 dark:bg-zinc-800 dark:border-emerald-500/30"
                    >
                        <span className="text-lg font-black leading-none tabular-nums text-emerald-600 dark:text-emerald-400">
                            00
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mt-1">
                            {unit}
                        </span>
                    </div>
                ))}
            </div>
        );
    }

    const diff = Math.max(0, new Date(target).getTime() - now);

    if (diff === 0) {
        return (
            <Chip
                color="danger"
                className="font-semibold animate-pulse"
                variant="flat"
            >
                <FaTimesCircle className="mr-1 inline" />
                Departed
            </Chip>
        );
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    const timeUnits = [
        { label: "Days", value: d },
        { label: "Hrs", value: h },
        { label: "Min", value: m },
        { label: "Sec", value: s },
    ];

    return (
        <div className="flex items-center gap-2">
            {timeUnits.map((unit, index) => (
                <div key={unit.label} className="flex items-center gap-2">
                    <div className="flex flex-col items-center justify-center rounded-lg bg-white/95 backdrop-blur-md px-3 py-2 shadow-lg min-w-[50px] border border-emerald-200/60 dark:bg-zinc-800/95 dark:border-emerald-500/30">
                        <motion.span
                            key={unit.value}
                            initial={{ y: -5, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-lg font-black leading-none tabular-nums text-emerald-700 dark:text-emerald-400"
                        >
                            {String(unit.value).padStart(2, "0")}
                        </motion.span>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mt-1">
                            {unit.label}
                        </span>
                    </div>
                    {index < timeUnits.length - 1 && (
                        <span className="text-lg font-black text-white/80 dark:text-white/60 -mx-0.5 animate-pulse">
                            :
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
};

const TrustBadge = ({ icon: Icon, title, desc }) => (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-emerald-50/50 dark:hover:bg-emerald-500/5 transition-colors">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/15 shrink-0 ring-1 ring-emerald-200 dark:ring-emerald-500/30">
            <Icon className="text-emerald-600 dark:text-emerald-400" size={16} />
        </div>
        <div className="min-w-0">
            <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                {title}
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-500">
                {desc}
            </p>
        </div>
    </div>
);

const TicketDetailsClient = ({ ticket, user }) => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isBooked, setIsBooked] = useState(false);

    const Icon = icons[ticket?.transportType] || IoTicketSharp;

    const departed = useMemo(() => {
        if (!ticket?.departureDate) return false;
        return new Date(ticket.departureDate) < new Date();
    }, [ticket?.departureDate]);

    const available = ticket?.quantity ?? 0;
    const soldOut = available <= 0;

    const total = useMemo(() => {
        return (ticket?.price ?? 0) * qty;
    }, [qty, ticket?.price]);

    const handleBook = async () => {
        if (qty < 1) {
            toast.error("Quantity must be at least 1");
            return;
        }

        if (qty > available) {
            toast.error("Not enough seats");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                ticketId: ticket._id,
                userId: user.id,
                userName: user.name || "",
                userEmail: user.email || "",
                quantity: qty,
                unitPrice: ticket.price,
                totalPrice: total,
                title: ticket.title,
                from: ticket.from,
                to: ticket.to,
                transportType: ticket.transportType,
                departureDate: ticket.departureDate,
                image: ticket.image || "",
                vendorId: ticket.vendorId,
                vendorEmail: ticket.vendorEmail,
                vendorName: ticket.vendorName,
            };

            const data = await createBooking(payload);
            console.log(data);

            if (data?.success) {
                toast.success("Booking sent! Status: Pending");
                setIsBooked(true);
                setIsOpen(false);
                router.push("/dashboard/user/my-booked-tickets");
            } else {
                toast.error(data?.message || "Booking failed");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const transportColors = {
        Bus: "from-green-500 to-emerald-600",
        Train: "from-blue-500 to-indigo-600",
        Plane: "from-purple-500 to-violet-600",
        Launch: "from-cyan-500 to-teal-600",
    };
    const transportColor =
        transportColors[ticket?.transportType] || "from-emerald-500 to-green-600";

    const departureDate = ticket?.departureDate
        ? new Date(ticket.departureDate)
        : null;
    const formattedDate = departureDate?.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const formattedTime = departureDate?.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <section className="min-h-screen bg-gradient-to-br from-zinc-50 via-emerald-50/30 to-zinc-100 py-6 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        borderRadius: "12px",
                        padding: "12px 16px",
                        fontWeight: "600",
                    },
                }}
            />

            {/* Decorative BG blobs */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <motion.div
                    animate={{
                        x: [0, 30, -20, 0],
                        y: [0, -40, 20, 0],
                        opacity: [0.06, 0.12, 0.04, 0.06],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-500/5"
                />
                <motion.div
                    animate={{
                        x: [0, -30, 20, 0],
                        y: [0, 30, -20, 0],
                        opacity: [0.04, 0.08, 0.03, 0.04],
                    }}
                    transition={{
                        duration: 14,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl dark:bg-blue-500/5"
                />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Back button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => router.back()}
                    className="mb-4 flex items-center gap-2 text-sm font-semibold text-zinc-600 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 transition-colors group"
                >
                    <FaArrowLeft
                        size={13}
                        className="transition-transform group-hover:-translate-x-1"
                    />
                    Back to Tickets
                </motion.button>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-600/60 dark:bg-zinc-900"
                >
                    {/* Hero Image */}
                    <div className="relative h-[260px] w-full md:h-[380px]">
                        {ticket?.image ? (
                            <Image
                                src={ticket.image}
                                alt={ticket.title || "Ticket"}
                                fill
                                priority
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-100 to-green-50 dark:from-zinc-800 dark:to-zinc-900">
                                <IoTicketSharp className="text-8xl text-emerald-200/60 dark:text-emerald-700/40" />
                            </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />

                        {/* Transport Type Badge */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="absolute top-4 left-4 flex items-center gap-2 rounded-xl bg-white/95 px-3.5 py-2 backdrop-blur-md shadow-lg dark:bg-zinc-800/95 dark:border dark:border-zinc-600/50"
                        >
                            <Icon
                                className="text-emerald-600 dark:text-emerald-400"
                                size={16}
                            />
                            <span className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
                                {ticket?.transportType || "Bus"}
                            </span>
                        </motion.div>

                        {/* Price Badge */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.25 }}
                            className="absolute top-4 right-4"
                        >
                            <div
                                className={`rounded-xl bg-gradient-to-r ${transportColor} px-4 py-2 shadow-lg`}
                            >
                                <p className="flex items-center gap-1 text-white font-black text-lg">
                                    <TbCurrencyTaka size={20} />
                                    {ticket?.price?.toLocaleString()}
                                </p>
                                <p className="text-[10px] font-bold text-white/80 text-right -mt-0.5">
                                    Per Unit
                                </p>
                            </div>
                        </motion.div>

                        {/* Title + Route + Countdown */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="absolute bottom-4 left-4 right-4"
                        >
                            <h1 className="text-2xl font-black text-white drop-shadow-lg md:text-3xl mb-3">
                                {ticket?.title || "Ticket"}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3">
                                {/* Route Pill */}
                                <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/15">
                                    <span className="flex items-center gap-1.5 text-sm font-bold text-white">
                                        <FaMapMarkerAlt
                                            size={12}
                                            className="text-emerald-400"
                                        />
                                        {ticket?.from}
                                    </span>
                                    <FaArrowRight
                                        className="text-emerald-300"
                                        size={11}
                                    />
                                    <span className="flex items-center gap-1.5 text-sm font-bold text-white">
                                        <FaMapMarkerAlt
                                            size={12}
                                            className="text-green-400"
                                        />
                                        {ticket?.to}
                                    </span>
                                </div>
                                {/* Countdown */}
                                <Countdown target={ticket?.departureDate} />
                            </div>
                        </motion.div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid gap-5 p-5 md:grid-cols-3 md:p-7">
                        {/* Left Column */}
                        <div className="space-y-5 md:col-span-2">
                            {/* Route Information */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                className="rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 p-5 dark:border-emerald-500/20 dark:from-emerald-950/30 dark:to-green-950/20 dark:bg-zinc-800/30"
                            >
                                <h2 className="mb-4 text-base font-black text-zinc-900 dark:text-white flex items-center gap-2">
                                    <FaMapMarkerAlt
                                        className="text-emerald-500"
                                        size={15}
                                    />
                                    Route Information
                                </h2>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 text-center">
                                        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 ring-2 ring-emerald-200 dark:bg-emerald-500/15 dark:ring-emerald-500/30">
                                            <FaMapMarkerAlt
                                                className="text-emerald-600 dark:text-emerald-400"
                                                size={18}
                                            />
                                        </div>
                                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                                            From
                                        </p>
                                        <p className="text-lg font-black text-zinc-800 dark:text-white mt-0.5">
                                            {ticket?.from || "N/A"}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="h-px w-12 bg-gradient-to-r from-emerald-300 to-green-300 dark:from-emerald-600 dark:to-green-600" />
                                        <FaArrowRight
                                            className="text-emerald-500 dark:text-emerald-400 my-2"
                                            size={18}
                                        />
                                        <div className="h-px w-12 bg-gradient-to-r from-green-300 to-emerald-300 dark:from-green-600 dark:to-emerald-600" />
                                    </div>
                                    <div className="flex-1 text-center">
                                        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 ring-2 ring-green-200 dark:bg-green-500/15 dark:ring-green-500/30">
                                            <FaMapMarkerAlt
                                                className="text-green-600 dark:text-green-400"
                                                size={18}
                                            />
                                        </div>
                                        <p className="text-[10px] text-green-600 dark:text-green-400 font-bold uppercase tracking-wider">
                                            To
                                        </p>
                                        <p className="text-lg font-black text-zinc-800 dark:text-white mt-0.5">
                                            {ticket?.to || "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Schedule */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-500/60 dark:bg-zinc-800/50"
                            >
                                <h2 className="mb-4 text-base font-black text-zinc-900 dark:text-white flex items-center gap-2">
                                    <FaClock
                                        className="text-emerald-500"
                                        size={15}
                                    />
                                    Schedule
                                </h2>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-700/50 dark:bg-zinc-800/60">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                                            Date
                                        </p>
                                        <div className="flex items-center gap-2.5">
                                            <FaCalendarAlt
                                                className="text-emerald-500 dark:text-emerald-400 shrink-0"
                                                size={15}
                                            />
                                            <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
                                                {formattedDate || "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-700/50 dark:bg-zinc-800/60">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
                                            Time
                                        </p>
                                        <div className="flex items-center gap-2.5">
                                            <FaClock
                                                className="text-emerald-500 dark:text-emerald-400 shrink-0"
                                                size={15}
                                            />
                                            <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
                                                {formattedTime || "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Perks */}
                            {ticket?.perks?.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.25 }}
                                    className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-500/60 dark:bg-zinc-800/50"
                                >
                                    <h2 className="mb-4 text-base font-black text-zinc-900 dark:text-white flex items-center gap-2">
                                        <FaCheckCircle
                                            className="text-emerald-500"
                                            size={15}
                                        />
                                        Available Perks
                                    </h2>
                                    <div className="flex flex-wrap gap-2.5">
                                        {ticket.perks.map((p, i) => (
                                            <motion.span
                                                key={p}
                                                initial={{ opacity: 0, scale: 0 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{
                                                    delay: i * 0.05,
                                                    type: "spring",
                                                    stiffness: 400,
                                                    damping: 20,
                                                }}
                                                className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 border border-emerald-200 shadow-sm dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/25"
                                            >
                                                <FaCheckCircle size={12} />
                                                {p}
                                            </motion.span>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Vendor Info */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-500/60 dark:bg-zinc-800/50"
                            >
                                <h2 className="mb-4 text-base font-black text-zinc-900 dark:text-white">
                                    Vendor Information
                                </h2>
                                <div className="flex items-center gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-600 text-white font-bold text-lg shadow-md shadow-emerald-500/25">
                                        {(ticket?.vendorName || "V")[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold text-base text-zinc-800 dark:text-white">
                                            {ticket?.vendorName || "Vendor"}
                                        </p>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                            {ticket?.vendorEmail || ""}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right Sidebar */}
                        <div className="md:col-span-1">
                            <div className="sticky top-24 space-y-4">
                                {/* Booking Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.35 }}
                                    className="rounded-xl border border-zinc-200 bg-white p-5 shadow-lg dark:border-zinc-700/60 dark:bg-zinc-800/80"
                                >
                                    <h2 className="text-lg font-black text-zinc-900 dark:text-white mb-4">
                                        Book This Ticket
                                    </h2>

                                    {/* Price */}
                                    <div className="mb-4 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 p-4 border border-emerald-100 dark:from-emerald-500/10 dark:to-green-500/10 dark:border-emerald-500/25">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                            Price Per Unit
                                        </p>
                                        <p className="text-3xl font-black text-emerald-700 dark:text-emerald-300 flex items-center">
                                            <TbCurrencyTaka size={28} />
                                            {ticket?.price?.toLocaleString()}
                                        </p>
                                    </div>

                                    {/* Available Seats */}
                                    <div className="mb-4 flex items-center justify-between rounded-lg bg-zinc-50 px-4 py-3 border border-zinc-100 dark:bg-zinc-700/40 dark:border-zinc-600/50">
                                        <span className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">
                                            Available Seats
                                        </span>
                                        <span
                                            className={`text-xl font-black ${
                                                available <= 5
                                                    ? "text-red-600 dark:text-red-400"
                                                    : "text-emerald-600 dark:text-emerald-400"
                                            }`}
                                        >
                                            {available}
                                        </span>
                                    </div>

                                    <AnimatePresence>
                                        {soldOut && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-700 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/25"
                                            >
                                                <FaTimesCircle
                                                    className="animate-pulse"
                                                    size={14}
                                                />
                                                <span className="text-sm font-bold">
                                                    Sold Out
                                                </span>
                                            </motion.div>
                                        )}

                                        {departed && !soldOut && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-700 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/25"
                                            >
                                                <FaTimesCircle
                                                    className="animate-pulse"
                                                    size={14}
                                                />
                                                <span className="text-sm font-bold">
                                                    Departure Passed
                                                </span>
                                            </motion.div>
                                        )}

                                        {isBooked && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="mb-4 flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/25"
                                            >
                                                <FaCheckCircle size={14} />
                                                <span className="text-sm font-bold">
                                                    Already Booked
                                                </span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {!soldOut && !departed && !isBooked && (
                                        <motion.button
                                            onClick={() => setIsOpen(true)}
                                            whileHover={{
                                                scale: 1.02,
                                                boxShadow:
                                                    "0 12px 30px rgba(5, 150, 105, 0.35)",
                                            }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 py-3.5 text-base font-bold text-white shadow-lg shadow-emerald-500/25 transition-all"
                                        >
                                            <span className="flex items-center justify-center gap-2">
                                                <IoTicketSharp size={20} />
                                                Book Now
                                            </span>
                                        </motion.button>
                                    )}

                                    <p className="mt-3 text-[11px] text-zinc-500 dark:text-zinc-500 text-center leading-relaxed">
                                        Booking will be sent to vendor as
                                        pending. Pay after acceptance.
                                    </p>
                                </motion.div>

                                {/* Trust Badges */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700/60 dark:bg-zinc-800/80"
                                >
                                    <div className="space-y-1">
                                        <TrustBadge
                                            icon={FaShieldAlt}
                                            title="Secure Payment"
                                            desc="Your data is protected"
                                        />
                                        <TrustBadge
                                            icon={FaUndo}
                                            title="Easy Cancellation"
                                            desc="Cancel before acceptance"
                                        />
                                        <TrustBadge
                                            icon={FaHeadset}
                                            title="24/7 Support"
                                            desc="We're here to help"
                                        />
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Booking Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 25,
                            }}
                            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-zinc-900 dark:border dark:border-zinc-700/60"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="relative bg-gradient-to-br from-emerald-500 to-green-600 p-5 overflow-hidden">
                                <motion.div
                                    className="absolute -inset-full h-full w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                                    animate={{ x: ["-100%", "200%"] }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                />
                                <div className="relative flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-black text-white">
                                            Book Ticket
                                        </h2>
                                        <p className="text-sm text-emerald-100 mt-0.5">
                                            {ticket?.title}
                                        </p>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setIsOpen(false)}
                                        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                                    >
                                        <FaTimesCircle size={18} />
                                    </motion.button>
                                </div>
                                <div className="relative flex items-center gap-2 mt-3 text-white bg-white/15 rounded-lg p-3 backdrop-blur-sm">
                                    <FaMapMarkerAlt
                                        size={13}
                                        className="text-emerald-200"
                                    />
                                    <span className="text-sm font-bold">
                                        {ticket?.from}
                                    </span>
                                    <FaArrowRight size={11} />
                                    <FaMapMarkerAlt
                                        size={13}
                                        className="text-green-200"
                                    />
                                    <span className="text-sm font-bold">
                                        {ticket?.to}
                                    </span>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="p-5 space-y-4">
                                {/* Price & Available */}
                                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/60">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                                Unit Price
                                            </p>
                                            <p className="flex items-center gap-0.5 text-2xl font-black text-emerald-600 dark:text-emerald-400">
                                                <TbCurrencyTaka size={22} />
                                                {ticket?.price?.toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                                Available
                                            </p>
                                            <p className="text-xl font-black text-zinc-900 dark:text-white">
                                                {available}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Quantity Selector */}
                                <div>
                                    <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-200 mb-2">
                                        Number of Tickets
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <motion.button
                                            whileTap={{ scale: 0.9 }}
                                            type="button"
                                            onClick={() =>
                                                setQty(Math.max(1, qty - 1))
                                            }
                                            disabled={qty <= 1}
                                            className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-zinc-200 bg-white text-xl font-bold text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 transition-colors dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                                        >
                                            −
                                        </motion.button>
                                        <div className="flex-1">
                                            <input
                                                type="number"
                                                min={1}
                                                max={available}
                                                value={qty}
                                                onChange={(e) => {
                                                    const v =
                                                        parseInt(
                                                            e.target.value
                                                        ) || 1;
                                                    if (v < 1) setQty(1);
                                                    else if (v > available)
                                                        setQty(available);
                                                    else setQty(v);
                                                }}
                                                className="w-full rounded-lg border-2 border-zinc-200 bg-white px-3 py-3 text-center text-xl font-bold text-zinc-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:focus:border-emerald-400"
                                            />
                                        </div>
                                        <motion.button
                                            whileTap={{ scale: 0.9 }}
                                            type="button"
                                            onClick={() =>
                                                setQty(
                                                    Math.min(
                                                        available,
                                                        qty + 1
                                                    )
                                                )
                                            }
                                            disabled={qty >= available}
                                            className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-zinc-200 bg-white text-xl font-bold text-zinc-700 hover:bg-zinc-50 disabled:opacity-40 transition-colors dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                                        >
                                            +
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="rounded-lg border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 p-4 dark:border-emerald-500/30 dark:from-emerald-500/10 dark:to-green-500/10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                                                Total Amount
                                            </p>
                                            <p className="text-3xl font-black text-emerald-700 dark:text-emerald-300 flex items-center">
                                                <TbCurrencyTaka size={28} />
                                                {total.toLocaleString()}
                                            </p>
                                        </div>
                                        <motion.div
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{
                                                duration: 0.5,
                                                repeat: Infinity,
                                                repeatDelay: 2,
                                            }}
                                        >
                                            <IoTicketSharp className="text-4xl text-emerald-400/50 dark:text-emerald-300/30" />
                                        </motion.div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-5 pt-0 flex justify-end gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setIsOpen(false)}
                                    className="px-5 py-3 rounded-xl text-sm font-bold text-zinc-700 hover:bg-zinc-100 border border-zinc-200 dark:text-zinc-200 dark:hover:bg-zinc-800 dark:border-zinc-700 transition-all"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleBook}
                                    disabled={
                                        loading || qty < 1 || qty > available
                                    }
                                    className="px-5 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-green-500 shadow-lg shadow-emerald-500/25 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                            Processing...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5">
                                            <IoTicketSharp size={16} />
                                            Confirm — ৳{total.toLocaleString()}
                                        </span>
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default TicketDetailsClient;