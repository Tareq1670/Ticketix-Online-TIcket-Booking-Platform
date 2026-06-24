"use client";

import React, { useEffect, useId, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Table } from "@heroui/react";
import toast from "react-hot-toast";
import { FaTicketAlt } from "react-icons/fa";
import { BiSearch } from "react-icons/bi";
import {
    FiRefreshCw,
    FiMapPin,
    FiCalendar,
    FiCheckCircle,
    FiXCircle,
    FiClock,
    FiDollarSign,
    FiPackage,
    FiX,
    FiUser,
} from "react-icons/fi";
import {
    MdOutlineAirplanemodeActive,
    MdDirectionsBus,
    MdTrain,
    MdDirectionsBoat,
} from "react-icons/md";
import { approveTicket, rejectTicket } from "@/lib/actions/admin";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

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

const toTicketsArray = (value) => {
    if (!Array.isArray(value)) return [];
    return Array.from(value).filter(Boolean);
};

const formatDateTime = (date) => {
    if (!date) return "N/A";
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const getTransportIcon = (type) => {
    if (!type) return MdDirectionsBus;
    const t = String(type).toLowerCase();
    if (t.includes("plane") || t.includes("flight") || t.includes("air"))
        return MdOutlineAirplanemodeActive;
    if (t.includes("bus")) return MdDirectionsBus;
    if (t.includes("train")) return MdTrain;
    if (t.includes("launch") || t.includes("boat") || t.includes("ship"))
        return MdDirectionsBoat;
    return MdDirectionsBus;
};

const getTransportColor = (type) => {
    if (!type)
        return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300";
    const t = String(type).toLowerCase();
    if (t.includes("plane") || t.includes("flight") || t.includes("air"))
        return "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300";
    if (t.includes("bus"))
        return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
    if (t.includes("train"))
        return "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300";
    if (t.includes("launch") || t.includes("boat") || t.includes("ship"))
        return "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300";
    return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300";
};

const getStatusColor = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "approved")
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300";
    if (s === "rejected")
        return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300";
    return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
};

const getStatusIcon = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "approved") return FiCheckCircle;
    if (s === "rejected") return FiXCircle;
    return FiClock;
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.05,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 25,
        },
    },
};

const heroVariants = {
    hidden: { opacity: 0, y: -25, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 25,
            staggerChildren: 0.1,
        },
    },
};

const statCardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 25,
        },
    },
};

const tableContainerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 350,
            damping: 28,
        },
    },
};

const mobileCardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.97 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 25,
        },
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        y: -10,
        transition: { duration: 0.2 },
    },
};

const filterBarVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 25,
            staggerChildren: 0.05,
        },
    },
};

const filterItemVariants = {
    hidden: { opacity: 0, y: -8 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 450,
            damping: 25,
        },
    },
};

const emptyStateVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 25,
        },
    },
};

const modalOverlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.25 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
};

const modalContentVariants = {
    hidden: { opacity: 0, scale: 0.92, y: 20 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 28,
        },
    },
    exit: {
        opacity: 0,
        scale: 0.92,
        y: 20,
        transition: { duration: 0.2 },
    },
};

const TicketImage = ({ src, title, className = "" }) => {
    const [imageError, setImageError] = useState(false);
    const imageSrc = normalizeImageUrl(src);

    useEffect(() => {
        setImageError(false);
    }, [imageSrc]);

    return (
        <div
            className={`relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-700 via-green-500 to-lime-400 ${className}`}
        >
            {imageSrc && !imageError ? (
                <Image
                    height={500}
                    width={500}
                    src={imageSrc}
                    alt={title || "Ticket"}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                    onError={() => setImageError(true)}
                />
            ) : (
                <FaTicketAlt className="text-lg text-white" />
            )}
        </div>
    );
};

