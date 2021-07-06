import { NextApiRequest, NextApiResponse } from "next"
import { verifyUser } from "utils/auth"
import { pool } from "db"

const deleteTransactionQuery =
  "DELETE FROM Commodity_Transaction WHERE tid = $1"

const deleteTransaction = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const email = await verifyUser(req.cookies.user)

    if (email.length === 0) {
      res.status(401).redirect("/login")
    } else if (req.method === "DELETE") {
      await pool.query(deleteTransactionQuery, [Number(req.query.tid)])

      res.status(200).send("Transaction has successfully been deleted")
    } else {
      res
        .status(400)
        .json({
          status: 400,
          message: `Cannot resolve a ${req.method} request`,
        })
    }
  } catch (e) {
    res.status(500).json({ status: 500, message: e.message })
  }
}

export default deleteTransaction
