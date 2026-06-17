"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button, Avatar } from "@heroui/react";
import { useTheme } from "next-themes";
import {
    RiTrainLine,
    RiMenu2Line,
    RiCloseLine,
    RiUserLine,
    RiLogoutBoxLine,
    RiArrowDownSLine,
    RiSunLine,
    RiMoonLine,
} from "react-icons/ri";
import {
    ArrowRightFromSquare,
    BarsUnaligned,
    Grip,
    House,
    Person,
    Ticket,
} from "@gravity-ui/icons";

const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    console.log(theme);

    const [mounted, setMounted] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const user = {};
    const isLoading = false;

    const profileRef = useRef(null);
    const mobileMenuRef = useRef(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setIsProfileOpen(false);
            }
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
        setIsProfileOpen(false);
    }, [pathname]);

    const handleLogout = () => {
        router.push("/");
    };

    const getLinkClass = (path) => {
        const isActive = pathname === path;
        return `px-4 py-2 rounded-xl text-sm text-[16px] font-medium transition-all ${
            isActive
                ? "text-green-600 dark:text-green-400"
                : "text-zinc-600 hover:text-green-600 dark:text-zinc-400 dark:hover:text-green-300"
        }`;
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled
                    ? "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-200 dark:border-zinc-800"
                    : "bg-zinc-100 dark:bg-zinc-900"
            }`}
        >
            <div className="container mx-auto px-2 md:px-0">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                            <Ticket className="text-white" size={20} />
                        </div>
                        <span className="text-xl font-bold text-zinc-950 dark:text-zinc-50">
                            Ticketix
                        </span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-1">
                        <Link href="/" className={getLinkClass("/")}>
                            Home
                        </Link>
                        <Link
                            href="/all-tickets"
                            className={getLinkClass("/all-tickets")}
                        >
                            All Tickets
                        </Link>
                        {user && (
                            <Link
                                href="/dashboard"
                                className={getLinkClass("/dashboard")}
                            >
                                Dashboard
                            </Link>
                        )}
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        <Button
                            isIconOnly
                            variant="light"
                            size="sm"
                            onClick={() =>
                                setTheme(theme === "dark" ? "light" : "dark")
                            }
                            aria-label="Toggle theme"
                        >
                            {mounted ? (
                                theme === "dark" ? (
                                    <RiSunLine />
                                ) : (
                                    <RiMoonLine />
                                )
                            ) : (
                                <div className="w-5 h-5 bg-zinc-200 dark:bg-zinc-800 rounded-full animate-pulse" />
                            )}
                        </Button>

                        {isLoading ? (
                            <div className="w-20 h-8 bg-zinc-100 animate-pulse rounded-full" />
                        ) : !user ? (
                            <div className="flex gap-3">
                                {/* Login Button - Solid Green */}
                                <Link
                                    href="/login"
                                    className="px-6 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-all"
                                >
                                    Login
                                </Link>

                                {/* Register Button - Bordered */}
                                <Link
                                    href="/register"
                                    className="px-6 py-2 rounded-lg border-2 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
                                >
                                    Register
                                </Link>
                            </div>
                        ) : (
                            <div
                                className="relative"
                                ref={profileRef}
                                onMouseEnter={() => setIsProfileOpen(true)}
                            >
                                <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                                    <Avatar
                                        size="sm"
                                        src={user?.image}
                                        name={user?.name?.[0]}
                                    />
                                </button>

                                {isProfileOpen && (
                                    <div className="text-sm absolute right-0 top-full mt-4 w-48 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-zinc-100 dark:border-zinc-800 overflow-hidden py-1">
                                        <Link
                                            href="/dashboard/profile"
                                            className="flex items-center gap-2 px-4 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                                        >
                                            <Person /> Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex w-full items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        >
                                            <ArrowRightFromSquare /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden p-2 hamburger-btn"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                            <RiCloseLine size={24} />
                        ) : (
                            <RiMenu2Line size={24} />
                        )}
                    </button>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div
                    ref={mobileMenuRef}
                    className="md:hidden bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-4 space-y-1"
                >
                    <Link
                        href="/"
                        className="flex items-center gap-3 py-2 text-zinc-700 dark:text-zinc-300"
                    >
                        <House /> Home
                    </Link>
                    <Link
                        href="/all-tickets"
                        className="flex items-center gap-3 py-2 text-zinc-700 dark:text-zinc-300"
                    >
                        <Grip /> All Tickets
                    </Link>
                    {user && (
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-3 py-2 text-zinc-700 dark:text-zinc-300"
                        >
                            <BarsUnaligned /> Dashboard
                        </Link>
                    )}

                    {!user ? (
                        <div className="grid grid-cols-2 gap-2 pt-2">
                            <Button
                                as={Link}
                                href="/login"
                                color="success"
                                variant="flat"
                            >
                                Login
                            </Button>
                            <Button
                                as={Link}
                                href="/register"
                                variant="bordered"
                            >
                                Register
                            </Button>
                        </div>
                    ) : (
                        <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 mt-2">
                            <Link
                                href="/dashboard/profile"
                                className="flex items-center gap-3 py-2 text-zinc-700 dark:text-zinc-300"
                            >
                                <Person /> My Profile
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center gap-3 py-2 text-red-500"
                            >
                                <ArrowRightFromSquare /> Logout
                            </button>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
