import { authClient } from "../auth-client";

const baseUrl = process.env.NEXT_PUBLIC_URL;

export const serverMutation = async (path, data, method = "POST") => {
    const { data: token } = await authClient.token();

    const res = await fetch(`${baseUrl}${path}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.token}`,
        },
        body: JSON.stringify(data),
    });

    return res.json();
};

export const serverDelete = async (path) => {
    const { data: tokenData } = await authClient.token();
    console.log(tokenData.token);

    const res = await fetch(`${baseUrl}${path}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData?.token}`,
        },
    });

    return res.json();
};

export const clientDataFetch = async (path) => {
    const { data: token } = await authClient.token();
    console.log(token);

    const res = await fetch(`${baseUrl}${path}`, {
        headers: {
            Authorization: `Bearer ${token.token}`,
        },
        cache: "no-cache",
    });

    if (res.status === 401) {
        window.location.href = "/unauthorized";
        return;
    } else if (res.status === 403) {
        window.location.href = "/forbidden";
        return;
    }

    return res.json();
};


export const publicClientDataFetch = async (path) => {
    const res = await fetch(`${baseUrl}${path}`, {
        cache: "no-cache",
    });

    return res.json();
};