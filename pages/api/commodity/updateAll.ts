import { NextApiRequest, NextApiResponse } from "next"
import { verifyUser } from "utils/auth"
import { pool } from "db"
import { updatePrice } from "./[cid]"

const allCommoditiesQuery = "SELECT cid FROM commodity"

const updateAllHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const email = await verifyUser(req.cookies.user)

    if (email.length === 0) {
      res.status(401).redirect("/login")
    } else {
      const { rows } = await pool.query(allCommoditiesQuery)
      const promises = [];

      for (let row of rows) {
        promises.push(updatePrice(Number(row.cid)));
      }

      Promise.allSettled(promises)
        .then(() => res.status(200).send("Prices successfully updated"))
        .catch(() => res.status(500).json({ status: 500, message: 'Commodities could not be updated' }))
    }
  } catch (e) {
    res.status(500).json({ status: 500, message: e.message })
  }
}

export const updateAll = async () => {
  const { rows } = await pool.query(allCommoditiesQuery)
  const promises = [];

  for (let row of rows) {
    promises.push(updatePrice(Number(row.cid)));
  }

  await Promise.allSettled(promises);
}

export default updateAllHandler
