import { NextApiRequest, NextApiResponse } from "next"
import { Address, User } from "interfaces"
import { pool } from "db"
import { verifyUser } from "utils/auth"
import { getAllPortfolios } from "../portfolio"
import { getAccounts, getTradingPlatforms } from "../account"
import { getWatchedCommoditySummaries } from "../commodity/watched"

const findUserQuery = "SELECT * FROM App_User WHERE email = $1"
const findProvinceQuery =
  "SELECT * FROM Province_Postalcodes WHERE postalcode = $1"
const findAddressQuery =
  "SELECT * FROM Address WHERE housenumber = $1 AND postalcode = $2"

const userHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const email = await verifyUser(req.cookies.user)
    if (email.length === 0) {
      res.status(401).json({})
    } else {
      const user: User = await getUser(email)
      user.address = await getAddress(user.housenumber, user.postalcode)
      user.portfolios = await getAllPortfolios(email)
      user.accounts = await getAccounts(email)
      for (const account of user.accounts) {
        account.tradingplatforms = await getTradingPlatforms(account.id)
      }
      user.watchedcommodities = await getWatchedCommoditySummaries(email)

      let initial = 0
      let current = 0
      for (const portfolio of user.portfolios) {
        initial += portfolio.initialbalance || 0
        current += portfolio.currentbalance || 0
      }
      user.initialbalance = initial
      user.currentbalance = current

      res.status(200).json(user)
    }
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

export const getUser = async (email: string): Promise<User> => {
  const { rows } = await pool.query(findUserQuery, [email])
  return rows[0]
}

export const getAddress = async (
  housenumber: number,
  postalCode
): Promise<Address> => {
  const res = await pool.query(findProvinceQuery, [postalCode])
  const { rows } = await pool.query(findAddressQuery, [housenumber, postalCode])

  const address: Address = rows[0] ?? {}
  address.province = res?.rows[0]?.province
  return address
}

export default userHandler
