"use client";

import React, { useEffect, useMemo, useState, useId } from "react";
import { Button, Table } from "@heroui/react";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FaTicketAlt } from "react-icons/fa";
import { BiSearch } from "react-icons/bi";
import {
    FiRefreshCw,
    FiCheckCircle,
    FiXCircle,
    FiClock,
    FiAlertTriangle,
    FiX,
    FiMail,
    FiMapPin,
    FiCalendar,
    FiPackage,
    FiCreditCard,
    FiChevronDown,
} from "react-icons/fi";
import {
    AiFillClockCircle,
    AiFillCloseCircle,
    AiFillCheckCircle,
} from "react-icons/ai";
import { createPortal } from "react-dom";
import { acceptBooking, rejectBooking } from "@/lib/actions/booking";

const getPlainId = (id) => {
    if (!id) return "";
    if (typeof id === "string") return id;
    if (typeof id === "number") return String(id);
    if (typeof id === "object") {
        if (id.$oid) return String(id.$oid);
        if (typeof id.toHexString === "function") return id.toHexString();
    }
    return "";
};

const normalizeImageUrl = (url) => {
    if (!url || typeof url !== "string") return "";
    const value = url.trim();
    if (!value) return "";
    if (value.startsWith("data:image/")) return value;
    if (value.startsWith("//")) return `https:${value}`;
    if (value.startsWith("/")) return value;
    try {
        const parsed = new URL(value);
        if (parsed.protocol === "http:" || parsed.protocol === "https:")
            return parsed.href;
        return "";
    } catch {
        return "";
    }
};

const getInitials = (name = "") => {
    const words = name.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return "U";
    return words
        .slice(0, 2)
        .map((w) => w.charAt(0).toUpperCase())
        .join("");
};

const formatDate = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const formatDateTime = (date) => {
    if (!date) return "N/A";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const getStatusConfig = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "accepted")
        return {
            label: "Accepted",
            icon: AiFillCheckCircle,
            bg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
            border: "border-emerald-400",
        };
    if (s === "rejected")
        return {
            label: "Rejected",
            icon: AiFillCloseCircle,
            bg: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
            border: "border-red-400",
        };
    if (s === "paid")
        return {
            label: "Paid",
            icon: AiFillCheckCircle,
            bg: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
            border: "border-blue-400",
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
        icon: AiFillClockCircle,
        bg: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
        border: "border-amber-400",
    };
};

const AVATAR_COLORS = [
    "from-violet-600 to-purple-500",
    "from-blue-600 to-cyan-500",
    "from-emerald-600 to-teal-500",
    "from-orange-500 to-amber-400",
    "from-rose-600 to-pink-500",
    "from-indigo-600 to-blue-500",
    "from-green-600 to-lime-500",
    "from-red-600 to-orange-500",
];

const getAvatarColor = (name = "") => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
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
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 90, damping: 14 },
    },
    exit: {
        opacity: 0,
        scale: 0.9,
        y: -15,
        transition: { duration: 0.2 },
    },
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
    exit: {
        opacity: 0,
        scale: 0.9,
        y: 20,
        transition: { duration: 0.2 },
    },
};

