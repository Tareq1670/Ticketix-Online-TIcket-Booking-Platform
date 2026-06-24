import { FaWandMagicSparkles } from "react-icons/fa6";
import CardTickets from "./CardTickets";

const getPlainId = (id) => {
    if (!id) return "";
    if (typeof id === "string") return id;
    if (typeof id === "number") return String(id);
    if (typeof id === "object") {
        if (id.$oid) return String(id.$oid);
        if (typeof id.toHexString === "function") return id.toHexString();
    }
    return "";
};

const AdvertisementSection = async () => {
    let tickets = [];

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/advertised-tickets`, {
            cache: "no-store",
        });
        if (res.ok) {
            const data = await res.json();
            tickets = Array.isArray(data) ? data : (data.data || []);
        }
    } catch (e) {
        console.error("Tickets fetch failed:", e);
    }

    if (tickets.length === 0) return null;

    return (
        <section className="relative overflow-hidden bg-white px-4 py-15 dark:bg-zinc-950 md:px-8">
            {/* Background Glows */}
            <div className="absolute inset-0 z-0">
                <div className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-emerald-500/10 blur-[128px]" />
                <div className="absolute -right-20 bottom-20 h-96 w-96 rounded-full bg-green-500/10 blur-[128px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl">
                <div className="mb-16 text-center">
                    
                    
                    <h2 className="mt-6 text-3xl font-black tracking-tight text-zinc-900 dark:text-white md:text-5xl">
                        Featured Tickets
                    </h2>
                    <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                        Discover the freshest travel deals hand-picked by our admins. Book your next journey with confidence.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {tickets.map((ticket, index) => (
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

export default AdvertisementSection;