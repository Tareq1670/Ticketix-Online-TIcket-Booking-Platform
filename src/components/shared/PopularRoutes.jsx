"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Skeleton } from "@heroui/react";
import { getPopularRoutes } from "@/lib/api/tickets.client";
import {
  FaBus,
  FaTrain,
  FaPlane,
  FaShip,
  FaFire,
  FaArrowRight,
  FaRegClock,
  FaRoute,
  FaTicketAlt,
  FaStar,
} from "react-icons/fa";
import { HiOutlineLocationMarker, HiSparkles } from "react-icons/hi";
import { BsLightningChargeFill } from "react-icons/bs";
import { IoMdTrendingUp } from "react-icons/io";
import { MdOutlineExplore } from "react-icons/md";

const transportIconMap = {
  Bus: FaBus,
  Train: FaTrain,
  Plane: FaPlane,
  Launch: FaShip,
};

const transportGradients = {
  Bus: "from-blue-500 via-blue-600 to-indigo-700",
  Train: "from-violet-500 via-purple-600 to-indigo-700",
  Plane: "from-sky-400 via-cyan-500 to-blue-600",
  Launch: "from-teal-400 via-emerald-500 to-green-600",
};

const transportBgGlow = {
  Bus: "shadow-blue-500/25",
  Train: "shadow-violet-500/25",
  Plane: "shadow-sky-500/25",
  Launch: "shadow-teal-500/25",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const PopularRouteCardSkeleton = () => (
  <div className="rounded-[28px] bg-white dark:bg-zinc-900/80 border border-zinc-100 dark:border-zinc-800/60 overflow-hidden backdrop-blur-sm">
    <Skeleton className="h-48 w-full rounded-none" />
    <div className="p-6 space-y-5">
      <div className="flex items-center gap-3">
        <Skeleton className="h-11 w-11 rounded-2xl" />
        <Skeleton className="h-4 w-24 rounded-lg" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="flex-1 h-12 rounded-2xl" />
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="flex-1 h-12 rounded-2xl" />
      </div>
      <div className="flex justify-between pt-4">
        <Skeleton className="h-5 w-24 rounded-lg" />
        <Skeleton className="h-5 w-20 rounded-lg" />
      </div>
      <div className="flex items-end justify-between pt-2">
        <Skeleton className="h-10 w-24 rounded-xl" />
        <Skeleton className="h-12 w-32 rounded-2xl" />
      </div>
    </div>
  </div>
);

const TiltCard = ({ children, className }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), {
    stiffness: 300,
    damping: 30,
  });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px);
    y.set(py);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const formatDuration = (departureDate) => {
  if (!departureDate) return "Flexible";
  const date = new Date(departureDate);
  if (isNaN(date.getTime())) return "Flexible";
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
  });
};

