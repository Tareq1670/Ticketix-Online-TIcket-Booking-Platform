import { publicClientDataFetch } from "../core/client";

export const getPopularRoutes = async () => {
    return publicClientDataFetch("/api/users/all-tickets?limit=30&page=1");
};