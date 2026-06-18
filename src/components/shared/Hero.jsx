"use client";

import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import {
    Autoplay,
    Pagination,
    Navigation,
    EffectFade,
    Keyboard,
} from "swiper/modules";

import { Button, Chip } from "@heroui/react";
import {
    RiArrowRightLine,
    RiArrowLeftSLine,
    RiArrowRightSLine,
} from "react-icons/ri";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

const heroSlides = [
    {
        id: 1,
        bgImage:
            "https://images.unsplash.com/photo-1474487548417-781cb71495f3?q=80&w=2084&auto=format&fit=crop",
        badge: "🏆 #1 Ticket Booking Platform",
        title: "Book All Travel Tickets in One Place",
        subtitle:
            "Bus, train, launch and flight tickets — no hidden fees, instant confirmation, 24/7 support for all routes across Bangladesh.",
        ctaText: "Browse All Tickets",
        ctaLink: "/all-tickets",
    },
    {
        id: 2,
        bgImage:
            "https://images.unsplash.com/photo-1540339832862-474599807836?q=80&w=2070&auto=format&fit=crop",
        badge: "🚌 Intercity Bus Tickets",
        title: "Comfortable Bus Journeys, Guaranteed Seats",
        subtitle:
            "Book AC/non-AC bus tickets from 100+ trusted operators, choose your favorite seat, and get e-ticket instantly on your phone.",
        ctaText: "See Bus Routes",
        ctaLink: "/all-tickets?type=bus",
    },
    {
        id: 3,
        bgImage:
            "https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?q=80&w=2070&auto=format&fit=crop",
        badge: "🚄 Train Tickets",
        title: "Skip the Long Railway Lines",
        subtitle:
            "Book Bangladesh Railway tickets in seconds, choose your class, and avoid last minute ticket counters with our fast booking system.",
        ctaText: "Book Train Tickets",
        ctaLink: "/all-tickets?type=train",
    },
    {
        id: 4,
        bgImage:
            "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop",
        badge: "✈️ Flight Tickets",
        title: "Best Airfare Deals for Domestic & International Flights",
        subtitle:
            "Compare prices across all airlines, book cheap tickets with flexible reschedule options, and get instant e-boarding pass support.",
        ctaText: "Find Flight Deals",
        ctaLink: "/all-tickets?type=flight",
    },
    {
        id: 5,
        bgImage:
            "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop",
        badge: "⛴️ Launch & Ferry Tickets",
        title: "River Route Tickets Made Simple",
        subtitle:
            "Book cabin, deck and VIP launch tickets for all major river routes, with guaranteed boarding and zero overbooking issues.",
        ctaText: "Book Launch Tickets",
        ctaLink: "/all-tickets?type=launch",
    },
    {
        id: 6,
        bgImage:
            "https://images.unsplash.com/photo-1533106958148-daaeab8b83fe?q=80&w=2071&auto=format&fit=crop",
        badge: "🎉 Limited Time Offer",
        title: "Flat 15% Off on All Holiday Bookings",
        subtitle:
            "Book in advance for Eid, Puja or weekend trips and save big with our special discount — valid for all transport types until stock lasts.",
        ctaText: "Grab Discount Offer",
        ctaLink: "/all-tickets",
    },
];

const HeroSlider = () => {
    return (
        <section className="w-full mt-16 rounded-b-lg overflow-hidden shadow-2xl shadow-green-900/10 group">
            <Swiper
                modules={[
                    Autoplay,
                    Pagination,
                    Navigation,
                    EffectFade,
                    Keyboard,
                ]}
                loop={true}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                grabCursor={true}
                touchRatio={1.5}
                keyboard={{ enabled: true }}
                autoplay={{
                    delay: 5500,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                pagination={{
                    clickable: true,
                    bulletClass:
                        "inline-block w-2.5 h-2.5 rounded-full bg-white/30 mx-1.5 cursor-pointer transition-all duration-500",
                    bulletActiveClass: "!bg-green-500 !w-8 !shadow-lg !shadow-green-500/50",
                    el: ".hero-pagination",
                }}
                navigation={{
                    nextEl: ".hero-swiper-next",
                    prevEl: ".hero-swiper-prev",
                }}
                speed={800}
                className="w-full min-h-[50vh] sm:min-h-[58vh] md:min-h-[75vh] lg:min-h-[88vh]"
            >
                {heroSlides.map((slide, index) => (
                    <SwiperSlide key={slide.id} className="relative overflow-hidden">
                        <Image
                            src={slide.bgImage}
                            alt={slide.title}
                            fill
                            sizes="100vw"
                            priority={index === 0}
                            loading={index === 0 ? "eager" : "lazy"}
                            className="object-cover z-0 scale-105 animate-[kenburns_20s_ease-in-out_infinite_alternate] group-hover:[animation-play-state:paused]"
                        />

                        <div className="absolute inset-0 bg-gradient-to-r from-green-950/85 via-black/60 to-black/20 z-10" />
                        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/70 to-transparent z-10" />

                        <div className="relative z-20 h-full min-h-[50vh] sm:min-h-[58vh] md:min-h-[75vh] lg:min-h-[88vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center py-10 sm:py-12 md:py-0">
                            <Chip
                                variant="shadow"
                                color="success"
                                radius="full"
                                size="lg"
                                className="mb-4 w-fit !bg-white/10 backdrop-blur-xl border border-white/20 text-white font-medium hover:scale-[1.02] transition-all"
                            >
                                {slide.badge}
                            </Chip>

                            <h1 className="text-[clamp(1.6rem,6vw,3.7rem)] font-bold text-white leading-[1.2] max-w-3xl mb-4 text-shadow">
                                {slide.title}
                            </h1>

                            <p className="text-sm sm:text-base md:text-lg text-zinc-200 max-w-2xl mb-6 sm:mb-8 leading-relaxed text-shadow">
                                {slide.subtitle}
                            </p>

                            <Button
                                as={Link}
                                href={slide.ctaLink}
                                size="lg"
                                radius="lg"
                                className="w-full sm:w-fit font-semibold bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-600/30 hover:shadow-green-600/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                endContent={<RiArrowRightLine size={18} />}
                            >
                                {slide.ctaText}
                            </Button>
                        </div>
                    </SwiperSlide>
                ))}

                <Button
                    isIconOnly
                    variant="ghost"
                    aria-label="Previous slide"
                    className="hero-swiper-prev hidden md:flex absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 !bg-white/10 backdrop-blur-md !border-white/20 text-white hover:!bg-green-600 hover:!border-green-600 transition-all opacity-0 group-hover:opacity-100"
                >
                    <RiArrowLeftSLine size={22} />
                </Button>
                <Button
                    isIconOnly
                    variant="ghost"
                    aria-label="Next slide"
                    className="hero-swiper-next hidden md:flex absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 !bg-white/10 backdrop-blur-md !border-white/20 text-white hover:!bg-green-600 hover:!border-green-600 transition-all opacity-0 group-hover:opacity-100"
                >
                    <RiArrowRightSLine size={22} />
                </Button>

                <div className="hero-pagination absolute bottom-4 sm:bottom-6 left-0 right-0 z-30 flex justify-center" />
            </Swiper>
        </section>
    );
};

export default HeroSlider;