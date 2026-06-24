"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    BsCalendar3,
    BsCheckCircleFill,
    BsEnvelope,
    BsGeoAlt,
    BsPersonBadge,
    BsShieldFillCheck,
    BsTelephone,
    BsXCircleFill,
    BsClockHistory,
    BsPersonCircle,
} from "react-icons/bs";
import { FaBusAlt, FaUserShield, FaStore, FaUser } from "react-icons/fa";
import Image from "next/image";
import { motion } from "framer-motion";
import { authClient } from "@/lib/auth-client";

const roleConfig = {
    admin: {
        label: "Admin",
        badge: "Platform Administrator",
        title: "Admin Profile",
        description:
            "This account has administrative access to manage users, vendors, tickets, and platform settings.",
        icon: FaUserShield,
        gradient: "from-rose-500 via-red-500 to-orange-500",
        softGradient:
            "from-rose-50 via-white to-orange-50 dark:from-rose-950/20 dark:via-zinc-950 dark:to-orange-950/10",
        textColor: "text-rose-600 dark:text-rose-400",
        borderColor: "border-rose-200 dark:border-rose-900/50",
        iconBg: "bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400",
        ring: "ring-rose-500/30",
    },
    vendor: {
        label: "Vendor",
        badge: "Ticket Vendor Partner",
        title: "Vendor Profile",
        description:
            "This account can add tickets, manage booking requests, and monitor vendor business activity.",
        icon: FaStore,
        gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
        softGradient:
            "from-violet-50 via-white to-purple-50 dark:from-violet-950/20 dark:via-zinc-950 dark:to-purple-950/10",
        textColor: "text-violet-600 dark:text-violet-400",
        borderColor: "border-violet-200 dark:border-violet-900/50",
        iconBg: "bg-violet-100 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400",
        ring: "ring-violet-500/30",
    },
    user: {
        label: "User",
        badge: "Traveler Account",
        title: "User Profile",
        description:
            "This account is used for browsing tickets, booking trips, and managing personal travel information.",
        icon: FaUser,
        gradient: "from-green-500 via-emerald-500 to-cyan-500",
        softGradient:
            "from-green-50 via-white to-emerald-50 dark:from-green-950/20 dark:via-zinc-950 dark:to-emerald-950/10",
        textColor: "text-green-600 dark:text-green-400",
        borderColor: "border-green-200 dark:border-green-900/50",
        iconBg: "bg-green-100 text-green-600 dark:bg-green-950/40 dark:text-green-400",
        ring: "ring-green-500/30",
    },
};

const formatDate = (date) => {
    if (!date) return "Not available";
    return new Date(date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const getInitials = (name) => {
    if (!name) return "U";
    return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
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
    hidden: { opacity: 0, y: -30, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 25,
            staggerChildren: 0.1,
            delayChildren: 0.15,
        },
    },
};

const heroChildVariants = {
    hidden: { opacity: 0, y: 20 },
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

const avatarVariants = {
    hidden: { opacity: 0, scale: 0.7 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 350,
            damping: 20,
            delay: 0.2,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.97 },
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

const gridContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.06,
            delayChildren: 0.1,
        },
    },
};

const gridItemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.97 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 450,
            damping: 25,
        },
    },
};

const slideInLeft = {
    hidden: { opacity: 0, x: -40 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 25,
        },
    },
};

const slideInRight = {
    hidden: { opacity: 0, x: 40 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 25,
        },
    },
};

