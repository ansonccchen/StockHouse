import { NextApiRequest, NextApiResponse } from "next";
import { verifyUser } from "../../../../utils/auth";
import { pool } from "../../../../db";


const getStocks = `
SELECT 'stock' as type, n.name AS prettyname, CONCAT(s.exchange, ':', s.ticker) AS name, c.value, c.cid FROM Stock s, Commodity c, StockNames n 
WHERE s.cid = c.cid AND s.ticker = n.ticker AND s.exchange = n.exchange`

const getCrypto = `
SELECT 'crypto' as type, n.name AS prettyname, t.symbol AS name, c.value, c.cid FROM Cryptocurrency t, CryptoNames n, Commodity c 
WHERE t.cid = c.cid AND t.symbol = n.symbol`

const getForex = `
SELECT 'forex' as type, c.description AS prettyname, f.symbol AS name, c.value, c.cid FROM Forex f, Commodity c WHERE f.cid = c.cid`

const getOther = `
SELECT 'other' as type, c.description AS prettyname, c.description AS name, c.value, c.cid FROM Commodity c
WHERE c.cid NOT IN (
    SELECT cid FROM Stock UNION SELECT cid FROM Cryptocurrency UNION SELECT cid FROM Forex
)`


const filteredCommodityHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const email = await verifyUser(req.cookies.user)

    if (email.length === 0) {
      res.status(401).redirect("/login")
    } else if (req.method === "GET") {
      const commodities = await getCommoditySummaries(req.query["commodities[]"] as string[] ?? [])
      res.status(200).json(commodities)
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

export const getCommoditySummaries = async (commodities: string[]) => {
  let query = '';

  if (commodities.includes('stocks')) {
    if (query.length != 0) query += ' UNION '
    query += getStocks
  }
  if (commodities.includes('crypto')) {
    if (query.length != 0) query += ' UNION '
    query += getCrypto
  }
  if (commodities.includes('forex')) {
    if (query.length != 0) query += ' UNION '
    query += getForex
  }
  if (commodities.includes('other')) {
    if (query.length != 0) query += ' UNION '
    query += getOther
  }

  const { rows } = await pool.query(query);
  return rows
}

export default filteredCommodityHandler;