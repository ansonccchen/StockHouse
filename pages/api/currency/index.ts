import { NextApiRequest, NextApiResponse } from "next";
import { Currency } from "interfaces";
import { pool } from "db";

const findAllCurrencyQuery = "SELECT * FROM Currency";

const currencyHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const currencies = await getCurrencies();
        res.status(200).json(currencies);
    } catch (err) {
        res.status(500).json({ statusCode: 500, message: err.message });
    }
};

export const getCurrencies = async (): Promise<Currency[]> => {
    const { rows } = await pool.query(findAllCurrencyQuery, []);
    return rows;
};

export default currencyHandler;
