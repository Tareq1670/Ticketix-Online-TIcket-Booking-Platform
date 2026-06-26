
import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";

import { NextResponse } from "next/server";

const baseUrl =
    process.env.NEXT_PUBLIC_URL;

const parseBackendResponse = async (res) => {
    const contentType = res.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
        return await res.json();
    }

    const text = await res.text();
    return {
        success: res.ok,
        message: text || "Unexpected server response",
    };
};

export async function GET(req) {
    try {

        const { token } = await auth.api.getToken({
            headers: await headers(),
        })

        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 },
            );
        }

        const { searchParams } = new URL(req.url);
        const vendorId = searchParams.get("vendorId");

        if (!vendorId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "vendorId is required",
                },
                { status: 400 },
            );
        }

        const backendRes = await fetch(
            `${baseUrl}/api/vendor/revenue-overview?vendorId=${encodeURIComponent(vendorId)}`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
                cache: "no-store",
            },
        );

        const data = await parseBackendResponse(backendRes);

        return NextResponse.json(data, {
            status: backendRes.status,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error?.message || "Something went wrong",
            },
            { status: 500 },
        );
    }
}
