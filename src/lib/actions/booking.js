import { serverMutation } from "../core/server";

export const createBooking = async (data) => {
    return serverMutation("/api/bookings", data, "POST");
};