const UserAvatar = ({ src, name, className = "" }) => {
    const [imageError, setImageError] = useState(false);
    const imageSrc = normalizeImageUrl(src);
    const colorClass = getAvatarColor(name);

    useEffect(() => {
        setImageError(false);
    }, [imageSrc]);

    return (
        <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br ${colorClass} ${className}`}
        >
            {imageSrc && !imageError ? (
                <img
                    src={imageSrc}
                    alt={name || "User"}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                    onError={() => setImageError(true)}
                />
            ) : (
                <span className="text-sm font-black text-white drop-shadow">
                    {getInitials(name)}
                </span>
            )}
        </motion.div>
    );
};

const ConfirmActionDialog = ({
    isOpen,
    onClose,
    onConfirm,
    isProcessing,
    type,
    bookingTitle,
    userName,
}) => {
    const titleId = useId();
    const descriptionId = useId();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const esc = (e) => {
            if (e.key === "Escape" && !isProcessing) onClose();
        };
        document.addEventListener("keydown", esc);
        return () => {
            document.body.style.overflow = prev;
            document.removeEventListener("keydown", esc);
        };
    }, [isOpen, isProcessing, onClose]);

    if (!mounted) return null;

    const isAccept = type === "accept";

    const modalContent = (
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
                        aria-hidden="true"
                    />
                    <motion.div
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby={titleId}
                        aria-describedby={descriptionId}
                        className={`relative z-[99991] mx-auto w-full max-w-[calc(100vw-2rem)] rounded-[28px] border bg-white shadow-[0_-20px_60px_rgba(0,0,0,0.25)] sm:max-w-md dark:bg-[#0A1626] ${
                            isAccept
                                ? "border-emerald-100/60 sm:shadow-[0_30px_100px_rgba(6,78,59,0.35)] dark:border-emerald-900/40"
                                : "border-red-100/60 sm:shadow-[0_30px_100px_rgba(220,38,38,0.35)] dark:border-red-900/40"
                        }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative flex flex-col items-center px-5 pb-7 pt-6 sm:px-7 sm:pb-7 sm:pt-7">
                            <button
                                type="button"
                                onClick={!isProcessing ? onClose : undefined}
                                disabled={isProcessing}
                                aria-label="Close"
                                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-all hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 disabled:opacity-50"
                            >
                                <FiX className="text-base" />
                            </button>

                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{
                                    delay: 0.1,
                                    type: "spring",
                                    stiffness: 200,
                                }}
                                className={`flex h-[72px] w-[72px] items-center justify-center rounded-[24px] shadow-lg ${
                                    isAccept
                                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300"
                                        : "bg-red-50 text-red-500 dark:bg-red-950/50 dark:text-red-400"
                                }`}
                            >
                                <motion.div
                                    animate={
                                        isAccept
                                            ? { scale: [1, 1.15, 1] }
                                            : { rotate: [0, -10, 10, -10, 0] }
                                    }
                                    transition={{
                                        duration: isAccept ? 1.5 : 0.6,
                                        delay: 0.4,
                                        repeat: Infinity,
                                        repeatDelay: 2,
                                    }}
                                >
                                    {isAccept ? (
                                        <FiCheckCircle className="text-3xl" />
                                    ) : (
                                        <FiAlertTriangle className="text-3xl" />
                                    )}
                                </motion.div>
                            </motion.div>

                            <motion.h3
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                id={titleId}
                                className="mt-5 px-4 text-center text-lg font-black leading-snug text-gray-900 sm:text-xl dark:text-white"
                            >
                                {isAccept
                                    ? "Accept this booking?"
                                    : "Reject this booking?"}
                            </motion.h3>

                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 }}
                                id={descriptionId}
                                className="mt-2.5 px-2 text-center text-sm leading-relaxed text-gray-500 dark:text-gray-400"
                            >
                                {isAccept ? (
                                    <>
                                        You are about to{" "}
                                        <span className="font-bold text-emerald-600">
                                            accept
                                        </span>{" "}
                                        the booking request from{" "}
                                        <span className="font-bold text-gray-700 dark:text-gray-300">
                                            {userName}
                                        </span>{" "}
                                        for{" "}
                                        <span className="font-bold text-gray-700 dark:text-gray-300">
                                            {bookingTitle}
                                        </span>
                                        . The user will be notified to proceed
                                        with payment.
                                    </>
                                ) : (
                                    <>
                                        You are about to{" "}
                                        <span className="font-bold text-red-600">
                                            reject
                                        </span>{" "}
                                        the booking request from{" "}
                                        <span className="font-bold text-gray-700 dark:text-gray-300">
                                            {userName}
                                        </span>{" "}
                                        for{" "}
                                        <span className="font-bold text-gray-700 dark:text-gray-300">
                                            {bookingTitle}
                                        </span>
                                        . This action{" "}
                                        <span className="font-bold text-red-500">
                                            cannot be undone
                                        </span>
                                        .
                                    </>
                                )}
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
                                    Keep Pending
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    type="button"
                                    disabled={isProcessing}
                                    onClick={onConfirm}
                                    className={`inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl px-6 text-sm font-black text-white shadow-lg transition-colors disabled:opacity-70 sm:h-11 sm:w-auto sm:min-w-[160px] ${
                                        isAccept
                                            ? "bg-gradient-to-r from-[#064E3B] via-emerald-600 to-green-500 hover:opacity-90 shadow-emerald-600/30"
                                            : "bg-gradient-to-r from-red-600 to-red-700 hover:opacity-90 shadow-red-600/30"
                                    }`}
                                >
                                    {isProcessing ? (
                                        <>
                                            <motion.svg
                                                animate={{ rotate: 360 }}
                                                transition={{
                                                    duration: 1,
                                                    repeat: Infinity,
                                                    ease: "linear",
                                                }}
                                                className="h-4 w-4"
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
                                            </motion.svg>
                                            {isAccept
                                                ? "Accepting..."
                                                : "Rejecting..."}
                                        </>
                                    ) : (
                                        <>
                                            {isAccept ? (
                                                <FiCheckCircle />
                                            ) : (
                                                <FiAlertTriangle />
                                            )}
                                            {isAccept
                                                ? "Yes, Accept"
                                                : "Yes, Reject"}
                                        </>
                                    )}
                                </motion.button>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return typeof document !== "undefined"
        ? createPortal(modalContent, document.body)
        : null;
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
        className={`group relative overflow-hidden rounded-[24px] border ${borderClass} bg-gradient-to-br ${cardClass} p-5 shadow-[0_18px_50px_rgba(6,78,59,0.08)] hover:shadow-[0_26px_80px_rgba(6,78,59,0.16)] sm:rounded-[26px]`}
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
                className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-xl sm:h-14 sm:w-14 ${iconClass}`}
            >
                <Icon className="text-2xl" />
            </motion.div>
        </div>
    </motion.div>
);

const BookingRequestsClient = ({ initialBookings, vendorId }) => {
    const [bookings, setBookings] = useState(
        Array.isArray(initialBookings) ? initialBookings : [],
    );
    const [search, setSearch] = useState("");
    const [titleFilter, setTitleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        type: null,
        bookingId: null,
        bookingTitle: "",
        userName: "",
    });
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (Array.isArray(initialBookings)) {
            setBookings(initialBookings);
        }
    }, [initialBookings]);

    const getBookingId = (b) => getPlainId(b?._id || b?.id);

    const getUserName = (b) =>
        b?.user?.name ||
        b?.userName ||
        b?.userEmail?.split("@")?.[0] ||
        "Unknown User";

    const getUserEmail = (b) => b?.user?.email || b?.userEmail || "N/A";

    const getUserAvatar = (b) =>
        normalizeImageUrl(
            b?.userImage ||
                b?.user?.image ||
                b?.user?.photoURL ||
                b?.userAvatar ||
                "",
        );

    const uniqueTitles = useMemo(() => {
        const titles = new Set();
        bookings.forEach((b) => {
            if (b?.title) titles.add(b.title);
        });
        return Array.from(titles).sort();
    }, [bookings]);

    const counts = useMemo(() => {
        const c = {
            all: bookings.length,
            pending: 0,
            accepted: 0,
            rejected: 0,
            paid: 0,
            cancelled: 0,
        };
        bookings.forEach((b) => {
            const s = String(b?.status || "pending").toLowerCase();
            if (c[s] !== undefined) c[s]++;
        });
        return c;
    }, [bookings]);

    const filteredBookings = useMemo(() => {
        const query = search.trim().toLowerCase();
        return bookings.filter((b) => {
            const title = String(b?.title || "").toLowerCase();
            const userName = getUserName(b).toLowerCase();
            const userEmail = getUserEmail(b).toLowerCase();
            const status = String(b?.status || "pending").toLowerCase();

            const matchSearch =
                !query ||
                title.includes(query) ||
                userName.includes(query) ||
                userEmail.includes(query);

            const matchStatus =
                statusFilter === "all" || status === statusFilter;

            const matchTitle =
                titleFilter === "all" || title === titleFilter.toLowerCase();

            return matchSearch && matchStatus && matchTitle;
        });
    }, [bookings, search, titleFilter, statusFilter]);

    const openConfirmModal = (type, booking) => {
        setConfirmModal({
            isOpen: true,
            type,
            bookingId: getBookingId(booking),
            bookingTitle: booking?.title || "Untitled",
            userName: getUserName(booking),
        });
    };

    const closeConfirmModal = () => {
        if (isProcessing) return;
        setConfirmModal({
            isOpen: false,
            type: null,
            bookingId: null,
            bookingTitle: "",
            userName: "",
        });
    };

    const updateBookingStatus = async (bookingId, type) => {
        if (type === "accept") {
            return await acceptBooking(bookingId);
        } else if (type === "reject") {
            return await rejectBooking(bookingId);
        }
        return { success: false, message: "Invalid action type" };
    };

    const handleConfirmAction = async () => {
        const { bookingId, type } = confirmModal;
        if (!bookingId || !type) return;

        setIsProcessing(true);

        try {
            const result = await updateBookingStatus(bookingId, type);

            if (result?.success) {
                const newStatus = type === "accept" ? "accepted" : "rejected";

                setBookings((prev) =>
                    prev.map((b) =>
                        getBookingId(b) === bookingId
                            ? { ...b, status: newStatus }
                            : b,
                    ),
                );

                toast.success(
                    type === "accept"
                        ? "✅ Booking accepted! User can now proceed to payment."
                        : "❌ Booking rejected successfully.",
                );

                setConfirmModal({
                    isOpen: false,
                    type: null,
                    bookingId: null,
                    bookingTitle: "",
                    userName: "",
                });
            } else {
                toast.error(
                    result?.message || "Action failed. Please try again.",
                );
            }
        } catch (error) {
            toast.error("Network error. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };

    const filters = [
        { key: "all", label: "All", color: "blue" },
        { key: "pending", label: "Pending", color: "amber" },
        { key: "accepted", label: "Accepted", color: "emerald" },
        { key: "rejected", label: "Rejected", color: "red" },
        { key: "paid", label: "Paid", color: "blue" },
        { key: "cancelled", label: "Cancelled", color: "gray" },
    ];

    const filterColorMap = {
        blue: "bg-gradient-to-r from-blue-500 to-blue-600",
        amber: "bg-gradient-to-r from-amber-500 to-amber-600",
        emerald: "bg-gradient-to-r from-[#064E3B] via-emerald-600 to-green-500",
        red: "bg-gradient-to-r from-red-500 to-red-600",
        gray: "bg-gradient-to-r from-gray-500 to-gray-600",
    };

    const renderActionButtons = (booking, mode = "table") => {
        const status = String(booking?.status || "pending").toLowerCase();
        const isMobile = mode === "mobile";

        if (status !== "pending") {
            const cfg = getStatusConfig(status);
            const Icon = cfg.icon;
            return (
                <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-black ${cfg.bg}`}
                >
                    <Icon className="text-sm" /> {cfg.label}
                </motion.span>
            );
        }

        return (
            <div
                className={`flex gap-2 ${isMobile ? "w-full flex-col sm:flex-row" : "flex-row"}`}
            >
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={isMobile ? "w-full" : ""}
                >
                    <Button
                        variant="none"
                        onClick={() => openConfirmModal("accept", booking)}
                        className={`inline-flex items-center justify-center gap-1.5 rounded-xl font-black text-white shadow-lg shadow-emerald-500/25 transition-all hover:opacity-90 bg-gradient-to-r from-[#064E3B] via-emerald-600 to-green-500 ${
                            isMobile
                                ? "h-11 w-full text-sm"
                                : "h-9 px-4 text-xs"
                        }`}
                    >
                        <FiCheckCircle className="text-sm" /> Accept
                    </Button>
                </motion.div>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={isMobile ? "w-full" : ""}
                >
                    <Button
                        variant="none"
                        onClick={() => openConfirmModal("reject", booking)}
                        className={`inline-flex items-center justify-center gap-1.5 rounded-xl font-black text-white shadow-lg shadow-red-500/25 transition-all hover:opacity-90 bg-gradient-to-r from-red-600 to-red-800 ${
                            isMobile
                                ? "h-11 w-full text-sm"
                                : "h-9 px-4 text-xs"
                        }`}
                    >
                        <FiXCircle className="text-sm" /> Reject
                    </Button>
                </motion.div>
            </div>
        );
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
                className="min-h-screen rounded-[28px] bg-[#F0FDF4] p-3 sm:p-5 lg:p-6 dark:bg-[#06130D]"
            >
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-5 sm:space-y-7"
                >
                    <motion.div
                        variants={itemVariants}
                        className="relative hidden md:block overflow-hidden rounded-[26px] bg-gradient-to-r from-[#052E16] via-[#16A34A] to-[#34D399] p-5 shadow-[0_24px_70px_rgba(22,163,74,0.28)] sm:rounded-[30px] sm:p-6 lg:p-8"
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
                                
                                <motion.h1
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl"
                                >
                                    Booking Requests
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="mt-3 max-w-2xl text-sm leading-6 text-green-50"
                                >
                                    Review and manage all ticket booking
                                    requests from users. Accept to allow
                                    payment, or reject to decline the request.
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
                                        {filteredBookings.length}
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
                            Icon={FaTicketAlt}
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
                            numberClass="text-green-700"
                            iconClass="bg-gradient-to-br from-green-700 to-emerald-500"
                            cardClass="from-green-50 via-white to-emerald-50 dark:from-green-950/50 dark:via-[#07111F] dark:to-green-950/30"
                            borderClass="border-green-100 dark:border-green-900/50"
                        />
                        <StatCard
                            index={3}
                            title="Rejected"
                            value={counts.rejected}
                            Icon={FiXCircle}
                            numberClass="text-red-600"
                            iconClass="bg-gradient-to-br from-red-600 to-red-800"
                            cardClass="from-red-50 via-white to-orange-50 dark:from-red-950/50 dark:via-[#07111F] dark:to-orange-950/30"
                            borderClass="border-red-100 dark:border-red-900/50"
                        />
                        <StatCard
                            index={4}
                            title="Paid"
                            value={counts.paid}
                            Icon={FiCreditCard}
                            numberClass="text-blue-600"
                            iconClass="bg-gradient-to-br from-blue-600 to-indigo-500"
                            cardClass="from-blue-50 via-white to-indigo-50 dark:from-blue-950/50 dark:via-[#07111F] dark:to-indigo-950/30"
                            borderClass="border-blue-100 dark:border-blue-900/50"
                        />
                    </motion.div>

                    <motion.div
                        variants={itemVariants}
                        className="overflow-hidden rounded-[26px] border border-emerald-100 bg-white shadow-[0_25px_80px_rgba(6,78,59,0.1)] sm:rounded-[30px] dark:border-emerald-900/50 dark:bg-[#07111F]"
                    >
                        <div className="border-b border-emerald-100 bg-gradient-to-r from-white via-emerald-50/60 to-green-50 p-4 sm:p-5 dark:border-emerald-900/50 dark:from-[#07111F] dark:via-[#052E16] dark:to-[#064E3B]">
                            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <h2 className="text-lg font-black text-[#064E3B] sm:text-xl dark:text-white">
                                        Booking Requests Directory
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        Accept or reject pending booking
                                        requests from users.
                                    </p>
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="grid w-full grid-cols-1 gap-3 sm:grid-cols-[1fr_180px_120px] xl:w-auto xl:grid-cols-[320px_180px_120px]"
                                >
                                    <div className="relative">
                                        <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-emerald-600 dark:text-emerald-300" />
                                        <input
                                            type="text"
                                            placeholder="Search user, email, ticket..."
                                            value={search}
                                            onChange={(e) =>
                                                setSearch(e.target.value)
                                            }
                                            className="h-11 w-full rounded-2xl border border-emerald-200/90 bg-white/95 pl-10 pr-4 text-sm font-semibold text-[#052E16] caret-emerald-600 outline-none transition placeholder:text-emerald-600/55 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 dark:border-emerald-800/70 dark:bg-[#081C13] dark:text-emerald-50"
                                        />
                                    </div>
                                    <div className="relative">
                                        <select
                                            value={titleFilter}
                                            onChange={(e) =>
                                                setTitleFilter(e.target.value)
                                            }
                                            className="h-11 w-full appearance-none rounded-2xl border border-emerald-200/90 bg-white/95 pl-4 pr-9 text-sm font-bold text-[#052E16] outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 dark:border-emerald-800/70 dark:bg-[#081C13] dark:text-emerald-50"
                                        >
                                            <option value="all">
                                                All Tickets
                                            </option>
                                            {uniqueTitles.map((title) => (
                                                <option
                                                    key={title}
                                                    value={title.toLowerCase()}
                                                >
                                                    {title}
                                                </option>
                                            ))}
                                        </select>
                                        <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-emerald-600 dark:text-emerald-300" />
                                    </div>
                                    <motion.div
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                    >
                                        <Button
                                            variant="none"
                                            onClick={() => {
                                                setSearch("");
                                                setTitleFilter("all");
                                                setStatusFilter("all");
                                            }}
                                            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#064E3B] via-emerald-600 to-green-500 px-4 font-black text-white shadow-lg shadow-emerald-700/25 transition hover:opacity-90"
                                        >
                                            <motion.div>
                                                <FiRefreshCw />
                                            </motion.div>
                                            Reset
                                        </Button>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-wrap gap-3 justify-center px-4 pb-4 pt-4 sm:px-5"
                        >
                            {filters.map((f, idx) => {
                                const isActive = statusFilter === f.key;
                                return (
                                    <motion.div
                                        key={f.key}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.05 * idx + 0.5 }}
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Button
                                            variant="none"
                                            onClick={() =>
                                                setStatusFilter(f.key)
                                            }
                                            className={`px-4 py-2 rounded-full font-bold text-xs transition-all flex items-center gap-1.5 ${
                                                isActive
                                                    ? `${filterColorMap[f.color]} text-white shadow-lg scale-105`
                                                    : "bg-white text-gray-700 border-2 border-gray-200 hover:bg-gray-50 dark:bg-[#0A1626] dark:text-gray-300 dark:border-emerald-900/50 dark:hover:bg-[#07111F]"
                                            }`}
                                        >
                                            {f.label}
                                            <span
                                                className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                                                    isActive
                                                        ? "bg-black/20"
                                                        : "bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                                                }`}
                                            >
                                                {counts[f.key] || 0}
                                            </span>
                                        </Button>
                                    </motion.div>
                                );
                            })}
                        </motion.div>

                        <div className="block bg-gradient-to-br from-[#ECFDF5] via-[#F8FFF9] to-[#F7FEE7] p-4 lg:hidden dark:from-[#04130B] dark:via-[#071A12] dark:to-[#102A0D]">
                            <AnimatePresence mode="wait">
                                {filteredBookings.length === 0 ? (
                                    <motion.div
                                        key="empty-mobile"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="flex items-center gap-3 rounded-3xl border border-emerald-100 bg-emerald-50/60 p-5 dark:border-emerald-900/50 dark:bg-emerald-950/20"
                                    >
                                        <motion.div
                                            animate={{
                                                rotate: [0, -10, 10, 0],
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                            }}
                                            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-600 dark:bg-[#06130D]"
                                        >
                                            <BiSearch className="text-2xl" />
                                        </motion.div>
                                        <div>
                                            <p className="font-bold text-[#064E3B] dark:text-white">
                                                No booking requests found
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Try changing search or filter
                                                options.
                                            </p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key={`mobile-${statusFilter}`}
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="grid grid-cols-1 gap-4 md:grid-cols-2"
                                    >
                                        <AnimatePresence mode="popLayout">
                                            {filteredBookings.map(
                                                (booking, index) => {
                                                    const bid =
                                                        getBookingId(booking);
                                                    const userName =
                                                        getUserName(booking);
                                                    const userEmail =
                                                        getUserEmail(booking);
                                                    const userAvatar =
                                                        getUserAvatar(booking);
                                                    const statusCfg =
                                                        getStatusConfig(
                                                            booking?.status,
                                                        );
                                                    const StatusIcon =
                                                        statusCfg.icon;
                                                    const totalPrice =
                                                        booking?.totalPrice ||
                                                        (booking?.unitPrice ||
                                                            booking?.price ||
                                                            0) *
                                                            (booking?.quantity ||
                                                                1);

                                                    return (
                                                        <motion.div
                                                            layout
                                                            key={
                                                                bid ||
                                                                `m-booking-${index}`
                                                            }
                                                            variants={
                                                                cardVariants
                                                            }
                                                            initial="hidden"
                                                            animate="visible"
                                                            exit="exit"
                                                            whileHover={{
                                                                y: -4,
                                                                transition: {
                                                                    duration: 0.2,
                                                                },
                                                            }}
                                                            className="relative overflow-hidden rounded-[28px] border border-emerald-200/80 bg-gradient-to-br from-white via-[#F0FDF4] to-[#ECFCCB] p-4 shadow-[0_18px_55px_rgba(6,78,59,0.13)] dark:border-emerald-800/70 dark:from-[#06130D] dark:via-[#082016] dark:to-[#142C10]"
                                                        >
                                                            <motion.div
                                                                animate={{
                                                                    scale: [
                                                                        1, 1.2,
                                                                        1,
                                                                    ],
                                                                    opacity: [
                                                                        0.2,
                                                                        0.3,
                                                                        0.2,
                                                                    ],
                                                                }}
                                                                transition={{
                                                                    duration: 4,
                                                                    repeat: Infinity,
                                                                    delay:
                                                                        index *
                                                                        0.2,
                                                                }}
                                                                className="absolute -right-14 -top-14 h-32 w-32 rounded-full bg-emerald-400/20 blur-2xl"
                                                            />

                                                            <div className="relative z-10 flex items-start justify-between gap-3">
                                                                <div className="flex min-w-0 items-center gap-3">
                                                                    <UserAvatar
                                                                        src={
                                                                            userAvatar
                                                                        }
                                                                        name={
                                                                            userName
                                                                        }
                                                                        className="border-2 border-white shadow-md ring-2 ring-emerald-100 dark:border-[#07111F] dark:ring-emerald-900/50"
                                                                    />
                                                                    <div className="min-w-0">
                                                                        <p className="truncate font-black text-[#064E3B] dark:text-white">
                                                                            {
                                                                                userName
                                                                            }
                                                                        </p>
                                                                        <p className="truncate text-xs font-semibold text-gray-400">
                                                                            {
                                                                                userEmail
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                                <span
                                                                    className={`shrink-0 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-black ${statusCfg.bg}`}
                                                                >
                                                                    <StatusIcon className="text-xs" />
                                                                    {
                                                                        statusCfg.label
                                                                    }
                                                                </span>
                                                            </div>

                                                            <div className="relative z-10 mt-4 grid grid-cols-2 gap-3 rounded-2xl border border-emerald-100/80 bg-white/85 p-4 text-sm shadow-inner backdrop-blur dark:border-emerald-900/60 dark:bg-[#04130B]/75">
                                                                <div className="col-span-2">
                                                                    <p className="mb-1 text-xs font-black uppercase text-emerald-700 dark:text-emerald-300">
                                                                        Ticket
                                                                    </p>
                                                                    <p className="truncate font-black text-[#064E3B] dark:text-white">
                                                                        {booking?.title ||
                                                                            "N/A"}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className="mb-1 text-xs font-black uppercase text-emerald-700 dark:text-emerald-300">
                                                                        Route
                                                                    </p>
                                                                    <div className="flex items-center gap-1 font-semibold text-gray-600 dark:text-gray-300">
                                                                        <FiMapPin className="shrink-0 text-emerald-600 text-xs" />
                                                                        <span className="truncate text-xs">
                                                                            {booking?.from ||
                                                                                "N/A"}{" "}
                                                                            →{" "}
                                                                            {booking?.to ||
                                                                                "N/A"}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <p className="mb-1 text-xs font-black uppercase text-emerald-700 dark:text-emerald-300">
                                                                        Quantity
                                                                    </p>
                                                                    <div className="flex items-center gap-1 font-semibold text-gray-600 dark:text-gray-300">
                                                                        <FiPackage className="text-lime-600 text-xs" />
                                                                        <span className="text-xs">
                                                                            {booking?.quantity ||
                                                                                1}{" "}
                                                                            seats
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <p className="mb-1 text-xs font-black uppercase text-emerald-700 dark:text-emerald-300">
                                                                        Total
                                                                        Price
                                                                    </p>
                                                                    <p className="font-black text-emerald-700 dark:text-emerald-300">
                                                                        ৳
                                                                        {
                                                                            totalPrice
                                                                        }
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className="mb-1 text-xs font-black uppercase text-emerald-700 dark:text-emerald-300">
                                                                        Booked
                                                                        At
                                                                    </p>
                                                                    <div className="flex items-center gap-1 font-semibold text-gray-600 dark:text-gray-300">
                                                                        <FiCalendar className="text-lime-600 text-xs" />
                                                                        <span className="text-xs">
                                                                            {formatDate(
                                                                                booking?.createdAt,
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="relative z-10 mt-4 border-t border-emerald-100 pt-4 dark:border-emerald-900/50">
                                                                {renderActionButtons(
                                                                    booking,
                                                                    "mobile",
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    );
                                                },
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="hidden lg:block">
                            <Table>
                                <Table.ScrollContainer>
                                    <Table.Content
                                        aria-label="Booking requests table"
                                        className="min-w-[1000px]"
                                    >
                                        <Table.Header>
                                            <Table.Column isRowHeader>
                                                User
                                            </Table.Column>
                                            <Table.Column>Email</Table.Column>
                                            <Table.Column>Ticket</Table.Column>
                                            <Table.Column>Route</Table.Column>
                                            <Table.Column>
                                                Quantity
                                            </Table.Column>
                                            <Table.Column>
                                                Total Price
                                            </Table.Column>
                                            <Table.Column>
                                                Booked At
                                            </Table.Column>
                                            <Table.Column>Status</Table.Column>
                                            <Table.Column>Actions</Table.Column>
                                        </Table.Header>
                                        <Table.Body>
                                            {filteredBookings.length === 0 ? (
                                                <Table.Row>
                                                    <Table.Cell>
                                                        <motion.div
                                                            initial={{
                                                                opacity: 0,
                                                                scale: 0.9,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                scale: 1,
                                                            }}
                                                            className="flex items-center gap-3 py-8"
                                                        >
                                                            <motion.div
                                                                animate={{
                                                                    rotate: [
                                                                        0, -10,
                                                                        10, 0,
                                                                    ],
                                                                }}
                                                                transition={{
                                                                    duration: 2,
                                                                    repeat: Infinity,
                                                                }}
                                                                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/50"
                                                            >
                                                                <BiSearch className="text-2xl text-emerald-600" />
                                                            </motion.div>
                                                            <div>
                                                                <p className="font-bold text-[#064E3B] dark:text-white">
                                                                    No booking
                                                                    requests
                                                                    found
                                                                </p>
                                                                <p className="text-sm text-gray-500">
                                                                    Try changing
                                                                    search or
                                                                    filter
                                                                    options.
                                                                </p>
                                                            </div>
                                                        </motion.div>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {""}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {""}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {""}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {""}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {""}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {""}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {""}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {""}
                                                    </Table.Cell>
                                                </Table.Row>
                                            ) : (
                                                filteredBookings.map(
                                                    (booking, index) => {
                                                        const bid =
                                                            getBookingId(
                                                                booking,
                                                            );
                                                        const userName =
                                                            getUserName(
                                                                booking,
                                                            );
                                                        const userEmail =
                                                            getUserEmail(
                                                                booking,
                                                            );
                                                        const userAvatar =
                                                            getUserAvatar(
                                                                booking,
                                                            );
                                                        const statusCfg =
                                                            getStatusConfig(
                                                                booking?.status,
                                                            );
                                                        const StatusIcon =
                                                            statusCfg.icon;
                                                        const totalPrice =
                                                            booking?.totalPrice ||
                                                            (booking?.unitPrice ||
                                                                booking?.price ||
                                                                0) *
                                                                (booking?.quantity ||
                                                                    1);

                                                        return (
                                                            <Table.Row
                                                                key={
                                                                    bid ||
                                                                    `d-booking-${index}`
                                                                }
                                                            >
                                                                <Table.Cell>
                                                                    <motion.div
                                                                        initial={{
                                                                            opacity: 0,
                                                                            x: -20,
                                                                        }}
                                                                        animate={{
                                                                            opacity: 1,
                                                                            x: 0,
                                                                        }}
                                                                        transition={{
                                                                            delay:
                                                                                index *
                                                                                0.05,
                                                                        }}
                                                                        className="flex items-center gap-3 py-2"
                                                                    >
                                                                        <UserAvatar
                                                                            src={
                                                                                userAvatar
                                                                            }
                                                                            name={
                                                                                userName
                                                                            }
                                                                            className="border-2 border-white shadow-md ring-2 ring-emerald-100 dark:border-[#07111F] dark:ring-emerald-900/50"
                                                                        />
                                                                        <div>
                                                                            <p className="font-black text-[#064E3B] dark:text-white">
                                                                                {
                                                                                    userName
                                                                                }
                                                                            </p>
                                                                            <p className="text-xs font-semibold text-gray-400">
                                                                                ID:{" "}
                                                                                {bid
                                                                                    ? String(
                                                                                          bid,
                                                                                      ).slice(
                                                                                          0,
                                                                                          8,
                                                                                      )
                                                                                    : "N/A"}
                                                                            </p>
                                                                        </div>
                                                                    </motion.div>
                                                                </Table.Cell>

                                                                <Table.Cell>
                                                                    <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                                                        <FiMail className="shrink-0 text-emerald-600" />
                                                                        <span className="max-w-[160px] truncate">
                                                                            {
                                                                                userEmail
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                </Table.Cell>

                                                                <Table.Cell>
                                                                    <p className="max-w-[160px] truncate font-black text-[#064E3B] dark:text-white">
                                                                        {booking?.title ||
                                                                            "N/A"}
                                                                    </p>
                                                                </Table.Cell>

                                                                <Table.Cell>
                                                                    <div className="flex items-center gap-1 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                                                        <FiMapPin className="shrink-0 text-emerald-600" />
                                                                        <span className="max-w-[70px] truncate">
                                                                            {booking?.from ||
                                                                                "N/A"}
                                                                        </span>
                                                                        <span className="font-black text-emerald-500">
                                                                            →
                                                                        </span>
                                                                        <span className="max-w-[70px] truncate">
                                                                            {booking?.to ||
                                                                                "N/A"}
                                                                        </span>
                                                                    </div>
                                                                </Table.Cell>

                                                                <Table.Cell>
                                                                    <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                                                        <FiPackage className="text-lime-600" />
                                                                        {booking?.quantity ||
                                                                            1}{" "}
                                                                        seats
                                                                    </div>
                                                                </Table.Cell>

                                                                <Table.Cell>
                                                                    <motion.span
                                                                        whileHover={{
                                                                            scale: 1.1,
                                                                        }}
                                                                        className="font-black text-emerald-700 dark:text-emerald-300 inline-block"
                                                                    >
                                                                        ৳
                                                                        {
                                                                            totalPrice
                                                                        }
                                                                    </motion.span>
                                                                </Table.Cell>

                                                                <Table.Cell>
                                                                    <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 dark:text-gray-400">
                                                                        <FiCalendar className="text-lime-600" />
                                                                        {formatDateTime(
                                                                            booking?.createdAt,
                                                                        )}
                                                                    </div>
                                                                </Table.Cell>

                                                                <Table.Cell>
                                                                    <motion.span
                                                                        initial={{
                                                                            scale: 0.8,
                                                                            opacity: 0,
                                                                        }}
                                                                        animate={{
                                                                            scale: 1,
                                                                            opacity: 1,
                                                                        }}
                                                                        transition={{
                                                                            type: "spring",
                                                                            stiffness: 200,
                                                                            delay:
                                                                                index *
                                                                                0.03,
                                                                        }}
                                                                        className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-black ${statusCfg.bg}`}
                                                                    >
                                                                        <StatusIcon className="text-xs" />
                                                                        {
                                                                            statusCfg.label
                                                                        }
                                                                    </motion.span>
                                                                </Table.Cell>

                                                                <Table.Cell>
                                                                    {renderActionButtons(
                                                                        booking,
                                                                        "table",
                                                                    )}
                                                                </Table.Cell>
                                                            </Table.Row>
                                                        );
                                                    },
                                                )
                                            )}
                                        </Table.Body>
                                    </Table.Content>
                                </Table.ScrollContainer>
                            </Table>
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>

            <ConfirmActionDialog
                isOpen={confirmModal.isOpen}
                onClose={closeConfirmModal}
                onConfirm={handleConfirmAction}
                isProcessing={isProcessing}
                type={confirmModal.type}
                bookingTitle={confirmModal.bookingTitle}
                userName={confirmModal.userName}
            />
        </>
    );
};

export default BookingRequestsClient;
