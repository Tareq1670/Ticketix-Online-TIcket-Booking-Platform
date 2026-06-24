"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
    MdDirectionsBus,
    MdTrain,
    MdDirectionsBoat,
    MdOutlineAirplanemodeActive,
} from "react-icons/md";
import { FaTicketAlt, FaPlaneDeparture } from "react-icons/fa";
import {
    FiAlertTriangle,
    FiCalendar,
    FiCheckCircle,
    FiClock,
    FiCreditCard,
    FiDownload,
    FiMapPin,
    FiTrash2,
    FiX,
    FiXCircle,
} from "react-icons/fi";
import { AiFillClockCircle, AiFillCloseCircle } from "react-icons/ai";
import { BsFillTicketDetailedFill } from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";
import { Button } from "@heroui/react";
import { cancelBooking } from "@/lib/actions/booking";

const getPlainId = (id) => {
    if (!id) return "";
    if (typeof id === "string") return id;
    if (typeof id === "object") {
        if (id.$oid) return String(id.$oid);
        if (typeof id.toHexString === "function") return id.toHexString();
    }
    return "";
};

const getTransportIcon = (type) => {
    if (!type) return MdDirectionsBus;
    const t = String(type).toLowerCase();
    if (t.includes("plane") || t.includes("flight"))
        return MdOutlineAirplanemodeActive;
    if (t.includes("bus")) return MdDirectionsBus;
    if (t.includes("train")) return MdTrain;
    if (t.includes("launch") || t.includes("boat")) return MdDirectionsBoat;
    return MdDirectionsBus;
};

const getTransportColor = (type) => {
    const t = String(type || "").toLowerCase();
    if (t.includes("plane") || t.includes("flight"))
        return "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300";
    if (t.includes("bus"))
        return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
    if (t.includes("train"))
        return "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300";
    if (t.includes("launch") || t.includes("boat"))
        return "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300";
    return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300";
};

const getStatusConfig = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "paid")
        return {
            label: "Paid",
            icon: FiCheckCircle,
            bg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
            border: "border-emerald-400",
        };
    if (s === "accepted")
        return {
            label: "Accepted",
            icon: FiCheckCircle,
            bg: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
            border: "border-blue-400",
        };
    if (s === "rejected")
        return {
            label: "Rejected",
            icon: AiFillCloseCircle,
            bg: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
            border: "border-red-400",
        };
    if (s === "cancelled")
        return {
            label: "Cancelled",
            icon: AiFillCloseCircle,
            bg: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
            border: "border-gray-400",
        };
    return {
        label: "Pending",
        icon: FiClock,
        bg: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
        border: "border-amber-400",
    };
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 100, damping: 15 },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.9 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 80, damping: 14 },
    },
    exit: { opacity: 0, scale: 0.85, y: -20, transition: { duration: 0.25 } },
};

const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const modalVariants = {
    hidden: { opacity: 0, scale: 0.85, y: 30 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { type: "spring", stiffness: 200, damping: 22 },
    },
    exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } },
};

const TimeBox = ({ value, label, colorScheme = "blue" }) => {
    const colors = {
        blue: {
            box: "bg-white dark:bg-[#07111F] border-blue-200 dark:border-blue-900",
            text: "text-[#064E3B] dark:text-blue-400",
            label: "text-gray-500 dark:text-gray-400",
        },
        emerald: {
            box: "bg-white dark:bg-[#07111F] border-emerald-200 dark:border-emerald-900",
            text: "text-[#064E3B] dark:text-emerald-400",
            label: "text-gray-500 dark:text-gray-400",
        },
        purple: {
            box: "bg-white dark:bg-[#07111F] border-purple-200 dark:border-purple-900",
            text: "text-purple-700 dark:text-purple-400",
            label: "text-gray-500 dark:text-gray-400",
        },
    };
    const c = colors[colorScheme];
    return (
        <div className="flex flex-col items-center">
            <div className={`${c.box} border rounded-lg px-2 py-1 min-w-[38px] text-center shadow-sm overflow-hidden`}>
                <AnimatePresence mode="popLayout">
                    <motion.span
                        key={value}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 20, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className={`text-sm font-black ${c.text} font-mono inline-block`}
                    >
                        {String(value).padStart(2, "0")}
                    </motion.span>
                </AnimatePresence>
            </div>
            <span className={`text-[8px] ${c.label} uppercase tracking-wider mt-1 font-bold`}>
                {label}
            </span>
        </div>
    );
};

