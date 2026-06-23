"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    BarChart,
    Bar,
    Cell,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import { FaTicketAlt, FaShoppingCart, FaDollarSign } from "react-icons/fa";
import { FiTrendingUp } from "react-icons/fi";

const MiniBarTooltip = ({ active, payload, isCurrency }) => {
    if (active && payload && payload.length) {
        const value = payload[0].value;
        return (
            <div
                style={{
                    backgroundColor: "#111827",
                    borderRadius: "8px",
                    padding: "6px 12px",
                    boxShadow: "0 6px 16px rgba(0,0,0,0.25)",
                }}
            >
                <p
                    style={{
                        color: "#ffffff",
                        fontWeight: 700,
                        fontSize: "13px",
                        margin: 0,
                    }}
                >
                    {isCurrency
                        ? `৳${value.toLocaleString()}`
                        : value.toLocaleString()}
                </p>
            </div>
        );
    }
    return null;
};

const StatChart = ({
    title,
    value,
    icon,
    color,
    lightColor,
    gradientId,
    isCurrency,
    chartData,
    delay,
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay, type: "spring", stiffness: 100 }}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden relative"
        >
            <motion.div
                className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-2xl opacity-20"
                style={{ backgroundColor: color }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div
                        className="p-3 rounded-xl"
                        style={{ backgroundColor: lightColor }}
                    >
                        <span style={{ color }}>{icon}</span>
                    </div>
                    <div
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{ backgroundColor: lightColor, color }}
                    >
                        <FiTrendingUp size={12} />
                        Total
                    </div>
                </div>

                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {title}
                </p>
                <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                    {isCurrency ? `৳${value.toLocaleString()}` : value.toLocaleString()}
                </h3>

                <div className="h-16 -mx-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <defs>
                                <linearGradient
                                    id={gradientId}
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop offset="0%" stopColor={color} />
                                    <stop
                                        offset="100%"
                                        stopColor={color}
                                        stopOpacity={0.4}
                                    />
                                </linearGradient>
                            </defs>
                            <Tooltip
                                content={
                                    <MiniBarTooltip isCurrency={isCurrency} />
                                }
                                cursor={{ fill: "transparent" }}
                            />
                            <Bar
                                dataKey="value"
                                radius={[4, 4, 0, 0]}
                                animationDuration={1200}
                            >
                                {chartData.map((_, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={`url(#${gradientId})`}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </motion.div>
    );
};

const TotalSummaryChart = ({ summary, monthlyData = [] }) => {
    const addedTrend =
        monthlyData.length > 0
            ? monthlyData.map((m) => ({ value: m.ticketsAdded }))
            : [{ value: summary?.totalTicketsAdded || 0 }];

    const soldTrend =
        monthlyData.length > 0
            ? monthlyData.map((m) => ({ value: m.ticketsSold }))
            : [{ value: summary?.totalTicketsSold || 0 }];

    const revenueTrend =
        monthlyData.length > 0
            ? monthlyData.map((m) => ({ value: m.revenue }))
            : [{ value: summary?.totalRevenue || 0 }];

    const stats = [
        {
            title: "Total Tickets Added",
            value: summary?.totalTicketsAdded || 0,
            icon: <FaTicketAlt size={22} />,
            color: "#3b82f6",
            lightColor: "rgba(59, 130, 246, 0.12)",
            gradientId: "addedMiniGrad",
            isCurrency: false,
            chartData: addedTrend,
            delay: 0.1,
        },
        {
            title: "Total Tickets Sold",
            value: summary?.totalTicketsSold || 0,
            icon: <FaShoppingCart size={22} />,
            color: "#10b981",
            lightColor: "rgba(16, 185, 129, 0.12)",
            gradientId: "soldMiniGrad",
            isCurrency: false,
            chartData: soldTrend,
            delay: 0.2,
        },
        {
            title: "Total Revenue",
            value: summary?.totalRevenue || 0,
            icon: <FaDollarSign size={22} />,
            color: "#a855f7",
            lightColor: "rgba(168, 85, 247, 0.12)",
            gradientId: "revenueMiniGrad",
            isCurrency: true,
            chartData: revenueTrend,
            delay: 0.3,
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
        >
            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                    Performance Summary
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Total tickets added, sold and revenue at a glance
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {stats.map((stat, index) => (
                    <StatChart key={index} {...stat} />
                ))}
            </div>
        </motion.div>
    );
};

export default TotalSummaryChart;