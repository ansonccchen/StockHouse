import { NextApiRequest, NextApiResponse } from 'next';
import { verifyUser } from '../../../utils/auth';
import { pool } from '../../../db';

const deleteAccountQuery = 'DELETE FROM Account WHERE id = $1';

const accountDeleteHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        if (req.method === 'DELETE') {
            const email = await verifyUser(req.cookies.user);

            if (email.length === 0) {
                res.status(401).redirect('/login');
            } else {
                await pool.query(deleteAccountQuery, [Number(req.query.id)])

                res.status(200).send('Account successfully deleted');
            }
        } else {
            res.status(400).json({ status: 400, message: `Cannot resolve a ${req.method} request` });
        }
    } catch (e) {
        res.status(500).json({ status: 500, message: e.message });
    }
}

export default accountDeleteHandler;