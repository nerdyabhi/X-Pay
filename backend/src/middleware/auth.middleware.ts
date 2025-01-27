import { NextFunction, Request, Response } from "express";
import { decodeToken } from "../utils/jwt";
import { findUserById } from "../db/rawQueries";


interface userInterface {
    user_id: number,
    name: string,
    email: string
}

const authUser = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json({ message: "Unauthroized user , No token found" });
        return;
    }

    try {
        const decoded = await decodeToken(token) as userInterface | null;
        if (!decoded) {
            res.status(401).json({ message: "Unauthroized user , No token found" });
            return;
        }
        const user = await findUserById(decoded.user_id);

        if (!user) {
            res.status(401).json({ message: "User Not found" });
            return;
        }

        req.body.user = user;
        next();

    } catch (err) {
        res.status(500).json({ msg: "Something went wrong while decoding jwt" });
        return;
    }
}

export {authUser};