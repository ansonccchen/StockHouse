import { NextApiRequest, NextApiResponse } from "next"
import { verifyUser } from "utils/auth"
import { pool } from "db"
import { Basket } from "interfaces"
import { getAllTransactions, getCurrentBalance, getInitialBalance } from "../../transaction/all/[pid]/[basketname]"
import { checkOwnsPortfolio } from "../../portfolio/[pid]"

const basketQuery = "SELECT * FROM Basket WHERE portfolioid = $1 AND name = $2"
const deleteBasketQuery =
  "DELETE FROM Basket WHERE portfolioid = $1 AND name = $2"
const updateBasketQuery =
  "UPDATE Basket SET description = $3 WHERE name = $1 AND portfolioid = $2"

const basketHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const email = await verifyUser(req.cookies.user)

    if (email.length === 0) {
      res.status(401).json({})
    } else if (req.method === "GET") {
      const basket: Basket = await getBasket(
        Number(req.query.pid),
        String(req.query.name)
      )
      basket.transactions = await getAllTransactions(
        Number(req.query.pid),
        String(req.query.name)
      )
      basket.currentbalance = await getCurrentBalance(
        Number(req.query.pid),
        String(req.query.name)
      )
      basket.initialbalance = await getInitialBalance(
        Number(req.query.pid),
        String(req.query.name)
      )

      res.status(200).json(basket)
    } else if (req.method === "DELETE") {
      await pool.query(deleteBasketQuery, [
        Number(req.query.pid),
        String(req.query.name),
      ])

      res.status(200).send("Basket successfully deleted")
    } else if (req.method === "PATCH") {
      if (!(await checkOwnsPortfolio(Number(req.query.pid), email))) {
        return res.status(403).json({
          message: "Unauthorized to update a basket you do not own",
        })
      }

      await pool.query(updateBasketQuery, [
        req.query.name,
        Number(req.query.pid),
        req.body.description,
      ])

      res.status(200).send("Basket successfully updated")
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

export const getBasketWithTransactions = async (
  pid: number,
  name: string
): Promise<Basket> => {
  const basket: Basket = await getBasket(pid, name)
  basket.transactions = await getAllTransactions(pid, name)
  basket.currentbalance = await getCurrentBalance(
    Number(pid),
    String(name)
  )
  basket.initialbalance = await getInitialBalance(
    Number(pid),
    String(name)
  )
  return basket
}

export const getBasket = async (pid: number, name: string): Promise<Basket> => {
  const { rows } = await pool.query(basketQuery, [pid, name])
  return rows[0]
}

export default basketHandler
