"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button, Avatar, Skeleton } from "@heroui/react";
import { useTheme } from "next-themes";
import Hamburger from "hamburger-react";
import { RiSunLine, RiMoonLine } from "react-icons/ri";
import {
    ArrowRightFromSquare,
    BarsUnaligned,
    Grip,
    House,
    Person,
    Ticket,
    LayoutHeaderCells,
} from "@gravity-ui/icons";
import { authClient, signOut } from "@/lib/auth-client";
import toast from "react-hot-toast";

const DesktopAuthSkeleton = () => {
    return (
        <div className="flex items-center gap-3">
            <Skeleton
                animationType="shimmer"
                className="h-10 w-28 rounded-xl"
            />

            <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800" />

            <div className="flex items-center gap-2.5 pr-3 min-w-[160px]">
                <Skeleton
                    animationType="shimmer"
                    className="h-9 w-9 shrink-0 rounded-full"
                />
                <div className="space-y-2">
                    <Skeleton
                        animationType="shimmer"
                        className="h-3 w-24 rounded-lg"
                    />
                    <Skeleton
                        animationType="shimmer"
                        className="h-3 w-16 rounded-lg"
                    />
                </div>
            </div>

            <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800" />

            <Skeleton
                animationType="shimmer"
                className="h-10 w-10 rounded-xl"
            />
        </div>
    );
};

const MobileDashboardSkeleton = () => {
    return (
        <div className="flex items-center gap-3.5 px-4 py-3 rounded-xl">
            <Skeleton
                animationType="shimmer"
                className="h-8 w-8 rounded-lg shrink-0"
            />
            <Skeleton animationType="shimmer" className="h-4 w-28 rounded-lg" />
        </div>
    );
};

const MobileAuthSkeleton = () => {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/40">
                <Skeleton
                    animationType="shimmer"
                    className="h-10 w-10 shrink-0 rounded-full"
                />
                <div className="flex-1 space-y-2">
                    <Skeleton
                        animationType="shimmer"
                        className="h-3 w-32 rounded-lg"
                    />
                    <Skeleton
                        animationType="shimmer"
                        className="h-3 w-20 rounded-lg"
                    />
                </div>
            </div>

            <Skeleton
                animationType="shimmer"
                className="h-11 w-full rounded-xl"
            />
            <Skeleton
                animationType="shimmer"
                className="h-11 w-full rounded-xl"
            />
        </div>
    );
};

