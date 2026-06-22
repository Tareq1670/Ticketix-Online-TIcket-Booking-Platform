import { FiSearch } from "react-icons/fi";
import TicketsFilter from "./TicketsFilter";
import CardTickets from "@/components/shared/CardTickets";
import { approvedTickets } from "@/lib/api/tickets";
import TicketsPagination from "./TicketPaginaton";

export async function generateMetadata({ searchParams }) {
    const filters = await searchParams;
    const fromLocation = filters?.from ? ` from ${filters.from}` : "";
    const toLocation = filters?.to ? ` to ${filters.to}` : "";
    const route = fromLocation && toLocation ? `${fromLocation}${toLocation}` : "";

    return {
        title: `Book Tickets${route} | Find Your Perfect Journey`,
        description: "Search, compare, and book tickets for Bus, Train, Plane, or Launch at the best rates. Secure your travel instantly.",
    };
}

const AllTicketsPage = async ({ searchParams }) => {
    const filters = await searchParams;

    const query = new URLSearchParams();

    if (filters?.from) query.set("from", filters.from);
    if (filters?.to) query.set("to", filters.to);
    if (filters?.transportType) query.set("transportType", filters.transportType);
    if (filters?.sort) query.set("sort", filters.sort);
    if (filters?.page) query.set("page", filters.page);
    query.set("limit", "6");

    const queryString = query.toString();

    const response = await approvedTickets(queryString);

    const tickets = response?.data || [];
    const pagination = response?.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        perPage: 6,
    };

    return (
        <section className="relative min-h-screen overflow-hidden bg-[#FAFAFA] pt-5 pb-16 dark:bg-[#0A0A0B]">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#FAFAFA] via-[#F4F4F5] to-[#FAFAFA] dark:from-[#0A0A0B] dark:via-[#101013] dark:to-[#0A0A0B]" />
                <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-zinc-300/20 blur-[100px] dark:bg-white/[0.02]" />
                <div className="absolute top-1/4 -left-40 h-[400px] w-[400px] rounded-full bg-zinc-300/20 blur-[120px] dark:bg-zinc-500/[0.03]" />
                <div className="absolute bottom-1/4 -right-40 h-[400px] w-[400px] rounded-full bg-zinc-300/20 blur-[120px] dark:bg-zinc-500/[0.03]" />
                <div
                    className="absolute inset-0 opacity-[0.04] dark:hidden"
                    style={{
                        backgroundImage: `linear-gradient(rgba(0,0,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.5) 1px, transparent 1px)`,
                        backgroundSize: "60px 60px",
                    }}
                />
                <div
                    className="absolute inset-0 hidden opacity-[0.025] dark:block"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                        backgroundSize: "60px 60px",
                    }}
                />
                <div
                    className="absolute inset-0 dark:hidden"
                    style={{
                        background:
                            "radial-gradient(ellipse at center, transparent 0%, #FAFAFA 80%)",
                    }}
                />
                <div
                    className="absolute inset-0 hidden dark:block"
                    style={{
                        background:
                            "radial-gradient(ellipse at center, transparent 0%, #0A0A0B 80%)",
                    }}
                />
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/40 to-transparent dark:from-black/60" />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white/30 to-transparent dark:from-black/40" />
            </div>

            <div className="container relative z-10 mx-auto px-4 md:px-0 mb-5 md:mb-10">
                <TicketsFilter filters={filters} />

                <div className="mb-6 mt-8 flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
                    <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                        Available Listings:{" "}
                        <span className="rounded-md bg-emerald-50 px-2 py-0.5 font-bold text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                            {pagination.totalItems}
                        </span>{" "}
                        {pagination.totalItems === 1 ? "ticket discovered" : "tickets discovered"}
                    </p>
                </div>

                {tickets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-3xl border border-zinc-200 bg-white/60 py-20 text-center backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:border-white/[0.08] dark:bg-white/[0.02] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
                        <div className="mb-4 rounded-full border border-emerald-500/30 bg-emerald-500/10 p-5 shadow-[0_0_40px_rgba(16,185,129,0.2)] dark:border-emerald-500/20 dark:shadow-[0_0_40px_rgba(16,185,129,0.15)]">
                            <FiSearch className="text-3xl text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h3 className="text-2xl font-black text-zinc-900 dark:text-white">
                            No Matching Tickets
                        </h3>
                        <p className="mt-2 max-w-md text-sm text-zinc-600 dark:text-zinc-400">
                            We couldn't find any journeys matching your criteria. Try adjusting your destinations or transport parameters.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {tickets.map((ticket) => (
                            <CardTickets
                                key={ticket._id}
                                ticket={ticket}
                            />
                        ))}
                    </div>
                )}

                <TicketsPagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.totalItems}
                    perPage={pagination.perPage}
                />
            </div>
        </section>
    );
};

export default AllTicketsPage;