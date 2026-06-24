import { IoTicketSharp } from "react-icons/io5";
import { getLatestTickets } from "@/lib/api/tickets";
import CardTickets from "./CardTickets";

const getPlainId = (id) => {
    if (!id) return "";
    if (typeof id === "string") return id;
    if (typeof id === "number") return String(id);

    if (typeof id === "object") {
        if (id.$oid) return String(id.$oid);
        if (typeof id.toHexString === "function") {
            return id.toHexString();
        }
    }

    return "";
};

const LatestSection = async () => {
    const tickets = await getLatestTickets();

    if (!tickets?.data?.length) return null;

    return (
        <section className="relative overflow-hidden bg-zinc-50 px-4 py-16 dark:bg-[#071018] md:px-8">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-emerald-500/10 blur-[130px]" />
                <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-green-500/10 blur-[130px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl">
                {/* Section Header */}
                <div className="mb-16 text-center">
                    

                    <h2 className="mt-6 text-3xl font-black tracking-tight text-zinc-900 dark:text-white md:text-5xl">
                        Latest Tickets
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 md:text-base">
                        Explore the newest travel tickets added to Ticketix.
                        Browse recently published bus, train, flight and launch
                        tickets from verified vendors across Bangladesh.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {tickets.data.map((ticket, index) => (
                        <CardTickets
                            key={getPlainId(ticket._id || ticket.id)}
                            ticket={ticket}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default LatestSection;