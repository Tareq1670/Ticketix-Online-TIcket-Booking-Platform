"use client";

import { LogoLinkedin, Ticket } from "@gravity-ui/icons";
import Link from "next/link";
import { CiTwitter } from "react-icons/ci";
import { FaInstagram } from "react-icons/fa";
import {
    RiTrainLine,
    RiLinksLine,
    RiContactsLine,
    RiSecurePaymentLine,
    RiMailLine,
    RiPhoneLine,
    RiFacebookCircleLine,
    RiVisaLine,
    RiMastercardFill,
} from "react-icons/ri";
import { SiStripe } from "react-icons/si";

const Footer = () => {
    return (
        <footer className="mt-10 w-full bg-zinc-50 dark:bg-zinc-950 rounded-t-3xl border-t border-zinc-200 dark:border-zinc-800">
            <div className="container mx-auto px-2 md:px-0 py-6 md:py-10 pb-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
                    <div>
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 bg-green-600 rounded-lg flex items-center justify-center shadow-md">
                                <Ticket className="text-white" size={20} />
                            </div>
                            <span className="text-xl font-bold text-zinc-900 dark:text-white">
                                Ticketix
                            </span>
                        </Link>

                        <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6">
                            Book bus, train, launch & flight tickets easily.
                            Fast, secure, and hassle-free travel booking for all
                            your journeys.
                        </p>

                        <div className="flex items-center gap-3">
                            <a
                                href="#facebook"
                                className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-green-50 dark:hover:bg-green-950/30 hover:text-green-600 dark:hover:text-green-400 transition-all"
                            >
                                <RiFacebookCircleLine size={18} />
                            </a>
                            <a
                                href="#linkedin"
                                className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-green-50 dark:hover:bg-green-950/30 hover:text-green-600 dark:hover:text-green-400 transition-all"
                            >
                                <LogoLinkedin size={18} />
                            </a>
                            <a
                                href="#twitter"
                                className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-green-50 dark:hover:bg-green-950/30 hover:text-green-600 dark:hover:text-green-400 transition-all"
                            >
                                <CiTwitter size={18} />
                            </a>
                            <a
                                href="#instagram"
                                className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-green-50 dark:hover:bg-green-950/30 hover:text-green-600 dark:hover:text-green-400 transition-all"
                            >
                                <FaInstagram size={18} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold text-lg mb-5">
                            <RiLinksLine size={18} />
                            Quick Links
                        </h4>
                        <ul className="space-y-3">
                            {[
                                { label: "Home", path: "/" },
                                { label: "All Tickets", path: "/all-tickets" },
                                { label: "Contact Us", path: "/contact" },
                                { label: "About", path: "/about" },
                            ].map((link) => (
                                <li key={link.path}>
                                    <Link
                                        href={link.path}
                                        className="text-zinc-600 dark:text-zinc-400 text-sm hover:text-green-600 dark:hover:text-green-400 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold text-lg mb-5">
                            <RiContactsLine size={18} />
                            Contact Info
                        </h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 text-sm">
                                <RiMailLine
                                    size={16}
                                    className="text-green-600 dark:text-green-400"
                                />
                                support@ticketix.com
                            </li>
                            <li className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 text-sm">
                                <RiPhoneLine
                                    size={16}
                                    className="text-green-600 dark:text-green-400"
                                />
                                +880 1700-000000
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 text-sm hover:text-green-600 dark:hover:text-green-400 transition-colors"
                                >
                                    <RiFacebookCircleLine
                                        size={16}
                                        className="text-green-600 dark:text-green-400"
                                    />
                                    Facebook Page
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold text-lg mb-5">
                            <RiSecurePaymentLine size={18} />
                            Payment Methods
                        </h4>
                        <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-4">
                            Secure payments powered by Stripe.
                        </p>
                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="px-3 py-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[#635BFF]">
                                <SiStripe size={32} />
                            </div>
                            <div className="px-3 py-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[#1A1F71]">
                                <RiVisaLine size={32} />
                            </div>
                            <div className="px-3 py-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-[#EB001B]">
                                <RiMastercardFill size={32} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-zinc-200 dark:border-zinc-800 mt-12 py-5 flex flex-col md:flex-row justify-between items-center gap-3">
                    <p className="text-sm text-zinc-500 dark:text-zinc-500">
                        © 2025 Ticketix. All rights reserved.
                    </p>
                    <div className="flex items-center gap-5 text-sm text-zinc-500 dark:text-zinc-500">
                        <p>Privacy Policy</p>
                        <p>Terms of Service</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