const StatusMessageCard = ({ status }) => {
    const isRejected = String(status).toLowerCase() === "rejected";
    const isCancelled = String(status).toLowerCase() === "cancelled";

    if (!isRejected && !isCancelled) return null;

    const config = isRejected
        ? {
              title: "Booking Rejected",
              message: "The vendor has rejected your booking request.",
              icon: AiFillCloseCircle,
              gradient:
                  "from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30",
              border: "border-red-200 dark:border-red-900",
              iconBg: "bg-red-100 dark:bg-red-950/50",
              iconColor: "text-red-600 dark:text-red-400",
              titleColor: "text-red-700 dark:text-red-300",
              textColor: "text-red-600/80 dark:text-red-400/80",
          }
        : {
              title: "Booking Cancelled",
              message:
                  "You have cancelled this booking. Seat has been released.",
              icon: FiXCircle,
              gradient:
                  "from-gray-50 to-slate-50 dark:from-gray-900/30 dark:to-slate-900/30",
              border: "border-gray-200 dark:border-gray-800",
              iconBg: "bg-gray-100 dark:bg-gray-800/50",
              iconColor: "text-gray-600 dark:text-gray-400",
              titleColor: "text-gray-700 dark:text-gray-300",
              textColor: "text-gray-600/80 dark:text-gray-400/80",
          };

    const Icon = config.icon;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 150, damping: 18 }}
            className={`bg-gradient-to-br ${config.gradient} border ${config.border} rounded-xl px-3 py-3 flex items-center gap-3`}
        >
            <motion.div
                animate={
                    isRejected
                        ? { rotate: [0, -10, 10, -10, 0] }
                        : { scale: [1, 1.1, 1] }
                }
                transition={{
                    duration: isRejected ? 0.6 : 2,
                    repeat: Infinity,
                    repeatDelay: isRejected ? 3 : 1,
                }}
                className={`flex-shrink-0 w-10 h-10 rounded-xl ${config.iconBg} ${config.iconColor} flex items-center justify-center shadow-md`}
            >
                <Icon className="text-xl" />
            </motion.div>
            <div className="flex-1 min-w-0">
                <p
                    className={`text-xs font-black ${config.titleColor} uppercase tracking-wide`}
                >
                    {config.title}
                </p>
                <p
                    className={`text-[11px] font-semibold mt-0.5 ${config.textColor} leading-relaxed`}
                >
                    {config.message}
                </p>
            </div>
        </motion.div>
    );
};

const PaidJourneyCard = ({ departureDate }) => {
    const [timeLeft, setTimeLeft] = useState({
        d: 0,
        h: 0,
        m: 0,
        s: 0,
        expired: false,
        loading: true,
    });

    useEffect(() => {
        const update = () => {
            const diff = new Date(departureDate) - new Date();
            if (diff <= 0) {
                setTimeLeft({ expired: true, loading: false });
                return;
            }
            setTimeLeft({
                d: Math.floor(diff / 86400000),
                h: Math.floor((diff % 86400000) / 3600000),
                m: Math.floor((diff % 3600000) / 60000),
                s: Math.floor((diff % 60000) / 1000),
                expired: false,
                loading: false,
            });
        };
        update();
        const timer = setInterval(update, 1000);
        return () => clearInterval(timer);
    }, [departureDate]);

    const journeyDate = new Date(departureDate).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
    });
    const journeyTime = new Date(departureDate).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });

    if (timeLeft.loading) {
        return (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-900 rounded-xl px-3 py-3 flex items-center justify-center gap-2">
                <FiClock className="text-emerald-500 animate-spin text-sm" />
                <span className="text-xs font-bold text-emerald-500">
                    Loading...
                </span>
            </div>
        );
    }

    if (timeLeft.expired) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-gradient-to-r from-purple-50 to-fuchsia-50 dark:from-purple-950/30 dark:to-fuchsia-950/30 border border-purple-200 dark:border-purple-900 rounded-xl px-3 py-3"
            >
                <p className="text-center text-[9px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest mb-2">
                    Journey Completed
                </p>
                <div className="flex items-center justify-center gap-2">
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <HiSparkles className="text-purple-600 dark:text-purple-400 text-base" />
                    </motion.div>
                    <span className="text-xs font-black text-purple-700 dark:text-purple-300">
                        Hope you had a wonderful trip! ✨
                    </span>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-900 rounded-xl px-3 py-3"
        >
            <p className="text-center text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2">
                Journey Starts • {journeyDate} • {journeyTime}
            </p>
            <div className="flex items-center justify-center gap-1.5">
                <motion.div
                    animate={{ x: [0, 2, 0] }}
                    transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <FaPlaneDeparture className="text-emerald-600 dark:text-emerald-400 text-sm mr-1" />
                </motion.div>
                <TimeBox value={timeLeft.d} label="Days" colorScheme="emerald" />
                <span className="text-gray-400 font-bold mb-3 text-lg">:</span>
                <TimeBox value={timeLeft.h} label="Hrs" colorScheme="emerald" />
                <span className="text-gray-400 font-bold mb-3 text-lg">:</span>
                <TimeBox value={timeLeft.m} label="Min" colorScheme="emerald" />
                <span className="text-gray-400 font-bold mb-3 text-lg">:</span>
                <TimeBox value={timeLeft.s} label="Sec" colorScheme="emerald" />
            </div>
        </motion.div>
    );
};

