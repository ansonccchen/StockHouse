import { NextApiRequest, NextApiResponse } from "next"
import { verifyUser } from "utils/auth"
import { CommoditySummary } from "interfaces"
import { pool } from "db"

const getWatchedCommoditySummariesQuery = `
SELECT 'stock' as type, n.name AS prettyname, CONCAT(s.exchange, ':', s.ticker) AS name, c.value, c.cid FROM Stock s, Commodity c, StockNames n , Watches w 
WHERE s.cid = c.cid AND s.ticker = n.ticker AND s.exchange = n.exchange AND c.cid = w.commodityid AND w.email = $1
UNION
SELECT 'crypto' as type, n.name AS prettyname, t.symbol AS name, c.value, c.cid FROM Cryptocurrency t, CryptoNames n, Commodity c , Watches w 
WHERE t.cid = c.cid AND t.symbol = n.symbol AND c.cid = w.commodityid AND w.email = $1
UNION
SELECT 'forex' as type, c.description AS prettyname, f.symbol AS name, c.value, c.cid FROM Forex f, Commodity c , Watches w
WHERE f.cid = c.cid AND c.cid = w.commodityid AND w.email = $1
UNION
SELECT 'other' as type, c.description AS prettyname, c.description AS name, c.value, c.cid FROM Commodity c, Watches w 
WHERE c.cid NOT IN (
    SELECT cid FROM Stock UNION SELECT cid FROM Cryptocurrency UNION SELECT cid FROM Forex
) AND c.cid = w.commodityid AND w.email = $1
`

const watchedHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const email = await verifyUser(req.cookies.user)

    if (email.length === 0) {
      res.status(401).redirect("/login")
    } else {
      const commodities = await getWatchedCommoditySummaries(email)

      res.status(200).json(commodities)
    }
  } catch (e) {
    res.status(500).json({ status: 500, message: e.message })
  }
}

export const getWatchedCommoditySummaries = async (
  email: string
): Promise<CommoditySummary[]> => {
  const { rows } = await pool.query(getWatchedCommoditySummariesQuery, [email])
  return rows
}

export default watchedHandler
