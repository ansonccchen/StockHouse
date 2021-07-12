# StockHouse

![Home Page](/readmeimages/home.png)

StockHouse allows users to track their financial commodities trades (stocks, cryptocurrencies, and forex). People often have a variety of different platforms that they buy/sell securities on, so this application allows users to have a single platform to log, organize, and view their assets and cumulative net worth throughout all their platforms. Everytime a user makes a trade on a platform such as through their bank, they will also record their transaction through our app.

Users will be able to create a portfolio in which they can track their trades. Each portfolio can have several collections, or “baskets” of commodities to organize their trades. For example, Aauser can open a TFSA account and have a basket for tech stocks and another for energy stocks. Each basket will have a ledger of transactions that the user will record every time they make a trade. Each trade will include info about the commodity that was bought/sold, the price, the volume, and the date.

Our app also contains other features that improve the quality of life for traders. You can watch/unwatch commodities, and perform various filters and view a wide variety of statistics for your portfolio. It is vital to use a database management system for this application, since we need to store a lot of data, share it concurrently with the users of this application, and provide safety incase of database crashes.

Finally, as a bonus, we’ve connected our database with live stock, cryptocurrency, and forex prices, enabling users to view how much money they have in their portfolio and their gain/losses.

## Demo

please log in with

email: markzuckerberg@facebook.com

password: password

https://portfolio-tracker-nu.vercel.app/

## Running this app

First, clone this app.

Then, install dependencies

```bash
yarn install
```

Run the dev server

```bash
yarn dev
```

Please fill out `./env.local.copy` with your database information and rename to `./env.local`

navigate to http://localhost:3000 and enjoy!

## Screenshots

![Dashboard](/readmeimages/dashboard.png)
![Transactions](/readmeimages/transactions.png)
![Commodities](/readmeimages/commodities.png)
