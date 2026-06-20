import { getApprovedTickets } from "@/lib/api/admin";
import AdvertiseTicketsTable from "./AdvertiseTicketsTable";


const AdvertiseTicketsPage = async () => {
    const allTickets = await getApprovedTickets();

    return <AdvertiseTicketsTable tickets={allTickets} />;
};

export default AdvertiseTicketsPage;