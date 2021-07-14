import { NextApiRequest, NextApiResponse } from "next"
import { verifyUser } from "utils/auth"
import { Portfolio } from "interfaces"
import { pool } from "db"
import { getAllBaskets } from "../basket/[pid]"

const portfolioQuery = "SELECT * FROM Portfolio WHERE pid = $1"
const deletePortfolioQuery = "DELETE FROM Portfolio WHERE pid = $1"
const updatePortfolioQuery =
  "UPDATE Portfolio SET title = $2, description = $3 WHERE pid = $1"
const allOwnedPortfolioIdsQuery =
  "SELECT portfolioid FROM Owns WHERE portfolioid = $2 AND email = $1"

const portfolioHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const email = await verifyUser(req.cookies.user)

    if (email.length === 0) {
      res.status(401).redirect("/login")
    } else if (!(await checkOwnsPortfolio(Number(req.query.pid), email))) {
      return res.status(403).json({
        message:
          "Unauthorized to perform actions on a portfolio you do not own",
      })
    } else if (req.method === "GET") {
      const portfolio: Portfolio = await getPortfolioWithBaskets(
        Number(req.query.pid)
      )

      res.status(200).json(portfolio)
    } else if (req.method === "DELETE") {
      await pool.query(deletePortfolioQuery, [Number(req.query.pid)])

      res.status(200).send("Portfolio successfully deleted")
    } else if (req.method === "PATCH") {
      await pool.query(updatePortfolioQuery, [
        Number(req.query.pid),
        req.body.title,
        req.body.description,
      ])

      res.status(200).send("Portfolio successfully updated")
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

export const getPortfolioWithBaskets = async (
  pid: number
): Promise<Portfolio> => {
  const portfolio = await getPortfolio(Number(pid))
  portfolio.baskets = await getAllBaskets(portfolio.pid)
  for (const basket of portfolio.baskets) {
    if (portfolio.initialbalance)
      portfolio.initialbalance += basket.initialbalance || 0
    else portfolio.initialbalance = basket.initialbalance || 0

    if (portfolio.currentbalance)
      portfolio.currentbalance += basket.currentbalance || 0
    else portfolio.currentbalance = basket.currentbalance || 0
  }

  return portfolio
}
export const checkOwnsPortfolio = async (pid: number, email: string) => {
  const { rows } = await pool.query(allOwnedPortfolioIdsQuery, [email, pid])
  return rows.length > 0
}

export const getPortfolio = async (pid: number): Promise<Portfolio> => {
  const { rows } = await pool.query(portfolioQuery, [pid])
  return rows[0]
}

export default portfolioHandler