const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { setTheme, resolvedTheme } = useTheme();

    const [mounted, setMounted] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { data, isPending, refetch } = authClient.useSession();

    const user = data?.user;
    const isLoading = isPending;
    const mobileMenuRef = useRef(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(e.target) &&
                !e.target.closest(".hamburger-btn")
            ) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const handleLogout = async () => {
        setIsMobileMenuOpen(false);

        try {
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: async () => {
                        await refetch?.(); // session state revalidate
                        toast.success("Logged out successfully");
                        router.replace("/");
                        router.refresh();
                    },
                    onError: (ctx) => {
                        toast.error(ctx.error.message || "Logout failed");
                    },
                },
            });
        } catch (err) {
        }
    };

    const isDark = mounted && resolvedTheme === "dark";

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled || isMobileMenuOpen
                    ? "bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shadow-sm"
                    : "bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800"
            }`}
        >
            <div className="container mx-auto px-2 md:px-0">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:shadow-green-500/30 transition-shadow">
                            <Ticket className="text-white" size={22} />
                        </div>
                        <span className="text-xl font-bold tracking-tight">
                            <span className="text-zinc-900 dark:text-white">
                                Ticket
                            </span>
                            <span className="text-green-500">ix</span>
                        </span>
                    </Link>

                    <div className="hidden lg:flex items-center gap-10">
                        {[
                            { path: "/", label: "Home" },
                            { path: "/all-tickets", label: "All Tickets" },
                        ].map((link) => {
                            const isActive = pathname === link.path;

                            return (
                                <Link
                                    key={link.path}
                                    href={link.path}
                                    className={`relative py-1 text-[15px] font-medium transition-colors border-b-2 ${
                                        isActive
                                            ? "text-green-500 border-green-500"
                                            : "text-zinc-600 dark:text-zinc-400 hover:text-green-500 dark:hover:text-green-400 border-transparent"
                                    }`}
                                >
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="hidden lg:flex items-center h-10">
                        <Button
                            isIconOnly
                            variant="light"
                            radius="lg"
                            className="w-10 h-10 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            onClick={() => setTheme(isDark ? "light" : "dark")}
                            aria-label="Toggle theme"
                        >
                            {mounted ? (
                                isDark ? (
                                    <RiSunLine size={18} />
                                ) : (
                                    <RiMoonLine size={18} />
                                )
                            ) : (
                                <div className="w-4 h-4 rounded-full bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
                            )}
                        </Button>

                        <div className="w-px h-6 mx-3 bg-zinc-200 dark:bg-zinc-800" />

                        {isLoading ? (
                            <DesktopAuthSkeleton />
                        ) : !user ? (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/login"
                                    className="text-[15px] font-medium text-zinc-800 dark:text-zinc-200 hover:text-green-500 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link href="/register">
                                    <Button
                                        radius="lg"
                                        className="bg-green-500 text-white font-medium hover:bg-green-600 shadow-lg shadow-green-500/20 hover:shadow-green-500/30 transition-all px-6"
                                    >
                                        Register
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <>
                                <Link href={`dashboard/${user?.role}`}>
                                    <Button
                                        variant="bordered"
                                        radius="lg"
                                        className="border-green-500 text-green-500 font-medium px-4 gap-2"
                                    >
                                        <LayoutHeaderCells size={16} />
                                        Dashboard
                                    </Button>
                                </Link>

                                <div className="w-px h-6 mx-3 bg-zinc-200 dark:bg-zinc-800" />

                                <Link
                                    href={`/dashboard/${user?.role}/profile`}
                                    className="flex items-center gap-2.5 pr-3 group"
                                >
                                    <Avatar className="w-9 h-9 group-hover:ring-2 ring-blue-500/70 transition-all cursor-pointer">
                                        <Avatar.Image
                                        className="object-cover"
                                            src={user?.image}
                                            alt={user?.name || "User"}
                                        />
                                        <Avatar.Fallback className="uppercase bg-success text-white">
                                            {user?.name?.slice(0, 2) || "U"}
                                        </Avatar.Fallback>
                                    </Avatar>
                                    <div className="text-left">
                                        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 max-w-[120px] truncate">
                                            {user?.name || "User"}
                                        </p>
                                        <p className="text-[11px] uppercase tracking-wider text-zinc-500">
                                            {user?.role || "USER"}
                                        </p>
                                    </div>
                                </Link>

                                <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-800" />

                                <Button
                                    isIconOnly
                                    variant="light"
                                    radius="lg"
                                    onClick={handleLogout}
                                    className="w-10 h-10 rounded-xl text-zinc-600 dark:text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 ml-2"
                                    aria-label="Logout"
                                >
                                    <ArrowRightFromSquare size={18} />
                                </Button>
                            </>
                        )}
                    </div>

                    <div className="lg:hidden hamburger-btn flex items-center justify-center">
                        {mounted ? (
                            <Hamburger
                                toggled={isMobileMenuOpen}
                                toggle={setIsMobileMenuOpen}
                                size={22}
                                color="#16a34a"
                                label="Show menu"
                            />
                        ) : (
                            <div className="w-[48px] h-[48px]" />
                        )}
                    </div>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div
                    ref={mobileMenuRef}
                    className="lg:hidden !bg-white dark:!bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 shadow-xl shadow-black/5 dark:shadow-black/20 relative z-50"
                >
                    <div className="container mx-auto px-2 md:px-0 py-4">
                        <div className="space-y-1">
                            {[
                                { path: "/", label: "Home", icon: House },
                                {
                                    path: "/all-tickets",
                                    label: "All Tickets",
                                    icon: Grip,
                                },
                                ...(!isLoading && user
                                    ? [
                                          {
                                              path: `/dashboard/${user?.role}`,
                                              label: "Dashboard",
                                              icon: BarsUnaligned,
                                          },
                                      ]
                                    : []),
                            ].map((link) => {
                                const isActive = pathname === link.path;
                                const Icon = link.icon;

                                return (
                                    <Link
                                        key={link.path}
                                        href={link.path}
                                        className={`group flex items-center gap-3.5 px-4 py-3 rounded-xl text-[15px] font-semibold transition-all ${
                                            isActive
                                                ? "bg-green-500/10 dark:bg-green-500/10 text-green-600 dark:text-green-400"
                                                : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                        }`}
                                    >
                                        <span
                                            className={`p-1.5 rounded-lg transition-colors ${
                                                isActive
                                                    ? "bg-green-500 text-white shadow-sm shadow-green-500/30"
                                                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover:text-green-500 dark:group-hover:text-green-400"
                                            }`}
                                        >
                                            <Icon size={18} />
                                        </span>
                                        {link.label}
                                        {isActive && (
                                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-500" />
                                        )}
                                    </Link>
                                );
                            })}

                            {isLoading && <MobileDashboardSkeleton />}

                            <button
                                onClick={() =>
                                    setTheme(
                                        mounted && resolvedTheme === "dark"
                                            ? "light"
                                            : "dark",
                                    )
                                }
                                className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-[15px] font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
                            >
                                <span className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                                    {mounted && resolvedTheme === "dark" ? (
                                        <RiSunLine
                                            size={18}
                                            className="text-amber-500"
                                        />
                                    ) : (
                                        <RiMoonLine
                                            size={18}
                                            className="text-indigo-500"
                                        />
                                    )}
                                </span>
                                {mounted && resolvedTheme === "dark"
                                    ? "Light Mode"
                                    : "Dark Mode"}
                            </button>
                        </div>

                        <div className="my-4 border-t border-zinc-100 dark:border-zinc-800" />

                        {isLoading ? (
                            <MobileAuthSkeleton />
                        ) : !user ? (
                            <div className="grid grid-cols-2 gap-3">
                                <Link href="/login" className="w-full">
                                    <Button
                                        fullWidth
                                        variant="flat"
                                        radius="lg"
                                        className="bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 h-11"
                                    >
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/register" className="w-full">
                                    <Button
                                        fullWidth
                                        radius="lg"
                                        className="bg-green-500 text-white font-semibold hover:bg-green-600 shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all h-11"
                                    >
                                        Register
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-1">
                                <Link
                                    href="/dashboard/profile"
                                    className="flex items-center gap-3.5 px-4 py-3 rounded-xl text-[15px] font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
                                >
                                    <span className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                                        <Person size={18} />
                                    </span>
                                    My Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-[15px] font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                                >
                                    <span className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-500">
                                        <ArrowRightFromSquare size={18} />
                                    </span>
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
