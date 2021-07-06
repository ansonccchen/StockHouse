import { NextApiRequest, NextApiResponse } from "next"
import { verifyUser } from "utils/auth"
import { Transaction } from "interfaces"
import { pool } from "db"

const groupedTransactions = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const email = await verifyUser(req.cookies.user)
    if (email.length === 0) {
      res.status(401).redirect("/login")
    } else {
      const transactions: [Transaction?] = await getAllTransactions(
        Number(req.query.pid),
        String(req.query.basketname),
        String(req.query.groupBy ?? "").toLowerCase(),
        Number(req.query.minAmount ?? 1)
      )
      res.status(200).json(transactions)
    }
  } catch (e) {
    res.status(500).json({ status: 500, message: e.message })
  }
}

export const getAllTransactions = async (
  pid: number,
  basketname: string,
  groupbycolumn: string,
  minAmount: number
): Promise<[Transaction?]> => {
  // This returns the transactions grouped by commodity and transaction type that are popular (i.e. have been transacted
  // with at least min amount of times in any of the portfolio's baskets)
  const groupedTransactionQuery = `
    SELECT ${
      groupbycolumn && `${groupbycolumn} as groupbycolumn, `
    } c.cid, c.description, COUNT(*), AVG(price) as avgPrice, AVG(quantity) as avgQuantity, AVG(fees) as avgFees
    FROM commodity_transaction t, commodity c
    WHERE c.cID = t.commodityID AND portfolioid = $1 AND basketname = $2
    GROUP BY c.cid ${groupbycolumn && `, ${groupbycolumn}`}
    HAVING ${minAmount} <= (
        SELECT COUNT(*) FROM commodity_transaction ct WHERE ct.portfolioid = $1 AND c.cid = ct.commodityid
    )`

  const { rows } = await pool.query(groupedTransactionQuery, [pid, basketname])
  const transactions: [Transaction?] = []
  rows.forEach(row => transactions.push(row))
  return transactions
}

export default groupedTransactions
