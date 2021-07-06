import { NextApiRequest, NextApiResponse } from 'next';
import Cookie from 'cookie';
import { verifyUser } from '../../../utils/auth';

const logoutHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const cookie = Cookie.parse(req.headers.cookie || '');
        const email = await verifyUser(cookie.user);

        if (email.length === 0) throw new Error('No user was logged in!');

        res.setHeader('Set-Cookie', Cookie.serialize('user', '', {
            httpOnly: true,
            path: '/',
            maxAge: 1
        }));
        res.status(200).send('User successfully logged out');
    } catch (e) {
        res.status(500).json({ statusCode: 500, message: e.message });
    }
}

export default logoutHandler;