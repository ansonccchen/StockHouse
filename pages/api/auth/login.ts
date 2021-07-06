import { NextApiRequest, NextApiResponse } from "next"
import Cookie from "cookie"
import db from "db"
import { encryptEmail } from "utils/auth"
import {updateAll} from "../commodity/updateAll";

const findUserQuery =
  "SELECT * FROM App_User WHERE email = $1 AND password = $2"

const loginHandler = (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const key = encryptEmail(req.body.email, req.body.password)

    db.query(
      findUserQuery,
      [req.body.email, req.body.password],
      async (err, result) => {
        if (err)
          res.status(500).json({
            statusCode: 500,
            message: "Database could not be reached",
          })
        else if (result.rows.length != 1)
          res.status(400).json({
            statusCode: 400,
            message: "There is no user with this email and password",
          })
        else {
          res.setHeader(
            "Set-Cookie",
            Cookie.serialize("user", key, {
              httpOnly: true,
              path: "/",
              maxAge: 60 * 60 * 24, // 1 day
            })
          )
          updateAll();
          res.status(200).send("User has successfully logged in")
        }
      }
    )
  } catch (e) {
    res.status(500).json({ statusCode: 500, message: e.message })
  }
}

export default loginHandler
