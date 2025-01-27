
import { pool } from "./dbConnect";

const createUser = async (name: string, email: string, hashedPassword: string, balance: number) => {

    try {
        const result = await pool.query(
            'INSERT INTO users (name, email, password, balance) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, hashedPassword, balance]
        );

        const user = result.rows[0];
        delete user.password;
        return user;
    } catch (err: any) {
        if (err?.code === '23505') {
            throw new Error('email Already exists');
        }
        throw err;
    }
}

const findUserById = async (userId: number) => {
    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE user_id = $1', [userId]
        );

        const user = result.rows[0];
        delete user.password;
        return user;

    } catch (err: any) {
        throw err;
    }
}

const findUserByEmail = async (email: String) => {
    try {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1', [email]
        );

        return result.rows[0];


    } catch (err: any) {
        throw err;
    }
}

export { createUser, findUserById, findUserByEmail };