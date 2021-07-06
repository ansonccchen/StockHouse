import axios from 'axios';

const URL = `https://www.alphavantage.co/query?apikey=${process.env.AV_API_KEY}&`;

export const getStockPrice = async (ticker: string): Promise<number> => {
    const url = URL + `function=GLOBAL_QUOTE&symbol=${ticker}`
    const res = await axios.get(url)
    return res.data['Global Quote']['05. price'] || null;
}

export const getCryptoPrice = async (symbol: string): Promise<number> => {
    const url = URL + `function=CURRENCY_EXCHANGE_RATE&from_currency=${symbol}&to_currency=USD`
    const res = await axios.get(url)
    return res.data['Realtime Currency Exchange Rate']['5. Exchange Rate'] || null;
}

export const getForexRate = async (symbol: string): Promise<number> => {
    const url = URL + `function=CURRENCY_EXCHANGE_RATE&from_currency=${symbol.substring(0,3)}&to_currency=${symbol.substring(4,7)}`
    const res = await axios.get(url)
    return res.data['Realtime Currency Exchange Rate']['5. Exchange Rate'] || null;
}