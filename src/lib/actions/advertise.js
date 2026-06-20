"use server";

import { serverMutation } from "../core/server";


export const toggleAdvertise = async (ticketId, isAdvertised) => {
    return serverMutation(
        `/api/admin/tickets/${ticketId}/advertise`,
        { isAdvertised },
        "PATCH"
    );
};