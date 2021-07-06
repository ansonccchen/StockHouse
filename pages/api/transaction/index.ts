import { NextApiRequest, NextApiResponse } from "next"
import { verifyUser } from "utils/auth"
import { pool } from "db"
import { Transaction } from "interfaces"

const postTransactionQuery = `INSERT INTO Commodity_Transaction(price, fees, quantity, transactiontype, transactiondate, 
                                  commodityid, currency, accountid, basketname, portfolioid) 
                                  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING tid`

const newTransactionHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const email = await verifyUser(req.cookies.user)

    if (email.length === 0) {
      res.status(401).redirect("/login")
    } else if (req.method === "POST") {
      const transaction: Transaction = {
        tid: 0,
        price: Number(req.body.price) || null,
        fees: Number(req.body.fees) || null,
        quantity: Number(req.body.quantity) || null,
        transactiontype: req.body.transactionType || null,
        transactiondate: new Date().toDateString() || null,
        commodityid: Number(req.body.commodityId) || null,
        currency: req.body.currency || null,
        accountid: Number(req.body.accountId) || null,
        basketname: req.body.basketName || null,
        portfolioid: Number(req.body.portfolioId) || null,
      }

      const { rows } = await pool.query(postTransactionQuery, [
        transaction.price,
        transaction.fees,
        transaction.quantity,
        transaction.transactiontype,
        transaction.transactiondate,
        transaction.commodityid,
        transaction.currency,
        transaction.accountid,
        transaction.basketname,
        transaction.portfolioid,
      ])

      res.status(200).json({
        tid: rows[0].tid,
        message: "Transaction has successfully been added",
      })
    } else {
      res.status(400).json({
        status: 400,
        message: `Cannot resolve a ${req.method} request`,
      })
    }
  } catch (e) {
    res.status(500).json({ status: 500, message: e.message })
  }
}

export default newTransactionHandler
