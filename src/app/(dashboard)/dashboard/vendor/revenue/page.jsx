"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImSpinner9 } from "react-icons/im";
import { FiAlertCircle, FiLock, FiBarChart2 } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import useRevenueData from "@/hooks/useRevenueData";
import BusinessInsight from "./BusinessInsight";
import SummaryCards from "./SummaryCards";
import TotalSummaryChart from "./TotalSummaryChart";
import MonthlyBarChart from "./MonthlyBarChart";
import TransportPieChart from "./TransportPieChart";
import TicketStatusChart from "./TicketStatusChart";
import TransportBarChart from "./TransportBarChart";

const StateWrapper = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center min-h-[60vh]"
    >
        {children}
    </motion.div>
);

const Spinner = ({ text }) => (
    <StateWrapper>
        <div className="text-center">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
                <ImSpinner9 className="text-blue-500 mx-auto mb-4" size={48} />
            </motion.div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">{text}</p>
        </div>
    </StateWrapper>
);

const RevenuePage = () => {
    const { data: session, isPending } = authClient.useSession();
    const vendorId = session?.user?.id;
    const { revenueData, loading, error } = useRevenueData(vendorId);

    if (isPending) return <Spinner text="Loading session..." />;

    if (!session?.user) {
        return (
            <StateWrapper>
                <div className="text-center bg-yellow-50 dark:bg-yellow-900/20 p-8 rounded-2xl max-w-md shadow-lg">
                    <FiLock className="text-yellow-500 text-5xl mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                        Please login to view revenue
                    </h3>
                </div>
            </StateWrapper>
        );
    }

    if (loading) return <Spinner text="Loading revenue data..." />;

    if (error) {
        return (
            <StateWrapper>
                <div className="text-center bg-red-50 dark:bg-red-900/20 p-8 rounded-2xl max-w-md shadow-lg">
                    <FiAlertCircle className="text-red-500 text-5xl mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
                        Something went wrong
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">{error}</p>
                </div>
            </StateWrapper>
        );
    }

    if (!revenueData) {
        return (
            <StateWrapper>
                <div className="text-center">
                    <FiBarChart2 className="text-gray-400 text-5xl mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300">
                        No revenue data found
                    </h3>
                    <p className="text-gray-400 mt-2">
                        Start adding tickets to see your business analytics
                    </p>
                </div>
            </StateWrapper>
        );
    }

    const { summary, monthlyData, transportBreakdown, ticketStatusBreakdown } =
        revenueData;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key="revenue"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 md:p-6 lg:p-8 space-y-7 max-w-7xl mx-auto"
            >
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between flex-wrap gap-4"
                >
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                            Business Analytics
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            Understand your profit, sales & growth at a glance
                        </p>
                    </div>
                    <div className="px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Hello,{" "}
                            <span className="font-bold text-purple-600 dark:text-purple-400">
                                {session.user.name || "Vendor"}
                            </span>
                        </p>
                    </div>
                </motion.div>

                <BusinessInsight summary={summary} />

                <SummaryCards summary={summary} />

                <TotalSummaryChart summary={summary} monthlyData={monthlyData} />

                <MonthlyBarChart data={monthlyData} summary={summary} />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <TransportPieChart data={transportBreakdown} />
                    <TicketStatusChart data={ticketStatusBreakdown} />
                </div>

                <TransportBarChart data={transportBreakdown} />
            </motion.div>
        </AnimatePresence>
    );
};

export default RevenuePage;