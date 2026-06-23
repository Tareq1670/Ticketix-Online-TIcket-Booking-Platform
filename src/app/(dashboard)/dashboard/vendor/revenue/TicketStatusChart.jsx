"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const STATUS_COLORS = {
    Approved: "#10b981",
    Pending: "#f59e0b",
    Rejected: "#ef4444",
};

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        const data = payload[0];
        return (
            <div
                style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    padding: "12px 14px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                    minWidth: "150px",
                }}
            >
                <p
                    style={{
                        fontWeight: 700,
                        color: data.payload.fill,
                        fontSize: "14px",
                        marginBottom: "6px",
                    }}
                >
                    {data.name}
                </p>
                <p style={{ fontSize: "13px", color: "#4b5563" }}>
                    Count:{" "}
                    <span
                        style={{
                            fontWeight: 700,
                            color: "#111827",
                        }}
                    >
                        {data.value}
                    </span>
                </p>
            </div>
        );
    }
    return null;
};

const TicketStatusChart = ({ data }) => {
    const hasData = data && data.length > 0;

    return (
        <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700"
        >
            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                    Ticket Status
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Verification status breakdown
                </p>
            </div>

            {!hasData ? (
                <div className="flex flex-col items-center justify-center h-72 text-gray-400">
                    <span className="text-5xl mb-3">📋</span>
                    <p>No ticket data yet</p>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={100}
                            paddingAngle={4}
                            dataKey="value"
                            nameKey="label"
                            animationDuration={1200}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={
                                        STATUS_COLORS[entry.label] || "#6b7280"
                                    }
                                    stroke="none"
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            )}
        </motion.div>
    );
};

export default TicketStatusChart;