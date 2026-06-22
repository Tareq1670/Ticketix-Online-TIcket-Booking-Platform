import { getTicketById } from "@/lib/api/tickets";
import { getUser } from "@/lib/core/session";
import { redirect } from "next/navigation";
import TicketDetailsClient from "./TicketDetailsClient";

export async function generateMetadata({ params }) {
    const { id } = await params;
    const res = await getTicketById(id);
    const t = res?.data;

    if (!t) {
        return {
            title: "Ticket not found | TicketBari",
        };
    }

    return {
        title: `${t.title} | ${t.from} → ${t.to}`,
        description: `Book ${t.transportType} ticket from ${t.from} to ${t.to}`,
    };
}

const TicketDetailsPage = async ({ params }) => {
    const { id } = await params;
    const user = await getUser();

    if (!user) {
        redirect("/login");
    }

    const res = await getTicketById(id);
    const ticket = res?.data;

    if (!ticket) {
        redirect("/all-tickets");
    }

    return <TicketDetailsClient ticket={ticket} user={user} />;
};

export default TicketDetailsPage;