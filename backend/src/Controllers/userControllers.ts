
import { Request, Response } from 'express';
import { getUserProfileSchema, userLoginSchema, userRegistrationSchema } from '../validation/user.validation';
import { checkPassword, hashPassword } from '../utils/hashPassword';
import { createUser, findUserByEmail } from '../db/rawQueries';
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
const userProfile = (req: Request, res: Response) => {
    const result = getUserProfileSchema.safeParse(req.body);
    if(!result.success){
        res.json(400).send("Please send valid data");
    }
}

// @ POST /user/editProfile
const editUserProfile = (req: Request, res: Response) => {
    res.send("Edit Profile ")
}

export { userSignup, userLogin, userProfile, editUserProfile }