const CountdownTimer = ({ departureDate, status }) => {
    const [timeLeft, setTimeLeft] = useState({
        d: 0,
        h: 0,
        m: 0,
        s: 0,
        expired: false,
        loading: true,
    });

    useEffect(() => {
        const update = () => {
            const diff = new Date(departureDate) - new Date();
            if (diff <= 0) {
                setTimeLeft({ expired: true, loading: false });
                return;
            }
            setTimeLeft({
                d: Math.floor(diff / 86400000),
                h: Math.floor((diff % 86400000) / 3600000),
                m: Math.floor((diff % 3600000) / 60000),
                s: Math.floor((diff % 60000) / 1000),
                expired: false,
                loading: false,
            });
        };
        update();
        const timer = setInterval(update, 1000);
        return () => clearInterval(timer);
    }, [departureDate]);

    const hiddenStatuses = ["rejected", "cancelled", "paid"];
    if (hiddenStatuses.includes(String(status).toLowerCase())) return null;

    if (timeLeft.loading) {
        return (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-900 rounded-xl px-3 py-3 flex items-center justify-center gap-2">
                <FiClock className="text-blue-500 animate-spin text-sm" />
                <span className="text-xs font-bold text-blue-500">
                    Loading...
                </span>
            </div>
        );
    }

    if (timeLeft.expired) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200 dark:bg-red-950/30 dark:border-red-900 rounded-xl px-3 py-3 flex items-center justify-center gap-2"
            >
                <FiAlertTriangle className="text-red-600 dark:text-red-400 text-sm animate-pulse" />
                <span className="text-xs font-black text-red-700 dark:text-red-400 tracking-wider uppercase">
                    Departed
                </span>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-900 rounded-xl px-3 py-3"
        >
            <p className="text-center text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">
                Departs In
            </p>
            <div className="flex items-center justify-center gap-1.5">
                <FiClock className="text-blue-600 dark:text-blue-400 text-sm mr-1" />
                <TimeBox value={timeLeft.d} label="Days" colorScheme="blue" />
                <span className="text-gray-400 font-bold mb-3 text-lg">:</span>
                <TimeBox value={timeLeft.h} label="Hrs" colorScheme="blue" />
                <span className="text-gray-400 font-bold mb-3 text-lg">:</span>
                <TimeBox value={timeLeft.m} label="Min" colorScheme="blue" />
                <span className="text-gray-400 font-bold mb-3 text-lg">:</span>
                <TimeBox value={timeLeft.s} label="Sec" colorScheme="blue" />
            </div>
        </motion.div>
    );
};

