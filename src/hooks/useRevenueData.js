"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useRevenueData = (vendorId) => {
    const [revenueData, setRevenueData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRevenue = useCallback(async () => {
        if (!vendorId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const baseURL =
                process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

            const res = await axios.get(
                `${baseURL}/api/vendor/revenue-overview`,
                {
                    params: { vendorId },
                },
            );

            if (res.data?.success) {
                setRevenueData(res.data.data);
            } else {
                setError(res.data?.message || "Failed to load revenue data");
            }
        } catch (err) {
            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to load revenue data";
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [vendorId]);

    useEffect(() => {
        fetchRevenue();
    }, [fetchRevenue]);

    return { revenueData, loading, error, refetch: fetchRevenue };
};

export default useRevenueData;
