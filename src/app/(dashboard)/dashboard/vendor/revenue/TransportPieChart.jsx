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

const COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
];

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
                        color: "#111827",
                        fontSize: "14px",
                        marginBottom: "6px",
                    }}
                >
                    {data.name}
                </p>
                <p style={{ fontSize: "13px", color: "#4b5563" }}>
                    Sold:{" "}
                    <span
                        style={{
                            fontWeight: 700,
                            color: "#111827",
                        }}
                    >
                        {data.value} tickets
                    </span>
                </p>
            </div>
        );
    }
    return null;
};

const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
}) => {
    if (percent < 0.05) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor="middle"
            dominantBaseline="central"
            className="text-xs font-bold"
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const TransportPieChart = ({ data }) => {
    const pieData =
        data
            ?.filter((item) => item.ticketsSold > 0)
            .map((item) => ({
                name: item.type,
                value: item.ticketsSold,
            })) || [];

    return (
        <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700"
        >
            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                    Sales by Transport
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Tickets sold distribution
                </p>
            </div>

            {pieData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-72 text-gray-400">
                    <span className="text-5xl mb-3">🚌</span>
                    <p>No sales data yet</p>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={110}
                            paddingAngle={3}
                            dataKey="value"
                            label={renderCustomLabel}
                            labelLine={false}
                            animationDuration={1200}
                        >
                            {pieData.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                    stroke="none"
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            iconType="circle"
                            wrapperStyle={{ paddingTop: "10px" }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            )}
        </motion.div>
    );
};

export default TransportPieChart;