import { z } from "zod";
const newTransactionSchema = z.object({
    reciever_email: z.string().email(),
    amount: z.number().nonnegative(),
})

export { newTransactionSchema };