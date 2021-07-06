import Cryptr from "cryptr"
import { pool } from "db"

const cryptr = new Cryptr(process.env.DB_NAME)

const findUserQuery =
  "SELECT * FROM App_User WHERE email = $1 AND password = $2"

// TODO: for all authorization checks, use res.redirect(401, '/login')

export const verifyUser = async (encryptedCookie: string): Promise<string> => {
  try {
    const user = cryptr.decrypt(encryptedCookie).split(" ")
    const { rows } = await pool.query(findUserQuery, [user[0], user[1]])
    if (rows.length != 1) return ""
    else return rows[0].email
  } catch (e) {
    return ""
  }
}

export const encryptEmail = (email: string, password: string) => {
  return cryptr.encrypt(email + " " + password)
}
