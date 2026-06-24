import { serverDataFetch } from "../core/server";

export const getMyAddedTickets = async(vendorId)=> {
    return serverDataFetch(`/api/vendor/my-tickets?vendorId=${vendorId}`,{
        cache : "no-store"
    })
}


export const getSingleTickets = async(ticketId) =>{
    return serverDataFetch(`/api/vendor/my-tickets/${ticketId}`)
}


export const approvedTickets = async(queryParams) => {
    return serverDataFetch(`/api/users/all-tickets?${queryParams}`);
}


export const getTicketById = async(id) => {
    return serverDataFetch(`/api/tickets/${id}`, {
        cache: "no-store",
    })
}


export const getLatestTickets = async() => {
    return serverDataFetch("/api/latest-tickets",{
        cache : "no-store"
    })
}