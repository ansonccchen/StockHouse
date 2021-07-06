import { NextApiRequest, NextApiResponse } from 'next';
import { verifyUser } from '../../../utils/auth'
import { getCryptoPrice, getForexRate, getStockPrice } from "../../../utils/alphaVantageAPI";
import { pool } from "../../../db";


const updatePriceQuery = 'UPDATE Commodity SET value = $1 WHERE cid = $2'

const getDetails =
    `SELECT 'stock' as type, ticker as symbol FROM Stock WHERE cid = $1
    UNION 
    SELECT 'crypto' as type, symbol FROM Cryptocurrency WHERE cid = $1
    UNION 
    SELECT 'forex' as type, symbol FROM Forex WHERE cid = $1`

const addWatchesQuery = `INSERT INTO Watches VALUES ($1, $2)`;
const deleteWatchedQuery = `DELETE FROM Watches WHERE email = $1 AND commodityid = $2`;

const updatePriceHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const email = await verifyUser(req.cookies.user);

        if (email.length === 0) {
            res.status(401).redirect('/login');
        } else if (req.method === "GET") {
            const price = await updatePrice(Number(req.query.cid));

            if (price === -1) res.status(200).send('Price already up to date');
            else res.status(200).send(price);
        } else if (req.method === "POST") {
            await pool.query(addWatchesQuery, [email, Number(req.query.cid)]);
            res.status(200).send('Commodity was successfully added to the favorite list');
        } else if (req.method === "DELETE") {
            await pool.query(deleteWatchedQuery, [email, Number(req.query.cid)]);
            res.status(200).send('Commodity was successfully deleted from the favorite list');
        } else {
            res.status(400).json({
                status: 400,
                message: `Cannot resolve a ${req.method} request`,
            })
        }
    } catch (e) {
        res.status(500).json({ status: 500, message: e.message });
    }
}

export const updatePrice = async (cid: number) => {
    const { rows } = await pool.query(getDetails, [cid]);
    if (rows.length === 0) return -1;

    let price = 0;

    if (rows[0].type === 'stock') {
        price = await getStockPrice(rows[0].symbol)
    } else if (rows[0].type === 'crypto') {
        price = await getCryptoPrice(rows[0].symbol)
    } else if (rows[0].type === 'forex') {
        price = await getForexRate(rows[0].symbol)
    }

    await pool.query(updatePriceQuery, [price, cid])

    return price;
}


export default updatePriceHandler;