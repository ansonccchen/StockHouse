import { NextApiRequest, NextApiResponse } from "next"
import { verifyUser } from "utils/auth"
import { pool } from "db"
import { Basket } from "interfaces"
import { checkOwnsPortfolio } from "../portfolio/[pid]"
import { getCurrentBalance, getInitialBalance } from "../transaction/all/[pid]/[basketname]";

const basketQuery = "SELECT * FROM Basket WHERE portfolioid = $1"
const addBasketQuery = "INSERT INTO Basket VALUES ($1, $2, $3, $4)"
const basketHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const email = await verifyUser(req.cookies.user)

    if (email.length === 0) {
      res.status(401).redirect("/login")
    } else {
      if (req.method === "POST") {
        const newBasket: Basket = {
          name: req.body.name,
          description: req.body.description || null,
          datecreated: new Date().toDateString() || null,
          portfolioid: Number(req.query.pid),
        }

        if (!(await checkOwnsPortfolio(Number(req.query.pid), email))) {
          return res.status(403).json({
            message:
              "Unauthorized to add a basket to a portfolio you do not own",
          })
        }

        await pool.query(addBasketQuery, [
          newBasket.name,
          newBasket.description,
          newBasket.datecreated,
          newBasket.portfolioid,
        ])

        res.status(200).send("Basket successfully added to the database")
      } else if (req.method === "GET") {
        const baskets: [Basket?] = await getAllBaskets(Number(req.query.pid))
        res.status(200).json(baskets)
      } else {
        res.status(400).json({
          status: 400,
          message: `Cannot resolve a ${req.method} request`,
        })
      }
    }
  } catch (e) {
    res.status(500).json({ status: 500, message: e.message })
  }
}

export const getAllBaskets = async (pid: number): Promise<[Basket?]> => {
  const { rows } = await pool.query(basketQuery, [pid])
  const baskets: [Basket?] = []
  for (const row of rows) {
      row.currentbalance = await getCurrentBalance(
          Number(pid),
          String(row.name)
      )
      row.initialbalance = await getInitialBalance(
          Number(pid),
          String(row.name)
      )
      baskets.push(row)
  }
    return baskets
}

export default basketHandler
