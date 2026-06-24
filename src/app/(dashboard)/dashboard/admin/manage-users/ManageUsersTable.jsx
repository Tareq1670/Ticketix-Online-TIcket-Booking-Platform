"use client";

import React, { useEffect, useId, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Table } from "@heroui/react";
import toast from "react-hot-toast";
import { FaTicketAlt } from "react-icons/fa";
import { BiSearch, BiShield, BiStore } from "react-icons/bi";
import {
    FiAlertTriangle,
    FiUsers,
    FiRefreshCw,
    FiMail,
    FiCalendar,
    FiCheckCircle,
    FiX,
} from "react-icons/fi";
import { updateFraudStatus, updateRole } from "@/lib/actions/admin";
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

const parseBoolean = (value) => {
    if (typeof value === "boolean") return value;
    if (typeof value === "string") return value.toLowerCase() === "true";
    if (typeof value === "number") return value === 1;
    return false;
};

const getPlainDate = (date) => {
    if (!date) return null;
    if (date instanceof Date) return date;
    if (typeof date === "object" && date.$date) return date.$date;
    return date;
};

const toUsersArray = (value) => {
    if (!Array.isArray(value)) return [];
    return Array.from(value).filter(Boolean);
};

const getInitials = (name = "") => {
    const words = name.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return "U";
    return words
        .slice(0, 2)
        .map((w) => w.charAt(0).toUpperCase())
        .join("");
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.07, delayChildren: 0.05 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 22 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 400, damping: 25 },
    },
};

const heroVariants = {
    hidden: { opacity: 0, y: -28, scale: 0.98 },
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
        transition: { type: "spring", stiffness: 400, damping: 25 },
    },
};

const tableContainerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 350, damping: 28 },
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
        transition: { type: "spring", stiffness: 450, damping: 25 },
    },
};

const mobileCardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.97 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 400, damping: 25 },
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        y: -10,
        transition: { duration: 0.2 },
    },
};

const emptyStateVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { type: "spring", stiffness: 400, damping: 25 },
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
        transition: { type: "spring", stiffness: 400, damping: 28 },
    },
    exit: {
        opacity: 0,
        scale: 0.92,
        y: 20,
        transition: { duration: 0.2 },
    },
};

