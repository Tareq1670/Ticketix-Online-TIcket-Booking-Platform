import { serverDataFetch } from "../core/server";

export const getMyBookedTickets = async (userId) => {
    return serverDataFetch(`/api/users/my-bookings?userId=${userId}`, {
        catch: "no-store",
    });
};
