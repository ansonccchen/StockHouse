import { NextApiRequest, NextApiResponse } from "next"
import { verifyUser } from "utils/auth"
import { pool } from "db"
import { Account, Trading_Platform } from "interfaces"

const accountQuery =
  "SELECT a.* FROM Account a, Opens o WHERE a.id = o.accountid AND o.email = $1"
const tradingPlatformQuery =
  "SELECT t.* FROM Trading_Platform t, Manages WHERE t.name = platformname AND accountid = $1"
const postAccountQuery =
  "INSERT INTO Account(accounttype) VALUES ($1) RETURNING id"
const postManagesQuery = "INSERT INTO Manages VALUES ($1, $2)"
const postOpensQuery = "INSERT INTO Opens VALUES ($1, $2)"

const accountHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const email = await verifyUser(req.cookies.user)

    if (email.length === 0) {
      res.status(401).redirect("/login")
    } else if (req.method === "GET") {
      const accounts: [Account?] = await getAccounts(email)
      for (const account of accounts) {
        account.tradingplatforms = await getTradingPlatforms(account.id)
      }

      res.status(200).json(accounts)
    } else if (req.method === "POST") {
      const account: Account = {
        id: 0,
        accounttype: req.body.accounttype,
      }

      const { rows } = await pool.query(postAccountQuery, [account.accounttype])

      for (const trading_platform of req.body.tradingplatforms) {
        await pool.query(postManagesQuery, [
          rows[0].id,
          String(trading_platform),
        ])
      }

      await pool.query(postOpensQuery, [email, rows[0].id])

      res
        .status(200)
        .json({ id: rows[0].id, message: "Account successfully added" })
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

export const getAccounts = async (email: string): Promise<[Account?]> => {
  const { rows } = await pool.query(accountQuery, [email])
  const accounts: [Account?] = []
  rows.forEach(row => accounts.push(row))
  return accounts
}

export const getTradingPlatforms = async (
  id: number
): Promise<[Trading_Platform?]> => {
  const { rows } = await pool.query(tradingPlatformQuery, [id])
  const tradingPlatforms: [Trading_Platform?] = []
  rows.forEach(row => tradingPlatforms.push(row))
  return tradingPlatforms
}

export default accountHandler
