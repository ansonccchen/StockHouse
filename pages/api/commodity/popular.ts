import { NextApiRequest, NextApiResponse } from "next"
import { verifyUser } from "utils/auth"
import { pool } from "db"

const popularCommoditiesHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const email = await verifyUser(req.cookies.user)

    if (email.length === 0) {
      res.status(401).redirect("/login")
    } else {
      // This division query finds the (cid, description) of all commodities that have either been watched by all users
      // or transacted with (at least once) by all users
      const transacted = `SELECT u.email, p.pid FROM  app_user u, portfolio p, owns o, commodity_transaction t
         WHERE u.email = o.email AND p.pid = o.portfolioid AND p.pid = t.portfolioid AND t.commodityid = c.cid`
      const watched = `SELECT u.email, p.pid FROM  app_user u, portfolio p, owns o, watches w
        WHERE u.email = o.email AND p.pid = o.portfolioid AND w.email = u.email AND w.commodityid = c.cid`

      const exceptQueries = []

      if (req.query.queries.includes('transacted')) exceptQueries.push(transacted)
      if (req.query.queries.includes('watched')) exceptQueries.push(watched)

      const popularCommoditiesDivisionQuery = `
        SELECT DISTINCT c.cid, c.description, c.value as price FROM commodity c
        WHERE c.value >= ${req.query.price} AND NOT EXISTS(
          (
              SELECT u.email, p.pid FROM  app_user u, portfolio p, owns o
              WHERE u.email = o.email AND p.pid = o.portfolioid
          )
          EXCEPT
          (
            ${exceptQueries.join(" UNION ")}
          )
        )`

      const { rows } = await pool.query(popularCommoditiesDivisionQuery)

      res.status(200).send(rows)
    }
  } catch (e) {
    res.status(500).json({ status: 500, message: e.message })
  }
}

export default popularCommoditiesHandler
