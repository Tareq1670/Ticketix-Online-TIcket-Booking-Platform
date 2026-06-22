"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo, useRef } from "react";
import {
    Select,
    Button,
    Chip,
    ListBox,
    Label,
    Description,
} from "@heroui/react";
import { FiSearch, FiX, FiChevronDown, FiSliders } from "react-icons/fi";
import { FaBus, FaTrain, FaPlane, FaShip, FaGlobe } from "react-icons/fa";
import { MdSwapHoriz, MdSort } from "react-icons/md";
import { motion, AnimatePresence, useInView } from "framer-motion";

const transportOptions = [
    {
        value: "all",
        label: "All Types",
        desc: "Show every transport option",
        icon: FaGlobe,
    },
    {
        value: "Bus",
        label: "Bus",
        desc: "Comfortable road travel",
        icon: FaBus,
    },
    {
        value: "Train",
        label: "Train",
        desc: "Fast & smooth rail journey",
        icon: FaTrain,
    },
    { value: "Plane", label: "Plane", desc: "Quick air travel", icon: FaPlane },
    {
        value: "Launch",
        label: "Launch",
        desc: "River & water transport",
        icon: FaShip,
    },
];

const sortOptions = [
    { value: "default", label: "Default Order", desc: "Recommended by system" },
    {
        value: "low",
        label: "Price: Low to High",
        desc: "Cheapest tickets first",
    },
    {
        value: "high",
        label: "Price: High to Low",
        desc: "Most expensive first",
    },
];

// Animation Variants
const containerVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.97 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.7,
            ease: [0.25, 0.46, 0.45, 0.94],
            staggerChildren: 0.08,
        },
    },
};

const headerVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.5, ease: "easeOut" },
    },
};

const badgeVariants = {
    hidden: { opacity: 0, scale: 0.5, x: 20 },
    visible: {
        opacity: 1,
        scale: 1,
        x: 0,
        transition: { type: "spring", stiffness: 400, damping: 20 },
    },
    exit: {
        opacity: 0,
        scale: 0.3,
        x: -10,
        transition: { duration: 0.2 },
    },
};

const inputGroupVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" },
    },
};

const swapVariants = {
    hidden: { opacity: 0, scale: 0, rotate: -180 },
    visible: {
        opacity: 1,
        scale: 1,
        rotate: 0,
        transition: { type: "spring", stiffness: 300, damping: 15, delay: 0.2 },
    },
};

const selectVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.4, ease: "easeOut" },
    },
};

const searchButtonVariants = {
    hidden: { opacity: 0, scale: 0.8, x: 30 },
    visible: {
        opacity: 1,
        scale: 1,
        x: 0,
        transition: { type: "spring", stiffness: 300, damping: 18, delay: 0.3 },
    },
};

const chipVariants = {
    hidden: { opacity: 0, scale: 0.6, y: 10 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { type: "spring", stiffness: 400, damping: 20 },
    },
    exit: {
        opacity: 0,
        scale: 0.4,
        y: -5,
        transition: { duration: 0.15 },
    },
};

const expandVariants = {
    hidden: {
        height: 0,
        opacity: 0,
        transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
    },
    visible: {
        height: "auto",
        opacity: 1,
        transition: {
            height: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
            opacity: { duration: 0.3, delay: 0.1 },
        },
    },
};

const pulseGlow = {
    animate: {
        boxShadow: [
            "0 0 0 0 rgba(34, 197, 94, 0)",
            "0 0 0 8px rgba(34, 197, 94, 0.1)",
            "0 0 0 0 rgba(34, 197, 94, 0)",
        ],
        transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
    },
};

const floatingOrb1 = {
    animate: {
        x: [0, 15, -10, 0],
        y: [0, -20, 10, 0],
        scale: [1, 1.15, 0.95, 1],
        opacity: [0.08, 0.15, 0.06, 0.08],
        transition: { duration: 8, repeat: Infinity, ease: "easeInOut" },
    },
};