const PopularRoutes = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const res = await getPopularRoutes();
        if (res?.success && Array.isArray(res?.data)) {
          setTickets(res.data);
        }
      } catch (err) {
        console.error("Failed to load popular routes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const popularRoutes = useMemo(() => {
    if (!tickets.length) return [];

    const routeMap = new Map();

    tickets.forEach((t) => {
      const key = `${t.from?.trim()}__${t.to?.trim()}__${t.transportType}`;
      if (!routeMap.has(key)) {
        routeMap.set(key, {
          from: t.from,
          to: t.to,
          transportType: t.transportType,
          minPrice: Number(t.price),
          tripCount: 1,
          departureDate: t.departureDate,
          soldQuantity: Number(t.soldQuantity || 0),
          ticketId: t._id || t.id,
          image: t.image || t.thumbnail || t.photo || null,
        });
      } else {
        const existing = routeMap.get(key);
        existing.tripCount += 1;
        existing.minPrice = Math.min(existing.minPrice, Number(t.price));
        existing.soldQuantity += Number(t.soldQuantity || 0);
        if (!existing.image && (t.image || t.thumbnail || t.photo)) {
          existing.image = t.image || t.thumbnail || t.photo;
        }
      }
    });

    const sorted = Array.from(routeMap.values()).sort((a, b) => {
      if (b.tripCount !== a.tripCount) return b.tripCount - a.tripCount;
      return b.soldQuantity - a.soldQuantity;
    });

    return sorted.slice(0, 6).map((r, i) => ({
      ...r,
      trending: i < 3 && r.soldQuantity > 0,
      rank: i + 1,
    }));
  }, [tickets]);

  return (
    <section className="relative py-24 lg:py-32 bg-gradient-to-b from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 w-full h-full"
      >
        <div className="absolute top-20 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-emerald-400/8 to-cyan-400/8 blur-[120px]" />
        <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-violet-400/8 to-blue-400/8 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-green-400/5 to-emerald-500/5 blur-[150px]" />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-[2.5px] bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 mb-8"
            >
              <BsLightningChargeFill size={14} className="animate-pulse" />
              MOST POPULAR ROUTES
              <IoMdTrendingUp size={16} />
            </motion.div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight text-zinc-900 dark:text-white">
              Where Everyone&apos;s{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 bg-clip-text text-transparent">
                  Traveling
                </span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-emerald-200/60 to-teal-200/60 dark:from-emerald-800/40 dark:to-teal-800/40 rounded-full origin-left"
                />
              </span>
            </h2>

            <p className="mt-6 text-lg lg:text-xl text-zinc-500 dark:text-zinc-400 max-w-lg leading-relaxed">
              Discover Bangladesh&apos;s most booked routes. Join thousands of
              happy travelers on journeys that never disappoint.
            </p>

            <div className="mt-8 flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 border-2 border-white dark:border-zinc-900 flex items-center justify-center text-white text-[10px] font-bold"
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">
                  10k+ travelers
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} size={14} className="text-amber-400" />
                ))}
                <span className="text-sm text-zinc-500 dark:text-zinc-400 font-medium ml-1">
                  4.9
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Link
              href="/all-tickets"
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all duration-300 shadow-xl shadow-zinc-900/15 dark:shadow-white/10 hover:shadow-2xl hover:-translate-y-0.5"
            >
              <MdOutlineExplore size={20} />
              Explore All Routes
              <FaArrowRight
                size={14}
                className="group-hover:translate-x-1.5 transition-transform duration-300"
              />
            </Link>
          </motion.div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
            {[...Array(6)].map((_, i) => (
              <PopularRouteCardSkeleton key={i} />
            ))}
          </div>
        ) : popularRoutes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 rounded-[32px] border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-24 h-24 rounded-[28px] bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900/30 dark:to-green-900/30 flex items-center justify-center text-emerald-500 mb-8 shadow-xl shadow-emerald-500/10"
            >
              <FaRoute size={44} />
            </motion.div>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">
              No Popular Routes Yet
            </h3>
            <p className="mt-3 text-zinc-500 dark:text-zinc-400 text-center max-w-sm leading-relaxed">
              Popular routes will appear here as soon as tickets are booked.
              Check back soon for trending destinations!
            </p>
            <Link
              href="/all-tickets"
              className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors"
            >
              Browse Tickets
              <FaArrowRight size={14} />
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7"
          >
            {popularRoutes.map((route, idx) => {
              const Icon = transportIconMap[route.transportType] || FaBus;
              const gradient =
                transportGradients[route.transportType] || transportGradients.Bus;
              const bgGlow =
                transportBgGlow[route.transportType] || transportBgGlow.Bus;

              return (
                <motion.div key={`${route.from}-${route.to}-${route.transportType}-${idx}`} variants={cardVariants}>
                  <TiltCard className="h-full perspective-1000">
                    <div
                      onMouseEnter={() => setHoveredCard(idx)}
                      onMouseLeave={() => setHoveredCard(null)}
                      className={`group relative h-full rounded-[28px] bg-white dark:bg-zinc-900/90 border border-zinc-100/80 dark:border-zinc-800/50 overflow-hidden hover:border-emerald-200/80 dark:hover:border-emerald-700/50 transition-all duration-500 backdrop-blur-sm shadow-lg shadow-zinc-200/40 dark:shadow-zinc-900/40 hover:shadow-2xl ${bgGlow}`}
                    >
                      <div className="relative h-48 overflow-hidden">
                        {route.image ? (
                          <Image
                            src={route.image}
                            alt={`${route.from} to ${route.to}`}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          />
                        ) : (
                          <div
                            className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}
                          >
                            <Icon
                              size={60}
                              className="text-white/20 group-hover:text-white/30 transition-colors duration-500"
                            />
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                        <div className="absolute top-4 left-4 flex items-center gap-2">
                          <div
                            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg ${bgGlow} backdrop-blur-sm`}
                          >
                            <Icon size={18} />
                          </div>
                          <span className="px-3 py-1.5 rounded-lg bg-white/15 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider border border-white/10">
                            {route.transportType}
                          </span>
                        </div>

                        {route.trending && (
                          <motion.div
                            initial={{ x: 60 }}
                            animate={{ x: 0 }}
                            transition={{ delay: 0.3 + idx * 0.1, type: "spring" }}
                            className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-orange-500/30"
                          >
                            <FaFire size={11} className="animate-pulse" />
                            HOT
                          </motion.div>
                        )}

                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-white/80">
                              <FaRegClock size={13} />
                              <span className="text-xs font-medium">
                                {formatDuration(route.departureDate)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-white/80">
                              <FaTicketAlt size={12} />
                              <span className="text-xs font-medium">
                                {route.tripCount}{" "}
                                {route.tripCount === 1 ? "trip" : "trips"} available
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="absolute top-4 left-1/2 -translate-x-1/2">
                          <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-xs font-bold">
                            #{route.rank}
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[2px] mb-1">
                              From
                            </p>
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20 flex-shrink-0" />
                              <p className="text-lg font-bold text-zinc-900 dark:text-white truncate">
                                {route.from}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-col items-center gap-1 px-2">
                            <div className="w-16 h-px bg-gradient-to-r from-emerald-300 via-emerald-500 to-emerald-300 dark:from-emerald-700 dark:via-emerald-500 dark:to-emerald-700 relative">
                              <motion.div
                                animate={
                                  hoveredCard === idx
                                    ? { x: [0, 56, 0] }
                                    : { x: 0 }
                                }
                                transition={{
                                  duration: 1.5,
                                  repeat: hoveredCard === idx ? Infinity : 0,
                                  ease: "easeInOut",
                                }}
                                className="absolute -top-1 left-0 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"
                              />
                            </div>
                            <FaArrowRight
                              size={10}
                              className="text-emerald-500"
                            />
                          </div>

                          <div className="flex-1 min-w-0 text-right">
                            <p className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[2px] mb-1">
                              To
                            </p>
                            <div className="flex items-center justify-end gap-2">
                              <p className="text-lg font-bold text-zinc-900 dark:text-white truncate">
                                {route.to}
                              </p>
                              <div className="w-2.5 h-2.5 rounded-full bg-red-500 ring-4 ring-red-500/20 flex-shrink-0" />
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800/60 flex items-end justify-between">
                          <div>
                            <p className="text-[10px] uppercase tracking-[2px] text-zinc-400 dark:text-zinc-500 font-bold">
                              Starting from
                            </p>
                            <div className="flex items-baseline gap-1 mt-1.5">
                              <span className="text-3xl font-black bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
                                ৳{route.minPrice.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          <Link
                            href={`/tickets/details/${route.ticketId}`}
                            className="group/btn relative inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 text-white font-bold px-6 py-3 rounded-2xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/35 transition-all duration-300 active:scale-95 overflow-hidden"
                          >
                            <span className="absolute inset-0 bg-gradient-to-r from-emerald-700 via-green-600 to-teal-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                            <span className="relative flex items-center gap-2">
                              Book Now
                              <FaArrowRight
                                size={13}
                                className="group-hover/btn:translate-x-1 transition-transform duration-300"
                              />
                            </span>
                          </Link>
                        </div>

                        {route.soldQuantity > 0 && (
                          <div className="mt-4 flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                whileInView={{
                                  width: `${Math.min(
                                    (route.soldQuantity /
                                      (route.soldQuantity + 20)) *
                                      100,
                                    95
                                  )}%`,
                                }}
                                viewport={{ once: true }}
                                transition={{
                                  duration: 1.2,
                                  delay: 0.3 + idx * 0.1,
                                  ease: [0.22, 1, 0.36, 1],
                                }}
                                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-400"
                              />
                            </div>
                            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider whitespace-nowrap">
                              {route.soldQuantity} sold
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 flex justify-center"
        >
          <div className="inline-flex items-center gap-8 px-8 py-4 rounded-2xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm border border-zinc-100 dark:border-zinc-800/50 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <HiSparkles size={20} className="text-emerald-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-900 dark:text-white">
                  Instant Confirmation
                </p>
                <p className="text-xs text-zinc-500">No waiting required</p>
              </div>
            </div>
            <div className="w-px h-10 bg-zinc-200 dark:bg-zinc-700" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <FaTicketAlt size={18} className="text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-900 dark:text-white">
                  E-Ticket
                </p>
                <p className="text-xs text-zinc-500">Digital tickets on phone</p>
              </div>
            </div>
            <div className="w-px h-10 bg-zinc-200 dark:bg-zinc-700 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                <BsLightningChargeFill size={18} className="text-violet-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-900 dark:text-white">
                  Best Prices
                </p>
                <p className="text-xs text-zinc-500">Guaranteed lowest fares</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PopularRoutes;




