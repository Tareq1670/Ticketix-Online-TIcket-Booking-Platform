"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Table } from "@heroui/react";
import toast from "react-hot-toast";
import { FaTicketAlt } from "react-icons/fa";
import { BiSearch } from "react-icons/bi";
import {
    FiRefreshCw,
    FiMapPin,
    FiCalendar,
    FiCheckCircle,
    FiDollarSign,
    FiPackage,
    FiStar,
    FiVolume2,
    FiVolumeX,
} from "react-icons/fi";
import {
    MdOutlineAirplanemodeActive,
    MdDirectionsBus,
    MdTrain,
    MdDirectionsBoat,
} from "react-icons/md";
import { toggleAdvertise } from "@/lib/actions/advertise";

// ─── Helpers ───
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

const toTicketsArray = (value) => {
    if (!Array.isArray(value)) return [];
    return Array.from(value).filter(Boolean);
};

const formatDate = (date) => {
    if (!date) return "N/A";
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
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

// ─── Ticket Image ───
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
                <img
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

// ─── Stat Card ───
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
        className={`group relative overflow-hidden rounded-[24px] border ${borderClass} bg-gradient-to-br ${cardClass} p-5 shadow-[0_18px_50px_rgba(6,78,59,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_80px_rgba(6,78,59,0.16)] sm:rounded-[26px]`}
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
                className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-xl transition-transform duration-300 group-hover:scale-110 sm:h-14 sm:w-14 ${iconClass}`}
            >
                <Icon className="text-2xl" />
            </div>
        </div>
    </div>
);

// ─── Toggle Switch ───
const AdvertiseToggle = ({ isOn, loading, onToggle, disabled }) => {
    return (
        <button
            type="button"
            onClick={onToggle}
            disabled={loading || disabled}
            className={`relative inline-flex h-8 w-[52px] shrink-0 cursor-pointer items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-50 ${
                isOn
                    ? "bg-gradient-to-r from-emerald-500 to-green-400 shadow-lg shadow-emerald-500/30 focus:ring-emerald-500/20"
                    : "bg-gray-200 shadow-inner focus:ring-gray-300/30 dark:bg-gray-700"
            }`}
            aria-label={isOn ? "Unadvertise ticket" : "Advertise ticket"}
        >
            {loading ? (
                <span className="absolute inset-0 flex items-center justify-center">
                    <svg
                        className="h-4 w-4 animate-spin text-white"
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
                </span>
            ) : (
                <span
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 ${
                        isOn ? "translate-x-[22px]" : "translate-x-[3px]"
                    }`}
                >
                    {isOn ? (
                        <FiVolume2 className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                        <FiVolumeX className="h-3.5 w-3.5 text-gray-400" />
                    )}
                </span>
            )}
        </button>
    );
};

