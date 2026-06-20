import { serverDataFetch } from "../core/server"

export const getApprovedTickets = async () => {
    return serverDataFetch(`/api/admin/approved-tickets`);
};