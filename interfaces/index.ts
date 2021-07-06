// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import { User } from 'path/to/interfaces';

export type User = {
  firstname?: string
  lastname?: string
  email: string
  password?: string
  phone?: string
  datecreated?: string
  housenumber?: number
  postalcode?: string
  address?: Address
  portfolios?: [Portfolio?]
  accounts?: [Account?]
  watchedcommodities?: CommoditySummary[]
  currentbalance?: number
  initialbalance?: number
}

export type Address = {
  unitnumber?: number
  housenumber: number
  streetname?: string
  province?: string
  postalcode: string
}

export type Account = {
  id: number
  accounttype?: string
  tradingplatforms?: [Trading_Platform?]
}

export type Trading_Platform = {
  name: string
  link: string
  address?: Address
}

export type Portfolio = {
  pid: number
  title?: string
  description?: string
  datecreated?: string
  baskets?: [Basket?]
  initialbalance?: number
  currentbalance?: number
}

export type Basket = {
  name: string
  description?: string
  datecreated?: string
  portfolioid: number | Portfolio
  transactions?: [Transaction?]
  initialbalance?: number
  currentbalance?: number
}

export type CommoditySummary = {
  cid: number
  name: string
  prettyname: string
  value: number
  type: 'stocks' | 'forex' | 'other' | 'crypto'
}

export type Commodity = {
  cid: number
  description?: string
  price?: number
}

export type Stock = Commodity & {
  cid: number
  ticker: string
  exchange: string
  name?: string
}

export type Cryptocurrency = Commodity & {
  cid: number
  symbol: string
  name?: string
}

export type Forex = Commodity & {
  cid: number
  symbol: string
}

export type Transaction = {
  tid: number
  price?: number
  fees?: number
  quantity?: number
  transactiontype?: "BUY" | "SELL"
  transactiondate?: string
  commodityid: number
  currency: string
  accountid?: number
  basketname: string
  portfolioid: number
}

export type Currency = {
  isocode: string
  country: string
}

export type Commodities = {
  stocks?: [Stock?]
  cryptocurrencies?: [Cryptocurrency?]
  forexPairs?: [Forex?]
  otherCommodities?: [Commodity?]
}