const ConfirmActionDialog = ({
    triggerIcon,
    triggerText,
    triggerClassName = "",
    triggerDisabled = false,
    confirmLoading = false,
    icon,
    iconBoxClassName = "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300",
    title,
    description,
    confirmText,
    confirmButtonClassName = "",
    onConfirm,
}) => {
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [localLoading, setLocalLoading] = useState(false);
    const titleId = useId();
    const descriptionId = useId();
    const loading = localLoading || confirmLoading;

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const esc = (e) => {
            if (e.key === "Escape" && !loading) setOpen(false);
        };
        document.addEventListener("keydown", esc);
        return () => {
            document.body.style.overflow = prev;
            document.removeEventListener("keydown", esc);
        };
    }, [open, loading]);

    const handleConfirm = async () => {
        try {
            setLocalLoading(true);
            const result = await onConfirm?.();
            if (result !== false) setOpen(false);
        } catch (err) {
            console.error(err);
        } finally {
            setLocalLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) setOpen(false);
    };

    const modalContent = (
        <AnimatePresence>
            {open && (
                <div
                    className="fixed inset-0 z-[99999] flex items-end justify-center sm:items-center sm:p-4"
                    style={{ isolation: "isolate" }}
                >
                    <motion.div
                        variants={modalOverlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed inset-0 bg-black/70 backdrop-blur-md"
                        onClick={handleClose}
                        aria-hidden="true"
                    />
                    <motion.div
                        variants={modalContentVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby={titleId}
                        aria-describedby={descriptionId}
                        className="relative z-[100000] mx-auto w-full max-w-[calc(100vw-2rem)] rounded-t-[28px] border border-emerald-100/60 bg-white shadow-[0_-20px_60px_rgba(0,0,0,0.25)] sm:max-w-md sm:rounded-[28px] sm:shadow-[0_30px_100px_rgba(6,78,59,0.35)] dark:border-emerald-900/40 dark:bg-[#0A1626]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative flex flex-col items-center px-5 pb-7 pt-6 sm:px-7 sm:pb-7 sm:pt-7">
                            <div className="mb-3 h-1 w-12 rounded-full bg-gray-300 sm:hidden dark:bg-gray-700" />
                            <motion.button
                                type="button"
                                onClick={handleClose}
                                disabled={loading}
                                aria-label="Close"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700 disabled:opacity-50 sm:right-5 sm:top-5 dark:bg-gray-800/80 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                            >
                                <FiX className="text-base" />
                            </motion.button>
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 20,
                                    delay: 0.1,
                                }}
                                className={`flex h-[72px] w-[72px] items-center justify-center rounded-[24px] shadow-lg ${iconBoxClassName}`}
                            >
                                <span className="text-3xl">{icon}</span>
                            </motion.div>
                            <motion.h3
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                id={titleId}
                                className="mt-5 px-4 text-center text-lg font-black leading-snug text-gray-900 sm:text-xl dark:text-white"
                            >
                                {title}
                            </motion.h3>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                id={descriptionId}
                                className="mt-2.5 px-2 text-center text-sm leading-relaxed text-gray-500 dark:text-gray-400"
                            >
                                {description}
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 }}
                                className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:justify-center"
                            >
                                <motion.button
                                    type="button"
                                    disabled={loading}
                                    onClick={handleClose}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-100 px-6 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50 sm:h-11 sm:w-auto sm:min-w-[120px] dark:border-gray-700/60 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    type="button"
                                    disabled={loading}
                                    onClick={handleConfirm}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl px-6 text-sm font-black text-white shadow-lg transition-colors disabled:opacity-70 sm:h-11 sm:w-auto sm:min-w-[160px] ${confirmButtonClassName}`}
                                >
                                    {loading && (
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
                                    )}
                                    {confirmText}
                                </motion.button>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return (
        <>
            <motion.button
                type="button"
                disabled={triggerDisabled || confirmLoading}
                onClick={() => setOpen(true)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`inline-flex items-center gap-1.5 disabled:cursor-not-allowed disabled:opacity-50 ${triggerClassName}`}
            >
                {confirmLoading ? (
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
                ) : (
                    triggerIcon
                )}
                <span>{triggerText}</span>
            </motion.button>
            {mounted && typeof document !== "undefined"
                ? createPortal(modalContent, document.body)
                : null}
        </>
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
        variants={statCardVariants}
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className={`group relative overflow-hidden rounded-[24px] border ${borderClass} bg-gradient-to-br ${cardClass} p-5 shadow-[0_18px_50px_rgba(6,78,59,0.08)] transition-shadow hover:shadow-[0_26px_80px_rgba(6,78,59,0.16)] sm:rounded-[26px]`}
    >
        <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-full bg-white/50 dark:bg-white/5" />
        <div className="relative z-10 flex items-center justify-between">
            <div>
                <motion.p
                    key={value}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 20,
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
                whileHover={{ scale: 1.15, rotate: 8 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-xl sm:h-14 sm:w-14 ${iconClass}`}
            >
                <Icon className="text-2xl" />
            </motion.div>
        </div>
    </motion.div>
);

