/*
 * List of all the SQL we have used in the project
 * Note: the $1, $2 represent params that require the users' input
 * Also, the files with names in [brackets] are dynamic routes and use the user's input for the SQL queries
 */


/* account/[id] */
// To delete an account based on the given id by the user
`DELETE FROM Account WHERE id = $1`;



/* account/index */
// To select all the accounts of the user based on their given email
`SELECT a.* FROM Account a, Opens o WHERE a.id = o.accountid AND o.email = $1`;
// To select all trading platforms which manage the account with the given id
`SELECT t.* FROM Trading_Platform t, Manages WHERE t.name = platformname AND accountid = $1`;
// To insert a new account with the given type
`INSERT INTO Account(accounttype) VALUES ($1) RETURNING id`;
// To add the trading platforms the user selected to manage the new account
`INSERT INTO Manages VALUES ($1, $2)`;
// To link the new account to the user that adds it
`INSERT INTO Opens VALUES ($1, $2)`;



/* auth/login */
// To find the user with the given email and password (when logging in)
`SELECT * FROM App_User WHERE email = $1 AND password = $2`;



/* auth/signup */
// To add a new user with all the user's inputted info
`INSERT INTO App_User VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
// To add the address of the new user
`INSERT INTO Address VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`;
// To add the postal code / province pair of the new address
`INSERT INTO Province_PostalCodes VALUES ($1, $2) ON CONFLICT DO NOTHING`;



/* basket/[pid]/[name] */
// Finds the basket with the user's given pid and name
`SELECT * FROM Basket WHERE portfolioid = $1 AND name = $2`;
// To delete the basket with the given pid and name
`DELETE FROM Basket WHERE portfolioid = $1 AND name = $2`;
// To update the description of the basket with the given name and pid
`UPDATE Basket SET description = $3 WHERE name = $1 AND portfolioid = $2`;



/* basket/[pid] */
// Finds all the baskets of the portfolio with the given pid
`SELECT * FROM Basket WHERE portfolioid = $1`;
// Adds a new basket in the portfolio specified by the user
`INSERT INTO Basket VALUES ($1, $2, $3, $4)`;



/* commodity/filter/[...params] */
// To select all stocks, their cid, and their name using a JOIN
`SELECT 'stock' as type, n.name AS prettyname, CONCAT(s.exchange, ':', s.ticker) AS name, c.value, c.cid 
    FROM Stock s, Commodity c, StockNames n 
    WHERE s.cid = c.cid AND s.ticker = n.ticker AND s.exchange = n.exchange`;
// To select all cryptocurrencies, their cid, and their name using a JOIN
`SELECT 'crypto' as type, n.name AS prettyname, t.symbol AS name, c.value, c.cid 
    FROM Cryptocurrency t, CryptoNames n, Commodity c 
    WHERE t.cid = c.cid AND t.symbol = n.symbol`;
// To select all forex pairs and their cid using a JOIN
`SELECT 'forex' as type, c.description AS prettyname, f.symbol AS name, c.value, c.cid 
    FROM Forex f, Commodity c 
    WHERE f.cid = c.cid`;
// To select all other commodities using a NESTED QUERY
`SELECT 'other' as type, c.description AS prettyname, c.description AS name, c.value, c.cid 
    FROM Commodity c
    WHERE c.cid NOT IN (
        SELECT cid FROM Stock 
        UNION 
        SELECT cid FROM Cryptocurrency 
        UNION 
        SELECT cid FROM Forex
    )`;
/*
 * NOTE: the filtering option on the commodities page will allow the user to select which combination
 * of these JOIN queries to run
 */



/* commodity/[cid] */
// To update a commodity's price based on the user's request
`UPDATE Commodity SET value = $1 WHERE cid = $2`;
// To get ticker/symbol of the commodity based on the given cid from the user
`SELECT 'stock' as type, ticker as symbol FROM Stock WHERE cid = $1
    UNION 
    SELECT 'crypto' as type, symbol FROM Cryptocurrency WHERE cid = $1
    UNION 
    SELECT 'forex' as type, symbol FROM Forex WHERE cid = $1`;
// To watch a new commodity
`INSERT INTO Watches VALUES ($1, $2)`;
// To delete a commodities from the watched list
`DELETE FROM Watches WHERE email = $1 AND commodityid = $2`;



/* commodity/index */
// To get detailed information about the commodity based on the given cid from the user
`SELECT 'stock' as type, n.name AS prettyname, CONCAT(s.exchange, ':', s.ticker) AS name, c.value, c.cid 
    FROM Stock s, Commodity c, StockNames n
    WHERE s.cid = c.cid AND s.ticker = n.ticker AND s.exchange = n.exchange
    UNION
    SELECT 'crypto' as type, n.name AS prettyname, t.symbol AS name, c.value, c.cid 
    FROM Cryptocurrency t, CryptoNames n, Commodity c
    WHERE t.cid = c.cid AND t.symbol = n.symbol
    UNION
    SELECT 'forex' as type, c.description AS prettyname, f.symbol AS name, c.value, c.cid 
    FROM Forex f, Commodity c WHERE f.cid = c.cid
    UNION
    SELECT 'other' as type, c.description AS prettyname, c.description AS name, c.value, c.cid 
    FROM Commodity c
    WHERE c.cid NOT IN (
       SELECT cid FROM Stock UNION SELECT cid FROM Cryptocurrency UNION SELECT cid FROM Forex
    )`;
// Insert a new commodity given by the user
`INSERT INTO Commodity(description, value) VALUES ($1, $2) RETURNING cid`;
// Insert a new stock
`INSERT INTO Stock VALUES ($1, $2, $3)`;
// Insert the name of the new stock
`INSERT INTO StockNames VALUES ($1, $2, $3)`;
// Find the stock with the given ticker and exchange
`SELECT * FROM Stock WHERE ticker = $1 AND exchange = $2`;
// Insert a new stock
`INSERT INTO Cryptocurrency VALUES ($1, $2)`;
// Insert the name of the new cryptocurrency
`INSERT INTO CryptoNames VALUES ($1, $2)`;
// Find the cryptocurrency with the given symbol
`SELECT * FROM Cryptocurrency WHERE symbol = $1`;
// Insert a new forex pair
`INSERT INTO Forex VALUES ($1, $2)`;
// Insert a currency, forex pair relation
`INSERT INTO Uses VALUES ($1, $2)`;
// Find a forex pair with the given symbol
`SELECT * FROM Forex WHERE symbol = $1`;
// Find a currency with the given ISO Code
`SELECT * FROM Currency WHERE isocode = $1`;
// Insert a new currency
`INSERT INTO Currency VALUES ($1, $2)`;



/* commodity/popular */
// A division query which finds the descriptions of all commodities that have been watched or transacted (can be selected by user) with
// (at least once) by all users
let price = 'someprice'; // picked by the user
const transacted =
    `SELECT u.email, p.pid FROM  app_user u, portfolio p, owns o, commodity_transaction t
