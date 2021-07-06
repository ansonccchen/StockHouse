import { NextApiRequest, NextApiResponse } from 'next';
import { verifyUser } from '../../../../utils/auth'
import { pool } from "../../../../db";

const findWatched = `SELECT * FROM Watches WHERE email = $1 AND commodityid = $2`;

const updatePriceHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const email = await verifyUser(req.cookies.user);

    if (email.length === 0) {
      res.status(401).redirect('/login');
    } else {
      const { rows } = await pool.query(findWatched, [email, req.query.cid]);
      res.status(200).send(rows.length !== 0);
    }
  } catch (e) {
    res.status(500).json({ status: 500, message: e.message });
  }
}

export default updatePriceHandler;