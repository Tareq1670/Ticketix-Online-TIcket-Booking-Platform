
import { publicServerDataFetch, serverDataFetch } from "../core/server";

export const getMyAddedTickets = async(vendorId)=> {
    return serverDataFetch(`/api/vendor/my-tickets?vendorId=${vendorId}`)
}


export const getSingleTickets = async(ticketId) =>{
    return serverDataFetch(`/api/vendor/my-tickets/${ticketId}`)
}


export const approvedTickets = async(queryParams) => {
    return publicServerDataFetch(`/api/users/all-tickets?${queryParams}`)
}


export const getTicketById = async(id) => {
    return serverDataFetch(`/api/tickets/${id}`)
}


export const getLatestTickets = async() => {
    return publicServerDataFetch("/api/latest-tickets")
}