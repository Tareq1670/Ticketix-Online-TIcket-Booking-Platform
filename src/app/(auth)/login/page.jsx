"use client";

import {
    Button,
    Description,
    FieldError,
    Form,
    Input,
    Label,
    TextField,
} from "@heroui/react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { IoTicketOutline } from "react-icons/io5";
import { MdOutlineEventSeat } from "react-icons/md";
import { HiOutlineTicket } from "react-icons/hi2";
import { BsShieldLock, BsEnvelope } from "react-icons/bs";

const validateStrongPassword = (value) => {
    if (!value || value.length < 8) {
        return "Password must be at least 8 characters";
    }
    if (!/[A-Z]/.test(value)) {
        return "Password must contain at least 1 uppercase letter";
    }
    if (!/[a-z]/.test(value)) {
        return "Password must contain at least 1 lowercase letter";
    }
    if (!/[0-9]/.test(value)) {
        return "Password must contain at least 1 number";
    }
    if (!/[^A-Za-z0-9]/.test(value)) {
        return "Password must contain at least 1 special character";
    }
    return null;
};

const LoginPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") || "/";

    const [error, setError] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const loginData = Object.fromEntries(formData.entries());

        // ===========================
        // Temporary simulation only
        // ===========================
        setTimeout(() => {
            setLoading(false);
            console.log("Login Data:", loginData);

            toast.success("Welcome back to TicketHub!", {
                duration: 2500,
                position: "top-center",
                icon: "🎫",
                style: {
                    background: "#fff7ed",
                    color: "#9a3412",
                    borderRadius: "12px",
                    border: "1px solid #fdba74",
                    fontWeight: "600",
                },
            });

            router.push(redirect);
        }, 1200);
    };

    const handleGoogleLogin = async () => {
        console.log("Google Login triggered");
        toast("Google sign in coming soon", {
            icon: "🚀",
            position: "top-center",
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-green-50 via-white to-green-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 transition-colors duration-500">
            {/* Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -left-20 w-72 h-72 bg-green-200/30 dark:bg-green-900/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-green-200/25 dark:bg-green-900/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 right-10 w-48 h-48 bg-green-300/15 dark:bg-green-800/10 rounded-full blur-2xl" />

                <div className="absolute top-[15%] left-[10%] text-green-300/20 dark:text-green-700/15 animate-pulse">
                    <IoTicketOutline size={60} />
                </div>
                <div className="absolute top-[25%] right-[15%] text-green-300/20 dark:text-green-700/15 animate-pulse">
                    <HiOutlineTicket size={45} />
                </div>
                <div className="absolute bottom-[20%] left-[15%] text-green-300/15 dark:text-green-700/10 animate-pulse">
                    <MdOutlineEventSeat size={50} />
                </div>
                <div className="absolute bottom-[30%] right-[10%] text-green-300/15 dark:text-green-700/10 animate-pulse">
                    <IoTicketOutline size={35} />
                </div>
            </div>

            {/* Card */}
            <div className="relative w-full max-w-md">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-400/20 via-green-400/20 to-green-400/20 dark:from-green-600/10 dark:via-green-600/10 dark:to-green-600/10 rounded-2xl blur-xl" />

                <div className="relative bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xl border border-green-100 dark:border-zinc-800 rounded-2xl shadow-2xl shadow-green-900/5 dark:shadow-black/20 p-8 md:p-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/25 mb-4">
                            <IoTicketOutline className="text-white" size={32} />
                        </div>

                        <h2 className="text-2xl md:text-3xl font-bold text-zinc-800 dark:text-zinc-100 tracking-tight">
                            Welcome Back
                        </h2>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                            Sign in to your{" "}
                            <span className="font-semibold text-green-600 dark:text-green-400">
                                Ticketix
                            </span>{" "}
                            account
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                            <svg
                                className="w-4 h-4 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <Form
                        onSubmit={handleLogin}
                        className="flex flex-col gap-5"
                    >
                        {/* Email */}
                        <TextField
                            isRequired
                            name="email"
                            type="email"
                            className="w-full"
                            validate={(value) => {
                                if (
                                    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
                                        value,
                                    )
                                ) {
                                    return "Please enter a valid email address";
                                }
                                return null;
                            }}
                        >
                            <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">
                                Email Address
                            </Label>

                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 z-10 pointer-events-none">
                                    <BsEnvelope size={16} />
                                </div>

                                <Input
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50/70 dark:bg-zinc-800/60 text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-green-400 dark:focus:border-green-500 focus:ring-2 focus:ring-green-400/20 dark:focus:ring-green-500/20 outline-none transition-all duration-200"
                                />
                            </div>

                            <FieldError className="text-xs text-red-500 mt-1.5" />
                        </TextField>

                        {/* Password */}
                        <TextField
                            isRequired
                            minLength={8}
                            name="password"
                            type={showPassword ? "text" : "password"}
                            className="w-full"
                            validate={validateStrongPassword}
                        >
                            <div className="flex justify-between items-center mb-1.5">
                                <Label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 block">
                                    Password
                                </Label>

                                <Link
                                    href="/forgot-password"
                                    className="text-xs font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:underline transition-colors"
                                >
                                    Forgot Password?
                                </Link>
                            </div>

                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 z-10 pointer-events-none">
                                    <BsShieldLock size={16} />
                                </div>

                                <Input
                                    autoComplete="current-password"
                                    placeholder="Enter your password"
                                    className="w-full pl-10 pr-12 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50/70 dark:bg-zinc-800/60 text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:border-green-400 dark:focus:border-green-500 focus:ring-2 focus:ring-green-400/20 dark:focus:ring-green-500/20 outline-none transition-all duration-200"
                                />

                                <Button
                                variant="none"
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 hover:text-green-600 dark:hover:text-green-400 transition-colors z-10"
                                >
                                    {showPassword ? (
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            className="w-4 h-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                    )}
                                </Button>
                            </div>

                            <Description className="mt-1.5 text-xs text-green-600 dark:text-green-400">
                                Use 8+ characters with uppercase, lowercase,
                                number and special character.
                            </Description>

                            <FieldError className="text-xs text-red-500 mt-1.5" />
                        </TextField>

                        {/* Remember me */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="remember"
                                name="remember"
                                className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-600 text-green-600 focus:ring-green-500 dark:bg-zinc-800 cursor-pointer"
                            />
                            <label
                                htmlFor="remember"
                                className="text-sm text-zinc-600 dark:text-zinc-400 cursor-pointer select-none"
                            >
                                Remember me for 30 days
                            </label>
                        </div>

                        {/* Submit */}
                        <Button
                            type="submit"
                            isDisabled={isLoading}
                            className="w-full rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 disabled:opacity-60 disabled:cursor-not-allowed mt-1 active:scale-[0.98]"
                        >
                            {isLoading ? (
                                <>
                                    <svg
                                        className="animate-spin h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    <IoTicketOutline size={18} />
                                    Sign In
                                </>
                            )}
                        </Button>
                    </Form>

                    {/* Divider */}
                    <div className="relative flex py-5 items-center justify-center">
                        <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800" />
                        <span className="flex-shrink mx-4 text-zinc-400 dark:text-zinc-500 text-xs font-medium uppercase tracking-widest">
                            Or continue with
                        </span>
                        <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800" />
                    </div>

                    {/* Google */}
                    <Button
                        type="button"
                        onClick={handleGoogleLogin}
                        variant="flat"
                        className="w-full rounded-xl bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 font-medium py-3 hover:bg-green-50 dark:hover:bg-zinc-700/80 transition-all duration-200 flex items-center justify-center gap-3 border border-zinc-200/50 dark:border-zinc-700/50 active:scale-[0.98]"
                    >
                        <FcGoogle size={20} />
                        Continue with Google
                    </Button>

                    {/* Register */}
                    <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-7">
                        Don&apos;t have an account?{" "}
                        <Link
                            href={`/register?redirect=${encodeURIComponent(redirect)}`}
                            className="text-green-600 dark:text-green-400 font-semibold hover:text-green-700 dark:hover:text-green-300 hover:underline transition-colors"
                        >
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
