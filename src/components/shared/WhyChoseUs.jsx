"use client";

import { motion } from "framer-motion";
import { BiWallet } from "react-icons/bi";
import { BsHeadphones, BsShieldCheck } from "react-icons/bs";
import { CiLock } from "react-icons/ci";

const features = [
    {
        icon: BsShieldCheck,
        title: "Secure Booking",
        description:
            "100% safe payments with Stripe and end-to-end encrypted ticket data for every transaction.",
        highlight: true,
    },
    {
        icon: CiLock,
        title: "Instant Confirmation",
        description:
            "Get your bus, train, launch or flight tickets confirmed in seconds — no waiting, no hassle.",
    },
    {
        icon: BiWallet,
        title: "Best Price Guarantee",
        description:
            "Transparent pricing with zero hidden charges. Compare and book the lowest fares across routes.",
    },
    {
        icon: BsHeadphones,
        title: "24/7 Customer Support",
        description:
            "Our dedicated support team is always available to help you with bookings, refunds and queries.",
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
};

const WhyChooseUs = () => {
    return (
        <section className="relative py-20 lg:py-28 bg-white dark:bg-zinc-950 overflow-hidden">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
                style={{
                    backgroundImage:
                        "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
                    backgroundSize: "64px 64px",
                    color: "#10b981",
                }}
            />

            <div
                aria-hidden
                className="pointer-events-none absolute -top-20 -left-20 w-72 h-72 rounded-full bg-green-500/10 blur-3xl"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl"
            />

            <div className="container mx-auto px-4 md:px-6 relative">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={containerVariants}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6"
                >
                    <motion.div
                        variants={itemVariants}
                        className="lg:row-span-2 flex items-center"
                    >
                        <div className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 lg:p-10 shadow-sm">
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-semibold uppercase tracking-wider bg-green-500/10 text-green-700 dark:text-green-300 ring-1 ring-green-500/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                Why Choose Us
                            </span>

                            <h2 className="mt-5 text-3xl md:text-4xl lg:text-[40px] font-extrabold leading-[1.15] tracking-tight text-zinc-900 dark:text-white">
                                Travel Smarter{" "}
                                <span className="text-green-500">
                                    With Ticketix
                                </span>
                            </h2>

                            <p className="mt-5 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
                                Book bus, train, launch and flight tickets from
                                a single platform. Verified vendors, instant
                                confirmations, real-time updates and secure
                                payments — everything you need for a stress-free
                                journey across Bangladesh.
                            </p>

                            <div className="mt-7 grid grid-cols-3 gap-4">
                                {[
                                    { value: "50K+", label: "Happy Users" },
                                    { value: "1.2K+", label: "Routes" },
                                    { value: "99%", label: "On-time" },
                                ].map((stat) => (
                                    <div
                                        key={stat.label}
                                        className="rounded-xl bg-zinc-50 dark:bg-zinc-800/60 px-3 py-3 text-center ring-1 ring-zinc-100 dark:ring-zinc-800"
                                    >
                                        <p className="text-lg font-extrabold text-zinc-900 dark:text-white">
                                            {stat.value}
                                        </p>
                                        <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mt-0.5">
                                            {stat.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {features.map((feature) => {
                        const Icon = feature.icon;
                        const highlighted = feature.highlight;

                        return (
                            <motion.div
                                key={feature.title}
                                variants={itemVariants}
                                whileHover={{ y: -6 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 280,
                                    damping: 22,
                                }}
                                className={`group relative rounded-2xl p-6 lg:p-7 border transition-all ${
                                    highlighted
                                        ? "bg-gradient-to-br from-green-500 to-emerald-600 border-transparent text-white shadow-xl shadow-green-500/25"
                                        : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-green-500/40 dark:hover:border-green-500/40 hover:shadow-lg hover:shadow-green-500/10"
                                }`}
                            >
                                <div
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                        highlighted
                                            ? "bg-white/20 text-white"
                                            : "bg-green-500/10 text-green-600 dark:text-green-400 ring-1 ring-green-500/20"
                                    }`}
                                >
                                    <Icon size={22} />
                                </div>

                                <h3
                                    className={`mt-5 text-lg font-bold tracking-tight ${
                                        highlighted
                                            ? "text-white"
                                            : "text-zinc-900 dark:text-white"
                                    }`}
                                >
                                    {feature.title}
                                </h3>

                                <p
                                    className={`mt-2 text-[14px] leading-relaxed ${
                                        highlighted
                                            ? "text-white/85"
                                            : "text-zinc-600 dark:text-zinc-400"
                                    }`}
                                >
                                    {feature.description}
                                </p>

                                <button
                                    type="button"
                                    className={`mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold transition-all ${
                                        highlighted
                                            ? "text-white hover:gap-2.5"
                                            : "text-green-600 dark:text-green-400 hover:gap-2.5"
                                    }`}
                                >
                                    Learn more
                                    <span className="transition-transform group-hover:translate-x-0.5">
                                        →
                                    </span>
                                </button>

                                {highlighted && (
                                    <div
                                        aria-hidden
                                        className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent"
                                    />
                                )}
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
};

export default WhyChooseUs;
