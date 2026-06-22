
import { getMyBookedTickets } from "@/lib/api/booking";
import { getUser } from "@/lib/core/session";
import { redirect } from "next/navigation";
import MyBookedTicketsClient from "./MyBookedTicketsClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "My Bookings | TicketBari" };

export default async function MyBookedTicketsPage() {
    const user = await getUser();

    if (!user) redirect("/auth/login");
    if (user.role !== "user") redirect("/");

    let bookings = [];
    try {
        const response = await getMyBookedTickets(user.id);
        bookings = response?.data || [];
    } catch (err) {
        console.error("Failed to fetch bookings:", err);
    }

    return <MyBookedTicketsClient user={user} initialBookings={bookings} />;
}