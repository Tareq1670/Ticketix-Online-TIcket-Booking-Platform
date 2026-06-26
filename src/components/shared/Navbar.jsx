"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const normalizePath = (p) => {
    if (!p || p === "/") return "/";
    return p.replace(/\/+$/, "");
};

const DesktopAuthSkeleton = () => (
    <div className="flex items-center gap-3">
        <Skeleton animationType="shimmer" className="h-10 w-28 rounded-xl" />
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
        <Skeleton animationType="shimmer" className="h-10 w-10 rounded-xl" />
    </div>
);

const MobileDashboardSkeleton = () => (
    <div className="flex items-center gap-3.5 px-4 py-3 rounded-xl">
        <Skeleton
            animationType="shimmer"
            className="h-8 w-8 rounded-lg shrink-0"
        />
        <Skeleton animationType="shimmer" className="h-4 w-28 rounded-lg" />
    </div>
);

const MobileAuthSkeleton = () => (
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
        <Skeleton animationType="shimmer" className="h-11 w-full rounded-xl" />
        <Skeleton animationType="shimmer" className="h-11 w-full rounded-xl" />
    </div>
);

const DesktopNavLink = ({ href, label, isActive }) => (
    <Link
        href={href}
        className="relative px-4 py-2 rounded-xl text-[15px] font-semibold transition-colors duration-300 select-none"
    >
        {isActive && (
            <motion.span
                layoutId="nav-active-pill"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
                className="absolute inset-0 rounded-xl bg-gradient-to-b from-green-500/15 to-emerald-500/10 dark:from-green-500/20 dark:to-emerald-500/[0.12] ring-1 ring-green-500/25 dark:ring-green-400/25 shadow-[0_10px_30px_-18px_rgba(16,185,129,0.55)]"
            />
        )}
        <span
            className={`relative z-10 transition-colors duration-300 ${
                isActive
                    ? "text-green-700 dark:text-green-300"
                    : "text-zinc-700 dark:text-zinc-300 hover:text-green-600 dark:hover:text-green-400"
            }`}
        >
            {label}
        </span>
    </Link>
);

