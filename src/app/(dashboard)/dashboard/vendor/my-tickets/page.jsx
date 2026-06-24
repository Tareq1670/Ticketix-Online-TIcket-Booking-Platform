import { redirect } from "next/navigation";
import { getUser } from "@/lib/core/session";
import { getMyAddedTickets } from "@/lib/api/tickets";
import MyTicketsCard from "./MyTicketsCard";

const MyTicketsPage = async () => {
    const user = await getUser();

    if (!user) {
        redirect("/login");
    }

    const vendorId = user?.id;
    const isFraud = user?.isFraud === true || user?.isFraud === "true";

    const result = await getMyAddedTickets(vendorId);

    const tickets = Array.isArray(result?.data)
        ? result.data
        : Array.isArray(result)
          ? result
          : [];

    return (
        <MyTicketsCard
            initialTickets={tickets}
            vendorId={vendorId}
            isFraud={isFraud}
        />
    );
};

export default MyTicketsPage;