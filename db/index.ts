import { Pool } from 'pg';

export const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
});

export default {
    query: (text, params, callback) => {
        return pool.query(text, params, callback);
    },
}