const ProfilePage = () => {
    const { data: session } = authClient.useSession();
    const user = session?.user;

    const role = user?.role?.toLowerCase() || "user";
    const config = roleConfig[role] || roleConfig.user;
    const RoleIcon = config.icon;

    return (
        <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className={`min-h-screen bg-gradient-to-br ${config.softGradient} px-3 py-6 sm:px-4 sm:py-8 md:px-8`}
        >
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="mx-auto max-w-6xl space-y-5 sm:space-y-6"
            >
                <motion.div
                    variants={heroVariants}
                    initial="hidden"
                    animate="visible"
                    className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${config.gradient} p-5 shadow-2xl sm:p-6 md:rounded-[2rem] md:p-10`}
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.25),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.18),transparent_35%)]" />

                    <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:text-left">
                            <motion.div
                                variants={avatarVariants}
                                className="relative shrink-0"
                            >
                                <motion.div
                                    animate={{
                                        scale: [1, 1.15, 1],
                                        opacity: [0.3, 0.5, 0.3],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                    className="absolute inset-0 rounded-full bg-white/30 blur-2xl"
                                />

                                {user?.image ? (
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 400,
                                            damping: 15,
                                        }}
                                    >
                                        <Image
                                            height={500}
                                            width={500}
                                            src={user?.image}
                                            alt={user?.name || "Profile"}
                                            className={`relative aspect-square h-24 w-24 rounded-full object-cover object-center shadow-2xl ring-4 ring-white/80 sm:h-28 sm:w-28 md:h-36 md:w-36 ${config.ring}`}
                                        />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 400,
                                            damping: 15,
                                        }}
                                        className={`relative flex aspect-square h-24 w-24 items-center justify-center rounded-full bg-white/20 text-3xl font-black text-white shadow-2xl ring-4 ring-white/80 sm:h-28 sm:w-28 md:h-36 md:w-36 md:text-4xl ${config.ring}`}
                                    >
                                        <h2 className="text-2xl">
                                            {getInitials(
                                                user?.name?.slice("")[0]
                                            )}
                                        </h2>
                                    </motion.div>
                                )}

                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 500,
                                        damping: 20,
                                        delay: 0.6,
                                    }}
                                    className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-green-500 shadow-lg sm:bottom-2 sm:right-2 sm:h-8 sm:w-8"
                                >
                                    <BsCheckCircleFill
                                        className="text-white"
                                        size={13}
                                    />
                                </motion.div>
                            </motion.div>

                            <motion.div
                                variants={heroChildVariants}
                                className="min-w-0 text-white"
                            >
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 500,
                                        damping: 25,
                                        delay: 0.3,
                                    }}
                                    className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md sm:px-4 sm:py-2 sm:text-xs"
                                >
                                    <RoleIcon />
                                    {config.badge}
                                </motion.div>

                                <motion.h1
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 25,
                                        delay: 0.35,
                                    }}
                                    className="break-words text-2xl font-black leading-tight tracking-tight sm:text-3xl md:text-4xl lg:text-5xl"
                                >
                                    {user?.name || "Unknown User"}
                                </motion.h1>

                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 25,
                                        delay: 0.4,
                                    }}
                                    className="mt-2 flex items-center justify-center gap-2 text-xs font-medium text-white/80 sm:justify-start sm:text-sm md:text-base"
                                >
                                    <BsEnvelope className="shrink-0" />
                                    <span className="break-all">
                                        {user?.email || "No email available"}
                                    </span>
                                </motion.p>

                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 25,
                                        delay: 0.45,
                                    }}
                                    className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:mx-0 md:text-base"
                                >
                                    {config.description}
                                </motion.p>
                            </motion.div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, x: 30, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            transition={{
                                type: "spring",
                                stiffness: 350,
                                damping: 25,
                                delay: 0.5,
                            }}
                            whileHover={{ scale: 1.03, y: -3 }}
                            className="mx-auto w-full max-w-xs shrink-0 rounded-3xl border border-white/20 bg-white/15 p-4 text-white backdrop-blur-md sm:p-5 lg:mx-0 lg:w-auto"
                        >
                            <div className="flex items-center gap-3">
                                <motion.div
                                    whileHover={{ rotate: 8, scale: 1.1 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 15,
                                    }}
                                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/20 sm:h-12 sm:w-12"
                                >
                                    <FaBusAlt className="text-lg sm:text-xl" />
                                </motion.div>

                                <div className="min-w-0">
                                    <p className="text-[10px] font-semibold uppercase tracking-wider text-white/70 sm:text-xs">
                                        TicketBari
                                    </p>
                                    <p className="truncate text-base font-black sm:text-lg">
                                        {config.title}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                <div className="grid gap-5 sm:gap-6 lg:grid-cols-3">
                    <motion.div
                        variants={slideInLeft}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-xl shadow-zinc-200/40 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none sm:p-6 md:rounded-[2rem] lg:col-span-2"
                    >
                        <motion.div
                            initial={{ opacity: 0, x: -15 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 25,
                            }}
                            className="mb-6 flex items-center gap-3"
                        >
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 15,
                                }}
                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl sm:h-12 sm:w-12 ${config.iconBg}`}
                            >
                                <BsPersonCircle size={20} />
                            </motion.div>

                            <div className="min-w-0">
                                <h2 className="text-lg font-black text-zinc-900 dark:text-white sm:text-xl">
                                    Personal Information
                                </h2>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 sm:text-sm">
                                    Basic profile details of this account
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            variants={gridContainerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-30px" }}
                            className="grid gap-4 sm:grid-cols-2"
                        >
                            <InfoField
                                icon={BsPersonBadge}
                                label="Full Name"
                                value={user?.name || "Not provided"}
                                config={config}
                                index={0}
                            />
                            <InfoField
                                icon={BsEnvelope}
                                label="Email Address"
                                value={user?.email || "Not provided"}
                                verified={user?.emailVerified}
                                config={config}
                                index={1}
                            />
                            <InfoField
                                icon={RoleIcon}
                                label="Account Role"
                                value={config.label}
                                config={config}
                                index={2}
                            />
                            <InfoField
                                icon={
                                    user?.emailVerified
                                        ? BsCheckCircleFill
                                        : BsXCircleFill
                                }
                                label="Email Verification"
                                value={
                                    user?.emailVerified
                                        ? "Verified"
                                        : "Not verified"
                                }
                                verified={user?.emailVerified}
                                config={config}
                                index={3}
                            />
                            <InfoField
                                icon={BsTelephone}
                                label="Phone Number"
                                value={
                                    user?.phone ||
                                    user?.phoneNumber ||
                                    "Not provided"
                                }
                                config={config}
                                index={4}
                            />
                            <InfoField
                                icon={BsGeoAlt}
                                label="Location"
                                value={
                                    user?.location ||
                                    user?.address ||
                                    "Not provided"
                                }
                                config={config}
                                index={5}
                            />
                        </motion.div>
                    </motion.div>

                    <motion.div
                        variants={slideInRight}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-xl shadow-zinc-200/40 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none sm:p-6 md:rounded-[2rem]"
                    >
                        <motion.div
                            initial={{ opacity: 0, x: 15 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 25,
                            }}
                            className="mb-6 flex items-center gap-3"
                        >
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 15,
                                }}
                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl sm:h-12 sm:w-12 ${config.iconBg}`}
                            >
                                <BsShieldFillCheck size={20} />
                            </motion.div>

                            <div className="min-w-0">
                                <h2 className="text-lg font-black text-zinc-900 dark:text-white sm:text-xl">
                                    Account Details
                                </h2>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 sm:text-sm">
                                    System profile information
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            variants={gridContainerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-30px" }}
                            className="space-y-4"
                        >
                            <InfoField
                                icon={BsPersonBadge}
                                label="User ID"
                                value={user?.id || user?._id || "Not available"}
                                config={config}
                                index={0}
                            />
                            <InfoField
                                icon={BsCalendar3}
                                label="Member Since"
                                value={formatDate(user?.createdAt)}
                                config={config}
                                index={1}
                            />
                            <InfoField
                                icon={BsClockHistory}
                                label="Last Updated"
                                value={formatDate(user?.updatedAt)}
                                config={config}
                                index={2}
                            />

                            <motion.div
                                variants={gridItemVariants}
                                whileHover={{ scale: 1.02, y: -2 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 20,
                                }}
                                className={`rounded-2xl border ${config.borderColor} bg-gradient-to-br ${config.softGradient} p-4`}
                            >
                                <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                    Current Status
                                </p>

                                <div className="mt-3 flex items-center gap-2">
                                    <motion.span
                                        animate={{
                                            scale: [1, 1.3, 1],
                                            opacity: [1, 0.7, 1],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            ease: "easeInOut",
                                        }}
                                        className="h-3 w-3 shrink-0 rounded-full bg-green-500 shadow-lg shadow-green-500/40"
                                    />
                                    <span className="font-black text-zinc-900 dark:text-white">
                                        Active Account
                                    </span>
                                </div>

                                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                                    This profile is currently active on
                                    TicketBari.
                                </p>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </motion.section>
    );
};

const InfoField = ({
    icon: Icon,
    label,
    value,
    verified = false,
    config,
    index = 0,
}) => {
    return (
        <motion.div
            variants={gridItemVariants}
            whileHover={{ scale: 1.02, y: -3 }}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 20,
            }}
            className={`rounded-2xl border ${config.borderColor} bg-zinc-50 p-4 transition-shadow hover:shadow-md dark:bg-zinc-800/50`}
        >
            <div className="mb-2 flex items-center gap-2">
                <motion.div
                    whileHover={{ rotate: 8, scale: 1.15 }}
                    transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 15,
                    }}
                >
                    <Icon
                        className={`${config.textColor} shrink-0`}
                        size={15}
                    />
                </motion.div>
                <p className="truncate text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    {label}
                </p>
            </div>

            <div className="flex items-center gap-2">
                <p className="min-w-0 flex-1 truncate text-sm font-bold text-zinc-900 dark:text-white">
                    {value}
                </p>
                {verified && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 20,
                            delay: 0.3 + index * 0.05,
                        }}
                    >
                        <BsCheckCircleFill
                            className="shrink-0 text-green-500"
                            size={15}
                        />
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default ProfilePage;