"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div
                style={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    padding: "14px 16px",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                    minWidth: "200px",
                }}
            >
                <p
                    style={{
                        fontWeight: 700,
                        color: "#111827",
                        marginBottom: "10px",
                        paddingBottom: "8px",
                        borderBottom: "1px solid #e5e7eb",
                        fontSize: "14px",
                    }}
                >
                    🚍 {label}
                </p>
                {payload.map((entry, index) => (
                    <div
                        key={index}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "12px",
                            padding: "4px 0",
                            fontSize: "13px",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                            }}
                        >
                            <span
                                style={{
                                    width: "10px",
                                    height: "10px",
                                    borderRadius: "50%",
                                    backgroundColor: entry.color,
                                    display: "inline-block",
                                }}
                            />
                            <span style={{ color: "#4b5563" }}>
                                {entry.name}
                            </span>
                        </div>
                        <span
                            style={{
                                fontWeight: 600,
                                color: "#111827",
                            }}
                        >
                            {entry.name === "Revenue"
                                ? `৳${entry.value.toLocaleString()}`
                                : entry.value}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const TransportBarChart = ({ data }) => {
    const hasData = data && data.length > 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700"
        >
            <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                        Revenue by Transport Type
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Compare added, sold and revenue per transport
                    </p>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Left: Tickets
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        Right: Revenue
                    </span>
                </div>
            </div>

            {!hasData ? (
                <div className="flex flex-col items-center justify-center h-72 text-gray-400">
                    <span className="text-5xl mb-3">🚆</span>
                    <p>No transport data yet</p>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={380}>
                    <BarChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 0, bottom: 10 }}
                        barGap={8}
                        barCategoryGap="25%"
                    >
                        <defs>
                            <linearGradient
                                id="addedBarGrad"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#93c5fd" />
                            </linearGradient>
                            <linearGradient
                                id="soldBarGrad"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop offset="0%" stopColor="#10b981" />
                                <stop offset="100%" stopColor="#6ee7b7" />
                            </linearGradient>
                            <linearGradient
                                id="revenueBarGrad"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop offset="0%" stopColor="#a855f7" />
                                <stop offset="100%" stopColor="#d8b4fe" />
                            </linearGradient>
                        </defs>

                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                            vertical={false}
                        />

                        <XAxis
                            dataKey="type"
                            tick={{
                                fill: "#6b7280",
                                fontSize: 13,
                                fontWeight: 500,
                            }}
                            axisLine={{ stroke: "#d1d5db" }}
                            tickLine={false}
                        />

                        <YAxis
                            yAxisId="left"
                            orientation="left"
                            tick={{ fill: "#3b82f6", fontSize: 12 }}
                            axisLine={{ stroke: "#d1d5db" }}
                            tickLine={false}
                        />

                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            tick={{ fill: "#a855f7", fontSize: 12 }}
                            axisLine={{ stroke: "#d1d5db" }}
                            tickLine={false}
                            tickFormatter={(value) =>
                                value >= 1000
                                    ? `৳${(value / 1000).toFixed(0)}k`
                                    : `৳${value}`
                            }
                        />

                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ fill: "rgba(168, 85, 247, 0.05)" }}
                        />

                        <Legend
                            iconType="circle"
                            wrapperStyle={{ paddingTop: "20px" }}
                        />

                        <Bar
                            yAxisId="left"
                            dataKey="ticketsAdded"
                            name="Added"
                            fill="url(#addedBarGrad)"
                            barSize={28}
                            radius={[8, 8, 0, 0]}
                            animationDuration={1500}
                        />
                        <Bar
                            yAxisId="left"
                            dataKey="ticketsSold"
                            name="Sold"
                            fill="url(#soldBarGrad)"
                            barSize={28}
                            radius={[8, 8, 0, 0]}
                            animationDuration={1500}
                            animationBegin={200}
                        />
                        <Bar
                            yAxisId="right"
                            dataKey="revenue"
                            name="Revenue"
                            fill="url(#revenueBarGrad)"
                            barSize={28}
                            radius={[8, 8, 0, 0]}
                            animationDuration={1500}
                            animationBegin={400}
                        />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </motion.div>
    );
};

export default TransportBarChart;