const ManageTicketsTable = ({ tickets: initialTickets }) => {
    const [tickets, setTickets] = useState(() =>
        toTicketsArray(initialTickets),
    );
    const [search, setSearch] = useState("");
    const [transportFilter, setTransportFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [busy, setBusy] = useState(null);

    useEffect(() => {
        setTickets(toTicketsArray(initialTickets));
    }, [initialTickets]);

    const getTicketId = (t) => getPlainId(t?._id || t?.id);
    const getTicketKey = (t, i) => getTicketId(t) || `ticket-${i}`;
    const getTitle = (t) => t?.title || t?.ticketTitle || "Untitled Ticket";
    const getFrom = (t) => t?.from || t?.fromLocation || "N/A";
    const getTo = (t) => t?.to || t?.toLocation || "N/A";
    const getTransport = (t) =>
        t?.transportType || t?.transport_type || "Unknown";
    const getPrice = (t) => t?.price || t?.ticketPrice || 0;
    const getQuantity = (t) => t?.quantity || t?.ticketQuantity || 0;
    const getImage = (t) => normalizeImageUrl(t?.image || t?.ticketImage || "");
    const getPerks = (t) => {
        if (Array.isArray(t?.perks)) return t.perks;
        if (typeof t?.perks === "string")
            return t.perks
                .split(",")
                .map((p) => p.trim())
                .filter(Boolean);
        return [];
    };
    const getDeparture = (t) =>
        t?.departureDate || t?.departure || t?.departureDateTime || null;
    const getStatus = (t) => (t?.verificationStatus || "pending").toLowerCase();
    const getVendorName = (t) => t?.vendorName || "Unknown Vendor";
    const getVendorEmail = (t) => t?.vendorEmail || "N/A";

    const totalTickets = tickets.length;
    const pendingCount = useMemo(
        () => tickets.filter((t) => getStatus(t) === "pending").length,
        [tickets],
    );
    const approvedCount = useMemo(
        () => tickets.filter((t) => getStatus(t) === "approved").length,
        [tickets],
    );
    const rejectedCount = useMemo(
        () => tickets.filter((t) => getStatus(t) === "rejected").length,
        [tickets],
    );

    const filteredTickets = useMemo(() => {
        const query = search.trim().toLowerCase();
        return tickets.filter((t) => {
            const title = getTitle(t).toLowerCase();
            const from = getFrom(t).toLowerCase();
            const to = getTo(t).toLowerCase();
            const vendor = getVendorName(t).toLowerCase();
            const vendorMail = getVendorEmail(t).toLowerCase();
            const transport = getTransport(t).toLowerCase();
            const status = getStatus(t);

            const matchSearch =
                !query ||
                title.includes(query) ||
                from.includes(query) ||
                to.includes(query) ||
                vendor.includes(query) ||
                vendorMail.includes(query);

            const matchTransport =
                transportFilter === "all" ||
                transport.includes(transportFilter.toLowerCase());

            const matchStatus =
                statusFilter === "all" || status === statusFilter;

            return matchSearch && matchTransport && matchStatus;
        });
    }, [tickets, search, transportFilter, statusFilter]);

    const handleApprove = async (ticketId, title) => {
        if (!ticketId) {
            toast.error("Ticket ID not found");
            return false;
        }
        setBusy(ticketId);
        try {
            const result = await approveTicket(ticketId);
            if (result.success) {
                toast.success(`"${title}" approved successfully!`);
                setTickets((prev) =>
                    prev.map((t) =>
                        getTicketId(t) === ticketId
                            ? {
                                  ...t,
                                  verificationStatus: "approved",
                                  approvedAt: new Date().toISOString(),
                              }
                            : t,
                    ),
                );
            } else {
                toast.error(result.message || "Failed to approve");
                return false;
            }
        } catch (e) {
            toast.error("Failed to approve ticket");
            return false;
        } finally {
            setBusy(null);
        }
    };

    const handleReject = async (ticketId, title) => {
        if (!ticketId) {
            toast.error("Ticket ID not found");
            return false;
        }
        setBusy(ticketId);
        try {
            const result = await rejectTicket(ticketId);
            if (result.success) {
                toast.success(`"${title}" rejected!`);
                setTickets((prev) =>
                    prev.map((t) =>
                        getTicketId(t) === ticketId
                            ? {
                                  ...t,
                                  verificationStatus: "rejected",
                                  isAdvertised: false,
                                  advertisedAt: null,
                              }
                            : t,
                    ),
                );
            } else {
                toast.error(result.message || "Failed to reject");
                return false;
            }
        } catch (e) {
            toast.error("Failed to reject ticket");
            return false;
        } finally {
            setBusy(null);
        }
    };

    const renderActions = (ticket, mode = "table") => {
        const tid = getTicketId(ticket);
        const title = getTitle(ticket);
        const status = getStatus(ticket);
        const isBusy = busy === tid;
        const isMobile = mode === "mobile";

        const approveBtn = isMobile
            ? "h-10 w-full justify-center rounded-xl bg-gradient-to-r from-[#064E3B] via-[#059669] to-[#22C55E] px-4 font-black text-white text-sm shadow-lg shadow-emerald-600/25"
            : "h-9 rounded-xl bg-gradient-to-r from-[#064E3B] via-emerald-600 to-green-500 px-3 text-xs font-black text-white shadow-lg shadow-emerald-600/25";

        const rejectBtn = isMobile
            ? "h-10 w-full justify-center rounded-xl bg-gradient-to-r from-[#DC2626] via-[#B91C1C] to-[#7F1D1D] px-4 font-black text-white text-sm shadow-lg shadow-red-500/25"
            : "h-9 rounded-xl bg-gradient-to-r from-red-600 to-red-800 px-3 text-xs font-black text-white shadow-lg shadow-red-500/25";

        const wrap = isMobile
            ? "grid grid-cols-1 gap-2 sm:grid-cols-2"
            : "flex items-center gap-2";

        if (status === "approved") {
            return (
                <div className={wrap}>
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                    >
                        <FiCheckCircle /> Approved
                    </motion.span>
                    <ConfirmActionDialog
                        triggerIcon={<FiXCircle className="text-sm" />}
                        triggerText="Reject"
                        triggerDisabled={isBusy}
                        triggerClassName={rejectBtn}
                        icon={<FiXCircle className="text-3xl" />}
                        iconBoxClassName="bg-red-50 text-red-500 dark:bg-red-950/50 dark:text-red-400"
                        title="Reject this ticket?"
                        description={`"${title}" will be rejected and removed from the All Tickets page. If advertised, it will also be unadvertised.`}
                        confirmText="Yes, Reject"
                        confirmButtonClassName="bg-gradient-to-r from-red-600 to-red-700 hover:opacity-90 shadow-red-600/30"
                        onConfirm={() => handleReject(tid, title)}
                    />
                </div>
            );
        }

        if (status === "rejected") {
            return (
                <div className={wrap}>
                    <ConfirmActionDialog
                        triggerIcon={<FiCheckCircle className="text-sm" />}
                        triggerText="Approve"
                        triggerDisabled={isBusy}
                        triggerClassName={approveBtn}
                        icon={<FiCheckCircle className="text-3xl" />}
                        iconBoxClassName="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300"
                        title="Approve this ticket?"
                        description={`"${title}" will be approved and visible on the All Tickets page for users to book.`}
                        confirmText="Yes, Approve"
                        confirmButtonClassName="bg-gradient-to-r from-[#064E3B] via-emerald-600 to-green-500 hover:opacity-90 shadow-emerald-600/30"
                        onConfirm={() => handleApprove(tid, title)}
                    />
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-1 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-black text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                    >
                        <FiXCircle /> Rejected
                    </motion.span>
                </div>
            );
        }

        return (
            <div className={wrap}>
                <ConfirmActionDialog
                    triggerIcon={<FiCheckCircle className="text-sm" />}
                    triggerText="Approve"
                    triggerDisabled={isBusy}
                    triggerClassName={approveBtn}
                    icon={<FiCheckCircle className="text-3xl" />}
                    iconBoxClassName="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300"
                    title="Approve this ticket?"
                    description={`"${title}" will be approved and visible on the All Tickets page for users to book.`}
                    confirmText="Yes, Approve"
                    confirmButtonClassName="bg-gradient-to-r from-[#064E3B] via-emerald-600 to-green-500 hover:opacity-90 shadow-emerald-600/30"
                    onConfirm={() => handleApprove(tid, title)}
                />
                <ConfirmActionDialog
                    triggerIcon={<FiXCircle className="text-sm" />}
                    triggerText="Reject"
                    triggerDisabled={isBusy}
                    triggerClassName={rejectBtn}
                    icon={<FiXCircle className="text-3xl" />}
                    iconBoxClassName="bg-red-50 text-red-500 dark:bg-red-950/50 dark:text-red-400"
                    title="Reject this ticket?"
                    description={`"${title}" will be rejected and will not appear on the platform.`}
                    confirmText="Yes, Reject"
                    confirmButtonClassName="bg-gradient-to-r from-red-600 to-red-700 hover:opacity-90 shadow-red-600/30"
                    onConfirm={() => handleReject(tid, title)}
                />
            </div>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen space-y-5 rounded-[28px] bg-[#F0FDF4] p-3 sm:space-y-7 sm:p-5 lg:p-6 dark:bg-[#06130D]"
        >
            <motion.div
                variants={heroVariants}
                initial="hidden"
                animate="visible"
                className="relative hidden md:block overflow-hidden rounded-[26px] bg-gradient-to-r from-[#052E16] via-[#16A34A] to-[#34D399] p-5 shadow-[0_24px_70px_rgba(22,163,74,0.28)] sm:rounded-[30px] sm:p-6 lg:p-8"
            >
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.15, 0.25, 0.15],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/15 blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.15, 1],
                        opacity: [0.3, 0.45, 0.3],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1,
                    }}
                    className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-lime-300/30 blur-3xl"
                />
                <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <motion.div variants={itemVariants}>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 25,
                                delay: 0.1,
                            }}
                            className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl"
                        >
                            Manage Tickets
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 25,
                                delay: 0.2,
                            }}
                            className="mt-3 max-w-2xl text-sm leading-6 text-green-50"
                        >
                            Review all vendor-submitted tickets. Approve tickets
                            to make them visible on the platform or reject them
                            to keep quality control.
                        </motion.p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 30, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 350,
                            damping: 25,
                            delay: 0.3,
                        }}
                        className="grid grid-cols-2 gap-3 rounded-2xl border border-white/20 bg-white/15 p-3 backdrop-blur-xl sm:min-w-[280px]"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="rounded-2xl bg-white/95 p-4 text-center shadow-lg dark:bg-[#07111F]/90"
                        >
                            <motion.p
                                key={filteredTickets.length}
                                initial={{ scale: 1.3 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 20,
                                }}
                                className="text-2xl font-black text-emerald-600"
                            >
                                {filteredTickets.length}
                            </motion.p>
                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                                Showing
                            </p>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="rounded-2xl bg-white/95 p-4 text-center shadow-lg dark:bg-[#07111F]/90"
                        >
                            <p className="text-2xl font-black text-lime-600">
                                {totalTickets}
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
                initial="hidden"
                animate="visible"
                className="grid gap-4 grid-cols-2 xl:grid-cols-4"
            >
                <StatCard
                    title="Total Tickets"
                    value={totalTickets}
                    Icon={FaTicketAlt}
                    numberClass="text-emerald-600"
                    iconClass="bg-gradient-to-br from-emerald-600 to-green-400"
                    cardClass="from-emerald-50 via-white to-green-50 dark:from-emerald-950/50 dark:via-[#07111F] dark:to-green-950/30"
                    borderClass="border-emerald-100 dark:border-emerald-900/50"
                    index={0}
                />
                <StatCard
                    title="Pending"
                    value={pendingCount}
                    Icon={FiClock}
                    numberClass="text-amber-600"
                    iconClass="bg-gradient-to-br from-amber-500 to-orange-500"
                    cardClass="from-amber-50 via-white to-orange-50 dark:from-amber-950/50 dark:via-[#07111F] dark:to-orange-950/30"
                    borderClass="border-amber-100 dark:border-amber-900/50"
                    index={1}
                />
                <StatCard
                    title="Approved"
                    value={approvedCount}
                    Icon={FiCheckCircle}
                    numberClass="text-green-700"
                    iconClass="bg-gradient-to-br from-green-700 to-emerald-500"
                    cardClass="from-green-50 via-white to-emerald-50 dark:from-green-950/50 dark:via-[#07111F] dark:to-green-950/30"
                    borderClass="border-green-100 dark:border-green-900/50"
                    index={2}
                />
                <StatCard
                    title="Rejected"
                    value={rejectedCount}
                    Icon={FiXCircle}
                    numberClass="text-red-600"
                    iconClass="bg-gradient-to-br from-red-600 to-red-800"
                    cardClass="from-red-50 via-white to-orange-50 dark:from-red-950/50 dark:via-[#07111F] dark:to-orange-950/30"
                    borderClass="border-red-100 dark:border-red-900/50"
                    index={3}
                />
            </motion.div>

            <motion.div
                variants={tableContainerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="overflow-hidden rounded-[26px] border border-emerald-100 bg-white shadow-[0_25px_80px_rgba(6,78,59,0.1)] sm:rounded-[30px] dark:border-emerald-900/50 dark:bg-[#07111F]"
            >
                <motion.div
                    variants={filterBarVariants}
                    initial="hidden"
                    animate="visible"
                    className="border-b border-emerald-100 bg-gradient-to-r from-white via-emerald-50/60 to-green-50 p-4 sm:p-5 dark:border-emerald-900/50 dark:from-[#07111F] dark:via-[#052E16] dark:to-[#064E3B]"
                >
                    <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-center 2xl:justify-between">
                        <motion.div variants={filterItemVariants}>
                            <h2 className="text-lg font-black text-[#064E3B] sm:text-xl dark:text-white">
                                All Tickets Directory
                            </h2>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Review, approve or reject vendor tickets.
                            </p>
                        </motion.div>
                        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[1fr_160px_160px_100px] xl:items-center 2xl:w-[880px]">
                            <motion.div
                                variants={filterItemVariants}
                                className="relative sm:col-span-2 xl:col-span-1"
                            >
                                <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-emerald-600 dark:text-emerald-300" />
                                <input
                                    type="text"
                                    placeholder="Search title, vendor, route..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="h-11 w-full rounded-2xl border border-emerald-200/90 bg-white/95 pl-10 pr-4 text-sm font-semibold text-[#052E16] caret-emerald-600 outline-none transition placeholder:text-emerald-600/55 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 dark:border-emerald-800/70 dark:bg-[#081C13] dark:text-emerald-50"
                                />
                            </motion.div>
                            <motion.select
                                variants={filterItemVariants}
                                value={transportFilter}
                                onChange={(e) =>
                                    setTransportFilter(e.target.value)
                                }
                                className="h-11 w-full rounded-2xl border border-emerald-200/90 bg-white/95 px-4 text-sm font-bold text-[#052E16] outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 dark:border-emerald-800/70 dark:bg-[#081C13] dark:text-emerald-50"
                            >
                                <option value="all">All Transport</option>
                                <option value="bus">Bus</option>
                                <option value="train">Train</option>
                                <option value="launch">Launch</option>
                                <option value="plane">Plane</option>
                            </motion.select>
                            <motion.select
                                variants={filterItemVariants}
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                                className="h-11 w-full rounded-2xl border border-emerald-200/90 bg-white/95 px-4 text-sm font-bold text-[#052E16] outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 dark:border-emerald-800/70 dark:bg-[#081C13] dark:text-emerald-50"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </motion.select>
                            <motion.button
                                variants={filterItemVariants}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                type="button"
                                onClick={() => {
                                    setSearch("");
                                    setTransportFilter("all");
                                    setStatusFilter("all");
                                }}
                                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#064E3B] via-emerald-600 to-green-500 px-4 font-black text-white shadow-lg shadow-emerald-700/25 transition-colors hover:opacity-90 sm:col-span-2 xl:col-span-1"
                            >
                                <motion.div
                                    whileHover={{ rotate: 180 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <FiRefreshCw />
                                </motion.div>
                                Reset
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                <div className="block bg-gradient-to-br from-[#ECFDF5] via-[#F8FFF9] to-[#F7FEE7] p-4 lg:hidden dark:from-[#04130B] dark:via-[#071A12] dark:to-[#102A0D]">
                    <AnimatePresence mode="wait">
                        {filteredTickets.length === 0 ? (
                            <motion.div
                                key="empty"
                                variants={emptyStateVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                className="flex items-center gap-3 rounded-3xl border border-emerald-100 bg-emerald-50/60 p-5 dark:border-emerald-900/50 dark:bg-emerald-950/20"
                            >
                                <motion.div
                                    animate={{
                                        y: [0, -3, 0],
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
                                        No tickets found
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Try changing search or filter options.
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="cards"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid grid-cols-1 gap-4 md:grid-cols-2"
                            >
                                {filteredTickets.map((ticket, index) => {
                                    const tid = getTicketId(ticket);
                                    const rowKey = getTicketKey(ticket, index);
                                    const title = getTitle(ticket);
                                    const status = getStatus(ticket);
                                    const transport = getTransport(ticket);
                                    const TransportIconComp =
                                        getTransportIcon(transport);
                                    const StatusIconComp =
                                        getStatusIcon(status);
                                    const perks = getPerks(ticket);

                                    return (
                                        <motion.div
                                            key={`m-${rowKey}`}
                                            variants={mobileCardVariants}
                                            whileHover={{ y: -3, scale: 1.01 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 400,
                                                damping: 20,
                                            }}
                                            layout
                                            className={`relative overflow-hidden rounded-[28px] border p-4 shadow-[0_18px_55px_rgba(6,78,59,0.13)] ${
                                                status === "approved"
                                                    ? "border-emerald-300 bg-gradient-to-br from-emerald-50 via-[#F0FDF4] to-[#ECFCCB] dark:border-emerald-700 dark:from-[#06130D] dark:via-[#082016] dark:to-[#142C10]"
                                                    : status === "rejected"
                                                      ? "border-red-200 bg-gradient-to-br from-red-50 via-white to-orange-50 dark:border-red-900/50 dark:from-[#0F0506] dark:via-[#0F0A0B] dark:to-[#140C08]"
                                                      : "border-amber-200 bg-gradient-to-br from-amber-50 via-white to-yellow-50 dark:border-amber-900/50 dark:from-[#0F0D04] dark:via-[#0F0E08] dark:to-[#14120A]"
                                            }`}
                                        >
                                            <div className="absolute -right-14 -top-14 h-32 w-32 rounded-full bg-emerald-400/20 blur-2xl" />
                                            <div className="relative z-10 flex items-start justify-between gap-3">
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <TicketImage
                                                        src={getImage(ticket)}
                                                        title={title}
                                                        className="border-2 border-white shadow-md ring-2 ring-emerald-100 dark:border-[#07111F] dark:ring-emerald-900/50"
                                                    />
                                                    <div className="min-w-0">
                                                        <p className="truncate font-black text-[#064E3B] dark:text-white">
                                                            {title}
                                                        </p>
                                                        <div className="mt-1 flex items-center gap-1.5">
                                                            <span
                                                                className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-black ${getTransportColor(transport)}`}
                                                            >
                                                                <TransportIconComp className="text-sm" />
                                                                {transport}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <motion.span
                                                    key={status}
                                                    initial={{
                                                        scale: 0.8,
                                                        opacity: 0,
                                                    }}
                                                    animate={{
                                                        scale: 1,
                                                        opacity: 1,
                                                    }}
                                                    className={`inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-black capitalize ${getStatusColor(status)}`}
                                                >
                                                    <StatusIconComp className="text-xs" />
                                                    {status}
                                                </motion.span>
                                            </div>
                                            <div className="relative z-10 mt-4 grid grid-cols-2 gap-3 rounded-2xl border border-emerald-100/80 bg-white/85 p-4 text-sm shadow-inner backdrop-blur dark:border-emerald-900/60 dark:bg-[#04130B]/75">
                                                <div className="col-span-2">
                                                    <p className="mb-1 text-xs font-black uppercase text-emerald-700 dark:text-emerald-300">
                                                        Vendor
                                                    </p>
                                                    <div className="flex items-center gap-2 font-semibold text-gray-600 dark:text-gray-300">
                                                        <FiUser className="shrink-0 text-emerald-600" />
                                                        <span className="truncate">
                                                            {getVendorName(
                                                                ticket,
                                                            )}
                                                        </span>
                                                        <span className="text-xs text-gray-400">
                                                            (
                                                            {getVendorEmail(
                                                                ticket,
                                                            )}
                                                            )
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="mb-1 text-xs font-black uppercase text-emerald-700 dark:text-emerald-300">
                                                        Route
                                                    </p>
                                                    <div className="flex items-center gap-1 font-semibold text-gray-600 dark:text-gray-300">
                                                        <FiMapPin className="shrink-0 text-emerald-600" />
                                                        <span className="truncate">
                                                            {getFrom(ticket)}
                                                        </span>
                                                        <span className="text-emerald-500">
                                                            →
                                                        </span>
                                                        <span className="truncate">
                                                            {getTo(ticket)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="mb-1 text-xs font-black uppercase text-emerald-700 dark:text-emerald-300">
                                                        Price
                                                    </p>
                                                    <div className="flex items-center gap-1 font-black text-emerald-700 dark:text-emerald-300">
                                                        <FiDollarSign className="text-emerald-600" />
                                                        ৳{getPrice(ticket)}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="mb-1 text-xs font-black uppercase text-emerald-700 dark:text-emerald-300">
                                                        Quantity
                                                    </p>
                                                    <div className="flex items-center gap-1 font-semibold text-gray-600 dark:text-gray-300">
                                                        <FiPackage className="text-lime-600" />
                                                        {getQuantity(ticket)}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="mb-1 text-xs font-black uppercase text-emerald-700 dark:text-emerald-300">
                                                        Departure
                                                    </p>
                                                    <div className="flex items-center gap-1 font-semibold text-gray-600 dark:text-gray-300">
                                                        <FiCalendar className="text-lime-600" />
                                                        <span className="text-xs">
                                                            {formatDateTime(
                                                                getDeparture(
                                                                    ticket,
                                                                ),
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                                {perks.length > 0 && (
                                                    <div className="col-span-2">
                                                        <p className="mb-1 text-xs font-black uppercase text-emerald-700 dark:text-emerald-300">
                                                            Perks
                                                        </p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {perks.map(
                                                                (p, i) => (
                                                                    <motion.span
                                                                        key={i}
                                                                        initial={{
                                                                            opacity: 0,
                                                                            scale: 0.8,
                                                                        }}
                                                                        animate={{
                                                                            opacity: 1,
                                                                            scale: 1,
                                                                        }}
                                                                        transition={{
                                                                            delay:
                                                                                i *
                                                                                0.03,
                                                                        }}
                                                                        className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                                                    >
                                                                        {p}
                                                                    </motion.span>
                                                                ),
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="relative z-10 mt-4 border-t border-emerald-100 pt-4 dark:border-emerald-900/50">
                                                {renderActions(
                                                    ticket,
                                                    "mobile",
                                                )}
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="hidden lg:block"
                >
                    <Table>
                        <Table.ScrollContainer>
                            <Table.Content
                                aria-label="Manage tickets table"
                                className="min-w-[1200px]"
                            >
                                <Table.Header>
                                    <Table.Column isRowHeader>
                                        Ticket
                                    </Table.Column>
                                    <Table.Column>Vendor</Table.Column>
                                    <Table.Column>Route</Table.Column>
                                    <Table.Column>Transport</Table.Column>
                                    <Table.Column>Price</Table.Column>
                                    <Table.Column>Qty</Table.Column>
                                    <Table.Column>Departure</Table.Column>
                                    <Table.Column>Status</Table.Column>
                                    <Table.Column>Actions</Table.Column>
                                </Table.Header>
                                <Table.Body>
                                    {filteredTickets.length === 0 ? (
                                        <Table.Row>
                                            <Table.Cell>
                                                <motion.div
                                                    variants={
                                                        emptyStateVariants
                                                    }
                                                    initial="hidden"
                                                    animate="visible"
                                                    className="flex items-center gap-3 py-8"
                                                >
                                                    <motion.div
                                                        animate={{
                                                            y: [0, -3, 0],
                                                        }}
                                                        transition={{
                                                            duration: 2,
                                                            repeat: Infinity,
                                                            ease: "easeInOut",
                                                        }}
                                                        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/50"
                                                    >
                                                        <BiSearch className="text-2xl text-emerald-600" />
                                                    </motion.div>
                                                    <div>
                                                        <p className="font-bold text-[#064E3B] dark:text-white">
                                                            No tickets found
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            Try changing search
                                                            or filter options.
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            </Table.Cell>
                                            <Table.Cell>{""}</Table.Cell>
                                            <Table.Cell>{""}</Table.Cell>
                                            <Table.Cell>{""}</Table.Cell>
                                            <Table.Cell>{""}</Table.Cell>
                                            <Table.Cell>{""}</Table.Cell>
                                            <Table.Cell>{""}</Table.Cell>
                                            <Table.Cell>{""}</Table.Cell>
                                            <Table.Cell>{""}</Table.Cell>
                                        </Table.Row>
                                    ) : (
                                        filteredTickets.map((ticket, index) => {
                                            const tid = getTicketId(ticket);
                                            const rowKey = getTicketKey(
                                                ticket,
                                                index,
                                            );
                                            const title = getTitle(ticket);
                                            const status = getStatus(ticket);
                                            const transport =
                                                getTransport(ticket);
                                            const TransportIconComp =
                                                getTransportIcon(transport);
                                            const StatusIconComp =
                                                getStatusIcon(status);

                                            return (
                                                <Table.Row key={`d-${rowKey}`}>
                                                    <Table.Cell>
                                                        <div className="flex items-center gap-3 py-2">
                                                            <TicketImage
                                                                src={getImage(
                                                                    ticket,
                                                                )}
                                                                title={title}
                                                                className="border-2 border-white shadow-md ring-2 ring-emerald-100 dark:border-[#07111F] dark:ring-emerald-900/50"
                                                            />
                                                            <div>
                                                                <p className="max-w-[160px] truncate font-black text-[#064E3B] dark:text-white">
                                                                    {title}
                                                                </p>
                                                                <p className="text-xs font-semibold text-gray-400">
                                                                    ID:{" "}
                                                                    {tid
                                                                        ? String(
                                                                              tid,
                                                                          ).slice(
                                                                              0,
                                                                              8,
                                                                          )
                                                                        : "N/A"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <div>
                                                            <p className="max-w-[120px] truncate text-sm font-black text-[#064E3B] dark:text-white">
                                                                {getVendorName(
                                                                    ticket,
                                                                )}
                                                            </p>
                                                            <p className="max-w-[120px] truncate text-xs font-semibold text-gray-400">
                                                                {getVendorEmail(
                                                                    ticket,
                                                                )}
                                                            </p>
                                                        </div>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <div className="flex items-center gap-1 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                                            <FiMapPin className="shrink-0 text-emerald-600" />
                                                            <span className="max-w-[70px] truncate">
                                                                {getFrom(
                                                                    ticket,
                                                                )}
                                                            </span>
                                                            <span className="font-black text-emerald-500">
                                                                →
                                                            </span>
                                                            <span className="max-w-[70px] truncate">
                                                                {getTo(ticket)}
                                                            </span>
                                                        </div>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <span
                                                            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-black capitalize ${getTransportColor(transport)}`}
                                                        >
                                                            <TransportIconComp className="text-sm" />
                                                            {transport}
                                                        </span>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <span className="text-sm font-black text-emerald-700 dark:text-emerald-300">
                                                            ৳{getPrice(ticket)}
                                                        </span>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                                                            {getQuantity(
                                                                ticket,
                                                            )}
                                                        </span>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <div className="flex items-center gap-1 text-sm font-semibold text-gray-500 dark:text-gray-400">
                                                            <FiCalendar className="text-lime-600" />
                                                            <span className="text-xs">
                                                                {formatDateTime(
                                                                    getDeparture(
                                                                        ticket,
                                                                    ),
                                                                )}
                                                            </span>
                                                        </div>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <motion.span
                                                            key={status}
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
                                                                stiffness: 500,
                                                                damping: 25,
                                                            }}
                                                            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-black capitalize ${getStatusColor(status)}`}
                                                        >
                                                            <StatusIconComp className="text-xs" />
                                                            {status}
                                                        </motion.span>
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {renderActions(
                                                            ticket,
                                                            "table",
                                                        )}
                                                    </Table.Cell>
                                                </Table.Row>
                                            );
                                        })
                                    )}
                                </Table.Body>
                            </Table.Content>
                        </Table.ScrollContainer>
                    </Table>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default ManageTicketsTable;
