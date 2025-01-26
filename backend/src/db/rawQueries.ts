
import { pool } from "./dbConnect";

const createUser = async (name: string, email: string, hashedPassword: string, balance: number) => {

    try {
        const result = await pool.query(
            'INSERT INTO users (username, email, password, balance) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, hashedPassword, balance]
        );

        return result.rows[0];
    } catch (err: any) {
        if (err?.code === '23505') {
            throw new Error('email Already exists');
        }
        throw err;
    }
}

export { createUser };