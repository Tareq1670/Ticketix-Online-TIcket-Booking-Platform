import Link from "next/link";
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import {
    RiCheckLine,
    RiTicket2Line,
    RiUser3Line,
    RiMailLine,
    RiCalendarLine,
    RiBankCardLine,
    RiHome4Line,
    RiArrowRightLine,
    RiCloseCircleLine,
    RiErrorWarningLine,
    RiShieldCheckLine,
    RiFileListLine,
} from "react-icons/ri";
import { paymentAdd } from "@/lib/actions/transaction";

function formatMoney(amount = 0, currency = "BDT") {
    return new Intl.NumberFormat("en-BD", {
        style: "currency",
        currency: currency.toUpperCase(),
    }).format(amount / 100);
}

function formatDate(timestamp) {
    if (!timestamp) return "N/A";
    return new Date(timestamp * 1000).toLocaleDateString("en-BD", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function SummaryRow({ icon, label, value, mono = false, highlight = false }) {
    return (
        <div className="flex items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 shrink-0">
                <span className="text-base">{icon}</span>
                <span className="text-xs sm:text-sm">{label}</span>
            </div>
            <span
                className={`text-right ${
                    mono
                        ? "font-mono text-[10px] sm:text-xs break-all text-gray-700 dark:text-gray-300"
                        : highlight
                          ? "text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400"
                          : "text-xs sm:text-sm font-medium text-gray-900 dark:text-white"
                } max-w-[55%] sm:max-w-[60%]`}
            >
                {value || "N/A"}
            </span>
        </div>
    );
}

function CancelledState() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-3 py-6 sm:p-4">
            <div className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl shadow-xl dark:shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="h-1 sm:h-1.5 bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400" />
                <div className="grid md:grid-cols-2">
                    <div className="p-5 sm:p-8 md:p-12 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-100 dark:bg-red-500/10 flex items-center justify-center mb-4 sm:mb-6">
                            <RiCloseCircleLine className="text-3xl sm:text-4xl text-red-500" />
                        </div>
                        <div className="inline-flex items-center gap-2 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4">
                            <RiErrorWarningLine /> Payment Cancelled
                        </div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                            Payment was not completed
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm leading-relaxed max-w-sm">
                            No charge was made to your account. You can try
                            again anytime.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-6 sm:mt-8 w-full max-w-xs">
                            <Link
                                href="/"
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                            >
                                <RiHome4Line /> Home
                            </Link>
                            <Link
                                href="/"
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition"
                            >
                                Try Again <RiArrowRightLine />
                            </Link>
                        </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-5 sm:p-8 md:p-12 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex items-center justify-center mb-3 sm:mb-4">
                                <RiErrorWarningLine className="text-2xl sm:text-3xl text-yellow-500" />
                            </div>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                Need help? Contact our support team.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InvalidState({ title, description }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-3 py-6 sm:p-4">
            <div className="w-full max-w-xl bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 p-6 sm:p-10 text-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-yellow-100 dark:bg-yellow-500/10 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <RiErrorWarningLine className="text-3xl sm:text-4xl text-yellow-500" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                    {title}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8">
                    {description}
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition"
                >
                    <RiHome4Line /> Back to Home
                </Link>
            </div>
        </div>
    );
}

export default async function SuccessPage({ searchParams }) {
    const { session_id, canceled } = await searchParams;

    if (canceled === "true") return <CancelledState />;
    if (!session_id)
        return (
            <InvalidState
                title="Invalid Payment Session"
                description="No session ID was found. Please try your payment again."
            />
        );

    let session;
    try {
        session = await stripe.checkout.sessions.retrieve(session_id, {
            expand: ["payment_intent", "line_items"],
        });
    } catch {
        return (
            <InvalidState
                title="Verification Failed"
                description="We couldn't verify this payment. Please contact support."
            />
        );
    }

    if (session.status === "open") redirect("/");
    if (session.status !== "complete")
        return (
            <InvalidState
                title="Payment Not Completed"
                description="Your payment session exists but is not completed yet."
            />
        );

    const lineItem = session.line_items?.data?.[0];
    const customerName = session.customer_details?.name || "Customer";
    const customerEmail =
        session.customer_email || session.customer_details?.email || "N/A";

    const transactionId =
        typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id || "N/A";

    const amountPaid = formatMoney(session.amount_total, session.currency);
    const paymentDate = formatDate(session.created);
    const ticketTitle = lineItem?.description || "Ticket Purchase";
    const bookingId = session.metadata?.bookingId || "N/A";

    const paymentData = {
        transactionId,
        bookingId,
        ticketId: session.metadata.ticketId,
        userId: session.metadata.userId,
        amount: session.amount_subtotal / 100,
        userEmail: customerEmail,
    };

     await paymentAdd(paymentData);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-3 py-6 sm:p-4">
            <div className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl sm:rounded-3xl shadow-xl dark:shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="h-1 sm:h-1.5 bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-500" />

                <div className="grid md:grid-cols-2">
                    {/* Left - Success Message */}
                    <div className="p-5 sm:p-8 md:p-12 flex flex-col items-center justify-center text-center">
                        <div className="relative mb-4 sm:mb-6">
                            <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl scale-150" />
                            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center ring-4 ring-emerald-500/20">
                                <RiCheckLine className="text-3xl sm:text-4xl text-emerald-600 dark:text-emerald-400" />
                            </div>
                        </div>

                        <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-5">
                            <RiShieldCheckLine /> Payment Confirmed
                        </div>

                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                            Booking Confirmed!
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm leading-relaxed max-w-sm">
                            Thank you,{" "}
                            <span className="font-semibold text-gray-700 dark:text-gray-300">
                                {customerName}
                            </span>
                            . Your booking status has been updated to{" "}
                            <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                Paid
                            </span>
                            .
                        </p>

                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-6 sm:mt-8 w-full max-w-xs">
                            <Link
                                href="/"
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                            >
                                <RiHome4Line /> Home
                            </Link>
                            <Link
                                href="/dashboard/user/my-bookings"
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition"
                            >
                                My Bookings <RiArrowRightLine />
                            </Link>
                        </div>
                    </div>

                    {/* Right - Transaction Summary */}
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-5 sm:p-8 md:p-10">
                        <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
                            <RiFileListLine className="text-emerald-600 dark:text-emerald-400" />
                            Transaction Summary
                        </h2>

                        <div className="space-y-3 sm:space-y-4">
                            <SummaryRow
                                icon={<RiBankCardLine />}
                                label="Transaction ID"
                                value={transactionId}
                                mono
                            />
                            <SummaryRow
                                icon={<RiTicket2Line />}
                                label="Ticket Title"
                                value={ticketTitle}
                            />
                            <SummaryRow
                                icon={<RiCalendarLine />}
                                label="Payment Date"
                                value={paymentDate}
                            />
                            <SummaryRow
                                icon={<RiBankCardLine />}
                                label="Amount Paid"
                                value={amountPaid}
                                highlight
                            />
                            <SummaryRow
                                icon={<RiTicket2Line />}
                                label="Booking ID"
                                value={bookingId}
                                mono
                            />
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700 my-4 sm:my-6" />

                        <h3 className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 sm:mb-4 flex items-center gap-2">
                            <RiUser3Line /> Customer Details
                        </h3>
                        <div className="space-y-2 sm:space-y-3">
                            <SummaryRow
                                icon={<RiUser3Line />}
                                label="Name"
                                value={customerName}
                            />
                            <SummaryRow
                                icon={<RiMailLine />}
                                label="Email"
                                value={customerEmail}
                            />
                        </div>

                        <div className="mt-4 sm:mt-6 flex items-center gap-2 bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-xl px-3 py-2.5 sm:px-4 sm:py-3">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                            <span className="text-xs sm:text-sm font-medium text-emerald-700 dark:text-emerald-400">
                                Booking Status:{" "}
                                <span className="font-bold">PAID</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
