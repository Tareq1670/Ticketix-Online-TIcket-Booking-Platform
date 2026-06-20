import { getAllTickets } from "@/lib/api/admin";
import ManageTicketsTable from "./ManageTicketsTable";

const ManageTicketsPage = async () => {
    const allTickets = await getAllTickets();

    return <ManageTicketsTable tickets={allTickets} />;
};

export default ManageTicketsPage;