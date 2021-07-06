import { NextApiRequest, NextApiResponse } from 'next';
import { verifyUser } from '../../../utils/auth';
import {Address, Trading_Platform} from '../../../interfaces';
import { pool } from '../../../db';

const tradingPlatformQuery = 'SELECT * FROM Trading_Platform';
const addTradingPlatform = 'INSERT INTO Trading_Platform VALUES ($1, $2, $3, $4)'
const addProvinceQuery =
    "INSERT INTO Province_PostalCodes VALUES ($1, $2) ON CONFLICT DO NOTHING"
const addAddressQuery =
    "INSERT INTO Address VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING"

const tradingPlatformHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const email = await verifyUser(req.cookies.user);

        if (email.length === 0) {
            res.status(401).redirect('/login');
        } else if (req.method === "GET") {
            const tradingPlatforms: [Trading_Platform?] = await getAllTradingPlatforms();

            res.status(200).json(tradingPlatforms);

        } else if (req.method === "POST") {
            const address: Address = {
                streetname: req.body.streetname || null,
                housenumber: Number(req.body.buildingnumber) || null,
                unitnumber: Number(req.body.unitnumber) || null,
                postalcode: req.body.postalcode || null,
                province: req.body.province || null,
            }
            const addressParams = [
                address.streetname,
                address.housenumber,
                address.unitnumber,
                address.postalcode,
            ]

            if (address.postalcode) {
               await pool.query(addProvinceQuery, [address.postalcode, address.province])
               await pool.query(addAddressQuery, addressParams)
            }
            await pool.query(addTradingPlatform, [
                req.body.name,
                req.body.link,
                address.housenumber,
                address.postalcode
            ])

            res.status(200).send("Trading Platform successfully added");
        } else {
            res.status(400).json({ status: 400, message: `Cannot resolve a ${req.method} request` });
        }
    } catch (e) {
        res.status(500).json({ status: 500, message: e.message });
    }
}

export const getAllTradingPlatforms = async (): Promise<[Trading_Platform?]> => {
    const { rows } = await pool.query(tradingPlatformQuery);
    const tradingPlatforms: [Trading_Platform?] = [];
    rows.forEach(row => tradingPlatforms.push(row));
    return tradingPlatforms;
}

export default tradingPlatformHandler;