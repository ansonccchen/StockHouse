import { NextApiRequest, NextApiResponse } from "next"
import { verifyUser } from "utils/auth"
import { Transaction } from "interfaces"
import { pool } from "db"

const transactionHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const email = await verifyUser(req.cookies.user)

    if (email.length === 0) {
      res.status(401).redirect("/login")
    } else {
      const transactions: [Transaction?] = await getAggregatedTransactions(
        Number(req.query.pid),
        String(req.query.basketname),
        String(req.query.params[0]),
        String(req.query.params[1])
      )

      res.status(200).json(transactions)
    }
  } catch (e) {
    res.status(500).json({ status: 500, message: e.message })
  }
}

const getAggregatedTransactions = async (
  pid: number,
  basketname: string,
  functionType: string,
  column: string
): Promise<[Transaction?]> => {
  const transactionQuery = `SELECT ${functionType.toUpperCase()}(${column.toLowerCase()}) FROM commodity_transaction t 
        WHERE portfolioid = $1 AND basketname = $2`

  const { rows } = await pool.query(transactionQuery, [pid, basketname])
  return rows[0][functionType.toLowerCase()]
}

export default transactionHandler
