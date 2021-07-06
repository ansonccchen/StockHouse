import dayjs from "dayjs"
import { Address } from "interfaces"

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

export const formatCurrency = (money: number) => formatter.format(money)

export const formatAddress = ({
  unitnumber,
  housenumber,
  streetname,
  province,
  postalcode,
}: Address) => {
  return `${unitnumber ? `${unitnumber}-` : ""}${housenumber ?? ""} ${
    streetname ?? ""
  } ${province ?? ""}, ${postalcode}`
}

export const formatDate = (date: string) => {
  return dayjs(date).format("MM/DD/YYYY")
}

export const formatPhone = (phone: string) => {
    if (phone.length < 10) return phone;
    if (phone.length === 10) return `(${phone.substring(0,3)}) ${phone.substring(3,6)}-${phone.substring(6)}`;
    if (phone.length === 11) `+${phone.substr(0, phone.length-10)} (${phone.substr(-10,3)}) 
    ${phone.substr(-7,3)}-${phone.substr(-4)}`;
    return phone;
}
