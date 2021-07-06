import { NextApiRequest, NextApiResponse } from "next"
import { verifyUser } from "utils/auth"
import { Transaction } from "interfaces"
import { pool } from "db"

const projectedTransactionHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const email = await verifyUser(req.cookies.user)

    if (email.length === 0) {
      res.status(401).redirect("/login")
    } else {
      const transactions: [Transaction?] = await getProjectedTransactions(
        String(req.query.column).toLowerCase(),
        Number(req.query.pid),
        String(req.query.basketname)
      )

      res.status(200).json(transactions)
    }
  } catch (e) {
    res.status(500).json({ status: 500, message: e.message })
  }
}

export const getProjectedTransactions = async (
  column: string,
  pid: number,
  basketname: string
): Promise<[Transaction?]> => {
  const transactionQuery = `
  SELECT ${column}, description FROM commodity_transaction t, commodity c, account a
  WHERE c.cID = t.commodityID AND t.accountID = a.id AND portfolioid = $1 AND basketname = $2
  UNION ALL
  SELECT ${column === 'accounttype' ? 'null as accounttype' : column}, description FROM commodity_transaction t, commodity c
  WHERE c.cID = t.commodityID AND portfolioid = $1 AND basketname = $2 AND t.accountid IS NULL
  `
  const { rows } = await pool.query(transactionQuery, [pid, basketname])
  const transactions: [Transaction?] = []
  rows.forEach(row => transactions.push(row))
  return transactions
}

export default projectedTransactionHandler
