"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    FaTicketAlt,
    FaShoppingCart,
    FaDollarSign,
    FaChartLine,
} from "react-icons/fa";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

const AnimatedNumber = ({ value, prefix = "" }) => {
    const [display, setDisplay] = React.useState(0);

    React.useEffect(() => {
        let start = 0;
        const duration = 1200;
        const startTime = performance.now();

        const step = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(Math.round(value * eased));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [value]);

    return (
        <>
            {prefix}
            {display.toLocaleString()}
        </>
    );
};

const SummaryCards = ({ summary }) => {
    const cards = [
        {
            title: "Total Tickets Added",
            value: summary?.totalTicketsAdded || 0,
            hint: `${summary?.remainingTickets || 0} still available`,
            icon: <FaTicketAlt size={24} />,
            gradient: "from-blue-500 via-blue-600 to-indigo-700",
            shadow: "shadow-blue-500/30",
            glow: "bg-blue-400/20",
        },
        {
            title: "Total Tickets Sold",
            value: summary?.totalTicketsSold || 0,
            hint: `${summary?.sellRate || 0}% sell rate`,
            icon: <FaShoppingCart size={24} />,
            gradient: "from-emerald-500 via-emerald-600 to-teal-700",
            shadow: "shadow-emerald-500/30",
            glow: "bg-emerald-400/20",
        },
        {
            title: "Total Revenue",
            value: summary?.totalRevenue || 0,
            prefix: "৳",
            hint: `Avg ৳${(summary?.avgTicketPrice || 0).toLocaleString()} per ticket`,
            icon: <FaDollarSign size={24} />,
            gradient: "from-purple-500 via-purple-600 to-fuchsia-700",
            shadow: "shadow-purple-500/30",
            glow: "bg-purple-400/20",
        },
        {
            title: "Monthly Growth",
            value: Math.abs(summary?.revenueGrowth || 0),
            suffix: "%",
            isGrowth: true,
            growthUp: (summary?.revenueGrowth || 0) >= 0,
            hint: `Top: ${summary?.topTransport || "N/A"}`,
            icon: <FaChartLine size={24} />,
            gradient:
                (summary?.revenueGrowth || 0) >= 0
                    ? "from-cyan-500 via-teal-500 to-emerald-600"
                    : "from-rose-500 via-red-500 to-orange-600",
            shadow: "shadow-teal-500/30",
            glow: "bg-teal-400/20",
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {cards.map((card, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, type: "spring" }}
                    whileHover={{ y: -6, scale: 1.02 }}
                    className={`relative overflow-hidden bg-gradient-to-br ${card.gradient} rounded-2xl p-5 text-white shadow-xl ${card.shadow}`}
                >
                    <motion.div
                        className={`absolute -top-10 -right-10 w-28 h-28 rounded-full ${card.glow} blur-2xl`}
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    />

                    <div className="relative z-10">
                        <div className="flex items-start justify-between mb-3">
                            <div className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl">
                                {card.icon}
                            </div>
                            {card.isGrowth && (
                                <div className="bg-white/20 p-1.5 rounded-lg">
                                    {card.growthUp ? (
                                        <FiTrendingUp size={18} />
                                    ) : (
                                        <FiTrendingDown size={18} />
                                    )}
                                </div>
                            )}
                        </div>

                        <p className="text-sm font-medium text-white/90 mb-1">
                            {card.title}
                        </p>
                        <p className="text-3xl font-bold tracking-tight">
                            {card.isGrowth && (card.growthUp ? "+" : "-")}
                            <AnimatedNumber
                                value={card.value}
                                prefix={card.prefix || ""}
                            />
                            {card.suffix || ""}
                        </p>

                        <div className="mt-3 pt-3 border-t border-white/20">
                            <p className="text-xs text-white/80 font-medium">
                                {card.hint}
                            </p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

export default SummaryCards;