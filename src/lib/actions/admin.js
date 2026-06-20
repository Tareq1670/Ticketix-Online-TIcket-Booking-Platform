import { serverMutation } from "../core/server"

export const updateRole = async(userId, role) => {
    return serverMutation(`/api/users/${userId}/role`, {role}, "PATCH")
}


export const updateFraudStatus = async (userId, isFraud) => {
    return serverMutation(`/api/users/${userId}/fraud`, { isFraud }, "PATCH");
};


