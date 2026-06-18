"use client";

import {
    Card,
    Avatar,
    Chip,
    AvatarImage,
    AvatarFallback,
} from "@heroui/react";
import Link from "next/link";
import {
    FaBusAlt,
    FaTrain,
    FaPlane,
    FaShip,
    FaArrowRight,
    FaUserCog,
} from "react-icons/fa";
import { RiDashboardLine, RiVipCrownFill } from "react-icons/ri";

const roleConfig = {
    admin: {
        label: "Administrator",
        accent: "from-emerald-500 to-green-600",
        accentText: "text-emerald-600 dark:text-emerald-400",
        glow: "bg-emerald-500/20",
        ring: "ring-emerald-500/30",
        title: "Admin Control Center",
        description:
            "Manage platform tickets, users, vendors, and homepage advertisements with complete control over the entire TicketBari system.",
        tip: {
            icon: <RiVipCrownFill />,
            title: "Admin Notice",
            text: "Review tickets carefully and keep homepage advertisements limited to the 6 most valuable offers.",
        },
    },
    vendor: {
        label: "Vendor Partner",
        accent: "from-teal-500 to-green-600",
        accentText: "text-teal-600 dark:text-teal-400",
        glow: "bg-teal-500/20",
        ring: "ring-teal-500/30",
        title: "Vendor Management Hub",
        description:
            "Add new tickets, manage booking requests, and track your revenue performance — all in one powerful dashboard.",
        tip: {
            icon: "🚀",
            title: "Vendor Tip",
            text: "Respond to booking requests quickly to boost customer trust and increase your ticket sales.",
        },
    },
    user: {
        label: "Traveler",
        accent: "from-green-500 to-emerald-500",
        accentText: "text-green-600 dark:text-green-400",
        glow: "bg-green-500/20",
        ring: "ring-green-500/30",
        title: "Traveler Dashboard",
        description:
            "View your bookings, track transactions, and manage your profile for a smooth and seamless travel experience.",
        tip: {
            icon: "💡",
            title: "Travel Tip",
            text: "Check departure times and booking status regularly so you never miss an important trip.",
        },
    },
};

export default function DashboardWelcome({ user }) {
    const currentHour = new Date().getHours();
    const greeting =
        currentHour < 12
            ? "Good Morning"
            : currentHour < 18
              ? "Good Afternoon"
              : "Good Evening";

    const role = user?.role || "user";
    const config = roleConfig[role] || roleConfig.user;

    const profilePath = `/dashboard/${role}/profile`;

    return (
        <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4 py-10 dark:from-[#070B14] dark:via-[#0A0F1C] dark:to-[#06140C]">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div
                    className={`absolute -left-20 -top-20 h-72 w-72 rounded-full ${config.glow} blur-3xl`}
                />
                <div
                    className={`absolute -bottom-20 -right-20 h-72 w-72 rounded-full ${config.glow} blur-3xl`}
                />

                <FaBusAlt className="absolute left-[10%] top-[20%] text-5xl text-green-500/5 dark:text-green-400/5" />
                <FaTrain className="absolute right-[12%] top-[30%] text-6xl text-green-500/5 dark:text-green-400/5" />
                <FaPlane className="absolute bottom-[20%] left-[15%] text-5xl text-green-500/5 dark:text-green-400/5" />
                <FaShip className="absolute bottom-[25%] right-[18%] text-6xl text-green-500/5 dark:text-green-400/5" />
            </div>

            <div className="relative z-10 mx-auto w-full max-w-3xl">
                <Card className="overflow-hidden border border-white/60 bg-white/70 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
                    <div
                        className={`h-28 w-full bg-gradient-to-r ${config.accent}`}
                    >
                        <div className="flex h-full items-center justify-between px-6 md:px-8">
                            <div className="flex items-center gap-2 text-white">
                                <FaBusAlt className="text-2xl" />
                                <span className="text-xl font-black tracking-tight">
                                    TicketBari
                                </span>
                            </div>

                            <Chip
                                variant="solid"
                                className="bg-white/20 font-semibold text-white backdrop-blur-md"
                            >
                                <span className="flex items-center gap-1.5">
                                    <RiDashboardLine className="text-sm" />
                                    {config.label}
                                </span>
                            </Chip>
                        </div>
                    </div>

                    <div className="-mt-14 flex flex-col items-center px-6 text-center md:px-10">
                        <Avatar
                            className={`h-28 w-28 text-4xl shadow-xl ring-4 ring-white dark:ring-zinc-900 ${config.ring}`}
                        >
                            <AvatarImage
                                src={user?.image || ""}
                                alt={user?.name || "User"}
                            />
                            <AvatarFallback className="uppercase">
                                {user?.name?.charAt(0) || "U"}
                            </AvatarFallback>
                        </Avatar>

                        <div className="mt-4 space-y-1">
                            <p className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-500">
                                {greeting}
                            </p>
                            <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white md:text-4xl">
                                Welcome back,
                                <br />
                                <span className={config.accentText}>
                                    {user?.name || "Traveler"}
                                </span>
                            </h1>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                {user?.email || "No email available"}
                            </p>
                        </div>
                    </div>

                    <div className="px-6 pt-8 text-center md:px-12">
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white md:text-3xl">
                            {config.title}
                        </h2>
                        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-zinc-600 dark:text-zinc-400 md:text-base">
                            {config.description}
                        </p>
                    </div>

                    <div className="px-6 pt-8 md:px-12">
                        <div className="flex items-start gap-4 rounded-2xl border border-zinc-200/70 bg-zinc-50/80 p-5 dark:border-white/10 dark:bg-white/5">
                            <div
                                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${config.accent} text-xl text-white shadow-lg`}
                            >
                                {config.tip.icon}
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-zinc-900 dark:text-white">
                                    {config.tip.title}
                                </h3>
                                <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                                    {config.tip.text}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 px-6 py-8 sm:flex-row sm:justify-center md:px-12">
                        <Link
                            href="/"
                            className={`flex items-center justify-center rounded-full bg-gradient-to-r ${config.accent} px-8 py-3 font-semibold text-white shadow-lg transition-transform hover:scale-[1.03]`}
                        >
                            <span className="flex items-center gap-2">
                                Go to Home
                                <FaArrowRight />
                            </span>
                        </Link>

                        <Link
                            href={profilePath}
                            className="flex items-center justify-center rounded-full border border-green-500 px-8 py-3 font-semibold text-green-700 transition-colors hover:bg-green-50 dark:border-green-400/40 dark:text-green-300 dark:hover:bg-green-500/10"
                        >
                            <span className="flex items-center gap-2">
                                <FaUserCog />
                                Dashboard Profile
                            </span>
                        </Link>
                    </div>

                    <div className="border-t border-zinc-200/60 bg-zinc-50/50 px-6 py-4 text-center dark:border-white/5 dark:bg-white/5">
                        <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                            Today is{" "}
                            {new Date().toLocaleDateString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>
                    </div>
                </Card>
            </div>
        </section>
    );
}