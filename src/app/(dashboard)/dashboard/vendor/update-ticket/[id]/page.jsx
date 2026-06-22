import { redirect } from "next/navigation";
import { getUser } from "@/lib/core/session";
import UpdateTicketForm from "../UpdateTicketForm";
import { getSingleTickets } from "@/lib/api/tickets";

const UpdateTicketPage = async ({ params }) => {
    const {id} = await params;
    const user = await getUser();

    if (!user) {
        redirect("/login");
    }


    const result = await getSingleTickets(id);
    console.log(result);

    if (!result?.success || !result?.data) {
        redirect("/dashboard/vendor/my-tickets");
    }

    return (
        <UpdateTicketForm
            initialTicket={result.data}
            vendor={user}
        />
    );
};

export default UpdateTicketPage;