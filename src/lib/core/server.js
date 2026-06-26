import { redirect } from "next/navigation";
import { auth } from "../auth";
import { headers } from "next/headers";

const baseUrl = process.env.NEXT_PUBLIC_URL;

export const serverDataFetch = async (path) => {
    const { token } = await auth.api.getToken({
        headers: await headers(),
    });
    const res = await fetch(`${baseUrl}${path}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        cache: "no-cache",
    });
    return handleVerifyCode(res);
};

export const serverMutation = async (path, data, method = "POST") => {
    const { token } = await auth.api.getToken({
        headers: await headers(),
    });

    const res = await fetch(`${baseUrl}${path}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    return handleVerifyCode(res);
};

export const publicServerDataFetch = async (path) => {
    const res = await fetch(`${baseUrl}${path}`, {
        cache: "no-cache",
    });
    return handleVerifyCode(res);
};

const handleVerifyCode = (res) => {
    if (res.status === 401) {
        redirect("/unauthorized");
    } else if (res.status === 403) {
        redirect("/forbidden");
    }

    return res.json();
};


