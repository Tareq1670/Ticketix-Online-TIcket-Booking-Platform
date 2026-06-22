import { serverMutation } from "../core/server";

export const createBooking = async (data) => {
    return serverMutation("/api/bookings", data, "POST");
};


export const cancelBooking = async(cancelBookingId) => {
    return serverMutation(`/api/bookings/${cancelBookingId}/cancel`,{}, "PATCH")
}