const BookingCard = ({ booking, onCancelClick, onPaymentClick }) => {
    const bookingId = getPlainId(booking._id);
    const isPast = new Date(booking.departureDate) < new Date();
    const date = new Date(booking.departureDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
    const time = new Date(booking.departureDate).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });
    const TransportIcon = getTransportIcon(booking.transportType);
    const statusConfig = getStatusConfig(booking.status);
    const StatusIcon = statusConfig.icon;
    const status = String(booking.status).toLowerCase();
    const isInactive = status === "rejected" || status === "cancelled";
    const isPaid = status === "paid";

    const showStatusMessage = isInactive;
    const showPaidJourney = isPaid;
    const showCountdown = !["rejected", "cancelled", "paid"].includes(status);

    return (
        <motion.div
            layout
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="group relative bg-white dark:bg-[#0A1626] rounded-[24px] overflow-hidden border border-emerald-100 dark:border-emerald-900/50 shadow-[0_18px_50px_rgba(6,78,59,0.08)] hover:shadow-[0_26px_80px_rgba(6,78,59,0.16)] transition-shadow duration-300 flex flex-col h-full"
        >
            <div className="relative h-44 overflow-hidden flex-shrink-0">
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="w-full h-full"
                >
                    <Image
                        src={
                            booking.image ||
                            "https://placehold.co/400x200/064E3B/white?text=Ticket"
                        }
                        alt={booking.title}
                        width={400}
                        height={200}
                        className={`w-full h-full object-cover ${isInactive ? "grayscale" : ""}`}
                    />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="absolute top-3 right-3"
                >
                    <div
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border-l-4 text-xs font-black shadow-lg ${statusConfig.bg} ${statusConfig.border}`}
                    >
                        <StatusIcon className="text-xs" /> {statusConfig.label}
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="absolute top-3 left-3"
                >
                    <div
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-black shadow-md ${getTransportColor(booking.transportType)}`}
                    >
                        <TransportIcon className="text-sm" />
                        <span>{booking.transportType}</span>
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="absolute bottom-3 left-4 right-4"
                >
                    <h3 className="text-lg font-black text-white drop-shadow-lg line-clamp-1 flex items-center gap-2">
                        <TransportIcon className="text-xl flex-shrink-0" />{" "}
                        {booking.title}
                    </h3>
                </motion.div>
            </div>

            <div className="p-4 flex flex-col flex-grow gap-3">
                <div className="flex items-center justify-between bg-emerald-50 dark:bg-[#07111F] rounded-xl px-3 py-2.5 border border-emerald-100 dark:border-emerald-900/50">
                    <div className="text-center flex-1">
                        <p className="text-[9px] text-gray-500 dark:text-gray-400 uppercase font-black tracking-widest mb-1">
                            From
                        </p>
                        <p className="font-black text-[#064E3B] dark:text-white text-sm truncate">
                            {booking.from}
                        </p>
                    </div>
                    <div className="flex flex-col items-center gap-0.5 flex-shrink-0 px-2">
                        <div className="w-6 h-[1px] bg-gray-300 dark:bg-gray-700" />
                        <motion.div
                            animate={{ y: [0, -3, 0] }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        >
                            <FiMapPin className="text-emerald-600 dark:text-emerald-400 text-base" />
                        </motion.div>
                        <div className="w-6 h-[1px] bg-gray-300 dark:bg-gray-700" />
                    </div>
                    <div className="text-center flex-1">
                        <p className="text-[9px] text-gray-500 dark:text-gray-400 uppercase font-black tracking-widest mb-1">
                            To
                        </p>
                        <p className="font-black text-[#064E3B] dark:text-white text-sm truncate">
                            {booking.to}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-orange-50 dark:bg-orange-950/20 rounded-xl px-3 py-2.5 border border-orange-100 dark:border-orange-900/30">
                    <FiCalendar className="text-orange-600 dark:text-orange-400 flex-shrink-0 text-sm" />
                    <div className="flex items-center gap-1.5 flex-1 flex-wrap">
                        <span className="text-gray-700 dark:text-gray-300 font-bold text-sm">
                            {date}
                        </span>
                        <span className="text-gray-400 text-xs">at</span>
                        <span className="text-orange-700 dark:text-orange-300 font-black text-sm">
                            {time}
                        </span>
                    </div>
                </div>

                {showStatusMessage && (
                    <StatusMessageCard status={booking.status} />
                )}

                {showPaidJourney && (
                    <PaidJourneyCard departureDate={booking.departureDate} />
                )}

                {showCountdown && (
                    <CountdownTimer
                        departureDate={booking.departureDate}
                        status={booking.status}
                    />
                )}

                <div className="mt-auto flex flex-col gap-3">
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/40 dark:to-green-950/40 rounded-xl px-4 py-3 border-2 border-emerald-200 dark:border-emerald-900 text-center">
                        <p className="text-[9px] text-gray-600 dark:text-gray-400 font-black uppercase tracking-widest">
                            Total Amount
                        </p>
                        <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400 mt-1">
                            ৳{booking.totalPrice}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 font-semibold">
                            ৳{booking.unitPrice} × {booking.quantity} seats
                        </p>
                    </div>

                    <div>
                        {booking.status === "accepted" && (
                            <motion.div
                                whileHover={!isPast ? { scale: 1.02 } : {}}
                                whileTap={!isPast ? { scale: 0.98 } : {}}
                            >
                                <Button
                                    variant="none"
                                    onClick={() =>
                                        !isPast && onPaymentClick(booking)
                                    }
                                    disabled={isPast}
                                    className={`w-full h-11 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                                        isPast
                                            ? "bg-gray-200 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
                                            : "bg-gradient-to-r from-[#064E3B] via-emerald-600 to-green-500 hover:opacity-90 text-white shadow-lg shadow-emerald-600/25"
                                    }`}
                                >
                                    <FiCreditCard className="text-base" />
                                    {isPast ? "Expired" : "Pay Now"}
                                </Button>
                            </motion.div>
                        )}
                        {booking.status === "pending" && (
                            <motion.div
                                whileHover={!isPast ? { scale: 1.02 } : {}}
                                whileTap={!isPast ? { scale: 0.98 } : {}}
                            >
                                <Button
                                    variant="none"
                                    onClick={() =>
                                        !isPast && onCancelClick(bookingId)
                                    }
                                    disabled={isPast}
                                    className={`w-full h-11 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
                                        isPast
                                            ? "bg-gray-200 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
                                            : "bg-gradient-to-r from-red-600 to-red-800 hover:opacity-90 text-white shadow-lg shadow-red-500/25"
                                    }`}
                                >
                                    <FiTrash2 className="text-base" />
                                    {isPast ? "Expired" : "Cancel Booking"}
                                </Button>
                            </motion.div>
                        )}
                        {booking.status === "paid" && (
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button
                                    variant="none"
                                    className="w-full h-11 rounded-xl font-black text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white shadow-lg shadow-purple-500/25 transition-all duration-300"
                                >
                                    <FiDownload className="text-base" />
                                    Download Ticket
                                </Button>
                            </motion.div>
                        )}
                        {booking.status === "rejected" && (
                            <Button
                                variant="none"
                                disabled
                                className="w-full h-11 rounded-xl font-black text-sm flex items-center justify-center gap-2 bg-red-100 dark:bg-red-950/40 text-red-500 dark:text-red-400 border-2 border-red-200 dark:border-red-900/60 cursor-not-allowed opacity-70"
                            >
                                <AiFillCloseCircle className="text-base" />
                                Booking Rejected
                            </Button>
                        )}
                        {booking.status === "cancelled" && (
                            <Button
                                variant="none"
                                disabled
                                className="w-full h-11 rounded-xl font-black text-sm flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 border-2 border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-70"
                            >
                                <FiXCircle className="text-base" />
                                Booking Cancelled
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const StatCard = ({
    title,
    value,
    Icon,
    numberClass,
    iconClass,
    cardClass,
    borderClass,
    index = 0,
}) => (
    <motion.div
        variants={itemVariants}
        whileHover={{ y: -6, transition: { duration: 0.2 } }}
        className={`group relative overflow-hidden rounded-[24px] border ${borderClass} bg-gradient-to-br ${cardClass} p-5 shadow-[0_18px_50px_rgba(6,78,59,0.08)] hover:shadow-[0_26px_80px_rgba(6,78,59,0.16)]`}
    >
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 + index * 0.05, type: "spring" }}
            className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-white/50 dark:bg-white/5"
        />
        <div className="relative z-10 flex items-center justify-between">
            <div>
                <motion.p
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                        delay: 0.2 + index * 0.05,
                        type: "spring",
                        stiffness: 200,
                    }}
                    className={`text-3xl font-black sm:text-4xl ${numberClass}`}
                >
                    {value}
                </motion.p>
                <p className="mt-1 text-sm font-bold text-gray-500 dark:text-gray-400">
                    {title}
                </p>
            </div>
            <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-xl ${iconClass}`}
            >
                <Icon className="text-2xl" />
            </motion.div>
        </div>
    </motion.div>
);

const CancelModal = ({ isOpen, onClose, onConfirm, isProcessing }) => (
    <AnimatePresence>
        {isOpen && (
            <div
                className="fixed inset-0 z-[99990] flex items-center justify-center p-4"
                style={{ isolation: "isolate" }}
            >
                <motion.div
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="fixed inset-0 bg-black/70 backdrop-blur-md"
                    onClick={!isProcessing ? onClose : undefined}
                />
                <motion.div
                    variants={modalVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="relative z-[99991] mx-auto w-full max-w-[calc(100vw-2rem)] rounded-[28px] border border-red-100/60 bg-white shadow-[0_-20px_60px_rgba(0,0,0,0.25)] sm:max-w-md sm:shadow-[0_30px_100px_rgba(220,38,38,0.35)] dark:border-red-900/40 dark:bg-[#0A1626]"
                >
                    <div className="relative flex flex-col items-center px-5 pb-7 pt-6 sm:px-7 sm:pb-7 sm:pt-7">
                        <Button
                            variant="none"
                            onClick={!isProcessing ? onClose : undefined}
                            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-all hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                        >
                            <FiX className="text-base" />
                        </Button>
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                                delay: 0.1,
                                type: "spring",
                                stiffness: 200,
                            }}
                            className="flex h-[72px] w-[72px] items-center justify-center rounded-[24px] shadow-lg bg-red-50 text-red-500 dark:bg-red-950/50 dark:text-red-400"
                        >
                            <motion.div
                                animate={{ rotate: [0, -10, 10, -10, 0] }}
                                transition={{
                                    duration: 0.6,
                                    delay: 0.4,
                                    repeat: Infinity,
                                    repeatDelay: 2,
                                }}
                            >
                                <FiAlertTriangle className="text-3xl" />
                            </motion.div>
                        </motion.div>
                        <motion.h3
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mt-5 px-4 text-center text-lg font-black leading-snug text-gray-900 sm:text-xl dark:text-white"
                        >
                            Cancel this booking?
                        </motion.h3>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                            className="mt-2.5 px-2 text-center text-sm leading-relaxed text-gray-500 dark:text-gray-400"
                        >
                            Are you sure you want to cancel this booking? This
                            action{" "}
                            <span className="text-red-500 font-bold">
                                cannot be undone
                            </span>{" "}
                            and the seat will be released.
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:justify-center"
                        >
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                type="button"
                                disabled={isProcessing}
                                onClick={onClose}
                                className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-100 px-6 text-sm font-black text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50 sm:h-11 sm:w-auto sm:min-w-[120px] dark:border-gray-700/60 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                            >
                                Keep Booking
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                type="button"
                                disabled={isProcessing}
                                onClick={onConfirm}
                                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl px-6 text-sm font-black text-white shadow-lg transition-colors disabled:opacity-70 sm:h-11 sm:w-auto sm:min-w-[160px] bg-gradient-to-r from-red-600 to-red-700 hover:opacity-90 shadow-red-600/30"
                            >
                                {isProcessing ? (
                                    <motion.span
                                        animate={{ rotate: 360 }}
                                        transition={{
                                            duration: 1,
                                            repeat: Infinity,
                                            ease: "linear",
                                        }}
                                    >
                                        ⏳
                                    </motion.span>
                                ) : (
                                    <FiTrash2 />
                                )}
                                {isProcessing ? "Cancelling..." : "Yes, Cancel"}
                            </motion.button>
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        )}
    </AnimatePresence>
);

const PaymentModal = ({ payBooking, onClose, isProcessing, user }) => {
    const [submitting, setSubmitting] = useState(false);
    const processing = isProcessing || submitting;

    const paymentPayload = payBooking
        ? JSON.stringify({
              bookingId: getPlainId(payBooking._id),
              ticketId: payBooking.ticketId,
              ticketTitle: payBooking.title,
              totalPrice: payBooking.totalPrice,
              quantity: payBooking.quantity,
              userId: user?.id,
              userEmail: user?.email,
          })
        : "";

    return (
        <AnimatePresence>
            {payBooking && (
                <div
                    className="fixed inset-0 z-[99990] flex items-center justify-center p-4"
                    style={{ isolation: "isolate" }}
                >
                    <motion.div
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="fixed inset-0 bg-black/70 backdrop-blur-md"
                        onClick={!processing ? onClose : undefined}
                    />
                    <motion.div
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="relative z-[99991] mx-auto w-full max-w-[calc(100vw-2rem)] rounded-[28px] border border-emerald-100/60 bg-white shadow-[0_-20px_60px_rgba(0,0,0,0.25)] sm:max-w-md sm:shadow-[0_30px_100px_rgba(6,78,59,0.35)] dark:border-emerald-900/40 dark:bg-[#0A1626]"
                    >
                        <div className="relative flex flex-col items-center px-5 pb-7 pt-6 sm:px-7 sm:pb-7 sm:pt-7">
                            <Button
                                variant="none"
                                onClick={!processing ? onClose : undefined}
                                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-all hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                            >
                                <FiX className="text-base" />
                            </Button>
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{
                                    delay: 0.1,
                                    type: "spring",
                                    stiffness: 200,
                                }}
                                className="flex h-[72px] w-[72px] items-center justify-center rounded-[24px] shadow-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300"
                            >
                                <FiCreditCard className="text-3xl" />
                            </motion.div>
                            <motion.h3
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="mt-5 px-4 text-center text-lg font-black leading-snug text-gray-900 sm:text-xl dark:text-white"
                            >
                                Confirm Payment
                            </motion.h3>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 }}
                                className="mt-2.5 px-2 text-center text-sm leading-relaxed text-gray-500 dark:text-gray-400"
                            >
                                Review your booking details before proceeding.
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="w-full mt-5 bg-emerald-50 dark:bg-[#07111F] rounded-2xl p-4 border border-emerald-100 dark:border-emerald-900/50 space-y-2"
                            >
                                <div className="flex justify-between items-center py-1 border-b border-emerald-200/50 dark:border-emerald-800/50">
                                    <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                                        Ticket:
                                    </span>
                                    <span className="text-sm font-black text-[#064E3B] dark:text-white max-w-[60%] text-right truncate">
                                        {payBooking.title}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-1 border-b border-emerald-200/50 dark:border-emerald-800/50">
                                    <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                                        Route:
                                    </span>
                                    <span className="text-sm font-black text-[#064E3B] dark:text-white">
                                        {payBooking.from} → {payBooking.to}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center py-1 border-b border-emerald-200/50 dark:border-emerald-800/50">
                                    <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                                        Quantity:
                                    </span>
                                    <span className="text-sm font-black text-[#064E3B] dark:text-white">
                                        {payBooking.quantity} seats
                                    </span>
                                </div>
                                <motion.div
                                    initial={{ scale: 0.95 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.45, type: "spring" }}
                                    className="flex justify-between items-center py-2 mt-2 bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-950 dark:to-green-950 rounded-xl px-3 border-l-4 border-emerald-600"
                                >
                                    <span className="text-lg font-black text-gray-900 dark:text-white">
                                        Total:
                                    </span>
                                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                                        ৳{payBooking.totalPrice}
                                    </span>
                                </motion.div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.45 }}
                                className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:justify-center"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="w-full sm:w-auto"
                                >
                                    <Button
                                        variant="none"
                                        type="button"
                                        disabled={processing}
                                        onClick={onClose}
                                        className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-100 px-6 text-sm font-black text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50 sm:h-11 sm:min-w-[120px] dark:border-gray-700/60 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                                    >
                                        Cancel
                                    </Button>
                                </motion.div>

                                <motion.form
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    action="/api/checkout_sessions"
                                    method="POST"
                                    onSubmit={() => setSubmitting(true)}
                                    className="w-full sm:w-auto"
                                >
                                    <input
                                        type="hidden"
                                        name="payload"
                                        value={paymentPayload}
                                    />
                                    <Button
                                        variant="none"
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl px-6 text-sm font-black text-white shadow-lg transition-colors disabled:opacity-70 sm:h-11 sm:min-w-[160px] bg-gradient-to-r from-[#064E3B] via-emerald-600 to-green-500 hover:opacity-90 shadow-emerald-600/30"
                                    >
                                        {processing ? (
                                            <motion.span
                                                animate={{ rotate: 360 }}
                                                transition={{
                                                    duration: 1,
                                                    repeat: Infinity,
                                                    ease: "linear",
                                                }}
                                            >
                                                ⏳
                                            </motion.span>
                                        ) : (
                                            <FiCreditCard />
                                        )}
                                        {processing
                                            ? "Redirecting..."
                                            : `Pay ৳${payBooking.totalPrice}`}
                                    </Button>
                                </motion.form>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

const MyBookedTicketsClient = ({ user, initialBookings }) => {
    const [bookings, setBookings] = useState(initialBookings);
    const [filter, setFilter] = useState("all");
    const [payBooking, setPayBooking] = useState(null);
    const [cancelBookingId, setCancelBookingId] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const filters = [
        {
            key: "all",
            label: "All",
            icon: BsFillTicketDetailedFill,
            color: "blue",
        },
        {
            key: "pending",
            label: "Pending",
            icon: AiFillClockCircle,
            color: "amber",
        },
        {
            key: "accepted",
            label: "Accepted",
            icon: FiCheckCircle,
            color: "blue",
        },
        { key: "paid", label: "Paid", icon: FiCreditCard, color: "emerald" },
        {
            key: "rejected",
            label: "Rejected",
            icon: AiFillCloseCircle,
            color: "red",
        },
        {
            key: "cancelled",
            label: "Cancelled",
            icon: FiXCircle,
            color: "gray",
        },
    ];

    const colorMap = {
        blue: "bg-gradient-to-r from-blue-500 to-blue-600",
        amber: "bg-gradient-to-r from-amber-500 to-amber-600",
        emerald: "bg-gradient-to-r from-[#064E3B] via-emerald-600 to-green-500",
        red: "bg-gradient-to-r from-red-500 to-red-600",
        gray: "bg-gradient-to-r from-gray-500 to-gray-600",
    };

    const filtered = useMemo(
        () =>
            filter === "all"
                ? bookings
                : bookings.filter((b) => b.status === filter),
        [bookings, filter],
    );

    const counts = useMemo(() => {
        const c = {
            all: bookings.length,
            pending: 0,
            accepted: 0,
            paid: 0,
            rejected: 0,
            cancelled: 0,
        };
        bookings.forEach((b) => {
            if (c[b.status] !== undefined) c[b.status]++;
        });
        return c;
    }, [bookings]);

    const handleCancelConfirm = async () => {
        if (!cancelBookingId) return;
        setIsProcessing(true);
        try {
            const data = await cancelBooking(cancelBookingId);
            if (data.success) {
                setBookings((prev) =>
                    prev.map((b) =>
                        getPlainId(b._id) === cancelBookingId
                            ? { ...b, status: "cancelled" }
                            : b,
                    ),
                );
                toast.success("Booking cancelled successfully!");
            } else {
                toast.error(data.message || "Failed to cancel booking");
            }
        } catch {
            toast.error("Something wrong. Please try again.");
        } finally {
            setIsProcessing(false);
            setCancelBookingId(null);
        }
    };

    return (
        <>
            <Toaster
                position="top-center"
                containerStyle={{ zIndex: 999999 }}
                toastOptions={{
                    style: {
                        zIndex: 999999,
                        fontWeight: 700,
                        borderRadius: "14px",
                        padding: "12px 18px",
                        fontSize: "14px",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
                    },
                    success: {
                        iconTheme: { primary: "#10B981", secondary: "#fff" },
                    },
                    error: {
                        iconTheme: { primary: "#EF4444", secondary: "#fff" },
                    },
                }}
            />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="min-h-screen rounded-[28px] bg-[#F0FDF4] p-4 sm:p-6 lg:p-7 dark:bg-[#06130D]"
            >
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col gap-6 sm:gap-7"
                >
                    <motion.div
                        variants={itemVariants}
                        className="relative hidden md:inline-block overflow-hidden rounded-[26px] bg-gradient-to-r from-[#052E16] via-[#16A34A] to-[#34D399] p-5 shadow-[0_24px_70px_rgba(22,163,74,0.28)] sm:rounded-[30px] sm:p-6 lg:p-8"
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.15, 0.25, 0.15],
                            }}
                            transition={{ duration: 8, repeat: Infinity }}
                            className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/15 blur-3xl"
                        />
                        <motion.div
                            animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.3, 0.5, 0.3],
                            }}
                            transition={{
                                duration: 10,
                                repeat: Infinity,
                                delay: 1,
                            }}
                            className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-lime-300/30 blur-3xl"
                        />
                        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-xs font-bold text-white backdrop-blur-md"
                                >
                                    <FaTicketAlt /> Ticketix User Dashboard
                                </motion.div>
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl"
                                >
                                    My Booked Tickets
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="mt-3 max-w-2xl text-sm leading-6 text-green-50"
                                >
                                    Manage, track and pay for all your travel
                                    bookings in one place.
                                </motion.p>
                            </div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5, type: "spring" }}
                                className="grid grid-cols-2 gap-3 rounded-2xl border border-white/20 bg-white/15 p-3 backdrop-blur-xl sm:min-w-[280px]"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="rounded-2xl bg-white/95 p-4 text-center shadow-lg dark:bg-[#07111F]/90"
                                >
                                    <p className="text-2xl font-black text-emerald-600">
                                        {filtered.length}
                                    </p>
                                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                                        Showing
                                    </p>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="rounded-2xl bg-white/95 p-4 text-center shadow-lg dark:bg-[#07111F]/90"
                                >
                                    <p className="text-2xl font-black text-lime-600">
                                        {bookings.length}
                                    </p>
                                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                                        Total
                                    </p>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>

                    <motion.div
                        variants={containerVariants}
                        className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 xl:grid-cols-5"
                    >
                        <StatCard
                            index={0}
                            title="Total"
                            value={counts.all}
                            Icon={BsFillTicketDetailedFill}
                            numberClass="text-emerald-600"
                            iconClass="bg-gradient-to-br from-emerald-600 to-green-400"
                            cardClass="from-emerald-50 via-white to-green-50 dark:from-emerald-950/50 dark:via-[#07111F] dark:to-green-950/30"
                            borderClass="border-emerald-100 dark:border-emerald-900/50"
                        />
                        <StatCard
                            index={1}
                            title="Pending"
                            value={counts.pending}
                            Icon={FiClock}
                            numberClass="text-amber-600"
                            iconClass="bg-gradient-to-br from-amber-500 to-orange-500"
                            cardClass="from-amber-50 via-white to-orange-50 dark:from-amber-950/50 dark:via-[#07111F] dark:to-orange-950/30"
                            borderClass="border-amber-100 dark:border-amber-900/50"
                        />
                        <StatCard
                            index={2}
                            title="Accepted"
                            value={counts.accepted}
                            Icon={FiCheckCircle}
                            numberClass="text-blue-600"
                            iconClass="bg-gradient-to-br from-blue-600 to-indigo-500"
                            cardClass="from-blue-50 via-white to-indigo-50 dark:from-blue-950/50 dark:via-[#07111F] dark:to-indigo-950/30"
                            borderClass="border-blue-100 dark:border-blue-900/50"
                        />
                        <StatCard
                            index={3}
                            title="Paid"
                            value={counts.paid}
                            Icon={FiCreditCard}
                            numberClass="text-green-700"
                            iconClass="bg-gradient-to-br from-green-700 to-emerald-500"
                            cardClass="from-green-50 via-white to-emerald-50 dark:from-green-950/50 dark:via-[#07111F] dark:to-green-950/30"
                            borderClass="border-green-100 dark:border-green-900/50"
                        />
                        <StatCard
                            index={4}
                            title="Rejected"
                            value={counts.rejected}
                            Icon={FiXCircle}
                            numberClass="text-red-600"
                            iconClass="bg-gradient-to-br from-red-600 to-red-800"
                            cardClass="from-red-50 via-white to-orange-50 dark:from-red-950/50 dark:via-[#07111F] dark:to-orange-950/30"
                            borderClass="border-red-100 dark:border-red-900/50"
                        />
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        className="flex flex-wrap gap-3 justify-center"
                    >
                        {filters.map((f, idx) => {
                            const Icon = f.icon;
                            const isActive = filter === f.key;
                            return (
                                <motion.div
                                    key={f.key}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 * idx }}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Button
                                        variant="none"
                                        onClick={() => setFilter(f.key)}
                                        className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${
                                            isActive
                                                ? `${colorMap[f.color]} text-white shadow-lg scale-105`
                                                : "bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50 dark:bg-[#0A1626] dark:text-gray-300 dark:border-emerald-900/50 dark:hover:bg-[#07111F]"
                                        }`}
                                    >
                                        <Icon className="text-base" /> {f.label}
                                        <span
                                            className={`text-xs px-2 py-0.5 rounded-full font-black ${isActive ? "bg-black/20" : "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400"}`}
                                        >
                                            {counts[f.key] || 0}
                                        </span>
                                    </Button>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    <AnimatePresence mode="wait">
                        {filtered.length > 0 ? (
                            <motion.div
                                key={filter}
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-1 gap-6 sm:gap-7 md:grid-cols-2 lg:grid-cols-3 xl:gap-8 auto-rows-fr"
                            >
                                <AnimatePresence mode="popLayout">
                                    {filtered.map((b) => (
                                        <BookingCard
                                            key={getPlainId(b._id)}
                                            booking={b}
                                            onCancelClick={setCancelBookingId}
                                            onPaymentClick={setPayBooking}
                                        />
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 100 }}
                                className="text-center py-20 bg-white dark:bg-[#0A1626] rounded-[28px] border border-emerald-100 dark:border-emerald-900/50 shadow-[0_18px_50px_rgba(6,78,59,0.08)]"
                            >
                                <motion.div
                                    animate={{
                                        y: [0, -10, 0],
                                        rotate: [0, -5, 5, 0],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                    className="text-7xl mb-4 inline-block"
                                >
                                    🎫
                                </motion.div>
                                <h3 className="text-2xl font-black text-[#064E3B] dark:text-white mb-2">
                                    No Bookings Found
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
                                    You don&apos;t have any{" "}
                                    {filter !== "all" ? `"${filter}"` : ""}{" "}
                                    bookings at the moment.
                                </p>
                                <Link href="/all-tickets">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="inline-block"
                                    >
                                        <Button
                                            variant="none"
                                            className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl font-black text-sm bg-gradient-to-r from-[#064E3B] via-emerald-600 to-green-500 hover:opacity-90 text-white shadow-lg shadow-emerald-600/25 transition-all duration-300"
                                        >
                                            <FiMapPin /> Browse Tickets
                                        </Button>
                                    </motion.div>
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>

            <CancelModal
                isOpen={!!cancelBookingId}
                onClose={() => setCancelBookingId(null)}
                onConfirm={handleCancelConfirm}
                isProcessing={isProcessing}
            />
            <PaymentModal
                payBooking={payBooking}
                onClose={() => setPayBooking(null)}
                isProcessing={isProcessing}
                user={user}
            />
        </>
    );
};

export default MyBookedTicketsClient;