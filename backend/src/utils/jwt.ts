import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

interface UserInterface {
    user_id: number;
    name: string;
    email: string;
}

const secret = process.env.JWT_SECRET || "default_Secret";

const generateAuthToken = async (payload: UserInterface) => {

    const token = jwt.sign(payload, secret);
    console.log(payload);
    console.log(token);
    return token;
}

const decodeToken = async(token:string) =>{
    const decoded = jwt.verify(token , secret);
    return decoded;
}

export { generateAuthToken  , decodeToken};