const floatingOrb2 = {
    animate: {
        x: [0, -20, 15, 0],
        y: [0, 15, -15, 0],
        scale: [1, 0.9, 1.1, 1],
        opacity: [0.04, 0.1, 0.04, 0.04],
        transition: { duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 },
    },
};

export default function TicketsFilter({ filters = {} }) {
    const router = useRouter();
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: "-50px" });

    const [from, setFrom] = useState(filters.from || "");
    const [to, setTo] = useState(filters.to || "");
    const [transportType, setTransportType] = useState(
        filters.transportType || "all",
    );
    const [sort, setSort] = useState(filters.sort || "default");
    const [isExpanded, setIsExpanded] = useState(false);
    const [isSwapping, setIsSwapping] = useState(false);

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const timer = setTimeout(() => {
            const sp = new URLSearchParams();

            if (from?.trim()) {
                sp.set("from", from.trim());
            }
            if (to?.trim()) {
                sp.set("to", to.trim());
            }
            if (transportType !== "all") {
                sp.set("transportType", transportType);
            }
            if (sort !== "default") {
                sp.set("sort", sort);
            }

            const queryString = sp.toString();
            router.push(`/all-tickets${queryString ? `?${queryString}` : ""}`);
        }, 400);

        return () => clearTimeout(timer);
    }, [from, to, transportType, sort]);

    const handleTransportChange = (key) => {
        let value = "all";
        if (key instanceof Set) {
            value = String([...key][0] || "all");
        } else if (key !== null && key !== undefined) {
            value = String(key);
        }
        if (value !== transportType) {
            setTransportType(value);
        }
    };

    const handleSortChange = (key) => {
        let value = "default";
        if (key instanceof Set) {
            value = String([...key][0] || "default");
        } else if (key !== null && key !== undefined) {
            value = String(key);
        }
        if (value !== sort) {
            setSort(value);
        }
    };

    const handleSwap = () => {
        setIsSwapping(true);
        const oldFrom = from;
        setFrom(to);
        setTo(oldFrom);
        setTimeout(() => setIsSwapping(false), 600);
    };

    const handleSearch = () => {
        setIsExpanded(false);
    };

    const clearFilters = () => {
        setFrom("");
        setTo("");
        setTransportType("all");
        setSort("default");
    };

    const hasActiveFilters = useMemo(
        () =>
            Boolean(
                from.trim() ||
                to.trim() ||
                transportType !== "all" ||
                sort !== "default",
            ),
        [from, to, transportType, sort],
    );

    const activeCount = useMemo(
        () =>
            [
                from.trim(),
                to.trim(),
                transportType !== "all" ? transportType : "",
                sort !== "default" ? sort : "",
            ].filter(Boolean).length,
        [from, to, transportType, sort],
    );

    const selectedTransportLabel = useMemo(
        () =>
            transportOptions.find((o) => o.value === transportType)?.label ||
            "All Types",
        [transportType],
    );

    const selectedSortLabel = useMemo(
        () =>
            sortOptions.find((o) => o.value === sort)?.label || "Default Order",
        [sort],
    );

    const renderSelectItems = (options, showIcon = false) =>
        options.map((opt) => {
            const Icon = opt.icon;
            return (
                <ListBox.Item
                    key={opt.value}
                    id={opt.value}
                    textValue={opt.label}
                    className="group/item flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 outline-none transition-all duration-200 
          data-[focused=true]:bg-zinc-100 data-[hovered=true]:bg-zinc-100 
          data-[selected=true]:bg-green-500 data-[selected=true]:text-white
          dark:data-[focused=true]:bg-zinc-800 dark:data-[hovered=true]:bg-zinc-800 dark:data-[selected=true]:bg-green-500 dark:data-[selected=true]:text-white"
                >
                    <div className="flex min-w-0 items-center gap-3">
                        {showIcon && Icon && (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 group-data-[selected=true]/item:bg-white/20 group-data-[selected=true]/item:text-white dark:bg-zinc-800 dark:text-zinc-400">
                                <Icon size={14} />
                            </div>
                        )}
                        <div className="min-w-0">
                            <Label className="block truncate text-sm font-semibold text-zinc-900 group-data-[selected=true]/item:text-white dark:text-zinc-200">
                                {opt.label}
                            </Label>
                            <Description className="block truncate text-[11px] text-zinc-500 group-data-[selected=true]/item:text-green-100 dark:text-zinc-50">
                                {opt.desc}
                            </Description>
                        </div>
                    </div>
                    <ListBox.ItemIndicator className="text-green-600 dark:text-green-400" />
                </ListBox.Item>
            );
        });

    return (
        <div className="w-full" ref={containerRef}>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/40 sm:p-5 lg:p-6"
                whileHover={{
                    boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
                    borderColor: "rgba(34, 197, 94, 0.2)",
                    transition: { duration: 0.3 },
                }}
            >
                {/* Animated Background Orbs */}
                <motion.div
                    className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-green-500/10 blur-3xl"
                    variants={floatingOrb1}
                    animate="animate"
                />
                <motion.div
                    className="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-blue-500/5 blur-3xl"
                    variants={floatingOrb2}
                    animate="animate"
                />

                {/* Shimmer Line */}
                <motion.div
                    className="pointer-events-none absolute top-0 left-0 h-[2px] w-full"
                    style={{
                        background:
                            "linear-gradient(90deg, transparent, rgba(34,197,94,0.4), transparent)",
                    }}
                    animate={{
                        x: ["-100%", "100%"],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        repeatDelay: 2,
                    }}
                />

                <div className="relative">
                    {/* Header */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:mb-5">
                        <motion.div
                            className="flex items-center gap-3"
                            variants={headerVariants}
                        >
                            <motion.div
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500 text-white shadow-lg shadow-green-500/20"
                                whileHover={{
                                    scale: 1.1,
                                    rotate: 5,
                                    boxShadow: "0 8px 25px rgba(34, 197, 94, 0.4)",
                                }}
                                whileTap={{ scale: 0.9 }}
                                {...pulseGlow}
                            >
                                <FiSearch size={18} />
                            </motion.div>
                            <div className="min-w-0 flex-1">
                                <motion.h3
                                    className="text-base font-bold text-zinc-900 dark:text-white sm:text-lg"
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ delay: 0.3, duration: 0.4 }}
                                >
                                    Find Your Journey
                                </motion.h3>
                                <motion.p
                                    className="truncate text-xs text-zinc-500 dark:text-zinc-400"
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ delay: 0.4, duration: 0.4 }}
                                >
                                    Search routes, compare prices & book instantly
                                </motion.p>
                            </div>
                        </motion.div>

                        <motion.div
                            className="flex items-center gap-2 self-end sm:self-auto"
                            initial={{ opacity: 0, x: 20 }}
                            animate={isInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: 0.5, duration: 0.4 }}
                        >
                            <AnimatePresence mode="popLayout">
                                {hasActiveFilters && (
                                    <>
                                        <motion.div
                                            key="active-chip"
                                            variants={badgeVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            layout
                                        >
                                            <Chip
                                                size="sm"
                                                variant="flat"
                                                className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                                            >
                                                {activeCount} Active
                                            </Chip>
                                        </motion.div>
                                        <motion.div
                                            key="clear-btn"
                                            variants={badgeVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            layout
                                        >
                                            <Button
                                                size="sm"
                                                variant="flat"
                                                color="danger"
                                                startContent={<FiX size={14} />}
                                                onPress={clearFilters}
                                                className="gap-1.5 text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
                                            >
                                                Clear
                                            </Button>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    size="sm"
                                    variant="flat"
                                    onPress={() => setIsExpanded((prev) => !prev)}
                                    className="gap-1.5 text-xs font-bold lg:hidden bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                                >
                                    <FiSliders size={14} />
                                    {isExpanded ? "Hide" : "Filters"}
                                    <motion.span
                                        animate={{ rotate: isExpanded ? 180 : 0 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 20,
                                        }}
                                    >
                                        <FiChevronDown size={14} />
                                    </motion.span>
                                </Button>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Mobile Collapsed Chips */}
                    <AnimatePresence>
                        {!isExpanded && (
                            <motion.div
                                className="mt-4 flex flex-wrap items-center gap-2 lg:hidden"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <AnimatePresence mode="popLayout">
                                    {from.trim() && (
                                        <motion.div
                                            key="from-chip-mobile"
                                            variants={chipVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            layout
                                        >
                                            <Chip
                                                size="sm"
                                                variant="flat"
                                                className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800"
                                            >
                                                From: {from}
                                            </Chip>
                                        </motion.div>
                                    )}
                                    {to.trim() && (
                                        <motion.div
                                            key="to-chip-mobile"
                                            variants={chipVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            layout
                                        >
                                            <Chip
                                                size="sm"
                                                variant="flat"
                                                className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800"
                                            >
                                                To: {to}
                                            </Chip>
                                        </motion.div>
                                    )}
                                    {transportType !== "all" && (
                                        <motion.div
                                            key="transport-chip-mobile"
                                            variants={chipVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            layout
                                        >
                                            <Chip
                                                size="sm"
                                                variant="flat"
                                                className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800"
                                            >
                                                {transportType}
                                            </Chip>
                                        </motion.div>
                                    )}
                                    {sort !== "default" && (
                                        <motion.div
                                            key="sort-chip-mobile"
                                            variants={chipVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            layout
                                        >
                                            <Chip
                                                size="sm"
                                                variant="flat"
                                                className="bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700"
                                            >
                                                {sortOptions.find((o) => o.value === sort)?.label}
                                            </Chip>
                                        </motion.div>
                                    )}
                                    {!hasActiveFilters && (
                                        <motion.p
                                            key="no-filter-text"
                                            className="text-xs text-zinc-500 dark:text-zinc-400"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            Tap{" "}
                                            <span className="font-bold text-green-600 dark:text-green-400">
                                                Filters
                                            </span>{" "}
                                            to search tickets
                                        </motion.p>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Filter Body - Desktop always visible, mobile expandable */}
                    <div className="hidden lg:block">
                        <motion.div
                            variants={inputGroupVariants}
                            className="flex flex-col gap-3 xl:flex-row xl:items-end"
                        >
                            <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                                {/* From Input */}
                                <motion.div
                                    className="relative flex-1 group"
                                    variants={inputGroupVariants}
                                    whileHover={{ scale: 1.01 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                >
                                    <div className="relative h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 transition-all focus-within:border-green-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-green-500/10 dark:border-zinc-700 dark:bg-zinc-800/50 dark:focus-within:bg-zinc-800 dark:focus-within:border-green-500">
                                        <div className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 items-center gap-2 border-r border-zinc-200 pr-2 dark:border-zinc-600">
                                            <motion.span
                                                className="h-2 w-2 rounded-full bg-green-500"
                                                animate={{
                                                    boxShadow: [
                                                        "0 0 0 0 rgba(34,197,94,0.4)",
                                                        "0 0 0 6px rgba(34,197,94,0)",
                                                    ],
                                                }}
                                                transition={{
                                                    duration: 1.5,
                                                    repeat: Infinity,
                                                    ease: "easeOut",
                                                }}
                                            />
                                            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                                FROM
                                            </span>
                                        </div>
                                        <input
                                            type="text"
                                            value={from}
                                            onChange={(e) => setFrom(e.target.value)}
                                            placeholder="From where?"
                                            className="h-full w-full rounded-xl bg-transparent py-2.5 pl-24 pr-10 text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:text-white dark:placeholder:text-zinc-500"
                                        />
                                        <AnimatePresence>
                                            {from && (
                                                <motion.button
                                                    type="button"
                                                    onClick={() => setFrom("")}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-zinc-200 hover:text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-white"
                                                    initial={{ opacity: 0, scale: 0, rotate: -90 }}
                                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                                    exit={{ opacity: 0, scale: 0, rotate: 90 }}
                                                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                                    whileHover={{ scale: 1.2 }}
                                                    whileTap={{ scale: 0.8 }}
                                                >
                                                    <FiX size={14} />
                                                </motion.button>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>

                                {/* Swap Button */}
                                <motion.div
                                    className="flex justify-center sm:px-0.5"
                                    variants={swapVariants}
                                >
                                    <motion.div
                                        whileHover={{
                                            scale: 1.15,
                                            borderColor: "rgba(34, 197, 94, 0.4)",
                                        }}
                                        whileTap={{ scale: 0.85 }}
                                        animate={
                                            isSwapping
                                                ? {
                                                    rotate: [0, 180, 360],
                                                    scale: [1, 1.2, 1],
                                                    transition: { duration: 0.5 },
                                                }
                                                : {}
                                        }
                                    >
                                        <Button
                                            isIconOnly
                                            variant="flat"
                                            size="sm"
                                            onPress={handleSwap}
                                            className="h-10 w-10 shrink-0 rounded-full border border-zinc-200 bg-white shadow-sm transition-all hover:border-green-500/40 hover:bg-green-50 hover:text-green-600 active:scale-95 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-green-400/30 dark:hover:bg-zinc-700 dark:hover:text-green-400 sm:h-12 sm:w-12 sm:rounded-xl"
                                        >
                                            <MdSwapHoriz size={18} />
                                        </Button>
                                    </motion.div>
                                </motion.div>

                                {/* To Input */}
                                <motion.div
                                    className="relative flex-1 group"
                                    variants={inputGroupVariants}
                                    whileHover={{ scale: 1.01 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                >
                                    <div className="relative h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 transition-all focus-within:border-rose-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-rose-500/10 dark:border-zinc-700 dark:bg-zinc-800/50 dark:focus-within:bg-zinc-800 dark:focus-within:border-rose-500">
                                        <div className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 items-center gap-2 border-r border-zinc-200 pr-2 dark:border-zinc-600">
                                            <motion.span
                                                className="h-2 w-2 rounded-full bg-rose-500"
                                                animate={{
                                                    boxShadow: [
                                                        "0 0 0 0 rgba(244,63,94,0.4)",
                                                        "0 0 0 6px rgba(244,63,94,0)",
                                                    ],
                                                }}
                                                transition={{
                                                    duration: 1.5,
                                                    repeat: Infinity,
                                                    ease: "easeOut",
                                                    delay: 0.5,
                                                }}
                                            />
                                            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                                TO
                                            </span>
                                        </div>
                                        <input
                                            type="text"
                                            value={to}
                                            onChange={(e) => setTo(e.target.value)}
                                            placeholder="To where?"
                                            className="h-full w-full rounded-xl bg-transparent py-2.5 pl-24 pr-10 text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:text-white dark:placeholder:text-zinc-500"
                                        />
                                        <AnimatePresence>
                                            {to && (
                                                <motion.button
                                                    type="button"
                                                    onClick={() => setTo("")}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-zinc-200 hover:text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-white"
                                                    initial={{ opacity: 0, scale: 0, rotate: -90 }}
                                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                                    exit={{ opacity: 0, scale: 0, rotate: 90 }}
                                                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                                    whileHover={{ scale: 1.2 }}
                                                    whileTap={{ scale: 0.8 }}
                                                >
                                                    <FiX size={14} />
                                                </motion.button>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            </div>

                            <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                                {/* Transport Select */}
                                <motion.div
                                    className="w-full sm:w-44 lg:w-48"
                                    variants={selectVariants}
                                >
                                    <Select
                                        selectedKey={transportType}
                                        onSelectionChange={handleTransportChange}
                                        aria-label="Transport Type"
                                    >
                                        <Select.Trigger className="flex h-12 w-full items-center justify-between gap-2 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700 px-3 text-sm shadow-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/15">
                                            <div className="flex min-w-0 flex-1 items-center gap-2">
                                                <FaGlobe
                                                    className="shrink-0 text-zinc-400"
                                                    size={14}
                                                />
                                                <span className="truncate text-left">
                                                    {selectedTransportLabel}
                                                </span>
                                            </div>
                                            <Select.Indicator className="shrink-0" />
                                        </Select.Trigger>
                                        <Select.Popover className="min-w-[260px] rounded-xl border border-zinc-200 bg-white p-1 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
                                            <ListBox className="outline-none">
                                                {renderSelectItems(transportOptions, true)}
                                            </ListBox>
                                        </Select.Popover>
                                    </Select>
                                </motion.div>

                                {/* Sort Select */}
                                <motion.div
                                    className="w-full sm:w-48 lg:w-52"
                                    variants={selectVariants}
                                >
                                    <Select
                                        selectedKey={sort}
                                        onSelectionChange={handleSortChange}
                                        aria-label="Sort By"
                                    >
                                        <Select.Trigger className="flex h-12 w-full items-center justify-between gap-2 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700 px-3 text-sm shadow-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/15">
                                            <div className="flex min-w-0 flex-1 items-center gap-2">
                                                <MdSort
                                                    className="shrink-0 text-zinc-400"
                                                    size={16}
                                                />
                                                <span className="truncate text-left">
                                                    {selectedSortLabel}
                                                </span>
                                            </div>
                                            <Select.Indicator className="shrink-0" />
                                        </Select.Trigger>
                                        <Select.Popover className="min-w-[260px] rounded-xl border border-zinc-200 bg-white p-1 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
                                            <ListBox className="outline-none">
                                                {renderSelectItems(sortOptions, false)}
                                            </ListBox>
                                        </Select.Popover>
                                    </Select>
                                </motion.div>

                                {/* Search Button */}
                                <motion.div variants={searchButtonVariants}>
                                    <motion.div
                                        whileHover={{
                                            scale: 1.03,
                                            boxShadow: "0 12px 30px rgba(34, 197, 94, 0.35)",
                                        }}
                                        whileTap={{ scale: 0.96 }}
                                    >
                                        <Button
                                            onPress={handleSearch}
                                            className="h-12 w-full shrink-0 rounded-xl bg-green-600 text-sm font-bold text-white shadow-lg shadow-green-500/30 transition-all hover:bg-green-700 hover:shadow-green-500/40 active:scale-95 dark:bg-green-600 dark:hover:bg-green-500 sm:w-auto sm:px-6"
                                            startContent={
                                                <motion.span
                                                    animate={{ rotate: [0, 0, 15, -15, 0] }}
                                                    transition={{
                                                        duration: 0.5,
                                                        repeat: Infinity,
                                                        repeatDelay: 4,
                                                    }}
                                                >
                                                    <FiSearch size={16} />
                                                </motion.span>
                                            }
                                        >
                                            Search
                                        </Button>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Desktop Active Filters Chips */}
                        <AnimatePresence>
                            {hasActiveFilters && (
                                <motion.div
                                    className="mt-4 flex flex-wrap items-center gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-800"
                                    initial={{ opacity: 0, y: 10, height: 0 }}
                                    animate={{ opacity: 1, y: 0, height: "auto" }}
                                    exit={{ opacity: 0, y: -10, height: 0 }}
                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                >
                                    <motion.span
                                        className="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-500"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        Active:
                                    </motion.span>
                                    <AnimatePresence mode="popLayout">
                                        {from.trim() && (
                                            <motion.div
                                                key="from-chip-desktop"
                                                variants={chipVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                layout
                                            >
                                                <Chip
                                                    size="sm"
                                                    variant="flat"
                                                    onClose={() => setFrom("")}
                                                    className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800 text-[10px] font-medium"
                                                >
                                                    From: {from}
                                                </Chip>
                                            </motion.div>
                                        )}
                                        {to.trim() && (
                                            <motion.div
                                                key="to-chip-desktop"
                                                variants={chipVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                layout
                                            >
                                                <Chip
                                                    size="sm"
                                                    variant="flat"
                                                    onClose={() => setTo("")}
                                                    className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800 text-[10px] font-medium"
                                                >
                                                    To: {to}
                                                </Chip>
                                            </motion.div>
                                        )}
                                        {transportType !== "all" && (
                                            <motion.div
                                                key="transport-chip-desktop"
                                                variants={chipVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                layout
                                            >
                                                <Chip
                                                    size="sm"
                                                    variant="flat"
                                                    onClose={() => setTransportType("all")}
                                                    className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800 text-[10px] font-medium"
                                                >
                                                    {transportType}
                                                </Chip>
                                            </motion.div>
                                        )}
                                        {sort !== "default" && (
                                            <motion.div
                                                key="sort-chip-desktop"
                                                variants={chipVariants}
                                                initial="hidden"
                                                animate="visible"
                                                exit="exit"
                                                layout
                                            >
                                                <Chip
                                                    size="sm"
                                                    variant="flat"
                                                    onClose={() => setSort("default")}
                                                    className="bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700 text-[10px] font-medium"
                                                >
                                                    {sortOptions.find((o) => o.value === sort)?.label}
                                                </Chip>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Mobile Expandable Filter Body */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                className="lg:hidden"
                                variants={expandVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                            >
                                <motion.div
                                    className="mt-5 flex flex-col gap-3 xl:flex-row xl:items-end"
                                    initial="hidden"
                                    animate="visible"
                                    variants={{
                                        visible: {
                                            transition: { staggerChildren: 0.06 },
                                        },
                                    }}
                                >
                                    <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                                        {/* From Input Mobile */}
                                        <motion.div
                                            className="relative flex-1 group"
                                            variants={inputGroupVariants}
                                        >
                                            <div className="relative h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 transition-all focus-within:border-green-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-green-500/10 dark:border-zinc-700 dark:bg-zinc-800/50 dark:focus-within:bg-zinc-800 dark:focus-within:border-green-500">
                                                <div className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 items-center gap-2 border-r border-zinc-200 pr-2 dark:border-zinc-600">
                                                    <motion.span
                                                        className="h-2 w-2 rounded-full bg-green-500"
                                                        animate={{
                                                            boxShadow: [
                                                                "0 0 0 0 rgba(34,197,94,0.4)",
                                                                "0 0 0 6px rgba(34,197,94,0)",
                                                            ],
                                                        }}
                                                        transition={{
                                                            duration: 1.5,
                                                            repeat: Infinity,
                                                            ease: "easeOut",
                                                        }}
                                                    />
                                                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                                        FROM
                                                    </span>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={from}
                                                    onChange={(e) => setFrom(e.target.value)}
                                                    placeholder="From where?"
                                                    className="h-full w-full rounded-xl bg-transparent py-2.5 pl-24 pr-10 text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:text-white dark:placeholder:text-zinc-500"
                                                />
                                                <AnimatePresence>
                                                    {from && (
                                                        <motion.button
                                                            type="button"
                                                            onClick={() => setFrom("")}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-zinc-200 hover:text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-white"
                                                            initial={{ opacity: 0, scale: 0 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0 }}
                                                        >
                                                            <FiX size={14} />
                                                        </motion.button>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </motion.div>

                                        {/* Swap Mobile */}
                                        <motion.div
                                            className="flex justify-center sm:px-0.5"
                                            variants={swapVariants}
                                        >
                                            <motion.div
                                                whileHover={{ scale: 1.15 }}
                                                whileTap={{ scale: 0.85 }}
                                                animate={
                                                    isSwapping
                                                        ? {
                                                            rotate: [0, 180, 360],
                                                            transition: { duration: 0.5 },
                                                        }
                                                        : {}
                                                }
                                            >
                                                <Button
                                                    isIconOnly
                                                    variant="flat"
                                                    size="sm"
                                                    onPress={handleSwap}
                                                    className="h-10 w-10 shrink-0 rounded-full border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-800 sm:h-12 sm:w-12 sm:rounded-xl"
                                                >
                                                    <MdSwapHoriz size={18} />
                                                </Button>
                                            </motion.div>
                                        </motion.div>

                                        {/* To Input Mobile */}
                                        <motion.div
                                            className="relative flex-1 group"
                                            variants={inputGroupVariants}
                                        >
                                            <div className="relative h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 transition-all focus-within:border-rose-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-rose-500/10 dark:border-zinc-700 dark:bg-zinc-800/50 dark:focus-within:bg-zinc-800 dark:focus-within:border-rose-500">
                                                <div className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 items-center gap-2 border-r border-zinc-200 pr-2 dark:border-zinc-600">
                                                    <motion.span
                                                        className="h-2 w-2 rounded-full bg-rose-500"
                                                        animate={{
                                                            boxShadow: [
                                                                "0 0 0 0 rgba(244,63,94,0.4)",
                                                                "0 0 0 6px rgba(244,63,94,0)",
                                                            ],
                                                        }}
                                                        transition={{
                                                            duration: 1.5,
                                                            repeat: Infinity,
                                                            ease: "easeOut",
                                                            delay: 0.5,
                                                        }}
                                                    />
                                                    <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                                        TO
                                                    </span>
                                                </div>
                                                <input
                                                    type="text"
                                                    value={to}
                                                    onChange={(e) => setTo(e.target.value)}
                                                    placeholder="To where?"
                                                    className="h-full w-full rounded-xl bg-transparent py-2.5 pl-24 pr-10 text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:text-white dark:placeholder:text-zinc-500"
                                                />
                                                <AnimatePresence>
                                                    {to && (
                                                        <motion.button
                                                            type="button"
                                                            onClick={() => setTo("")}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-zinc-200 hover:text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-white"
                                                            initial={{ opacity: 0, scale: 0 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0 }}
                                                        >
                                                            <FiX size={14} />
                                                        </motion.button>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </motion.div>
                                    </div>

                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                                        <motion.div
                                            className="w-full sm:w-44 lg:w-48"
                                            variants={selectVariants}
                                        >
                                            <Select
                                                selectedKey={transportType}
                                                onSelectionChange={handleTransportChange}
                                                aria-label="Transport Type"
                                            >
                                                <Select.Trigger className="flex h-12 w-full items-center justify-between gap-2 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700 px-3 text-sm shadow-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/15">
                                                    <div className="flex min-w-0 flex-1 items-center gap-2">
                                                        <FaGlobe className="shrink-0 text-zinc-400" size={14} />
                                                        <span className="truncate text-left">
                                                            {selectedTransportLabel}
                                                        </span>
                                                    </div>
                                                    <Select.Indicator className="shrink-0" />
                                                </Select.Trigger>
                                                <Select.Popover className="min-w-[260px] rounded-xl border border-zinc-200 bg-white p-1 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
                                                    <ListBox className="outline-none">
                                                        {renderSelectItems(transportOptions, true)}
                                                    </ListBox>
                                                </Select.Popover>
                                            </Select>
                                        </motion.div>

                                        <motion.div
                                            className="w-full sm:w-48 lg:w-52"
                                            variants={selectVariants}
                                        >
                                            <Select
                                                selectedKey={sort}
                                                onSelectionChange={handleSortChange}
                                                aria-label="Sort By"
                                            >
                                                <Select.Trigger className="flex h-12 w-full items-center justify-between gap-2 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700 px-3 text-sm shadow-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/15">
                                                    <div className="flex min-w-0 flex-1 items-center gap-2">
                                                        <MdSort className="shrink-0 text-zinc-400" size={16} />
                                                        <span className="truncate text-left">
                                                            {selectedSortLabel}
                                                        </span>
                                                    </div>
                                                    <Select.Indicator className="shrink-0" />
                                                </Select.Trigger>
                                                <Select.Popover className="min-w-[260px] rounded-xl border border-zinc-200 bg-white p-1 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
                                                    <ListBox className="outline-none">
                                                        {renderSelectItems(sortOptions, false)}
                                                    </ListBox>
                                                </Select.Popover>
                                            </Select>
                                        </motion.div>

                                        <motion.div variants={searchButtonVariants}>
                                            <motion.div
                                                whileHover={{ scale: 1.03 }}
                                                whileTap={{ scale: 0.96 }}
                                            >
                                                <Button
                                                    onPress={handleSearch}
                                                    className="h-12 w-full shrink-0 rounded-xl bg-green-600 text-sm font-bold text-white shadow-lg shadow-green-500/30 dark:bg-green-600 dark:hover:bg-green-500 sm:w-auto sm:px-6"
                                                    startContent={<FiSearch size={16} />}
                                                >
                                                    Search
                                                </Button>
                                            </motion.div>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}