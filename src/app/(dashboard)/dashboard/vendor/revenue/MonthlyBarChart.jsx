"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    ComposedChart,
    Bar,
    Line,
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
                    📅 {label}
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

const MonthlyBarChart = ({ data }) => {
    const hasData =
        data &&
        data.length > 0 &&
        data.some(
            (d) => d.ticketsAdded > 0 || d.ticketsSold > 0 || d.revenue > 0
        );

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700"
        >
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                        Monthly Overview
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Tickets & Revenue trend over last 6 months
                    </p>
                </div>
                <div className="flex gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                </div>
            </div>

            {!hasData ? (
                <div className="flex flex-col items-center justify-center h-72 text-gray-400">
                    <span className="text-5xl mb-3">📊</span>
                    <p>No data available yet</p>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={350}>
                    <ComposedChart
                        data={data}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient
                                id="addedGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="0%"
                                    stopColor="#3b82f6"
                                    stopOpacity={1}
                                />
                                <stop
                                    offset="100%"
                                    stopColor="#3b82f6"
                                    stopOpacity={0.6}
                                />
                            </linearGradient>
                            <linearGradient
                                id="soldGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="0%"
                                    stopColor="#10b981"
                                    stopOpacity={1}
                                />
                                <stop
                                    offset="100%"
                                    stopColor="#10b981"
                                    stopOpacity={0.6}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e5e7eb"
                            vertical={false}
                        />
                        <XAxis
                            dataKey="month"
                            tick={{ fill: "#6b7280", fontSize: 13 }}
                            axisLine={{ stroke: "#d1d5db" }}
                        />
                        <YAxis
                            yAxisId="left"
                            tick={{ fill: "#6b7280", fontSize: 13 }}
                            axisLine={{ stroke: "#d1d5db" }}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            tick={{ fill: "#6b7280", fontSize: 13 }}
                            axisLine={{ stroke: "#d1d5db" }}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ fill: "rgba(168, 85, 247, 0.08)" }}
                        />
                        <Legend
                            wrapperStyle={{ paddingTop: "20px" }}
                            iconType="circle"
                        />
                        <Bar
                            yAxisId="left"
                            dataKey="ticketsAdded"
                            name="Tickets Added"
                            fill="url(#addedGradient)"
                            barSize={28}
                            radius={[8, 8, 0, 0]}
                            animationDuration={1500}
                        />
                        <Bar
                            yAxisId="left"
                            dataKey="ticketsSold"
                            name="Tickets Sold"
                            fill="url(#soldGradient)"
                            barSize={28}
                            radius={[8, 8, 0, 0]}
                            animationDuration={1500}
                            animationBegin={200}
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="revenue"
                            name="Revenue"
                            stroke="#a855f7"
                            strokeWidth={3}
                            dot={{
                                r: 5,
                                fill: "#a855f7",
                                strokeWidth: 2,
                                stroke: "#fff",
                            }}
                            activeDot={{ r: 8 }}
                            animationDuration={2000}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            )}
        </motion.div>
    );
};

export default MonthlyBarChart;