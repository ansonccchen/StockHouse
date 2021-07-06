import { NextApiRequest, NextApiResponse } from "next"
import db, { pool } from "db"
import { Address, User } from "interfaces"

const addProvinceQuery =
  "INSERT INTO Province_PostalCodes VALUES ($1, $2) ON CONFLICT DO NOTHING"
const addAddressQuery =
  "INSERT INTO Address VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING"
const addUserQuery =
  "INSERT INTO App_User VALUES ($1, $2, $3, $4, $5, $6, $7, $8)"

const signupHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const address: Address = {
            streetname: req.body.streetname || null,
            housenumber: Number(req.body.housenumber) || null,
            unitnumber: Number(req.body.unitnumber) || null,
            postalcode: req.body.postalcode || null,
            province: req.body.province || null,
        }

        const user: User = {
            firstname: req.body.firstname || null,
            lastname: req.body.lastname || null,
            email: req.body.email || null,
            password: req.body.password || null,
            phone: req.body.phone || null,
            datecreated: new Date().toDateString() || null,
        }

        const userParams = [
            user.firstname,
            user.lastname,
            user.email,
            user.password,
            user.phone,
            user.datecreated,
            address.housenumber,
            address.postalcode,
        ]
        const addressParams = [
            address.streetname,
            address.housenumber,
            address.unitnumber,
            address.postalcode,
        ]

        if (address.postalcode) {
            await pool.query(addProvinceQuery, [address.postalcode, address.province])
            await pool.query(addAddressQuery, addressParams)
        }
        await pool.query(addUserQuery, [userParams])

        res.status(200).send("App_User successfully added to the database")
    } catch (e) {
        res.status(500).json({statusCode: 500, message: e.message})
    }
}

export default signupHandler