WHERE u.email = o.email AND p.pid = o.portfolioid AND p.pid = t.portfolioid AND t.commodityid = c.cid`;
const watched =
    `SELECT u.email, p.pid FROM  app_user u, portfolio p, owns o, watches w
WHERE u.email = o.email AND p.pid = o.portfolioid AND w.email = u.email AND w.commodityid = c.cid`;

const exceptQueries = [];

if (/* User selects transacted */) exceptQueries.push(transacted);
if (/* User selects watched */) exceptQueries.push(watched);

const popularCommoditiesDivisionQuery = `
SELECT DISTINCT c.cid, c.description, c.value as price FROM commodity c
WHERE c.value >= ${price} AND NOT EXISTS(
    (
        SELECT u.email, p.pid FROM  app_user u, portfolio p, owns o
        WHERE u.email = o.email AND p.pid = o.portfolioid
    )
    EXCEPT
    (
    ${exceptQueries.join(' UNION ')}
    )
)`;



/* commodity/updateAll */
// Select all the commodities
`SELECT cid FROM commodity`;



/* commodity/watched/index */
// Fetches all commodities (and their type specific information using JOINs) that a user has watched
// using the user's email -- Also a nested query
`SELECT 'stock' as type, n.name AS prettyname, CONCAT(s.exchange, ':', s.ticker) AS name, c.value, c.cid 
    FROM Stock s, Commodity c, StockNames n , Watches w 
    WHERE s.cid = c.cid AND s.ticker = n.ticker AND s.exchange = n.exchange AND c.cid = w.commodityid AND w.email = $1
    UNION
    SELECT 'crypto' as type, n.name AS prettyname, t.symbol AS name, c.value, c.cid 
    FROM Cryptocurrency t, CryptoNames n, Commodity c , Watches w 
    WHERE t.cid = c.cid AND t.symbol = n.symbol AND c.cid = w.commodityid AND w.email = $1
    UNION
    SELECT 'forex' as type, c.description AS prettyname, f.symbol AS name, c.value, c.cid 
    FROM Forex f, Commodity c , Watches w
    WHERE f.cid = c.cid AND c.cid = w.commodityid AND w.email = $1
    UNION
    SELECT 'other' as type, c.description AS prettyname, c.description AS name, c.value, c.cid 
    FROM Commodity c, Watches w 
    WHERE c.cid NOT IN (
        SELECT cid FROM Stock UNION SELECT cid FROM Cryptocurrency UNION SELECT cid FROM Forex
    ) AND c.cid = w.commodityid AND w.email = $1`;



/* commodity/watched/[cid] */
// Check if a certain commodity is watched by the user
`SELECT * FROM Watches WHERE email = $1 AND commodityid = $2`;



/* currency/index */
// Selects all currencies
`SELECT * FROM Currency`;



/* portfolio/[pid] */
// Selects the portfolio with the pid given by the user
`SELECT * FROM Portfolio WHERE pid = $1`;
// Deletes the portfolio with the pid given by the user
`DELETE FROM Portfolio WHERE pid = $1`;
// Updates the title and description of the portfolio with the pid given by the user
`UPDATE Portfolio SET title = $2, description = $3 WHERE pid = $1`;
// Selects the portfolio ids of all the portfolios the current user owns
`SELECT portfolioid FROM Owns WHERE portfolioid = $2 AND email = $1`;



/* portfolio/index */
// JOINS the portfolio and owns relations to get the info of the portfolios the user owns
`SELECT p.* FROM Portfolio p, Owns o WHERE p.pid = o.portfolioid AND o.email = $1`;
// Inserts a new portfolio based on the information given by the user
`INSERT INTO Portfolio(title, description, datecreated) VALUES ($1, $2, $3) RETURNING pid`;
// Adds the new portfolio into the Owns relation for the current user
`INSERT INTO Owns VALUES ($1, $2)`;



/* tradingplatform/index */
// Selects all trading platforms
`SELECT * FROM Trading_Platform`;
// Inserts a new trading platform with the given info
`INSERT INTO Trading_Platform VALUES ($1, $2, $3, $4)`;



/* transaction/all/[pid]/[basketname]/projection/[column] */
// Does a PROJECTION query to select only the columns specified by the user
let column = ''; // this would be a given by the user
`SELECT ${column}, description FROM commodity_transaction t, commodity c, account a
  WHERE c.cID = t.commodityID AND t.accountID = a.id AND portfolioid = $1 AND basketname = $2
  UNION ALL
  SELECT ${column === 'accounttype' ? 'null as accounttype' : column}, description FROM commodity_transaction t, commodity c
  WHERE c.cID = t.commodityID AND portfolioid = $1 AND basketname = $2 AND t.accountid IS NULL`;



/* transaction/all/[pid]/[basketname]/[...params] */
// Performs the AGGREGATION query that is given by the user
let functionType = ''; // this would be a given by the user
`SELECT ${functionType.toUpperCase()}(${column.toLowerCase()}) FROM commodity_transaction t 
  WHERE portfolioid = $1 AND basketname = $2`;



/* transaction/all/[pid]/[basketname]/grouped */
// Does a NESTED AGGREGATION WITH GROUP BY to get the commodiites that have been transacted with at least twice
// in the portfolio given by the user
let groupbycolumn = ''; // this would be a given by the user
let minAmount = ''; // given by user
`SELECT ${groupbycolumn && `${groupbycolumn} as groupbycolumn, `} c.cid, c.description, COUNT(*), transactiontype, AVG(price) as avgPrice, AVG(quantity) as avgQuantity, AVG(fees) as avgFees
    FROM commodity_transaction t, commodity c
    WHERE c.cID = t.commodityID AND portfolioid = $1 AND basketname = $2
    GROUP BY c.cid ${groupbycolumn && `, ${groupbycolumn}`}
    HAVING ${minAmount} <= (
        SELECT COUNT(*) FROM commodity_transaction ct WHERE ct.portfolioid = $1 AND c.cid = ct.commodityid
    )`;



/* transaction/all/[pid]/[basketname]/index */
// JOINS transactions with commodity and account depending on whether the transaction is linked to an account
`SELECT * FROM commodity_transaction t, commodity c, account a
  WHERE c.cID = t.commodityID AND t.accountID = a.id AND portfolioid = $1 AND basketname = $2
  UNION
  SELECT *, null as id, null as accounttype FROM commodity_transaction t, commodity c
  WHERE c.cID = t.commodityID AND portfolioid = $1 AND basketname = $2 AND t.accountid IS NULL`;
// Calculates the BUY sum of transactions
`SELECT SUM((price*quantity)-fees) FROM commodity_transaction t 
    WHERE transactiontype = 'BUY' AND t.basketname = $1 AND t.portfolioid = $2`;
// Calculates the SELL sum of transactions
`SELECT SUM((price*quantity)-fees) FROM commodity_transaction t
    WHERE transactiontype = 'SELL' AND t.basketname = $1 AND t.portfolioid = $2`;
// Calculates the sum of BUY transactions using the latest price
`SELECT SUM((c.value*quantity)-fees) FROM commodity_transaction t, commodity c 
    WHERE transactiontype = 'BUY' AND c.cid = t.commodityid AND t.basketname = $1 AND t.portfolioid = $2`;
// Calculates the sum of SELL transactions using the latest price
`SELECT SUM((c.value*quantity)-fees) FROM commodity_transaction t, commodity c 
    WHERE transactiontype = 'SELL' AND c.cid = t.commodityid AND t.basketname = $1 AND t.portfolioid = $2`;



/* transaction/index */
// Inserts a new transaction based on the information given by the user
`INSERT INTO Commodity_Transaction(price, fees, quantity, transactiontype, transactiondate, 
                                  commodityid, currency, accountid, basketname, portfolioid) 
                                  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING tid`;



/* user/index */
// Finds the user with the given email address
`SELECT * FROM App_User WHERE email = $1`;
// Finds the province with the given postal code
`SELECT * FROM Province_Postalcodes WHERE postalcode = $1`;
// Finds the address with the given postal code and house number
`SELECT * FROM Address WHERE housenumber = $1 AND postalcode = $2`;

export { }