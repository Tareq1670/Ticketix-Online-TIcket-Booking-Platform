"use client";

import Image from "next/image";
import Link from "next/link";
import { FaBus, FaTrain, FaPlane, FaShip } from "react-icons/fa";
import { TbCurrencyTaka } from "react-icons/tb";
import {
    MdArrowForward,
    MdOutlineModeEdit,
    MdDeleteOutline,
    MdAccessTime,
} from "react-icons/md";
import { AlertDialog, Button } from "@heroui/react";
import { motion } from "framer-motion";

const transportIcons = {
    Bus: FaBus,
    Train: FaTrain,
    Plane: FaPlane,
    Launch: FaShip,
};

const statusStyle = {
    pending:
        "border border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400",
    approved:
        "border border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400",
    rejected:
        "border border-rose-200 bg-rose-100 text-rose-700 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-400",
};

const formatDate = (dateString) => {
    if (!dateString) return "Date not available";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";

    return date.toLocaleString("en-BD", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const contentStagger = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.07, delayChildren: 0.1 },
    },
};

const contentItem = {
    hidden: { opacity: 0, y: 14 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 120, damping: 14 },
    },
};

const MyAddedTicketCard = ({
    ticket,
    onDelete,
    deletingId,
    isFraud = false,
}) => {
    if (!ticket) return null;

    const ticketId = ticket?._id?.$oid || ticket?._id || "";
    const transportType = ticket?.transportType || "Bus";
    const Icon = transportIcons[transportType] || FaBus;
    const status = ticket?.verificationStatus || "pending";
    const isRejected = status === "rejected";
    const disableActions = isRejected || isFraud;

    return (
        <motion.div
            className="group flex h-full flex-col overflow-hidden rounded-[26px] border border-zinc-200 bg-white shadow-[0_15px_40px_-20px_rgba(0,0,0,0.18)] transition-colors dark:border-zinc-800 dark:bg-zinc-900"
            whileHover={{
                y: -5,
                boxShadow: "0 25px 50px -20px rgba(16,185,129,0.25)",
            }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
            <div className="relative h-44 w-full overflow-hidden">
                {ticket?.image ? (
                    <motion.div
                        className="relative h-full w-full"
                        whileHover={{ scale: 1.06 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <Image
                            src={ticket.image}
                            alt={ticket?.title || "Ticket image"}
                            fill
                            className="object-cover"
                        />
                    </motion.div>
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                        <Icon className="text-4xl text-zinc-400" />
                    </div>
                )}

                <motion.div
                    className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-green-700 shadow backdrop-blur-sm dark:bg-zinc-900/90 dark:text-green-400"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15, type: "spring", stiffness: 150 }}
                >
                    <Icon size={12} />
                    {transportType}
                </motion.div>

                <motion.div
                    className={`absolute right-3 top-3 rounded-full px-3 py-1 text-[11px] font-bold capitalize shadow-sm ${
                        statusStyle[status] || statusStyle.pending
                    }`}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
                >
                    {status}
                </motion.div>
            </div>

            <motion.div
                className="flex flex-1 flex-col p-4"
                variants={contentStagger}
                initial="hidden"
                animate="visible"
            >
                <div className="space-y-3">
                    <motion.h3
                        variants={contentItem}
                        className="line-clamp-2 text-lg font-black leading-snug text-zinc-900 dark:text-white"
                    >
                        {ticket?.title || "Untitled Ticket"}
                    </motion.h3>

                    <motion.div
                        variants={contentItem}
                        className="flex flex-wrap items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400"
                    >
                        <span className="rounded-lg bg-zinc-100 px-2.5 py-1 dark:bg-zinc-800">
                            {ticket?.from || "Unknown"}
                        </span>
                        <motion.span
                            animate={{ x: [0, 4, 0] }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        >
                            <MdArrowForward className="text-green-500" />
                        </motion.span>
                        <span className="rounded-lg bg-zinc-100 px-2.5 py-1 dark:bg-zinc-800">
                            {ticket?.to || "Unknown"}
                        </span>
                    </motion.div>

                    <motion.div
                        variants={contentItem}
                        className="grid grid-cols-3 gap-2.5"
                    >
                        <InfoBox
                            label="Price"
                            value={
                                <span className="flex items-center text-green-600 dark:text-green-400">
                                    <TbCurrencyTaka size={16} />
                                    {ticket?.price || 0}
                                </span>
                            }
                        />
                        <InfoBox label="Qty" value={ticket?.quantity || 0} />
                        <InfoBox
                            label="Sold"
                            value={ticket?.soldQuantity || 0}
                        />
                    </motion.div>

                    <motion.div
                        variants={contentItem}
                        className="flex items-center gap-2 rounded-xl bg-zinc-50 px-3 py-2.5 text-sm text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                    >
                        <motion.span
                            animate={{ rotate: [0, 360] }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                            className="shrink-0"
                        >
                            <MdAccessTime
                                className="text-green-500"
                                size={17}
                            />
                        </motion.span>
                        <span className="line-clamp-1">
                            {formatDate(ticket?.departureDate)}
                        </span>
                    </motion.div>

                    {ticket?.perks?.length > 0 && (
                        <motion.div
                            variants={contentItem}
                            className="flex flex-wrap gap-2"
                        >
                            {ticket.perks.slice(0, 3).map((perk, i) => (
                                <motion.span
                                    key={perk}
                                    initial={{ opacity: 0, scale: 0.7 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        delay: 0.3 + i * 0.08,
                                        type: "spring",
                                        stiffness: 180,
                                        damping: 12,
                                    }}
                                    whileHover={{ scale: 1.08, y: -2 }}
                                    className="rounded-full bg-green-50 px-3 py-1 text-[11px] font-semibold text-green-700 dark:bg-green-900/20 dark:text-green-400"
                                >
                                    {perk}
                                </motion.span>
                            ))}
                            {ticket.perks.length > 3 && (
                                <motion.span
                                    initial={{ opacity: 0, scale: 0.7 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        delay: 0.55,
                                        type: "spring",
                                        stiffness: 180,
                                    }}
                                    className="rounded-full bg-zinc-100 px-3 py-1 text-[11px] font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                                >
                                    +{ticket.perks.length - 3} more
                                </motion.span>
                            )}
                        </motion.div>
                    )}

                    {isRejected && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            transition={{ type: "spring", stiffness: 100 }}
                            className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-400"
                        >
                            Rejected tickets cannot be updated or deleted.
                        </motion.div>
                    )}
                </div>

                <motion.div
                    variants={contentItem}
                    className="mt-4 grid grid-cols-2 gap-3"
                >
                    {disableActions ? (
                        <Button
                            variant="none"
                            disabled
                            className="flex h-11 w-auto items-center justify-center gap-2 rounded-2xl bg-zinc-200 font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500"
                        >
                            <MdOutlineModeEdit size={18} />
                            Update
                        </Button>
                    ) : (
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <Link
                                href={`/dashboard/vendor/update-ticket/${ticketId}`}
                                className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-zinc-900 font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-zinc-900"
                            >
                                <MdOutlineModeEdit size={18} />
                                Update
                            </Link>
                        </motion.div>
                    )}

                    {disableActions ? (
                        <Button
                            variant="none"
                            disabled
                            className="flex h-11 w-auto items-center justify-center gap-2 rounded-2xl bg-rose-300 font-semibold text-white dark:bg-rose-900/40"
                        >
                            <MdDeleteOutline size={18} />
                            Delete
                        </Button>
                    ) : (
                        <AlertDialog>
                            <motion.div
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <Button
                                    variant="none"
                                    className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-rose-500 font-semibold text-white transition hover:bg-rose-600"
                                >
                                    <MdDeleteOutline size={18} />
                                    Delete
                                </Button>
                            </motion.div>

                            <AlertDialog.Backdrop>
                                <AlertDialog.Container>
                                    <AlertDialog.Dialog className="sm:max-w-[420px]">
                                        <AlertDialog.CloseTrigger />
                                        <AlertDialog.Header>
                                            <AlertDialog.Icon status="danger" />
                                            <AlertDialog.Heading>
                                                Delete ticket permanently?
                                            </AlertDialog.Heading>
                                        </AlertDialog.Header>

                                        <AlertDialog.Body>
                                            <p className="text-sm text-zinc-600 dark:text-zinc-300">
                                                This will permanently delete{" "}
                                                <strong>{ticket?.title}</strong>
                                                . This action cannot be undone.
                                            </p>
                                        </AlertDialog.Body>

                                        <AlertDialog.Footer>
                                            <Button
                                                slot="close"
                                                variant="tertiary"
                                            >
                                                Cancel
                                            </Button>

                                            <Button
                                                slot="close"
                                                variant="danger"
                                                isDisabled={
                                                    deletingId === ticketId
                                                }
                                                onPress={() =>
                                                    onDelete(ticketId)
                                                }
                                            >
                                                {deletingId === ticketId
                                                    ? "Deleting..."
                                                    : "Delete Ticket"}
                                            </Button>
                                        </AlertDialog.Footer>
                                    </AlertDialog.Dialog>
                                </AlertDialog.Container>
                            </AlertDialog.Backdrop>
                        </AlertDialog>
                    )}
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

const InfoBox = ({ label, value }) => {
    return (
        <motion.div
            className="rounded-xl bg-zinc-50 p-2.5 dark:bg-zinc-800"
            whileHover={{ scale: 1.05, y: -2 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
            <p className="text-[11px] text-zinc-500">{label}</p>
            <p className="mt-1 text-base font-bold text-zinc-900 dark:text-white">
                {value}
            </p>
        </motion.div>
    );
};

export default MyAddedTicketCard;
