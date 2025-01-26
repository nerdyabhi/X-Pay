import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();
const connectionString = (process.env.DB_CONNECTION_STRING);

const pool = new Pool({
    connectionString:connectionString,
    max:300,
    idleTimeoutMillis:60*1000,
    connectionTimeoutMillis:2*1000,
})



export  { pool };