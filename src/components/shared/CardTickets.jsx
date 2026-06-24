"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FaBus, FaTrain, FaPlane, FaShip, FaBusAlt } from "react-icons/fa";
import {
    MdLocationOn,
    MdArrowForward,
    MdAccessTime,
    MdDateRange,
} from "react-icons/md";
import { TbCurrencyTaka } from "react-icons/tb";
import { FiPackage } from "react-icons/fi";
import { IoTicketSharp } from "react-icons/io5";

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
        if (parsed.protocol === "http:" || parsed.protocol === "https:") {
            return parsed.href;
        }
        return "";
    } catch {
        return "";
    }
};

const getTransportIcon = (type) => {
    if (!type) return FaBus;
    const t = String(type).toLowerCase();

    if (t.includes("plane") || t.includes("flight") || t.includes("air"))
        return FaPlane;
    if (t.includes("bus")) return FaBusAlt;
    if (t.includes("train")) return FaTrain;
    if (t.includes("launch") || t.includes("boat") || t.includes("ship"))
        return FaShip;

    return FaBus;
};

const getDepartureRaw = (ticket) => {
    return (
        ticket.departureDateTime ||
        ticket.departure_date_time ||
        ticket.departureDate ||
        ticket.departure ||
        ticket.date ||
        null
    );
};

const getDepartureDateObject = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;
    return date;
};

const formatDepartureDate = (dateStr) => {
    const date = getDepartureDateObject(dateStr);
    if (!date) return null;

    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const formatDepartureTime = (dateStr) => {
    const date = getDepartureDateObject(dateStr);
    if (!date) return null;

    return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};

const isDeparturePassed = (dateStr) => {
    const date = getDepartureDateObject(dateStr);
    if (!date) return false;
    return date.getTime() < Date.now();
};

const CardTickets = ({ ticket = {}, index = 0 }) => {
    const id = getPlainId(ticket._id || ticket.id);
    const title = ticket.title ?? "Untitled Ticket";
    const from = ticket.from ?? "N/A";
    const to = ticket.to ?? "N/A";
    const price = ticket.price ?? 0;
    const quantity = ticket.quantity ?? 0;
    const transport = ticket.transportType ?? "Bus";
    const perks = Array.isArray(ticket.perks) ? ticket.perks : [];
    const imageSrc = normalizeImageUrl(ticket.image);
    const TransportIcon = getTransportIcon(transport);

    const departureRaw = getDepartureRaw(ticket);
    const departureDate = formatDepartureDate(departureRaw);
    const departureTime = formatDepartureTime(departureRaw);
    const departed = isDeparturePassed(departureRaw);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/20 bg-white/80 shadow-lg backdrop-blur-lg transition-shadow duration-300 hover:shadow-2xl hover:shadow-emerald-500/20 dark:border-white/10 dark:bg-white/5"
        >
            <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-emerald-100 to-green-50 dark:from-emerald-950/40 dark:to-[#0A1020]">
                {imageSrc ? (
                    <Image
                        src={imageSrc}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <IoTicketSharp className="text-6xl text-emerald-200/60 dark:text-emerald-800/60" />
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-emerald-700 shadow-lg backdrop-blur-md dark:bg-black/60 dark:text-emerald-300">
                    <TransportIcon size={14} />
                    {transport}
                </div>

                <div
                    className={`absolute right-4 top-4 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-lg ${
                        departed ? "bg-red-500" : "bg-emerald-500"
                    }`}
                >
                    {departed ? "Departed" : "Upcoming"}
                </div>
            </div>

            <div className="flex flex-1 flex-col p-5">
                <h3 className="line-clamp-1 text-lg font-black leading-tight text-zinc-900 dark:text-white">
                    {title}
                </h3>

                <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-zinc-600 dark:text-zinc-400">
                    <span className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                        <MdLocationOn size={14} />
                        {from}
                    </span>
                    <MdArrowForward className="text-emerald-500" />
                    <span className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                        {to}
                    </span>
                </div>

                {departureDate || departureTime ? (
                    <div
                        className={`mt-3 rounded-xl px-3 py-2.5 text-xs font-semibold ${
                            departed
                                ? "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400"
                                : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                        }`}
                    >
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="font-bold uppercase tracking-wide opacity-80">
                                Departure
                            </span>

                            {departureDate && (
                                <span className="flex items-center gap-1.5">
                                    <MdDateRange size={15} />
                                    {departureDate}
                                </span>
                            )}

                            {departureDate && departureTime && (
                                <span className="h-3.5 w-px bg-current opacity-30" />
                            )}

                            {departureTime && (
                                <span className="flex items-center gap-1.5">
                                    <MdAccessTime size={15} />
                                    {departureTime}
                                </span>
                            )}

                            {departed && (
                                <span className="ml-auto rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-black uppercase text-red-600 dark:bg-red-900/40 dark:text-red-400">
                                    Departed
                                </span>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="mt-3 flex items-center gap-1.5 rounded-xl bg-zinc-100 px-3 py-2.5 text-xs font-semibold text-zinc-400 dark:bg-white/5 dark:text-zinc-600">
                        <MdDateRange size={15} />
                        Departure info not available
                    </div>
                )}

                <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-white/10">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                            Price / Unit
                        </p>
                        <p className="flex items-center gap-0.5 text-xl font-black text-emerald-600 dark:text-emerald-400">
                            <TbCurrencyTaka size={20} />
                            {price}
                        </p>
                    </div>

                    <div className="text-right">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                            Available
                        </p>
                        <p className="flex items-center gap-1 text-xl font-black text-zinc-900 dark:text-white">
                            <FiPackage size={18} />
                            {quantity}
                        </p>
                    </div>
                </div>

                {perks.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                        {perks.slice(0, 3).map((perk) => (
                            <span
                                key={perk}
                                className="rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-bold text-zinc-600 dark:bg-white/10 dark:text-zinc-300"
                            >
                                {perk}
                            </span>
                        ))}

                        {perks.length > 3 && (
                            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                                +{perks.length - 3} more
                            </span>
                        )}
                    </div>
                )}

                <div className="mt-auto pt-5">
                    <Link
                        href={`/tickets/details/${id}`}
                        className="group/btn flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition-all duration-300 active:scale-[0.98]"
                    >
                        See Details
                        <MdArrowForward className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default CardTickets;