const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { setTheme, resolvedTheme } = useTheme();

    const currentPath = normalizePath(pathname);

    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    const { data, isPending, refetch } = authClient.useSession();
    const user = data?.user;
    const isLoading = isPending;

    const mobileMenuRef = useRef(null);
    const profileMenuWrapRef = useRef(null);
    const closeTimeoutRef = useRef(null);

    const isDark = mounted && resolvedTheme === "dark";
    const isHomeActive = currentPath === "/";
    const isAllTicketsActive =
        currentPath === "/all-tickets" ||
        currentPath.startsWith("/all-tickets/");
    const isDashboardActive =
        user && currentPath === `/dashboard/${user?.role}/profile`;

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll, { passive: true });
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
            if (
                profileMenuOpen &&
                profileMenuWrapRef.current &&
                !profileMenuWrapRef.current.contains(e.target)
            ) {
                setProfileMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [profileMenuOpen]);

    useEffect(() => {
        setIsMobileMenuOpen(false);
        setProfileMenuOpen(false);
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    }, [currentPath]);

    useEffect(() => {
        if (isMobileMenuOpen) {
            setProfileMenuOpen(false);
            if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        }
    }, [isMobileMenuOpen]);

    useEffect(() => {
        return () => {
            if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        };
    }, []);

    const openProfileMenu = useCallback(() => {
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        setProfileMenuOpen(true);
    }, []);

    const closeProfileMenu = useCallback(() => {
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = setTimeout(
            () => setProfileMenuOpen(false),
            150,
        );
    }, []);

    const toggleTheme = useCallback(() => {
        setTheme(isDark ? "light" : "dark");
    }, [isDark, setTheme]);

    const handleLogout = useCallback(async () => {
        setIsMobileMenuOpen(false);
        setProfileMenuOpen(false);

        try {
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: async () => {
                        await refetch?.();
                        toast.success("Logged out successfully");
                        router.replace("/");
                        router.refresh();
                    },
                    onError: (ctx) =>
                        toast.error(ctx.error.message || "Logout failed"),
                },
            });
        } catch (err) {
            toast.error("Something went wrong while logging out");
        }
    }, [refetch, router]);

    const mobileLinks = [
        { path: "/", label: "Home", icon: House, active: isHomeActive },
        {
            path: "/all-tickets",
            label: "All Tickets",
            icon: Grip,
            active: isAllTicketsActive,
        },
        ...(!isLoading && user
            ? [
                  {
                      path: `/dashboard/${user?.role}/profile`,
                      label: "Dashboard",
                      icon: BarsUnaligned,
                      active: isDashboardActive,
                  },
              ]
            : []),
    ];

    return (
        <motion.nav
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled || isMobileMenuOpen
                    ? "bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 shadow-sm"
                    : "bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800"
            }`}
        >
            <div className="container mx-auto px-2 md:px-0">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <motion.div
                            whileHover={{ scale: 1.08, rotate: -6 }}
                            whileTap={{ scale: 0.94 }}
                            transition={{
                                type: "spring",
                                stiffness: 380,
                                damping: 18,
                            }}
                            className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/20 group-hover:shadow-green-500/30 transition-shadow"
                        >
                            <Ticket className="text-white" size={22} />
                        </motion.div>
                        <span className="text-xl font-bold tracking-tight">
                            <span className="text-zinc-900 dark:text-white">
                                Ticket
                            </span>
                            <span className="text-green-500">ix</span>
                        </span>
                    </Link>

                    <div className="hidden lg:flex items-center gap-1">
                        <LayoutGroup id="navbar-active">
                            <DesktopNavLink
                                href="/"
                                label="Home"
                                isActive={isHomeActive}
                            />
                            <DesktopNavLink
                                href="/all-tickets"
                                label="All Tickets"
                                isActive={isAllTicketsActive}
                            />
                        </LayoutGroup>
                    </div>

                    <div className="hidden lg:flex items-center h-10">
                        <motion.div whileTap={{ scale: 0.92 }}>
                            <Button
                                isIconOnly
                                variant="light"
                                radius="lg"
                                onClick={toggleTheme}
                                aria-label="Toggle theme"
                                className="w-10 h-10 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                                <AnimatePresence mode="wait" initial={false}>
                                    {mounted ? (
                                        isDark ? (
                                            <motion.span
                                                key="sun"
                                                initial={{
                                                    rotate: -90,
                                                    opacity: 0,
                                                    scale: 0.7,
                                                }}
                                                animate={{
                                                    rotate: 0,
                                                    opacity: 1,
                                                    scale: 1,
                                                }}
                                                exit={{
                                                    rotate: 90,
                                                    opacity: 0,
                                                    scale: 0.7,
                                                }}
                                                transition={{ duration: 0.25 }}
                                            >
                                                <RiSunLine
                                                    size={18}
                                                    className="text-amber-500"
                                                />
                                            </motion.span>
                                        ) : (
                                            <motion.span
                                                key="moon"
                                                initial={{
                                                    rotate: 90,
                                                    opacity: 0,
                                                    scale: 0.7,
                                                }}
                                                animate={{
                                                    rotate: 0,
                                                    opacity: 1,
                                                    scale: 1,
                                                }}
                                                exit={{
                                                    rotate: -90,
                                                    opacity: 0,
                                                    scale: 0.7,
                                                }}
                                                transition={{ duration: 0.25 }}
                                            >
                                                <RiMoonLine
                                                    size={18}
                                                    className="text-indigo-500"
                                                />
                                            </motion.span>
                                        )
                                    ) : (
                                        <div className="w-4 h-4 rounded-full bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
                                    )}
                                </AnimatePresence>
                            </Button>
                        </motion.div>

                        <div className="w-px h-6 mx-3 bg-zinc-200 dark:bg-zinc-800" />

                        {isLoading ? (
                            <DesktopAuthSkeleton />
                        ) : !user ? (
                            <motion.div
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35 }}
                                className="flex items-center gap-4"
                            >
                                <Link
                                    href="/login"
                                    className="text-[15px] font-medium text-zinc-800 dark:text-zinc-200 hover:text-green-600 dark:hover:text-green-400 transition-colors"
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
                            </motion.div>
                        ) : (
                            <>
                                <motion.div whileTap={{ scale: 0.96 }}>
                                    <Link
                                        href={`/dashboard/${user?.role}/profile`}
                                    >
                                        <Button
                                            variant="bordered"
                                            radius="lg"
                                            className="border-green-500 text-green-600 dark:text-green-400 font-semibold px-4 gap-2 hover:bg-green-500/10 dark:hover:bg-green-500/15 transition-colors"
                                        >
                                            <LayoutHeaderCells size={16} />
                                            Dashboard
                                        </Button>
                                    </Link>
                                </motion.div>

                                <div className="w-px h-6 mx-3 bg-zinc-200 dark:bg-zinc-800" />

                                <div
                                    ref={profileMenuWrapRef}
                                    className="relative"
                                    onMouseEnter={openProfileMenu}
                                    onMouseLeave={closeProfileMenu}
                                >
                                    <motion.button
                                        type="button"
                                        whileTap={{ scale: 0.97 }}
                                        aria-haspopup="menu"
                                        aria-expanded={profileMenuOpen}
                                        onClick={() =>
                                            setProfileMenuOpen((v) => !v)
                                        }
                                        className={`flex items-center gap-2.5 px-2 py-1.5 rounded-xl transition-all border ${
                                            profileMenuOpen
                                                ? "bg-green-500/[0.12] dark:bg-green-500/15 border-green-500/20 dark:border-green-500/25"
                                                : "hover:bg-zinc-100 dark:hover:bg-zinc-800 border-transparent"
                                        }`}
                                    >
                                        <Avatar className="w-9 h-9 ring-2 ring-transparent hover:ring-green-500/40 transition-all cursor-pointer">
                                            <Avatar.Image
                                                className="object-cover"
                                                src={user?.image}
                                                alt={user?.name || "User"}
                                            />
                                            <Avatar.Fallback className="uppercase bg-success text-white">
                                                {user?.name?.slice(0, 2) || "U"}
                                            </Avatar.Fallback>
                                        </Avatar>

                                        <div className="text-left hidden xl:block">
                                            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 max-w-[140px] truncate">
                                                {user?.name || "User"}
                                            </p>
                                            <p className="text-[11px] uppercase tracking-wider text-zinc-500">
                                                {user?.role || "USER"}
                                            </p>
                                        </div>
                                    </motion.button>

                                    <AnimatePresence>
                                        {profileMenuOpen && (
                                            <motion.div
                                                role="menu"
                                                initial={{
                                                    opacity: 0,
                                                    y: -8,
                                                    scale: 0.96,
                                                }}
                                                animate={{
                                                    opacity: 1,
                                                    y: 0,
                                                    scale: 1,
                                                }}
                                                exit={{
                                                    opacity: 0,
                                                    y: -6,
                                                    scale: 0.97,
                                                }}
                                                transition={{
                                                    duration: 0.22,
                                                    ease: [0.22, 1, 0.36, 1],
                                                }}
                                                className="absolute right-0 top-full mt-3 w-[240px] rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-[0_25px_70px_-35px_rgba(0,0,0,0.6)] overflow-hidden z-50 origin-top-right"
                                            >
                                                <div className="p-2">
                                                    <Link
                                                        href={`/dashboard/${user?.role}/profile`}
                                                        role="menuitem"
                                                        onClick={() =>
                                                            setProfileMenuOpen(
                                                                false,
                                                            )
                                                        }
                                                        className="group w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-[14px] font-semibold transition-all bg-transparent hover:bg-green-500/10 dark:hover:bg-green-500/15"
                                                    >
                                                        <span className="w-9 h-9 rounded-xl flex items-center justify-center bg-green-500/10 text-zinc-900 dark:text-zinc-100 ring-1 ring-green-500/20 dark:ring-green-400/20 transition-colors group-hover:bg-green-500/15 group-hover:text-green-600 dark:group-hover:text-green-400">
                                                            <Person size={18} />
                                                        </span>
                                                        <span className="flex-1 text-zinc-900 dark:text-zinc-100">
                                                            My Profile
                                                        </span>
                                                    </Link>

                                                    <div className="my-2 h-px bg-zinc-100 dark:bg-zinc-800" />

                                                    <button
                                                        type="button"
                                                        role="menuitem"
                                                        onClick={handleLogout}
                                                        className="w-full flex items-center  px-4 gap-3.5 py-2.5 rounded-xl text-[14px] font-semibold transition-all bg-transparent hover:bg-red-500/10 dark:hover:bg-red-500/15"
                                                    >
                                                        <span className="w-9 h-9 rounded-xl flex items-center justify-center bg-red-500/10 dark:bg-red-500/15 text-red-600 dark:text-red-400 ring-1 ring-red-500/20 dark:ring-red-400/20 transition-colors">
                                                            <ArrowRightFromSquare
                                                                size={18}
                                                            />
                                                        </span>
                                                        <span className=" text-red-700 dark:text-red-300">
                                                            Logout
                                                        </span>
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="w-px h-6 mx-3 bg-zinc-200 dark:bg-zinc-800" />
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

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        ref={mobileMenuRef}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="lg:hidden !bg-white dark:!bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 shadow-xl shadow-black/5 dark:shadow-black/20 relative z-50"
                    >
                        <div className="container mx-auto px-2 md:px-0 py-4">
                            <div className="space-y-1">
                                {mobileLinks.map((link, i) => {
                                    const Icon = link.icon;
                                    const isActive = link.active;

                                    return (
                                        <motion.div
                                            key={link.path}
                                            initial={{ opacity: 0, x: -8 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{
                                                delay: i * 0.05,
                                                duration: 0.25,
                                            }}
                                        >
                                            <Link
                                                href={link.path}
                                                className={`group flex items-center gap-3.5 px-4 py-3 rounded-xl text-[15px] font-semibold transition-all ${
                                                    isActive
                                                        ? "bg-green-500/10 text-green-700 dark:text-green-300 border border-green-500/20"
                                                        : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                                }`}
                                            >
                                                <span
                                                    className={`p-1.5 rounded-lg transition-colors ${
                                                        isActive
                                                            ? "bg-green-500 text-white shadow-sm shadow-green-500/30"
                                                            : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover:text-green-600 dark:group-hover:text-green-400"
                                                    }`}
                                                >
                                                    <Icon size={18} />
                                                </span>

                                                {link.label}

                                                {isActive && (
                                                    <span className="ml-auto w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_0_3px_rgba(34,197,94,0.18)]" />
                                                )}
                                            </Link>
                                        </motion.div>
                                    );
                                })}

                                {isLoading && <MobileDashboardSkeleton />}

                                <button
                                    onClick={toggleTheme}
                                    className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-[15px] font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
                                >
                                    <span className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                                        {mounted && isDark ? (
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
                                    {mounted && isDark
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
                                        href={`/dashboard/${user?.role}/profile`}
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
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;