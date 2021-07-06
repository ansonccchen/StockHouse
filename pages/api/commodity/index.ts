import { NextApiRequest, NextApiResponse } from "next"
import { verifyUser } from "utils/auth"
import { CommoditySummary } from "interfaces"
import { pool } from "db"
import {
  getCryptoPrice,
  getForexRate,
  getStockPrice,
} from "utils/alphaVantageAPI"
import axios from "axios"

const getCommoditySummariesQuery = `
SELECT 'stock' as type, n.name AS prettyname, CONCAT(s.exchange, ':', s.ticker) AS name, c.value, c.cid FROM Stock s, Commodity c, StockNames n 
WHERE s.cid = c.cid AND s.ticker = n.ticker AND s.exchange = n.exchange
UNION
SELECT 'crypto' as type, n.name AS prettyname, t.symbol AS name, c.value, c.cid FROM Cryptocurrency t, CryptoNames n, Commodity c 
WHERE t.cid = c.cid AND t.symbol = n.symbol
UNION
SELECT 'forex' as type, c.description AS prettyname, f.symbol AS name, c.value, c.cid FROM Forex f, Commodity c WHERE f.cid = c.cid
UNION
SELECT 'other' as type, c.description AS prettyname, c.description AS name, c.value, c.cid FROM Commodity c
WHERE c.cid NOT IN (
    SELECT cid FROM Stock UNION SELECT cid FROM Cryptocurrency UNION SELECT cid FROM Forex
)
`

const addCommodityQuery = "INSERT INTO Commodity(description, value) VALUES ($1, $2) RETURNING cid"

const addStockQuery = "INSERT INTO Stock VALUES ($1, $2, $3)"
const addStockName = "INSERT INTO StockNames VALUES ($1, $2, $3)"
const findStock = "SELECT * FROM Stock WHERE ticker = $1 AND exchange = $2"

const addCryptoQuery = "INSERT INTO Cryptocurrency VALUES ($1, $2)"
const addCryptoName = "INSERT INTO CryptoNames VALUES ($1, $2)"
const findCrypto = "SELECT * FROM Cryptocurrency WHERE symbol = $1"

const addForexQuery = "INSERT INTO Forex VALUES ($1, $2)"
const addUsesQuery = "INSERT INTO Uses VALUES ($1, $2)"
const findForex = "SELECT * FROM Forex WHERE symbol = $1"
const findCurrency = "SELECT * FROM Currency WHERE isocode = $1"
const addCurrency = "INSERT INTO Currency VALUES ($1, $2)"

const commodityHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const email = await verifyUser(req.cookies.user)

    if (email.length === 0) {
      res.status(401).redirect("/login")
    } else if (req.method === "GET") {
      const commodities = await getCommoditySummaries()

      res.status(200).json(commodities)
    } else if (req.method === "POST") {
      let price: number = req.body.price || null
      let type = "commodity"
      let name: string = req.body.name || null

      if (req.body.type === "stocks") {
        price = await getStockPrice(req.body.ticker)
        type = "stock"
        name = req.body.ticker

        const result = await pool.query(findStock, [
          req.body.ticker,
          req.body.exchange,
        ])
        if (result.rows.length === 0) {
          const { rows } = await pool.query(addCommodityQuery, [
            req.body.description || req.body.ticker,
            price,
          ])
          await pool.query(addStockName, [
            req.body.ticker,
            req.body.exchange,
            req.body.name,
          ])
          await pool.query(addStockQuery, [
            req.body.ticker,
            req.body.exchange,
            rows[0].cid,
          ])
        } else price = null
      } else if (req.body.type === "crypto") {
        price = await getCryptoPrice(req.body.symbol)
        type = "cryptocurrency"
        name = req.body.symbol

        const result = await pool.query(findCrypto, [req.body.symbol])
        if (result.rows.length === 0) {
          const { rows } = await pool.query(addCommodityQuery, [
            req.body.description || req.body.symbol,
            price,
          ])
          await pool.query(addCryptoName, [req.body.symbol, req.body.name])
          await pool.query(addCryptoQuery, [req.body.symbol, rows[0].cid])
        } else price = null
      } else if (req.body.type === "forex") {
        price = await getForexRate(req.body.symbol)
        type = "forex pair"
        name = req.body.symbol

        const result = await pool.query(findForex, [req.body.symbol])
        if (result.rows.length === 0) {
          const { rows } = await pool.query(addCommodityQuery, [
            req.body.description || req.body.symbol,
            price,
          ])
          await pool.query(addForexQuery, [req.body.symbol, rows[0].cid])
          await addCurrencies(
            req.body.symbol.substring(0, 3),
            req.body.symbol.substring(4, 7),
            rows[0].cid
          )
        } else price = null
      } else {
        await pool.query(addCommodityQuery, [req.body.description, price])
      }

      if (price)
        res.status(200).json({
          price: price,
          message: `This ${type} has successfully been added`,
        })
      else
        res.status(400).send(`${name} is not a valid ${type} or already exists`)
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

export const getCommoditySummaries = async (): Promise<CommoditySummary[]> => {
  const { rows } = await pool.query(getCommoditySummariesQuery, [])
  return rows
}

const addCurrencies = async (code1: string, code2: string, cid: number) => {
  let result = await pool.query(findCurrency, [code1])
  if (result.rows.length === 0) {
    const res = await axios.get(
      `https://restcountries.eu/rest/v2/currency/${code1}`
    )
    await pool.query(addCurrency, [code1, res.data[0].name])
  }
  result = await pool.query(findCurrency, [code2])
  if (result.rows.length === 0) {
    const res = await axios.get(
      `https://restcountries.eu/rest/v2/currency/${code2}`
    )
    await pool.query(addCurrency, [code2, res.data[0].name])
  }

  await pool.query(addUsesQuery, [cid, code1])
  await pool.query(addUsesQuery, [cid, code2])
}

export default commodityHandler
