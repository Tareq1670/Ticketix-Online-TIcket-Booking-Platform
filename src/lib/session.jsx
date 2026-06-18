
import { headers } from "next/headers"
import { auth } from "./auth"

export const getUser = async() => {
    const {user} = await auth.api.getSession({
        headers : await headers()
        
    })
    if(!user){
        return null;
    }
    return user;
}