// ═══════════════════════════════════════════════
// ─── MAIN COMPONENT ───
// ═══════════════════════════════════════════════
const AdvertiseTicketsTable = ({ tickets: initialTickets }) => {
    const [tickets, setTickets] = useState(() =>
        toTicketsArray(initialTickets)
    );
    const [search, setSearch] = useState("");
    const [transportFilter, setTransportFilter] = useState("all");
    const [advertiseFilter, setAdvertiseFilter] = useState("all");
    const [busy, setBusy] = useState(null);

    useEffect(() => {
        setTickets(toTicketsArray(initialTickets));
    }, [initialTickets]);

    const getTicketId = (t) => getPlainId(t?._id || t?.id);
    const getTicketKey = (t, i) => getTicketId(t) || `ticket-${i}`;

    // Ticket field getters
    const getTitle = (t) => t?.title || t?.ticketTitle || "Untitled Ticket";
    const getFrom = (t) => t?.from || t?.fromLocation || "N/A";
    const getTo = (t) => t?.to || t?.toLocation || "N/A";
    const getTransport = (t) =>
        t?.transportType || t?.transport_type || "Unknown";
    const getPrice = (t) => t?.price || t?.ticketPrice || 0;
    const getQuantity = (t) => t?.ticketQuantity || t?.quantity || 0;
    const getImage = (t) =>
        normalizeImageUrl(t?.image || t?.ticketImage || "");
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

    // Counts
    const advertisedCount = useMemo(
        () => tickets.filter((t) => parseBoolean(t?.isAdvertised)).length,
        [tickets]
    );
    const totalTickets = tickets.length;
    const slotsAvailable = 6 - advertisedCount;

    // Filter
    const filteredTickets = useMemo(() => {
        const query = search.trim().toLowerCase();
        return tickets.filter((t) => {
            const title = getTitle(t).toLowerCase();
            const from = getFrom(t).toLowerCase();
            const to = getTo(t).toLowerCase();
            const transport = getTransport(t).toLowerCase();
            const isAd = parseBoolean(t?.isAdvertised);

            const matchSearch =
                !query ||
                title.includes(query) ||
                from.includes(query) ||
                to.includes(query);

            const matchTransport =
                transportFilter === "all" ||
                transport.includes(transportFilter.toLowerCase());

            const matchAdvertise =
                advertiseFilter === "all" ||
                (advertiseFilter === "advertised" && isAd) ||
                (advertiseFilter === "not-advertised" && !isAd);

            return matchSearch && matchTransport && matchAdvertise;
        });
    }, [tickets, search, transportFilter, advertiseFilter]);

    // Toggle handler
    const handleToggleAdvertise = async (ticketId, currentStatus, title) => {
        const newStatus = !currentStatus;

        if (newStatus && advertisedCount >= 6) {
            toast.error(
                "Maximum 6 tickets can be advertised. Please unadvertise one first.",
                { duration: 4000 }
            );
            return;
        }

        setBusy(ticketId);
        try {
            const result = await toggleAdvertise(ticketId, newStatus);

            if (result.success) {
                toast.success(
                    newStatus
                        ? `"${title}" is now advertised on homepage!`
                        : `"${title}" removed from advertisement.`
                );
                setTickets((prev) =>
                    prev.map((t) =>
                        getTicketId(t) === ticketId
                            ? {
                                  ...t,
                                  isAdvertised: newStatus,
                                  advertisedAt: newStatus
                                      ? new Date().toISOString()
                                      : null,
                              }
                            : t
                    )
                );
            } else {
                toast.error(result.message || "Failed to update");
            }
        } catch (e) {
            toast.error("Failed to update advertise status");
        } finally {
            setBusy(null);
        }
    };

    return (
        <div className="min-h-screen space-y-5 rounded-[28px] bg-[#F0FDF4] p-3 sm:space-y-7 sm:p-5 lg:p-6 dark:bg-[#06130D]">
            {/* ─── Header Banner ─── */}
            <div className="relative hidden md:block overflow-hidden rounded-[26px] bg-gradient-to-r from-[#052E16] via-[#16A34A] to-[#34D399] p-5 shadow-[0_24px_70px_rgba(22,163,74,0.28)] sm:rounded-[30px] sm:p-6 lg:p-8">
                <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/15 blur-3xl" />
                <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-lime-300/30 blur-3xl" />
                <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        
                        <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
                            Advertise Tickets
                        </h1>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-green-50">
                            Promote approved tickets to the homepage
                            advertisement section. You can advertise up to 6
                            tickets at a time.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 rounded-2xl border border-white/20 bg-white/15 p-3 backdrop-blur-xl sm:min-w-[280px]">
                        <div className="rounded-2xl bg-white/95 p-4 text-center shadow-lg dark:bg-[#07111F]/90">
                            <p className="text-2xl font-black text-emerald-600">
                                {advertisedCount}
                                <span className="text-base font-bold text-gray-400">
                                    /6
                                </span>
                            </p>
                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                                Advertised
                            </p>
                        </div>
                        <div className="rounded-2xl bg-white/95 p-4 text-center shadow-lg dark:bg-[#07111F]/90">
                            <p className="text-2xl font-black text-lime-600">
                                {totalTickets}
                            </p>
                            <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
                                Approved
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Stat Cards ─── */}
            <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Total Approved"
                    value={totalTickets}
                    Icon={FaTicketAlt}
                    numberClass="text-emerald-600"
                    iconClass="bg-gradient-to-br from-emerald-600 to-green-400"
                    cardClass="from-emerald-50 via-white to-green-50 dark:from-emerald-950/50 dark:via-[#07111F] dark:to-green-950/30"
                    borderClass="border-emerald-100 dark:border-emerald-900/50"
                />
                <StatCard
                    title="Advertised"
                    value={advertisedCount}
                    Icon={FiVolume2}
                    numberClass="text-green-700"
                    iconClass="bg-gradient-to-br from-green-700 to-emerald-500"
                    cardClass="from-green-50 via-white to-emerald-50 dark:from-green-950/50 dark:via-[#07111F] dark:to-green-950/30"
                    borderClass="border-green-100 dark:border-green-900/50"
                />
                <StatCard
                    title="Not Advertised"
                    value={totalTickets - advertisedCount}
                    Icon={FiVolumeX}
                    numberClass="text-lime-600"
                    iconClass="bg-gradient-to-br from-lime-600 to-emerald-500"
                    cardClass="from-lime-50 via-white to-emerald-50 dark:from-lime-950/40 dark:via-[#07111F] dark:to-emerald-950/30"
                    borderClass="border-lime-100 dark:border-lime-900/50"
                />
                <StatCard
                    title="Slots Available"
                    value={slotsAvailable < 0 ? 0 : slotsAvailable}
                    Icon={FiStar}
                    numberClass="text-amber-600"
                    iconClass="bg-gradient-to-br from-amber-500 to-orange-500"
                    cardClass="from-amber-50 via-white to-orange-50 dark:from-amber-950/50 dark:via-[#07111F] dark:to-orange-950/30"
                    borderClass="border-amber-100 dark:border-amber-900/50"
                />
            </div>

            {/* ─── Limit Warning ─── */}
            {advertisedCount >= 6 && (
                <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-4 shadow-md dark:border-amber-900/50 dark:from-amber-950/30 dark:to-orange-950/30">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950">
                        <FiStar className="text-xl text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                        <p className="text-sm font-black text-amber-800 dark:text-amber-200">
                            Maximum Advertisement Limit Reached
                        </p>
                        <p className="text-xs text-amber-600 dark:text-amber-400">
                            You have advertised 6 tickets. Unadvertise one to
                            add another.
                        </p>
                    </div>
                </div>
            )}

            {/* ─── Table Section ─── */}
            <div className="overflow-hidden rounded-[26px] border border-emerald-100 bg-white shadow-[0_25px_80px_rgba(6,78,59,0.1)] sm:rounded-[30px] dark:border-emerald-900/50 dark:bg-[#07111F]">
                {/* Filters */}
                <div className="border-b border-emerald-100 bg-gradient-to-r from-white via-emerald-50/60 to-green-50 p-4 sm:p-5 dark:border-emerald-900/50 dark:from-[#07111F] dark:via-[#052E16] dark:to-[#064E3B]">
                    <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-center 2xl:justify-between">
                        <div>
                            <h2 className="text-lg font-black text-[#064E3B] sm:text-xl dark:text-white">
                                Approved Tickets Directory
                            </h2>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Toggle advertisement status for approved
                                tickets. Max 6 at a time.
                            </p>
                        </div>
                        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[1fr_160px_170px_100px] xl:items-center 2xl:w-[880px]">
                            <div className="relative sm:col-span-2 xl:col-span-1">
                                <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-xl text-emerald-600 dark:text-emerald-300" />
                                <input
                                    type="text"
                                    placeholder="Search title, from, to..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="h-11 w-full rounded-2xl border border-emerald-200/90 bg-white/95 pl-10 pr-4 text-sm font-semibold text-[#052E16] caret-emerald-600 outline-none transition placeholder:text-emerald-600/55 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 dark:border-emerald-800/70 dark:bg-[#081C13] dark:text-emerald-50"
                                />
                            </div>
                            <select
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
                            </select>
                            <select
                                value={advertiseFilter}
                                onChange={(e) =>
                                    setAdvertiseFilter(e.target.value)
                                }
                                className="h-11 w-full rounded-2xl border border-emerald-200/90 bg-white/95 px-4 text-sm font-bold text-[#052E16] outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 dark:border-emerald-800/70 dark:bg-[#081C13] dark:text-emerald-50"
                            >
                                <option value="all">All Status</option>
                                <option value="advertised">Advertised</option>
                                <option value="not-advertised">
                                    Not Advertised
                                </option>
                            </select>
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch("");
                                    setTransportFilter("all");
                                    setAdvertiseFilter("all");
                                }}
                                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#064E3B] via-emerald-600 to-green-500 px-4 font-black text-white shadow-lg shadow-emerald-700/25 transition hover:opacity-90 sm:col-span-2 xl:col-span-1"
                            >
                                <FiRefreshCw /> Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* ─── Mobile Cards ─── */}
                <div className="block bg-gradient-to-br from-[#ECFDF5] via-[#F8FFF9] to-[#F7FEE7] p-4 lg:hidden dark:from-[#04130B] dark:via-[#071A12] dark:to-[#102A0D]">
                    {filteredTickets.length === 0 ? (
                        <div className="flex items-center gap-3 rounded-3xl border border-emerald-100 bg-emerald-50/60 p-5 dark:border-emerald-900/50 dark:bg-emerald-950/20">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-600 dark:bg-[#06130D]">
                                <BiSearch className="text-2xl" />
                            </div>
                            <div>
                                <p className="font-bold text-[#064E3B] dark:text-white">
                                    No tickets found
                                </p>
                                <p className="text-sm text-gray-500">
                                    Try changing search or filter options.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {filteredTickets.map((ticket, index) => {
                                const tid = getTicketId(ticket);
                                const rowKey = getTicketKey(ticket, index);
                                const title = getTitle(ticket);
                                const isAd = parseBoolean(
                                    ticket?.isAdvertised
                                );
                                const transport = getTransport(ticket);
                                const TransportIconComp =
                                    getTransportIcon(transport);
                                const perks = getPerks(ticket);

                                return (
                                    <div
                                        key={`m-${rowKey}`}
                                        className={`relative overflow-hidden rounded-[28px] border p-4 shadow-[0_18px_55px_rgba(6,78,59,0.13)] transition-all ${
                                            isAd
                                                ? "border-emerald-300 bg-gradient-to-br from-emerald-50 via-[#F0FDF4] to-[#ECFCCB] dark:border-emerald-700 dark:from-[#06130D] dark:via-[#082016] dark:to-[#142C10]"
                                                : "border-emerald-200/80 bg-gradient-to-br from-white via-[#F0FDF4] to-[#ECFCCB] dark:border-emerald-800/70 dark:from-[#06130D] dark:via-[#082016] dark:to-[#142C10]"
                                        }`}
                                    >
                                        <div className="absolute -right-14 -top-14 h-32 w-32 rounded-full bg-emerald-400/20 blur-2xl" />

                                        {/* Top */}
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
                                            {isAd ? (
                                                <span className="shrink-0 rounded-lg bg-emerald-100 px-2 py-1 text-xs font-black text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                                    Advertised
                                                </span>
                                            ) : (
                                                <span className="shrink-0 rounded-lg bg-gray-100 px-2 py-1 text-xs font-black text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                                                    Not Ad
                                                </span>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="relative z-10 mt-4 grid grid-cols-2 gap-3 rounded-2xl border border-emerald-100/80 bg-white/85 p-4 text-sm shadow-inner backdrop-blur dark:border-emerald-900/60 dark:bg-[#04130B]/75">
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
                                                        {formatDate(
                                                            getDeparture(
                                                                ticket
                                                            )
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
                                                        {perks.map((p, i) => (
                                                            <span
                                                                key={i}
                                                                className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                                            >
                                                                {p}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Toggle */}
                                        <div className="relative z-10 mt-4 flex items-center justify-between border-t border-emerald-100 pt-4 dark:border-emerald-900/50">
                                            <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                                                {isAd
                                                    ? "Currently advertised"
                                                    : "Not advertised"}
                                            </span>
                                            <div className="flex items-center gap-3">
                                                <AdvertiseToggle
                                                    isOn={isAd}
                                                    loading={busy === tid}
                                                    disabled={
                                                        !isAd &&
                                                        advertisedCount >= 6
                                                    }
                                                    onToggle={() =>
                                                        handleToggleAdvertise(
                                                            tid,
                                                            isAd,
                                                            title
                                                        )
                                                    }
                                                />
                                                <span className="text-xs font-bold text-gray-400">
                                                    {isAd ? "ON" : "OFF"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* ─── Desktop Table ─── */}
                <div className="hidden lg:block">
                    <Table>
                        <Table.ScrollContainer>
                            <Table.Content
                                aria-label="Advertise tickets table"
                                className="min-w-[1100px]"
                            >
                                <Table.Header>
                                    <Table.Column isRowHeader>
                                        Ticket
                                    </Table.Column>
                                    <Table.Column>Route</Table.Column>
                                    <Table.Column>Transport</Table.Column>
                                    <Table.Column>Price</Table.Column>
                                    <Table.Column>Qty</Table.Column>
                                    <Table.Column>Departure</Table.Column>
                                    <Table.Column>Perks</Table.Column>
                                    <Table.Column>Status</Table.Column>
                                    <Table.Column>Advertise</Table.Column>
                                </Table.Header>
                                <Table.Body>
                                    {filteredTickets.length === 0 ? (
                                        <Table.Row>
                                            <Table.Cell>
                                                <div className="flex items-center gap-3 py-8">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/50">
                                                        <BiSearch className="text-2xl text-emerald-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-[#064E3B] dark:text-white">
                                                            No tickets found
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            Try changing search
                                                            or filter options.
                                                        </p>
                                                    </div>
                                                </div>
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
                                        filteredTickets.map(
                                            (ticket, index) => {
                                                const tid =
                                                    getTicketId(ticket);
                                                const rowKey = getTicketKey(
                                                    ticket,
                                                    index
                                                );
                                                const title =
                                                    getTitle(ticket);
                                                const isAd = parseBoolean(
                                                    ticket?.isAdvertised
                                                );
                                                const transport =
                                                    getTransport(ticket);
                                                const TransportIconComp =
                                                    getTransportIcon(
                                                        transport
                                                    );
                                                const perks =
                                                    getPerks(ticket);

                                                return (
                                                    <Table.Row
                                                        key={`d-${rowKey}`}
                                                    >
                                                        {/* Ticket */}
                                                        <Table.Cell>
                                                            <div className="flex items-center gap-3 py-2">
                                                                <TicketImage
                                                                    src={getImage(
                                                                        ticket
                                                                    )}
                                                                    title={
                                                                        title
                                                                    }
                                                                    className="border-2 border-white shadow-md ring-2 ring-emerald-100 dark:border-[#07111F] dark:ring-emerald-900/50"
                                                                />
                                                                <div>
                                                                    <p className="max-w-[180px] truncate font-black text-[#064E3B] dark:text-white">
                                                                        {title}
                                                                    </p>
                                                                    <p className="text-xs font-semibold text-gray-400">
                                                                        ID:{" "}
                                                                        {tid
                                                                            ? String(
                                                                                  tid
                                                                              ).slice(
                                                                                  0,
                                                                                  8
                                                                              )
                                                                            : "N/A"}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </Table.Cell>

                                                        {/* Route */}
                                                        <Table.Cell>
                                                            <div className="flex items-center gap-1 text-sm font-semibold text-gray-600 dark:text-gray-300">
                                                                <FiMapPin className="shrink-0 text-emerald-600" />
                                                                <span className="max-w-[80px] truncate">
                                                                    {getFrom(
                                                                        ticket
                                                                    )}
                                                                </span>
                                                                <span className="font-black text-emerald-500">
                                                                    →
                                                                </span>
                                                                <span className="max-w-[80px] truncate">
                                                                    {getTo(
                                                                        ticket
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </Table.Cell>

                                                        {/* Transport */}
                                                        <Table.Cell>
                                                            <span
                                                                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-black capitalize ${getTransportColor(transport)}`}
                                                            >
                                                                <TransportIconComp className="text-sm" />
                                                                {transport}
                                                            </span>
                                                        </Table.Cell>

                                                        {/* Price */}
                                                        <Table.Cell>
                                                            <span className="text-sm font-black text-emerald-700 dark:text-emerald-300">
                                                                ৳
                                                                {getPrice(
                                                                    ticket
                                                                )}
                                                            </span>
                                                        </Table.Cell>

                                                        {/* Qty */}
                                                        <Table.Cell>
                                                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                                                                {getQuantity(
                                                                    ticket
                                                                )}
                                                            </span>
                                                        </Table.Cell>

                                                        {/* Departure */}
                                                        <Table.Cell>
                                                            <div className="flex items-center gap-1 text-sm font-semibold text-gray-500 dark:text-gray-400">
                                                                <FiCalendar className="text-lime-600" />
                                                                {formatDateTime(
                                                                    getDeparture(
                                                                        ticket
                                                                    )
                                                                )}
                                                            </div>
                                                        </Table.Cell>

                                                        {/* Perks */}
                                                        <Table.Cell>
                                                            <div className="flex max-w-[150px] flex-wrap gap-1">
                                                                {perks.length >
                                                                0 ? (
                                                                    perks
                                                                        .slice(
                                                                            0,
                                                                            3
                                                                        )
                                                                        .map(
                                                                            (
                                                                                p,
                                                                                i
                                                                            ) => (
                                                                                <span
                                                                                    key={
                                                                                        i
                                                                                    }
                                                                                    className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                                                                >
                                                                                    {
                                                                                        p
                                                                                    }
                                                                                </span>
                                                                            )
                                                                        )
                                                                ) : (
                                                                    <span className="text-xs text-gray-400">
                                                                        None
                                                                    </span>
                                                                )}
                                                                {perks.length >
                                                                    3 && (
                                                                    <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                                                                        +
                                                                        {perks.length -
                                                                            3}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </Table.Cell>

                                                        {/* Status */}
                                                        <Table.Cell>
                                                            {isAd ? (
                                                                <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-black text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                                                    <FiCheckCircle className="text-xs" />
                                                                    Advertised
                                                                </span>
                                                            ) : (
                                                                <span className="inline-block rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-black text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                                                                    Not Ad
                                                                </span>
                                                            )}
                                                        </Table.Cell>

                                                        {/* Toggle */}
                                                        <Table.Cell>
                                                            <div className="flex items-center gap-3">
                                                                <AdvertiseToggle
                                                                    isOn={isAd}
                                                                    loading={
                                                                        busy ===
                                                                        tid
                                                                    }
                                                                    disabled={
                                                                        !isAd &&
                                                                        advertisedCount >=
                                                                            6
                                                                    }
                                                                    onToggle={() =>
                                                                        handleToggleAdvertise(
                                                                            tid,
                                                                            isAd,
                                                                            title
                                                                        )
                                                                    }
                                                                />
                                                                <span className="text-xs font-bold text-gray-400">
                                                                    {isAd
                                                                        ? "ON"
                                                                        : "OFF"}
                                                                </span>
                                                            </div>
                                                        </Table.Cell>
                                                    </Table.Row>
                                                );
                                            }
                                        )
                                    )}
                                </Table.Body>
                            </Table.Content>
                        </Table.ScrollContainer>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default AdvertiseTicketsTable;