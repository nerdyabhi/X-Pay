
import { Request, Response } from 'express';
import { userLoginSchema, userRegistrationSchema } from '../validation/user.validation';
import { checkPassword, hashPassword } from '../utils/hashPassword';
import { createUser } from '../db/rawQueries';
import { z, ZodError } from "zod";
/* Post /user/signup */

type UserRegistrationData = z.infer<typeof userRegistrationSchema>;
type ParseResult = {
    success: boolean;
    data?: UserRegistrationData;
    error?: ZodError<UserRegistrationData>;
};


const userSignup = async (req: Request, res: Response) => {

    const { success, error } = userRegistrationSchema.safeParse(req.body);
    // Check if user send valid data

    if (!success) {
        return res.status(400).json({ success: false, errors: error.errors });
    }
    const { name, email, password }: UserRegistrationData = req.body;
    const hashedPassword = await hashPassword(password);

    const user: any = await createUser(name, email, hashedPassword, 100);

    /***@TODO : JWT  */
    return res.json({
        message: "Succesfully Registered",
        user,
    })
}

/* Post /user/Login */
const userLogin = (req: Request, res: Response) => {
    res.send("Welcome user Login ")
}

/*@ GET /user/profile */
const userProfile = (req: Request, res: Response) => {
    res.send("Welcome user Profile ")
}

// @ POST /user/editProfile
const editUserProfile = (req: Request, res: Response) => {
    res.send("Edit Profile ")
}

export { userSignup, userLogin, userProfile, editUserProfile }

