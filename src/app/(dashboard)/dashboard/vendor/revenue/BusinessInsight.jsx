"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    FiTrendingUp,
    FiTrendingDown,
    FiAlertTriangle,
    FiCheckCircle,
} from "react-icons/fi";

const BusinessInsight = ({ summary }) => {
    const {
        totalRevenue = 0,
        sellRate = 0,
        revenueGrowth = 0,
        remainingTickets = 0,
        potentialRevenue = 0,
        topTransport = "N/A",
    } = summary || {};

    const isGrowing = revenueGrowth >= 0;
    const isHealthy = sellRate >= 40;

    let statusMessage = "";
    let statusType = "";

    if (totalRevenue === 0) {
        statusMessage =
            "You haven't earned any revenue yet. Add attractive tickets and promote them to start selling!";
        statusType = "warning";
    } else if (sellRate >= 60 && isGrowing) {
        statusMessage =
            "Excellent! Your business is performing great with strong sales and growing revenue.";
        statusType = "success";
    } else if (sellRate >= 40) {
        statusMessage =
            "Good progress! Your tickets are selling well. Keep adding popular routes to grow more.";
        statusType = "success";
    } else if (sellRate < 40 && totalRevenue > 0) {
        statusMessage =
            "Your sell rate is low. Consider adjusting prices or adding more attractive perks to boost sales.";
        statusType = "warning";
    } else {
        statusMessage = "Keep tracking your performance to grow your business.";
        statusType = "neutral";
    }

    const statusConfig = {
        success: {
            bg: "from-emerald-500 to-green-600",
            icon: <FiCheckCircle size={24} />,
            label: "Business Healthy",
        },
        warning: {
            bg: "from-amber-500 to-orange-600",
            icon: <FiAlertTriangle size={24} />,
            label: "Needs Attention",
        },
        neutral: {
            bg: "from-blue-500 to-indigo-600",
            icon: <FiTrendingUp size={24} />,
            label: "Getting Started",
        },
    };

    const config = statusConfig[statusType];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`relative overflow-hidden bg-gradient-to-r ${config.bg} rounded-2xl p-6 text-white shadow-xl`}
        >
            <motion.div
                className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/10 blur-2xl"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 5, repeat: Infinity }}
            />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-5">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                        {config.icon}
                    </div>
                    <div>
                        <p className="text-xs font-medium text-white/80 uppercase tracking-wide">
                            Status
                        </p>
                        <p className="text-lg font-bold">{config.label}</p>
                    </div>
                </div>

                <div className="hidden md:block w-px h-12 bg-white/30" />

                <div className="flex-1">
                    <p className="text-sm md:text-base font-medium leading-relaxed">
                        {statusMessage}
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                    {isGrowing ? (
                        <FiTrendingUp size={20} />
                    ) : (
                        <FiTrendingDown size={20} />
                    )}
                    <div>
                        <p className="text-xs text-white/80">This Month</p>
                        <p className="font-bold">
                            {isGrowing ? "+" : ""}
                            {revenueGrowth}%
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default BusinessInsight;