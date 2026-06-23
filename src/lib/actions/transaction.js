import { serverMutation } from "../core/server"

export const paymentAdd = async(paymentData) => {
   return serverMutation("/api/payment/confirm",paymentData,)
}