
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


/* What the payload should look like? ummm.... */
interface payloadInterface {
    name: string,
    email: string,
    password: string,
}
const findAndUpdateUserById = async (userId: Number, payload: payloadInterface) => {
    const { name, email } = payload;

    const result = await pool.query(
        `UPDATE users
        SET name = $1 , email = $2 
        WHERE user_id = $3 
        RETURNING *`,
        [name, email, userId]
    );

    const updatedUser = result.rows[0];
    delete updatedUser.password;
    return updatedUser;

}



const transferMoney = async (senderId: Number, recieverId: Number, amount: Number) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Begin the transaction.

        // 1. Deduct sender's balance (but check bhi karle )
        const deductResult = await client.query(
            `UPDATE users SET balance = balance - $1
            WHERE user_id = $2 AND balance >=$1
            RETURNING balance`,
            [amount, senderId]
        )

        if (deductResult.rowCount === 0) {
            throw new Error("Insufficient funds or invalid sender");
        }

        // 2. Add money to reciver.
        const addResult = await client.query(
            `UPDATE users SET balance = balance + $1
            WHERE user_id = $2
            RETURNING balance`,
            [amount, recieverId]
        );

        // 3. Create transaction record
        await client.query(
            `INSERT INTO transactions (amount , sender_id ,  receiver_id)
            VALUES($1 , $2 , $3 )`,
            [amount, senderId, recieverId]
        );


        await client.query('COMMIT');
        return true;
    } catch (error) {
        await client.query('ROLLBACK');
        return false;
    } finally {
        client.release();
    }
}

export { createUser, findUserById, findUserByEmail, findAndUpdateUserById, transferMoney };