import { NextApiRequest, NextApiResponse } from "next"
import { verifyUser } from "utils/auth"
import { Portfolio } from "interfaces"
import { pool } from "db"
import { getPortfolioWithBaskets } from "./[pid]";

const allPortfoliosQuery =
  "SELECT p.* FROM Portfolio p, Owns o WHERE p.pid = o.portfolioid AND o.email = $1"
const addNewPortfolioQuery = "INSERT INTO Portfolio(title, description, datecreated) VALUES ($1, $2, $3) RETURNING pid"
const addOwnsPortfolio = "INSERT INTO Owns VALUES ($1, $2)"

const portfolioHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const email = await verifyUser(req.cookies.user)

    if (email.length === 0) {
      res.status(401).redirect("/login")
    } else {
      if (req.method === "POST") {
        const newPortfolio: Portfolio = {
          pid: 0,
          title: req.body.title || null,
          description: req.body.description || null,
          datecreated: new Date().toDateString() || null,
        }

        const { rows } = await pool.query(addNewPortfolioQuery, [
          newPortfolio.title,
          newPortfolio.description,
          newPortfolio.datecreated,
        ])

        await pool.query(addOwnsPortfolio, [email, rows[0].pid])

        res.status(200).json({ pid: rows[0].pid })

      } else if (req.method === "GET") {
        const portfolios: [Portfolio?] = await getAllPortfolios(email)

        res.status(200).json(portfolios)

      } else {
         res.status(400).json({ status: 400, message: `Cannot resolve a ${req.method} request` });
      }
    }
  } catch (e) {
    res.status(500).json({ status: 500, message: e.message })
  }
}

export const getAllPortfolios = async (
  email: string
): Promise<[Portfolio?]> => {
  const { rows } = await pool.query(allPortfoliosQuery, [email])
  const portfolios: [Portfolio?] = []
  for (const row of rows) {
      const portfolio = await getPortfolioWithBaskets(row.pid)
      row.initialbalance = portfolio.initialbalance
      row.currentbalance = portfolio.currentbalance
      portfolios.push(row)
  }
    return portfolios
}

export default portfolioHandler
