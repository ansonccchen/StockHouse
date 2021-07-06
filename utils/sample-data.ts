import { Address, Basket, Portfolio, User, Commodity, Stock } from "interfaces"
import { Cryptocurrency, Forex } from "interfaces"

/** Dummy user data. */
export const sampleUserData: User[] = [{ email: "stuffbyliang@gmail.com" }]

export const samplePortfolios: Portfolio[] = [
  {
    pid: 1,
    title: "RRSP",
    description: "yeet stonks go up only",
    datecreated: "2021-06-11T05:48:23.720Z",
  },
  {
    pid: 2,
    title: "TFSA",
    description: "yeet tech stonks go up only",
    datecreated: "2021-05-11T05:48:23.720Z",
  },
]

export const sampleBaskets: Basket[] = [
  {
    portfolioid: 1,
    name: "Tech stocks",
    description: "yeet tech stonks go up only",
    datecreated: "2021-06-11T05:48:23.720Z",
  },
  {
    portfolioid: 1,
    name: "Oil and Gas",
    description: "yee haw cowboy",
    datecreated: "2021-05-11T05:48:23.720Z",
  },
]

export const sampleAddress: Address = {
  unitnumber: 2,
  housenumber: 6969,
  streetname: "Marine Drive Rd.",
  province: "BC",
  postalcode: "V6Y 1N1",
}

export const sampleUser: User = {
  firstname: "Anson",
  lastname: "Chen",
  email: "stuffbyliang@gmail.com",
  password: "pokemon1",
  phone: "7788148834",
  datecreated: "2021-05-11T05:48:23.720Z",
  address: sampleAddress,
}

export const sampleCommodities: Commodity[] = [
  {
    cid: 1,
    description: "Gamestop",
    price: 222.0,
  },
  {
    cid: 2,
    description: "Apple",
    price: 124.61,
  },
  {
    cid: 3,
    description: "Bitcoin",
    price: 36696.81,
  },
  {
    cid: 4,
    description: "Dogecoin",
    price: 0.3149,
  },
  {
    cid: 5,
    description: "EUR/USD",
    price: 1.22,
  },
]

export const sampleStocks: { [key: string]: Stock } = {
  1: {
    cid: 1,
    ticker: "GME",
    exchange: "NYSE",
  },
  2: {
    cid: 2,
    ticker: "AAPL",
    exchange: "NASDAQ",
  },
}

export const sampleCryptos: { [key: string]: Cryptocurrency } = {
  3: {
    cid: 3,
    symbol: "BTC",
  },
  4: {
    cid: 4,
    symbol: "DOGE",
  },
}

export const sampleForex: { [key: string]: Forex } = {
  5: {
    cid: 5,
    symbol: "EUR/USD",
  },
}
