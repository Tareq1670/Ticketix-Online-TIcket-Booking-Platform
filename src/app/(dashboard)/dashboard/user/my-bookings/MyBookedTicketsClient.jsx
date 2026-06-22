"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import {
    MdDirectionsBus,
    MdTrain,
    MdDirectionsBoat,
    MdOutlineAirplanemodeActive,
} from "react-icons/md";
import { FaTicketAlt } from "react-icons/fa";
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
            <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gray-50 border border-gray-200 dark:bg-gray-900/30 dark:border-gray-800">
                <FiClock className="text-gray-400 animate-spin text-sm" />
                <span className="text-xs font-bold text-gray-400">
                    Loading...
                </span>
            </div>
        );
    }

    if (timeLeft.expired) {
        return (
            <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-50 border border-red-200 text-red-700 dark:bg-red-950/30 dark:border-red-900 dark:text-red-400">
                <FiAlertTriangle className="text-sm animate-pulse" />
                <span className="text-xs font-black tracking-wider uppercase">
                    Departed
                </span>
            </div>
        );
    }

    const TimeBox = ({ value, label }) => (
        <div className="flex flex-col items-center">
            <div className="bg-white dark:bg-[#07111F] border border-emerald-200 dark:border-emerald-900 rounded-lg px-2 py-1 min-w-[38px] text-center shadow-sm">
                <span className="text-sm font-black text-[#064E3B] dark:text-emerald-400 font-mono">
                    {String(value).padStart(2, "0")}
                </span>
            </div>
            <span className="text-[8px] text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1 font-bold">
                {label}
            </span>
        </div>
    );

    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-900 rounded-xl px-3 py-3">
            <p className="text-center text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">
                Departs In
            </p>
            <div className="flex items-center justify-center gap-1.5">
                <FiClock className="text-blue-600 dark:text-blue-400 text-sm mr-1" />
                <TimeBox value={timeLeft.d} label="Days" />
                <span className="text-gray-400 font-bold mb-3 text-lg">:</span>
                <TimeBox value={timeLeft.h} label="Hrs" />
                <span className="text-gray-400 font-bold mb-3 text-lg">:</span>
                <TimeBox value={timeLeft.m} label="Min" />
                <span className="text-gray-400 font-bold mb-3 text-lg">:</span>
                <TimeBox value={timeLeft.s} label="Sec" />
            </div>
        </div>
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

    return (
        <div className="group relative bg-white dark:bg-[#0A1626] rounded-[24px] overflow-hidden border border-emerald-100 dark:border-emerald-900/50 shadow-[0_18px_50px_rgba(6,78,59,0.08)] hover:shadow-[0_26px_80px_rgba(6,78,59,0.16)] transition-all duration-300 hover:-translate-y-1 flex flex-col">
            <div className="relative h-48 overflow-hidden">
                <Image
                    src={
                        booking.image ||
                        "https://placehold.co/400x200/064E3B/white?text=Ticket"
                    }
                    alt={booking.title}
                    width={400}
                    height={200}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                <div className="absolute top-3 right-3">
                    <div
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border-l-4 text-xs font-black shadow-lg ${statusConfig.bg} ${statusConfig.border}`}
                    >
                        <StatusIcon className="text-xs" /> {statusConfig.label}
                    </div>
                </div>
                <div className="absolute top-3 left-3">
                    <div
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-black shadow-md ${getTransportColor(booking.transportType)}`}
                    >
                        <TransportIcon className="text-sm" />{" "}
                        <span>{booking.transportType}</span>
                    </div>
                </div>
                <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-lg font-black text-white drop-shadow-lg line-clamp-1 flex items-center gap-2">
                        <TransportIcon className="text-xl" /> {booking.title}
                    </h3>
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow gap-4">
                <div className="flex items-center justify-between bg-emerald-50 dark:bg-[#07111F] rounded-xl px-3 py-3 border border-emerald-100 dark:border-emerald-900/50">
                    <div className="text-center flex-1">
                        <p className="text-[9px] text-gray-500 dark:text-gray-400 uppercase font-black tracking-widest mb-1.5">
                            From
                        </p>
                        <p className="font-black text-[#064E3B] dark:text-white text-sm">
                            {booking.from}
                        </p>
                    </div>
                    <div className="flex flex-col items-center gap-1 flex-shrink-0 px-3">
                        <div className="w-8 h-[1px] bg-gray-300 dark:bg-gray-700" />
                        <FiMapPin className="text-emerald-600 dark:text-emerald-400 text-lg" />
                        <div className="w-8 h-[1px] bg-gray-300 dark:bg-gray-700" />
                    </div>
                    <div className="text-center flex-1">
                        <p className="text-[9px] text-gray-500 dark:text-gray-400 uppercase font-black tracking-widest mb-1.5">
                            To
                        </p>
                        <p className="font-black text-[#064E3B] dark:text-white text-sm">
                            {booking.to}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2.5 bg-orange-50 dark:bg-orange-950/20 rounded-xl px-3 py-3 border border-orange-100 dark:border-orange-900/30">
                    <FiCalendar className="text-orange-600 dark:text-orange-400 flex-shrink-0 text-base" />
                    <div className="flex items-center gap-2 flex-1 flex-wrap">
                        <span className="text-gray-700 dark:text-gray-300 font-bold text-sm">
                            {date}
                        </span>
                        <span className="text-gray-400 text-xs">at</span>
                        <span className="text-orange-700 dark:text-orange-300 font-black text-sm">
                            {time}
                        </span>
                    </div>
                </div>

                <CountdownTimer
                    departureDate={booking.departureDate}
                    status={booking.status}
                />

                <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/40 dark:to-green-950/40 rounded-xl px-4 py-4 border-2 border-emerald-200 dark:border-emerald-900 text-center mt-auto">
                    <p className="text-[9px] text-gray-600 dark:text-gray-400 font-black uppercase tracking-widest">
                        Total Amount
                    </p>
                    <p className="text-3xl font-black text-emerald-700 dark:text-emerald-400 mt-1.5">
                        ৳{booking.totalPrice}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1.5 font-semibold">
                        ৳{booking.unitPrice} × {booking.quantity} seats
                    </p>
                </div>

                <div className="pt-1">
                    {booking.status === "accepted" && (
                        <Button
                            variant="none"
                            onClick={() => !isPast && onPaymentClick(booking)}
                            disabled={isPast}
                            className={`w-full h-11 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all duration-300 ${isPast ? "bg-gray-200 dark:bg-gray-800 text-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-[#064E3B] via-emerald-600 to-green-500 hover:opacity-90 text-white shadow-lg shadow-emerald-600/25 active:scale-[0.98]"}`}
                        >
                            <FiCreditCard className="text-base" />{" "}
                            {isPast ? "Expired" : "Pay Now"}
                        </Button>
                    )}
                    {booking.status === "pending" && (
                        <Button
                            variant="none"
                            onClick={() => onCancelClick(bookingId)}
                            className="w-full h-11 rounded-xl font-black text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-800 hover:opacity-90 text-white shadow-lg shadow-red-500/25 transition-all duration-300 active:scale-[0.98]"
                        >
                            <FiTrash2 className="text-base" /> Cancel Booking
                        </Button>
                    )}
                    {booking.status === "paid" && (
                        <Button variant="none" className="w-full h-11 rounded-xl font-black text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white shadow-lg shadow-purple-500/25 transition-all duration-300 active:scale-[0.98]">
                            <FiDownload className="text-base" /> Download Ticket
                        </Button>
                    )}
                    {(booking.status === "rejected" ||
                        booking.status === "cancelled") && (
                        <div className="w-full h-11 rounded-xl font-black text-sm flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed">
                            <AiFillCloseCircle className="text-base" />{" "}
                            {booking.status === "rejected"
                                ? "Booking Rejected"
                                : "Booking Cancelled"}
                        </div>
                    )}
                </div>
            </div>
        </div>
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
}) => (
    <div
        className={`group relative overflow-hidden rounded-[24px] border ${borderClass} bg-gradient-to-br ${cardClass} p-5 shadow-[0_18px_50px_rgba(6,78,59,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_80px_rgba(6,78,59,0.16)]`}
    >
        <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-white/50 dark:bg-white/5" />
        <div className="relative z-10 flex items-center justify-between">
            <div>
                <p className={`text-3xl font-black sm:text-4xl ${numberClass}`}>
                    {value}
                </p>
                <p className="mt-1 text-sm font-bold text-gray-500 dark:text-gray-400">
                    {title}
                </p>
            </div>
            <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-xl transition-transform duration-300 group-hover:scale-110 ${iconClass}`}
            >
                <Icon className="text-2xl" />
            </div>
        </div>
    </div>
);

const CancelModal = ({ isOpen, onClose, onConfirm, isProcessing }) => {
    if (!isOpen) return null;
    return (
        <div
            className="fixed inset-0 z-[99990] flex items-center justify-center p-4"
            style={{ isolation: "isolate" }}
        >
            <div
                className="fixed inset-0 bg-black/70 backdrop-blur-md"
                onClick={!isProcessing ? onClose : undefined}
            />
            <div className="relative z-[99991] mx-auto w-full max-w-[calc(100vw-2rem)] rounded-[28px] border border-red-100/60 bg-white shadow-[0_-20px_60px_rgba(0,0,0,0.25)] sm:max-w-md sm:shadow-[0_30px_100px_rgba(220,38,38,0.35)] dark:border-red-900/40 dark:bg-[#0A1626]">
                <div className="relative flex flex-col items-center px-5 pb-7 pt-6 sm:px-7 sm:pb-7 sm:pt-7">
                    <Button
                        variant="none"
                        onClick={!isProcessing ? onClose : undefined}
                        className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-all hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                    >
                        <FiX className="text-base" />
                    </Button>
                    <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[24px] shadow-lg bg-red-50 text-red-500 dark:bg-red-950/50 dark:text-red-400">
                        <FiAlertTriangle className="text-3xl" />
                    </div>
                    <h3 className="mt-5 px-4 text-center text-lg font-black leading-snug text-gray-900 sm:text-xl dark:text-white">
                        Cancel this booking?
                    </h3>
                    <p className="mt-2.5 px-2 text-center text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                        Are you sure you want to cancel this booking? This
                        action{" "}
                        <span className="text-red-500 font-bold">
                            cannot be undone
                        </span>{" "}
                        and the seat will be released.
                    </p>
                    <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
                        <button
                            type="button"
                            disabled={isProcessing}
                            onClick={onClose}
                            className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-100 px-6 text-sm font-black text-gray-700 transition-all hover:bg-gray-200 active:scale-[0.98] disabled:opacity-50 sm:h-11 sm:w-auto sm:min-w-[120px] dark:border-gray-700/60 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                        >
                            Keep Booking
                        </button>
                        <button
                            type="button"
                            disabled={isProcessing}
                            onClick={onConfirm}
                            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl px-6 text-sm font-black text-white shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 sm:h-11 sm:w-auto sm:min-w-[160px] bg-gradient-to-r from-red-600 to-red-700 hover:opacity-90 shadow-red-600/30"
                        >
                            {isProcessing ? (
                                <span className="animate-spin">⏳</span>
                            ) : (
                                <FiTrash2 />
                            )}{" "}
                            {isProcessing ? "Cancelling..." : "Yes, Cancel"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PaymentModal = ({ payBooking, onClose, onConfirm, isProcessing }) => {
    if (!payBooking) return null;
    return (
        <div
            className="fixed inset-0 z-[99990] flex items-center justify-center p-4"
            style={{ isolation: "isolate" }}
        >
            <div
                className="fixed inset-0 bg-black/70 backdrop-blur-md"
                onClick={!isProcessing ? onClose : undefined}
            />
            <div className="relative z-[99991] mx-auto w-full max-w-[calc(100vw-2rem)] rounded-[28px] border border-emerald-100/60 bg-white shadow-[0_-20px_60px_rgba(0,0,0,0.25)] sm:max-w-md sm:shadow-[0_30px_100px_rgba(6,78,59,0.35)] dark:border-emerald-900/40 dark:bg-[#0A1626]">
                <div className="relative flex flex-col items-center px-5 pb-7 pt-6 sm:px-7 sm:pb-7 sm:pt-7">
                    <Button
                        variant="none"
                        onClick={!isProcessing ? onClose : undefined}
                        className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-all hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                    >
                        <FiX className="text-base" />
                    </Button>
                    <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[24px] shadow-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300">
                        <FiCreditCard className="text-3xl" />
                    </div>
                    <h3 className="mt-5 px-4 text-center text-lg font-black leading-snug text-gray-900 sm:text-xl dark:text-white">
                        Confirm Payment
                    </h3>
                    <p className="mt-2.5 px-2 text-center text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                        Review your booking details before proceeding.
                    </p>

                    <div className="w-full mt-5 bg-emerald-50 dark:bg-[#07111F] rounded-2xl p-4 border border-emerald-100 dark:border-emerald-900/50 space-y-2">
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
                        <div className="flex justify-between items-center py-2 mt-2 bg-gradient-to-r from-emerald-100 to-green-100 dark:from-emerald-950 dark:to-green-950 rounded-xl px-3 border-l-4 border-emerald-600">
                            <span className="text-lg font-black text-gray-900 dark:text-white">
                                Total:
                            </span>
                            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                                ৳{payBooking.totalPrice}
                            </span>
                        </div>
                    </div>

                    <div className="w-full mt-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl p-3 text-sm text-amber-800 dark:text-amber-300 font-bold flex items-center gap-2">
                        <FiAlertTriangle /> Demo Mode: Click to simulate payment
                    </div>

                    <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
                        <Button
                            variant="none"
                            type="button"
                            disabled={isProcessing}
                            onClick={onClose}
                            className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-100 px-6 text-sm font-black text-gray-700 transition-all hover:bg-gray-200 active:scale-[0.98] disabled:opacity-50 sm:h-11 sm:w-auto sm:min-w-[120px] dark:border-gray-700/60 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="none"
                            type="button"
                            disabled={isProcessing}
                            onClick={onConfirm}
                            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl px-6 text-sm font-black text-white shadow-lg transition-all active:scale-[0.98] disabled:opacity-70 sm:h-11 sm:w-auto sm:min-w-[160px] bg-gradient-to-r from-[#064E3B] via-emerald-600 to-green-500 hover:opacity-90 shadow-emerald-600/30"
                        >
                            {isProcessing ? (
                                <span className="animate-spin">⏳</span>
                            ) : (
                                <FiCreditCard />
                            )}{" "}
                            {isProcessing
                                ? "Processing..."
                                : `Pay ৳${payBooking.totalPrice}`}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
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
            
            const data = await cancelBooking(cancelBookingId)
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

    const handlePayConfirm = async () => {
        if (!payBooking) return;
        const id = getPlainId(payBooking._id);
        setIsProcessing(true);
        try {
            const res = await fetch(`/api/bookings/${id}/paid`, {
                method: "PATCH",
            });
            const data = await res.json();
            if (data.success) {
                await fetch("/api/transactions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userId: user.id,
                        bookingId: id,
                        transactionId: `TXN-${Date.now()}`,
                        amount: payBooking.totalPrice,
                        ticketTitle: payBooking.title,
                    }),
                });
                setBookings((prev) =>
                    prev.map((b) =>
                        getPlainId(b._id) === id
                            ? { ...b, status: "paid", isPaid: true }
                            : b,
                    ),
                );
                toast.success("Payment successful! Ticket confirmed. 🎉");
                setPayBooking(null);
            } else {
                toast.error(data.message || "Payment failed");
            }
        } catch {
            toast.error("Network error. Please try again.");
        } finally {
            setIsProcessing(false);
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

            <div className="min-h-screen rounded-[28px] bg-[#F0FDF4] p-4 sm:p-6 lg:p-7 dark:bg-[#06130D]">
                <div className="flex flex-col gap-6 sm:gap-7">
                    <div className="relative hidden md:inline-block overflow-hidden rounded-[26px] bg-gradient-to-r from-[#052E16] via-[#16A34A] to-[#34D399] p-5 shadow-[0_24px_70px_rgba(22,163,74,0.28)] sm:rounded-[30px] sm:p-6 lg:p-8">
                        <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/15 blur-3xl" />
                        <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-lime-300/30 blur-3xl" />
                        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-xs font-bold text-white backdrop-blur-md">
                                    <FaTicketAlt /> Ticketix User Dashboard
                                </div>
                                <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
                                    My Booked Tickets
                                </h1>
                                <p className="mt-3 max-w-2xl text-sm leading-6 text-green-50">
                                    Manage, track and pay for all your travel
                                    bookings in one place.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-3 rounded-2xl border border-white/20 bg-white/15 p-3 backdrop-blur-xl sm:min-w-[280px]">
                                <div className="rounded-2xl bg-white/95 p-4 text-center shadow-lg dark:bg-[#07111F]/90">
                                    <p className="text-2xl font-black text-emerald-600">
                                        {filtered.length}
                                    </p>
                                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                                        Showing
                                    </p>
                                </div>
                                <div className="rounded-2xl bg-white/95 p-4 text-center shadow-lg dark:bg-[#07111F]/90">
                                    <p className="text-2xl font-black text-lime-600">
                                        {bookings.length}
                                    </p>
                                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                                        Total
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 xl:grid-cols-5">
                        <StatCard
                            title="Total"
                            value={counts.all}
                            Icon={BsFillTicketDetailedFill}
                            numberClass="text-emerald-600"
                            iconClass="bg-gradient-to-br from-emerald-600 to-green-400"
                            cardClass="from-emerald-50 via-white to-green-50 dark:from-emerald-950/50 dark:via-[#07111F] dark:to-green-950/30"
                            borderClass="border-emerald-100 dark:border-emerald-900/50"
                        />
                        <StatCard
                            title="Pending"
                            value={counts.pending}
                            Icon={FiClock}
                            numberClass="text-amber-600"
                            iconClass="bg-gradient-to-br from-amber-500 to-orange-500"
                            cardClass="from-amber-50 via-white to-orange-50 dark:from-amber-950/50 dark:via-[#07111F] dark:to-orange-950/30"
                            borderClass="border-amber-100 dark:border-amber-900/50"
                        />
                        <StatCard
                            title="Accepted"
                            value={counts.accepted}
                            Icon={FiCheckCircle}
                            numberClass="text-blue-600"
                            iconClass="bg-gradient-to-br from-blue-600 to-indigo-500"
                            cardClass="from-blue-50 via-white to-indigo-50 dark:from-blue-950/50 dark:via-[#07111F] dark:to-indigo-950/30"
                            borderClass="border-blue-100 dark:border-blue-900/50"
                        />
                        <StatCard
                            title="Paid"
                            value={counts.paid}
                            Icon={FiCreditCard}
                            numberClass="text-green-700"
                            iconClass="bg-gradient-to-br from-green-700 to-emerald-500"
                            cardClass="from-green-50 via-white to-emerald-50 dark:from-green-950/50 dark:via-[#07111F] dark:to-green-950/30"
                            borderClass="border-green-100 dark:border-green-900/50"
                        />
                        <StatCard
                            title="Rejected"
                            value={counts.rejected}
                            Icon={FiXCircle}
                            numberClass="text-red-600"
                            iconClass="bg-gradient-to-br from-red-600 to-red-800"
                            cardClass="from-red-50 via-white to-orange-50 dark:from-red-950/50 dark:via-[#07111F] dark:to-orange-950/30"
                            borderClass="border-red-100 dark:border-red-900/50"
                        />
                    </div>

                    <div className="flex flex-wrap gap-3 justify-center">
                        {filters.map((f) => {
                            const Icon = f.icon;
                            const isActive = filter === f.key;
                            return (
                                <Button variant="none"
                                    key={f.key}
                                    onClick={() => setFilter(f.key)}
                                    className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${isActive ? `${colorMap[f.color]} text-white shadow-lg scale-105` : "bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50 dark:bg-[#0A1626] dark:text-gray-300 dark:border-emerald-900/50 dark:hover:bg-[#07111F]"}`}
                                >
                                    <Icon className="text-base" /> {f.label}
                                    <span
                                        className={`text-xs px-2 py-0.5 rounded-full font-black ${isActive ? "bg-black/20" : "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400"}`}
                                    >
                                        {counts[f.key] || 0}
                                    </span>
                                </Button>
                            );
                        })}
                    </div>

                    {filtered.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:gap-7 md:grid-cols-2 lg:grid-cols-3 xl:gap-8">
                            {filtered.map((b) => (
                                <BookingCard
                                    key={getPlainId(b._id)}
                                    booking={b}
                                    onCancelClick={setCancelBookingId}
                                    onPaymentClick={setPayBooking}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white dark:bg-[#0A1626] rounded-[28px] border border-emerald-100 dark:border-emerald-900/50 shadow-[0_18px_50px_rgba(6,78,59,0.08)]">
                            <div className="text-7xl mb-4">🎫</div>
                            <h3 className="text-2xl font-black text-[#064E3B] dark:text-white mb-2">
                                No Bookings Found
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
                                You don&apos;t have any{" "}
                                {filter !== "all" ? `"${filter}"` : ""} bookings
                                at the moment.
                            </p>
                            <Link href="/all-tickets">
                                <Button variant="none" className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl font-black text-sm bg-gradient-to-r from-[#064E3B] via-emerald-600 to-green-500 hover:opacity-90 text-white shadow-lg shadow-emerald-600/25 transition-all duration-300 hover:scale-105 active:scale-95">
                                    <FiMapPin /> Browse Tickets
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <CancelModal
                isOpen={!!cancelBookingId}
                onClose={() => setCancelBookingId(null)}
                onConfirm={handleCancelConfirm}
                isProcessing={isProcessing}
            />
            <PaymentModal
                payBooking={payBooking}
                onClose={() => setPayBooking(null)}
                onConfirm={handlePayConfirm}
                isProcessing={isProcessing}
            />
        </>
    );
};

export default MyBookedTicketsClient;