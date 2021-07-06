import { NextApiRequest, NextApiResponse } from "next"
import { verifyUser } from "utils/auth"
import { Transaction } from "interfaces"
import { pool } from "db"

const transactionQuery = `
SELECT * FROM commodity_transaction t, commodity c, account a
WHERE c.cID = t.commodityID AND t.accountID = a.id AND portfolioid = $1 AND basketname = $2
UNION
SELECT *, null as id, null as accounttype FROM commodity_transaction t, commodity c
WHERE c.cID = t.commodityID AND portfolioid = $1 AND basketname = $2 AND t.accountid IS NULL`

const buyBalanceQuery = `SELECT SUM((price*quantity)-fees) FROM commodity_transaction t 
    WHERE transactiontype = 'BUY' AND t.basketname = $1 AND t.portfolioid = $2`
const sellBalanceQuery = `SELECT SUM((price*quantity)-fees) FROM commodity_transaction t
    WHERE transactiontype = 'SELL' AND t.basketname = $1 AND t.portfolioid = $2`

const buyCurrentQuery = `SELECT SUM((c.value*quantity)-fees) FROM commodity_transaction t, commodity c 
    WHERE transactiontype = 'BUY' AND c.cid = t.commodityid AND t.basketname = $1 AND t.portfolioid = $2`
const sellCurrentQuery = `SELECT SUM((c.value*quantity)-fees) FROM commodity_transaction t, commodity c 
    WHERE transactiontype = 'SELL' AND c.cid = t.commodityid AND t.basketname = $1 AND t.portfolioid = $2`

const transactionHandler = async (
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
        String(req.query.basketname)
      )

      res.status(200).json(transactions)
    }
  } catch (e) {
    res.status(500).json({ status: 500, message: e.message })
  }
}

export const getAllTransactions = async (
  pid: number,
  basketname: string
): Promise<[Transaction?]> => {
  const { rows } = await pool.query(transactionQuery, [pid, basketname])
  const transactions: [Transaction?] = []
  rows.forEach(row => transactions.push(row))
  return transactions
}

export const getInitialBalance = async (
  pid: number,
  basketname: string
): Promise<number> => {
  const { rows } = await pool.query(buyBalanceQuery, [basketname, pid])
  const res = await pool.query(sellBalanceQuery, [basketname, pid])

  return rows[0].sum - res.rows[0].sum
}

export const getCurrentBalance = async (
  pid: number,
  basketname: string
): Promise<number> => {
  const { rows } = await pool.query(buyCurrentQuery, [basketname, pid])
  const res = await pool.query(sellCurrentQuery, [basketname, pid])

  return rows[0].sum - res.rows[0].sum
}

export default transactionHandler
