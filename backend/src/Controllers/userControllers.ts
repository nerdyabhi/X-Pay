
import { Request, Response } from 'express';
import { changeUserDetailsSchema, getUserProfileSchema, userLoginSchema, userRegistrationSchema } from '../validation/user.validation';
import { checkPassword, hashPassword } from '../utils/hashPassword';
import { createUser, findAndUpdateUserById, findUserByEmail } from '../db/rawQueries';
import { generateAuthToken } from '../utils/jwt';

/* Post /user/signup */
const userSignup = async (req: Request, res: Response) => {
    const result = userRegistrationSchema.safeParse(req.body);
    if (!result.success) {
        const errorMessages = result.error.issues.map(issue => issue.message);
        res.status(400).json({ message: "Please send all the valid credentials", errors: errorMessages });
        return;
    }

    const { name, email, password } = req.body;
    const hashedPassword = await hashPassword(password);

    try {
        const user = await createUser(name, email, hashedPassword, 1000);
        const token = await generateAuthToken({ user_id: user.user_id, name: user.name, email: user.email });
        res.json({ message: "User registred successfully", user, token })

    } catch (error: any) {
        res.status(400).json({ message: error?.message })
    }

}

/* Post /user/Login */
const userLogin = async (req: Request, res: Response) => {
    const result = userLoginSchema.safeParse(req.body);
    if (!result.success) {
        res.json(400).json({ message: "Please send valid email and password" });
        return;
    }

    const { email, password } = req.body;
    try {
        const user = await findUserByEmail(email);
        if (!user) {
            res.status(400).json({ message: "User Doesn't exist Please login" });
            return;
        }
        console.log(password, user.password);

        const isPasswordSame = await checkPassword(password, user.password);
        if (isPasswordSame === false) {
            res.status(400).json({ message: "Wrong Password Please try again" });
            return;
        }

        const token = await generateAuthToken({ user_id: user.user_id, name: user.name, email: user.email });
        delete user.password;
        res.json({ message: "User Logined Successfully", user, token })

    } catch (error: any) {
        res.status(500).json({ message: "Some Error Occurred", error: error.message })
    }
}

/*@ GET /user/profile */
const userProfile = async (req: Request, res: Response) => {
    const result = getUserProfileSchema.safeParse(req.body);
    if (!result.success) {

        res.status(400).json({ message: "Please send valid data", error: result.error.message });
        return;
    }

    const { email } = req.body;
    const user = await findUserByEmail(email);

    if (!user) {
        res.status(401).json({ message: "User Not found for that email" });
        return;
    }

    delete user.password;
    res.status(200).json({ message: "Succesfully found the user : ", user: user })
    return;

}

// @ POST /user/editProfile
const editUserProfile = async (req: Request, res: Response) => {
    const result = changeUserDetailsSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ message: "Send valid data " });
        return;
    }

    const { name, email } = req.body;
    if (name === req.body.user.name && email == req.body.user.email) {
        res.status(400).json({ message: "Updated User Details can't be same as of current user. " })
        return;
    }

    if (req.body.user.email !== email) {
        const userExists = await findUserByEmail(email);
        if (userExists) {
            res.status(400).json({ message: "Email Already exists for different user , Please provide new email.", userExists });
            return;
        }
    }

    req.body.user.name = name;
    req.body.user.email = email;
    try {
        const result = await findAndUpdateUserById(req.body.user.user_id, req.body.user);
        res.status(200).json({ message: "Successfully changed the user details", user: result })
        return;
    } catch (error: any) {
        res.status(500).json({ message: "Failed to update user details", error: error.message });
        return;
    }

}

export { userSignup, userLogin, userProfile, editUserProfile }

