import { serverMutation } from "../core/server"

export const updateRole = async(userId, role) => {
    return serverMutation(`/api/users/${userId}/role`, {role}, "PATCH")
}


export const updateFraudStatus = async (userId, isFraud) => {
    return serverMutation(`/api/users/${userId}/fraud`, { isFraud }, "PATCH");
};


export const approveTicket = async (ticketId) => {
    return serverMutation(
        `/api/admin/tickets/${ticketId}/approve`,
        {},
        "PATCH"
    );
};

export const rejectTicket = async (ticketId) => {
    return serverMutation(
        `/api/admin/tickets/${ticketId}/reject`,
        {},
        "PATCH"
    );
};