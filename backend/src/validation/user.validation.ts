import { z } from "zod";
const userRegistrationSchema = z.object({
    name: z.string().min(3, "Name Should Be Atleast 3 characters"),
    email: z.string().email(),
    password: z.string().min(6, "Password Should be atleast 6 characters"),
})

const userLoginSchema = z.object({
    email: z.string().email("Enter a valid Email"),
    password: z.string().min(6, "Password Should be atleast 6 characters"),
})

export { userRegistrationSchema, userLoginSchema };