const UserAvatar = ({ src, name, className = "" }) => {
    const [imageError, setImageError] = useState(false);
    const imageSrc = normalizeImageUrl(src);

    useEffect(() => {
        setImageError(false);
    }, [imageSrc]);

    return (
        <div
            className={`relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-emerald-700 via-green-500 to-lime-400 ${className}`}
        >
            {imageSrc && !imageError ? (
                <Image
                    width={500}
                    height={500}
                    src={imageSrc}
                    alt={name || "User avatar"}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                    onError={() => setImageError(true)}
                />
            ) : (
                <span className="text-sm font-black text-white">
                    {getInitials(name)}
                </span>
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
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
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

const ManageUsersTable = ({
    user: currentUser = null,
    users: initialUsers,
}) => {
    const [users, setUsers] = useState(() => toUsersArray(initialUsers));
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [busy, setBusy] = useState({ id: null, action: null });

    useEffect(() => {
        setUsers(toUsersArray(initialUsers));
    }, [initialUsers]);

    const getUserId = (u) => getPlainId(u?._id || u?.id || u?.userId);
    const getUserKey = (u, i) => getUserId(u) || u?.email || `user-${i}`;

    const normalizeRole = (role) => {
        if (typeof role !== "string") return "user";
        return role.toLowerCase();
    };

    const isFraudUser = (u) =>
        parseBoolean(u?.isFraud) ||
        parseBoolean(u?.is_fraud) ||
        String(u?.status || "").toLowerCase() === "fraud";

    const isFraudVendor = (u) =>
        normalizeRole(u?.role) === "vendor" && isFraudUser(u);

    const getDisplayName = (u) =>
        u?.name || u?.email?.split("@")?.[0] || "Unknown User";

    const getAvatar = (u) =>
        normalizeImageUrl(
            u?.image || u?.photoURL || u?.avatar || u?.profileImage || "",
        );

    const formatDate = (date) => {
        const d = getPlainDate(date);
        if (!d) return "N/A";
        const parsed = new Date(d);
        if (isNaN(parsed.getTime())) return "N/A";
        return parsed.toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const currentUserId = getUserId(currentUser);
    const currentUserEmail = currentUser?.email || "";

    const isCurrentUser = (u) => {
        const tid = getUserId(u);
        const te = u?.email || "";
        return (
            (currentUserId && tid && currentUserId === tid) ||
            (currentUserEmail && te && currentUserEmail === te)
        );
    };

    const totalUsers = users.length;
    const totalAdmins = users.filter(
        (u) => normalizeRole(u?.role) === "admin",
    ).length;
    const totalVendors = users.filter(
        (u) => normalizeRole(u?.role) === "vendor",
    ).length;
    const totalFrauds = users.filter((u) => isFraudVendor(u)).length;

    const filteredUsers = useMemo(() => {
        const query = search.trim().toLowerCase();
        return users.filter((u) => {
            const name = u?.name?.toLowerCase() || "";
            const email = u?.email?.toLowerCase() || "";
            const role = normalizeRole(u?.role);
            const fraud = isFraudUser(u);
            const fraudVendor = isFraudVendor(u);
            const matchSearch =
                !query || name.includes(query) || email.includes(query);
            const matchRole = roleFilter === "all" || role === roleFilter;
            const matchStatus =
                statusFilter === "all" ||
                (statusFilter === "active" && !fraud) ||
                (statusFilter === "fraud" && fraudVendor);
            return matchSearch && matchRole && matchStatus;
        });
    }, [users, search, roleFilter, statusFilter]);

    const isButtonBusy = (uid, action) =>
        busy.id === uid && busy.action === action;
    const isActionDisabled = (uid) => !uid || Boolean(busy.id);

    const handleMakeAdmin = async (userId) => {
        if (!userId) {
            toast.error("User ID not found");
            return false;
        }
        try {
            const result = await updateRole(userId, "admin");
            if (result.success) {
                toast.success(result.message);
                setUsers((prev) =>
                    prev.map((u) =>
                        getUserId(u) === userId ? { ...u, role: "admin" } : u,
                    ),
                );
            }
        } catch (e) {
            toast.error("Failed to update");
        }
    };

    const handleMakeVendor = async (userId) => {
        if (!userId) {
            toast.error("User ID not found");
            return false;
        }
        try {
            const result = await updateRole(userId, "vendor");
            if (result.success) {
                toast.success(result.message);
                setUsers((prev) =>
                    prev.map((u) =>
                        getUserId(u) === userId ? { ...u, role: "vendor" } : u,
                    ),
                );
            }
        } catch (e) {
            toast.error("Failed to update");
        }
    };

    const handleMarkFraud = async (userId, name) => {
        if (!userId) {
            toast.error("User ID not found");
            return false;
        }
        try {
            const result = await updateFraudStatus(userId, true);
            if (result.success) {
                toast.success(`${name} marked as fraud`);
                setUsers((prev) =>
                    prev.map((u) =>
                        getUserId(u) === userId
                            ? { ...u, isFraud: true, status: "fraud" }
                            : u,
                    ),
                );
            }
        } catch (e) {
            toast.error("Failed to mark as fraud");
        }
    };

    const handleRemoveFraud = async (userId, name) => {
        if (!userId) {
            toast.error("User ID not found");
            return false;
        }
        try {
            const result = await updateFraudStatus(userId, false);
            if (result.success) {
                toast.success(`${name} restored as active`);
                setUsers((prev) =>
                    prev.map((u) =>
                        getUserId(u) === userId
                            ? { ...u, isFraud: false, status: "active" }
                            : u,
                    ),
                );
            }
        } catch (e) {
            toast.error("Failed to restore status");
        }
    };

    const getRoleChipClass = (role) => {
        const r = normalizeRole(role);
        if (r === "admin")
            return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300";
        if (r === "vendor")
            return "bg-lime-100 text-lime-700 dark:bg-lime-950 dark:text-lime-300";
        return "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300";
    };

    const renderActions = (targetUser, mode = "table") => {
        const uid = getUserId(targetUser);
        const role = normalizeRole(targetUser.role);
        const fraud = isFraudUser(targetUser);
        const name = getDisplayName(targetUser);
        const self = isCurrentUser(targetUser);
        const isMobile = mode === "mobile";

        const wrap = isMobile
            ? "grid grid-cols-1 gap-2 sm:grid-cols-2"
            : "flex flex-wrap items-center gap-2";

        const adminBtn = isMobile
            ? "h-10 w-full justify-center rounded-xl bg-gradient-to-r from-[#064E3B] via-[#059669] to-[#22C55E] px-4 font-black text-white text-sm shadow-lg shadow-emerald-600/25"
            : "h-9 rounded-xl bg-gradient-to-r from-[#064E3B] via-emerald-600 to-green-500 px-3 text-xs font-black text-white shadow-lg shadow-emerald-600/25";

        const vendorBtn = isMobile
            ? "h-10 w-full justify-center rounded-xl bg-gradient-to-r from-[#3F6212] via-[#65A30D] to-[#10B981] px-4 font-black text-white text-sm shadow-lg shadow-lime-600/25"
            : "h-9 rounded-xl bg-gradient-to-r from-lime-600 via-green-500 to-emerald-500 px-3 text-xs font-black text-white shadow-lg shadow-green-500/25";

        const fraudBtn = isMobile
            ? "h-10 w-full justify-center rounded-xl bg-gradient-to-r from-[#DC2626] via-[#B91C1C] to-[#7F1D1D] px-4 font-black text-white text-sm shadow-lg shadow-red-500/25"
            : "h-9 rounded-xl bg-gradient-to-r from-red-600 to-red-800 px-3 text-xs font-black text-white shadow-lg shadow-red-500/25";

        const restoreBtn = isMobile
            ? "h-10 w-full justify-center rounded-xl bg-gradient-to-r from-[#064E3B] via-[#059669] to-[#22C55E] px-4 font-black text-white text-sm shadow-lg shadow-emerald-600/25"
            : "h-9 rounded-xl bg-gradient-to-r from-[#064E3B] via-emerald-600 to-green-500 px-3 text-xs font-black text-white shadow-lg shadow-emerald-600/25";

        return (
            <div className={wrap}>
                {self && (
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 25,
                        }}
                        className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-black text-white shadow-md"
                    >
                        <FiCheckCircle /> You
                    </motion.span>
                )}

                {role === "user" && !fraud && !self && (
                    <>
                        <ConfirmActionDialog
                            triggerIcon={<BiShield className="text-sm" />}
                            triggerText="Make Admin"
                            triggerDisabled={isActionDisabled(uid)}
                            confirmLoading={isButtonBusy(uid, "admin")}
                            triggerClassName={adminBtn}
                            icon={<BiShield className="text-3xl" />}
                            title="Make this user Admin?"
                            description={`"${name}" will get full admin permissions to manage users, tickets, advertisements and platform controls.`}
                            confirmText="Yes, Make Admin"
                            confirmButtonClassName="bg-gradient-to-r from-[#064E3B] via-emerald-600 to-green-500 hover:opacity-90 shadow-emerald-600/30"
                            onConfirm={() => handleMakeAdmin(uid, name)}
                        />
                        <ConfirmActionDialog
                            triggerIcon={<BiStore className="text-sm" />}
                            triggerText="Make Vendor"
                            triggerDisabled={isActionDisabled(uid)}
                            confirmLoading={isButtonBusy(uid, "vendor")}
                            triggerClassName={vendorBtn}
                            icon={<BiStore className="text-3xl" />}
                            title="Make this user Vendor?"
                            description={`"${name}" will become a vendor and can add travel tickets to the platform after approval.`}
                            confirmText="Yes, Make Vendor"
                            confirmButtonClassName="bg-gradient-to-r from-lime-600 via-green-500 to-emerald-500 hover:opacity-90 shadow-green-500/30"
                            onConfirm={() => handleMakeVendor(uid, name)}
                        />
                    </>
                )}

                {role === "vendor" && !fraud && !self && (
                    <>
                        <ConfirmActionDialog
                            triggerIcon={<BiShield className="text-sm" />}
                            triggerText="Make Admin"
                            triggerDisabled={isActionDisabled(uid)}
                            confirmLoading={isButtonBusy(uid, "admin")}
                            triggerClassName={adminBtn}
                            icon={<BiShield className="text-3xl" />}
                            title="Make this vendor Admin?"
                            description={`"${name}" will be promoted from vendor to admin with full platform control.`}
                            confirmText="Yes, Make Admin"
                            confirmButtonClassName="bg-gradient-to-r from-[#064E3B] via-emerald-600 to-green-500 hover:opacity-90 shadow-emerald-600/30"
                            onConfirm={() => handleMakeAdmin(uid, name)}
                        />
                        <ConfirmActionDialog
                            triggerIcon={
                                <FiAlertTriangle className="text-sm" />
                            }
                            triggerText="Mark Fraud"
                            triggerDisabled={isActionDisabled(uid)}
                            confirmLoading={isButtonBusy(uid, "fraud")}
                            triggerClassName={fraudBtn}
                            icon={<FiAlertTriangle className="text-3xl" />}
                            iconBoxClassName="bg-red-50 text-red-500 dark:bg-red-950/50 dark:text-red-400"
                            title="Mark vendor as Fraud?"
                            description={`"${name}" will be flagged as fraud. All their tickets will be hidden and they will lose the ability to add new tickets.`}
                            confirmText="Yes, Mark Fraud"
                            confirmButtonClassName="bg-gradient-to-r from-red-600 to-red-700 hover:opacity-90 shadow-red-600/30"
                            onConfirm={() => handleMarkFraud(uid, name)}
                        />
                    </>
                )}

                {role === "vendor" && fraud && !self && (
                    <ConfirmActionDialog
                        triggerIcon={<FiCheckCircle className="text-sm" />}
                        triggerText="Remove Fraud"
                        triggerDisabled={isActionDisabled(uid)}
                        confirmLoading={isButtonBusy(uid, "restore")}
                        triggerClassName={restoreBtn}
                        icon={<FiCheckCircle className="text-3xl" />}
                        title="Remove fraud restriction?"
                        description={`"${name}" will be restored as an active vendor. Their tickets will become visible again.`}
                        confirmText="Yes, Restore Vendor"
                        confirmButtonClassName="bg-gradient-to-r from-[#064E3B] via-emerald-600 to-green-500 hover:opacity-90 shadow-emerald-600/30"
                        onConfirm={() => handleRemoveFraud(uid, name)}
                    />
                )}

                {role === "admin" && !fraud && !self && (
                    <ConfirmActionDialog
                        triggerIcon={<BiStore className="text-sm" />}
                        triggerText="Make Vendor"
                        triggerDisabled={isActionDisabled(uid)}
                        confirmLoading={isButtonBusy(uid, "vendor")}
                        triggerClassName={vendorBtn}
                        icon={<BiStore className="text-3xl" />}
                        title="Demote this admin to Vendor?"
                        description={`"${name}" will lose admin permissions and become a vendor.`}
                        confirmText="Yes, Make Vendor"
                        confirmButtonClassName="bg-gradient-to-r from-lime-600 via-green-500 to-emerald-500 hover:opacity-90 shadow-green-500/30"
                        onConfirm={() => handleMakeVendor(uid, name)}
                    />
                )}

                {role === "admin" && !fraud && (
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                    >
                        <FiCheckCircle /> Admin Now
                    </motion.span>
                )}
                {role === "vendor" && !fraud && (
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-1 rounded-xl bg-lime-50 px-3 py-1.5 text-xs font-black text-lime-700 dark:bg-lime-950/40 dark:text-lime-300"
                    >
                        <FiCheckCircle /> Vendor Now
                    </motion.span>
                )}
                {role === "user" && !fraud && (
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-1 rounded-xl bg-teal-50 px-3 py-1.5 text-xs font-black text-teal-700 dark:bg-teal-950/40 dark:text-teal-300"
                    >
                        <FiCheckCircle /> Regular User
                    </motion.span>
                )}
                {role === "vendor" && fraud && (
                    <motion.span
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-black text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
                    >
                        <FiAlertTriangle /> Fraud Marked
                    </motion.span>
                )}
            </div>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen space-y-5 rounded-[28px] bg-[#F0FDF4] p-1 sm:space-y-7 sm:p-5 lg:p- dark:bg-[#06130D]"
        >
            <motion.div
                variants={heroVariants}
                initial="hidden"
                animate="visible"
                className="relative hidden md:block overflow-hidden rounded-[26px] bg-gradient-to-r from-[#052E16] via-[#16A34A] to-[#34D399] shadow-[0_24px_70px_rgba(22,163,74,0.28)] sm:rounded-[30px] sm:p-6 lg:p-8"
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
                            Manage Users
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
                            Control user roles, promote trusted members to
                            vendors or admins, and protect your platform from
                            fraudulent vendors.
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
                                key={filteredUsers.length}
                                initial={{ scale: 1.3 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 20,
                                }}
                                className="text-2xl font-black text-emerald-600"
                            >
                                {filteredUsers.length}
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
                                {totalUsers}
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
                    title="Total Users"
                    value={totalUsers}
                    Icon={FiUsers}
                    numberClass="text-emerald-600"
                    iconClass="bg-gradient-to-br from-emerald-600 to-green-400"
                    cardClass="from-emerald-50 via-white to-green-50 dark:from-emerald-950/50 dark:via-[#07111F] dark:to-green-950/30"
                    borderClass="border-emerald-100 dark:border-emerald-900/50"
                />
                <StatCard
                    title="Total Admins"
                    value={totalAdmins}
                    Icon={BiShield}
                    numberClass="text-green-700"
                    iconClass="bg-gradient-to-br from-green-700 to-emerald-500"
                    cardClass="from-green-50 via-white to-emerald-50 dark:from-green-950/50 dark:via-[#07111F] dark:to-green-950/30"
                    borderClass="border-green-100 dark:border-green-900/50"
                />
                <StatCard
                    title="Total Vendors"
                    value={totalVendors}
                    Icon={BiStore}
                    numberClass="text-lime-600"
                    iconClass="bg-gradient-to-br from-lime-600 to-emerald-500"
                    cardClass="from-lime-50 via-white to-emerald-50 dark:from-lime-950/40 dark:via-[#07111F] dark:to-emerald-950/30"
                    borderClass="border-lime-100 dark:border-lime-900/50"
                />
                <StatCard
                    title="Fraud Vendors"
                    value={totalFrauds}
                    Icon={FiAlertTriangle}
                    numberClass="text-red-600"
                    iconClass="bg-gradient-to-br from-red-600 to-red-800"
                    cardClass="from-red-50 via-white to-orange-50 dark:from-red-950/50 dark:via-[#07111F] dark:to-orange-950/30"
                    borderClass="border-red-100 dark:border-red-900/50"
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
                                Users Directory
                            </h2>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                View all users, roles, status and available
                                actions.
                            </p>
                        </motion.div>
                        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[1fr_150px_150px_100px] xl:items-center 2xl:w-[880px]">
                            <motion.div
                                variants={filterItemVariants}
                                className="relative sm:col-span-2 xl:col-span-1"
                            >
                                <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-emerald-600 dark:text-emerald-300" />
                                <input
                                    type="text"
                                    placeholder="Search name or email..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="h-11 w-full rounded-2xl border border-emerald-200/90 bg-white/95 pl-10 pr-4 text-sm font-semibold text-[#052E16] caret-emerald-600 outline-none transition placeholder:text-emerald-600/55 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 dark:border-emerald-800/70 dark:bg-[#081C13] dark:text-emerald-50"
                                />
                            </motion.div>
                            <motion.select
                                variants={filterItemVariants}
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="h-11 w-full rounded-2xl border border-emerald-200/90 bg-white/95 px-4 text-sm font-bold text-[#052E16] outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 dark:border-emerald-800/70 dark:bg-[#081C13] dark:text-emerald-50"
                            >
                                <option value="all">All Roles</option>
                                <option value="user">Users</option>
                                <option value="vendor">Vendors</option>
                                <option value="admin">Admins</option>
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
                                <option value="active">Active</option>
                                <option value="fraud">Fraud</option>
                            </motion.select>
                            <motion.button
                                variants={filterItemVariants}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                type="button"
                                onClick={() => {
                                    setSearch("");
                                    setRoleFilter("all");
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
                        {filteredUsers.length === 0 ? (
                            <motion.div
                                key="empty"
                                variants={emptyStateVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                className="flex items-center gap-3 rounded-3xl border border-emerald-100 bg-emerald-50/60 p-5 dark:border-emerald-900/50 dark:bg-emerald-950/20"
                            >
                                <motion.div
                                    animate={{ y: [0, -3, 0] }}
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
                                        No users found
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
                                {filteredUsers.map((targetUser, index) => {
                                    const uid = getUserId(targetUser);
                                    const rowKey = getUserKey(
                                        targetUser,
                                        index,
                                    );
                                    const role = normalizeRole(targetUser.role);
                                    const fraud = isFraudUser(targetUser);
                                    const name = getDisplayName(targetUser);
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
                                            className="relative overflow-hidden rounded-[28px] border border-emerald-200/80 bg-gradient-to-br from-white via-[#F0FDF4] to-[#ECFCCB] p-4 shadow-[0_18px_55px_rgba(6,78,59,0.13)] dark:border-emerald-800/70 dark:from-[#06130D] dark:via-[#082016] dark:to-[#142C10]"
                                        >
                                            <div className="absolute -right-14 -top-14 h-32 w-32 rounded-full bg-emerald-400/20 blur-2xl" />
                                            <div className="relative z-10 flex items-start justify-between gap-3">
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <UserAvatar
                                                        src={getAvatar(
                                                            targetUser,
                                                        )}
                                                        name={name}
                                                        className="border-2 border-white shadow-md ring-2 ring-emerald-100 dark:border-[#07111F] dark:ring-emerald-900/50"
                                                    />
                                                    <div className="min-w-0">
                                                        <p className="truncate font-black text-[#064E3B] dark:text-white">
                                                            {name}
                                                        </p>
                                                        <p className="text-xs font-semibold text-gray-400">
                                                            ID:{" "}
                                                            {uid
                                                                ? String(
                                                                      uid,
                                                                  ).slice(0, 8)
                                                                : "N/A"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <motion.span
                                                    key={
                                                        fraud
                                                            ? "fraud"
                                                            : "active"
                                                    }
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
                                                    className={`shrink-0 rounded-lg px-2 py-1 text-xs font-black ${
                                                        fraud
                                                            ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                                                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                                    }`}
                                                >
                                                    {fraud ? "Fraud" : "Active"}
                                                </motion.span>
                                            </div>
                                            <div className="relative z-10 mt-4 grid grid-cols-1 gap-3 rounded-2xl border border-emerald-100/80 bg-white/85 p-4 text-sm shadow-inner backdrop-blur sm:grid-cols-2 dark:border-emerald-900/60 dark:bg-[#04130B]/75">
                                                <div className="min-w-0">
                                                    <p className="mb-1 text-xs font-black uppercase text-emerald-700 dark:text-emerald-300">
                                                        Email
                                                    </p>
                                                    <div className="flex min-w-0 items-center gap-2 font-semibold text-gray-600 dark:text-gray-300">
                                                        <FiMail className="shrink-0 text-emerald-600" />
                                                        <span className="break-all">
                                                            {targetUser.email ||
                                                                "No email"}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="mb-1 text-xs font-black uppercase text-emerald-700 dark:text-emerald-300">
                                                        Role
                                                    </p>
                                                    <motion.span
                                                        key={role}
                                                        initial={{
                                                            scale: 0.85,
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
                                                        className={`inline-block rounded-lg px-2 py-1 text-xs font-black capitalize ${getRoleChipClass(role)}`}
                                                    >
                                                        {role}
                                                    </motion.span>
                                                </div>
                                                <div>
                                                    <p className="mb-1 text-xs font-black uppercase text-emerald-700 dark:text-emerald-300">
                                                        Joined
                                                    </p>
                                                    <div className="flex items-center gap-2 font-semibold text-gray-600 dark:text-gray-300">
                                                        <FiCalendar className="text-lime-600" />
                                                        {formatDate(
                                                            targetUser.createdAt ||
                                                                targetUser.created_at,
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="relative z-10 mt-4 border-t border-emerald-100 pt-4 dark:border-emerald-900/50">
                                                {renderActions(
                                                    targetUser,
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
                                aria-label="Manage users table"
                                className="min-w-[1100px]"
                            >
                                <Table.Header>
                                    <Table.Column isRowHeader>
                                        User
                                    </Table.Column>
                                    <Table.Column>Email</Table.Column>
                                    <Table.Column>Role</Table.Column>
                                    <Table.Column>Joined</Table.Column>
                                    <Table.Column>Status</Table.Column>
                                    <Table.Column>
                                        Available Actions
                                    </Table.Column>
                                </Table.Header>
                                <Table.Body>
                                    {filteredUsers.length === 0 ? (
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
                                                            No users found
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
                                        </Table.Row>
                                    ) : (
                                        filteredUsers.map(
                                            (targetUser, index) => {
                                                const uid =
                                                    getUserId(targetUser);
                                                const rowKey = getUserKey(
                                                    targetUser,
                                                    index,
                                                );
                                                const role = normalizeRole(
                                                    targetUser.role,
                                                );
                                                const fraud =
                                                    isFraudUser(targetUser);
                                                const name =
                                                    getDisplayName(targetUser);

                                                return (
                                                    <Table.Row
                                                        key={`d-${rowKey}`}
                                                    >
                                                        <Table.Cell>
                                                            <div className="flex items-center gap-3 py-2">
                                                                <UserAvatar
                                                                    src={getAvatar(
                                                                        targetUser,
                                                                    )}
                                                                    name={name}
                                                                    className="border-2 border-white shadow-md ring-2 ring-emerald-100 dark:border-[#07111F] dark:ring-emerald-900/50"
                                                                />
                                                                <div>
                                                                    <p className="font-black text-[#064E3B] dark:text-white">
                                                                        {name}
                                                                    </p>
                                                                    <p className="text-xs font-semibold text-gray-400">
                                                                        ID:{" "}
                                                                        {uid
                                                                            ? String(
                                                                                  uid,
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
                                                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                                                <FiMail className="shrink-0 text-emerald-600" />
                                                                <span>
                                                                    {targetUser.email ||
                                                                        "No email"}
                                                                </span>
                                                            </div>
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <motion.span
                                                                key={role}
                                                                initial={{
                                                                    scale: 0.85,
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
                                                                className={`inline-block rounded-lg px-2.5 py-1 text-xs font-black capitalize ${getRoleChipClass(role)}`}
                                                            >
                                                                {role}
                                                            </motion.span>
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
                                                                <FiCalendar className="text-lime-600" />
                                                                {formatDate(
                                                                    targetUser.createdAt ||
                                                                        targetUser.created_at,
                                                                )}
                                                            </div>
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <motion.span
                                                                key={
                                                                    fraud
                                                                        ? "fraud"
                                                                        : "active"
                                                                }
                                                                initial={{
                                                                    scale: 0.85,
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
                                                                className={`inline-block rounded-lg px-2.5 py-1 text-xs font-black ${
                                                                    fraud
                                                                        ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300"
                                                                        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                                                }`}
                                                            >
                                                                {fraud
                                                                    ? "Fraud"
                                                                    : "Active"}
                                                            </motion.span>
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {renderActions(
                                                                targetUser,
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
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default ManageUsersTable;
