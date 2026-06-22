import { redirect } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_URL


export const serverMutation = async(path, data ,method = "POST") => {
    const res = await fetch(`${baseUrl}${path}`,{
        method : method ,
        headers : {
            "Content-Type" : "application/json",
        },
        body : JSON.stringify(data)
    })
    return handleVerifyCode(res);
}

export const serverDataFetch = async(path) => {
    const res = await fetch(`${baseUrl}${path}`)
    return handleVerifyCode(res)
}



const handleVerifyCode = res => {
    if (res.status === 401) {
        redirect('/unauthorized')
    }
    else if (res.status === 403) {
        redirect('/forbidden');
    }

    return res.json()
}