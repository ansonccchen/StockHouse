DROP TABLE IF EXISTS Province_PostalCodes CASCADE;
DROP TABLE IF EXISTS Address CASCADE;
DROP TABLE IF EXISTS App_User CASCADE;
DROP TABLE IF EXISTS Account CASCADE;
DROP TABLE IF EXISTS Trading_Platform CASCADE;
DROP TABLE IF EXISTS Portfolio CASCADE;
DROP TABLE IF EXISTS Basket CASCADE;
DROP TABLE IF EXISTS Commodity CASCADE;
DROP TABLE IF EXISTS StockNames CASCADE;
DROP TABLE IF EXISTS Stock CASCADE;
DROP TABLE IF EXISTS CryptoNames CASCADE;
DROP TABLE IF EXISTS Cryptocurrency CASCADE;
DROP TABLE IF EXISTS Forex CASCADE;
DROP TABLE IF EXISTS Currency CASCADE;
DROP TABLE IF EXISTS Commodity_Transaction CASCADE;
DROP TABLE IF EXISTS Owns CASCADE;
DROP TABLE IF EXISTS Opens CASCADE;
DROP TABLE IF EXISTS Watches CASCADE;
DROP TABLE IF EXISTS Manages CASCADE;
DROP TABLE IF EXISTS Uses CASCADE;

CREATE TABLE Province_PostalCodes
(
    postalCode VARCHAR(6) PRIMARY KEY,
    province   VARCHAR(20)
);

CREATE TABLE Address
(
    streetName  VARCHAR(20),
    houseNumber INTEGER,
    unitNumber  INTEGER,
    postalCode  VARCHAR(6),
    PRIMARY KEY (houseNumber, postalCode),
    FOREIGN KEY (postalCode) REFERENCES Province_PostalCodes
);

CREATE TABLE App_User
(
    firstName   VARCHAR(20),
    lastName    VARCHAR(20),
    email       VARCHAR(30) PRIMARY KEY,
    password    VARCHAR(255) NOT NULL,
    phone       VARCHAR(15),
    dateCreated DATE,
    houseNumber INTEGER,
    postalCode  VARCHAR(6),
    FOREIGN KEY (houseNumber, postalCode) REFERENCES Address (houseNumber, postalCode)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE TABLE Account
(
    id          SERIAL PRIMARY KEY,
    accountType VARCHAR(10)
);

CREATE TABLE Trading_Platform
(
    name           VARCHAR(30) PRIMARY KEY,
    link           VARCHAR(30) UNIQUE,
    buildingNumber INTEGER,
    postalCode     VARCHAR(6),
    FOREIGN KEY (buildingNumber, postalCode) REFERENCES
        Address (houseNumber, postalCode)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE TABLE Portfolio
(
    pID         SERIAL PRIMARY KEY,
    title       VARCHAR(20),
    description VARCHAR(100),
    dateCreated DATE
);

CREATE TABLE Basket
(
    name        VARCHAR(20),
    description VARCHAR(100),
    dateCreated DATE,
    portfolioID INTEGER,
    PRIMARY KEY (name, portfolioID),
    FOREIGN KEY (portfolioID) REFERENCES Portfolio
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


CREATE TABLE Commodity
(
    cID         SERIAL PRIMARY KEY,
    description VARCHAR(100),
    value       NUMERIC
);

CREATE TABLE StockNames
(
    ticker   VARCHAR(6),
    exchange VARCHAR(20),
    name     VARCHAR(50) NOT NULL,
    PRIMARY KEY (ticker, exchange)
);

CREATE TABLE Stock
(
    ticker   VARCHAR(6) NOT NULL,
    exchange VARCHAR(20) NOT NULL,
    cID      INTEGER PRIMARY KEY,
    FOREIGN KEY (cID) REFERENCES Commodity
        ON DELETE CASCADE,
    FOREIGN KEY (ticker, exchange) REFERENCES StockNames
        ON DELETE CASCADE
);

CREATE TABLE CryptoNames
(
    symbol VARCHAR(5) PRIMARY KEY,
    name   VARCHAR(20) NOT NULL
);

CREATE TABLE Cryptocurrency
(
    symbol VARCHAR(5) NOT NULL,
    cID    INTEGER PRIMARY KEY,
    FOREIGN KEY (cID) REFERENCES Commodity
        ON DELETE CASCADE,
    FOREIGN KEY (symbol) REFERENCES CryptoNames
        ON DELETE CASCADE
);

CREATE TABLE Forex
(
    symbol VARCHAR(7) NOT NULL,
    cID    INTEGER PRIMARY KEY,
    FOREIGN KEY (cID) REFERENCES Commodity (cID)
        ON DELETE CASCADE
);

CREATE TABLE Currency
(
    isoCode VARCHAR(3) PRIMARY KEY,
    country VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE Commodity_Transaction
(
    tID             SERIAL PRIMARY KEY,
    price           NUMERIC,
    fees            NUMERIC,
    quantity        NUMERIC,
    transactionType VARCHAR(4),
    transactionDate DATE,
    commodityID     INTEGER     NOT NULL,
    currency        VARCHAR(3)  NOT NULL,
    accountID       INTEGER,
    basketName      VARCHAR(20) NOT NULL,
    portfolioID     INTEGER     NOT NULL,
    FOREIGN KEY (commodityID) REFERENCES Commodity (cID)
        ON UPDATE CASCADE,
    FOREIGN KEY (currency) REFERENCES Currency (isoCode)
        ON UPDATE CASCADE,
    FOREIGN KEY (accountID) REFERENCES Account (id)
        ON DELETE SET NULL,
    FOREIGN KEY (basketName, portfolioID) REFERENCES Basket (name, portfolioID)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (portfolioID) REFERENCES Portfolio (pID)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Owns
(
    email       VARCHAR(30),
    portfolioID INTEGER,
    PRIMARY KEY (email, portfolioID),
    FOREIGN KEY (email) REFERENCES App_User (email)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (portfolioID) REFERENCES Portfolio (pID)
        ON DELETE CASCADE
);

CREATE TABLE Opens
(
    email     VARCHAR(30),
    accountID INTEGER,
    PRIMARY KEY (email, accountID),
    FOREIGN KEY (email) REFERENCES App_User (email)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (accountID) REFERENCES Account (id)
        ON DELETE CASCADE
);

CREATE TABLE Watches
(
    email       VARCHAR(30),
    commodityID INTEGER,
    PRIMARY KEY (email, commodityID),
    FOREIGN KEY (email) REFERENCES App_User (email)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (commodityID) REFERENCES Commodity (cID)
        ON DELETE CASCADE
);

CREATE TABLE Manages
(
    accountID    INTEGER,
    platformName VARCHAR(30),
    PRIMARY KEY (accountID, platformName),
    FOREIGN KEY (accountID) REFERENCES Account (id)
        ON DELETE CASCADE,
    FOREIGN KEY (platformName) REFERENCES Trading_Platform (name)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Uses
(
    forexID INTEGER,
    isoCode VARCHAR(3),
    PRIMARY KEY (forexID, isoCode),
    FOREIGN KEY (forexID) REFERENCES Forex (cID)
        ON DELETE CASCADE,
    FOREIGN KEY (isoCode) REFERENCES Currency (isoCode)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


-- Populating the tables

INSERT INTO Province_PostalCodes
VALUES ('94043', 'California'),
       ('95014', 'California'),
       ('98109', 'Washington'),
       ('98052', 'Washington'),
       ('94025', 'California'),
       ('M5T2E2', 'Ontario'),
       ('M2M4G3', 'Ontario'),
       ('M5H1H1', 'Ontario');

INSERT INTO Address
VALUES ('Amphitheatre Pkwy', 1600, NULL, '94043'),
       ('Infinite Loop', 1, NULL, '95014'),
       ('Terry Ave. North', 410, NULL, '98109'),
       ('Microsoft Way', 1, NULL, '98052'),
       ('Hacker Way', 1, NULL, '94025'),
       ('Spadina Avenue', 241, NULL, 'M5T2E2'),
       ('Yonge Street', 5650, 1700, 'M2M4G3'),
       ('King Street West', 44, NULL, 'M5H1H1');

INSERT INTO App_User
VALUES ('Sundar', 'Pichai', 'sundarpichai@google.com', 'password', '650-253-0000', '1998-09-04', 1600, '94043'),
       ('Tim', 'Cook', 'timcook@apple.com', 'password', '800-692-7753', '1976-04-01', 1, '95014'),
       ('Jeff', 'Bezos', 'jeffbezos@amazon.com', 'password', '877-586-3230', '1994-07-05', 410, '98109'),
       ('Satya', 'Nadella', 'satyanadella@microsoft.com', 'password', '425-882-8080', '1975-04-04', 1, '98052'),
       ('Mark', 'Zuckerberg', 'markzuckerberg@facebook.com', 'password', '650-308-7300', '2004-02-01', 1, '94025');

INSERT INTO Account(accountType)
VALUES ('Savings'),
       ('TFSA'),
       ('RRSP'),
       ('Roth IRA'),
       ('401(k)');

INSERT INTO Trading_Platform
VALUES ('Wealthsimple', 'www.wealthsimple.com', 241, 'M5T2E2'),
       ('Questrade', 'www.questrade.com', 5650, 'M2M4G3'),
       ('Vanguard', 'investor.vanguard.com', NULL, NULL),
       ('QTrade', 'www.qtrade.ca', NULL, NULL),
       ('Scotia iTrade', 'www.scotiaitrade.com', 44, 'M5H1H1');

INSERT INTO Portfolio(title, description, dateCreated)
VALUES ('High Risk', 'A portfolio of high risk commodities', '2004-02-01'),
       ('Innovation', 'A specialty portfolio', '2004-03-01'),
       ('Finance', 'A finance commodities portfolio', '2020-07-05'),
       ('Long term', 'A portfolio of long term steady growth commodities', '2012-01-01'),
       ('FAANG', 'Tech stocks portfolio', '2004-02-01');

INSERT INTO Basket
VALUES ('Crypto', 'Cryptocurrencies', '2021-01-01', 1),
       ('Forex', 'Forex trading', '2000-12-31', 2),
       ('Tech', 'Tech stocks', '2005-02-01', 5),
       ('Fintech', 'Stable fintech stocks', '2004-10-12', 3),
       ('Oil', 'Emerging oil stocks', '2013-01-01', 4);

INSERT INTO Commodity(description, value)
VALUES ('Gamestop', 222.00),
       ('Apple', 124.61),
       ('Berkshire Hathaway Inc. Class B', 289.44),
       ('Google', 2411.56),
       ('Amazon', 3223.07),
       ('Microsoft', 249.68),
       ('Facebook', 328.73),
       ('Bitcoin', 36696.81),
       ('Ethereum', 2596.86),
       ('Tether', 1.00),
       ('Cardano', 1.65),
       ('Dogecoin', 0.3149),
       ('EUR/USD', 1.22),
       ('GBP/USD', 1.42),
       ('USD/JPY', 109.50),
       ('AUD/USD', 0.77),
       ('USD/CAD', 1.21);

INSERT INTO StockNames
VALUES ('GME', 'NYSE', 'GameStop Corp.'),
       ('AAPL', 'NASDAQ', 'Apple Inc'),
       ('BRK.B', 'NYSE', 'Berkshire Hathaway Inc. Class B'),
       ('GOOG', 'NASDAQ', 'Alphabet Inc. Class C'),
       ('AMZN', 'NASDAQ', 'Amazon.com Inc.'),
       ('MSFT', 'NASDAQ', 'Microsoft Corporation'),
       ('FB', 'NASDAQ', 'Facebook Inc. Common Stock');

INSERT INTO Stock
VALUES ('GME', 'NYSE', 1),
       ('AAPL', 'NASDAQ', 2),
       ('BRK.B', 'NYSE', 3),
       ('GOOG', 'NASDAQ', 4),
       ('AMZN', 'NASDAQ', 5),
       ('MSFT', 'NASDAQ', 6),
       ('FB', 'NASDAQ', 7);

INSERT INTO CryptoNames
VALUES ('BTC', 'Bitcoin'),
       ('ETH', 'Ethereum'),
       ('USDT', 'Tether'),
       ('ADA', 'Cardano'),
       ('DOGE', 'Dogecoin');

INSERT INTO Cryptocurrency
VALUES ('BTC', 8),
       ('ETH', 9),
       ('USDT', 10),
       ('ADA', 11),
       ('DOGE', 12);

INSERT INTO Forex
VALUES ('EUR/USD', 13),
       ('GBP/USD', 14),
       ('USD/JPY', 15),
       ('AUD/USD', 16),
       ('USD/CAD', 17);

INSERT INTO Currency
VALUES ('USD', 'United States'),
       ('EUR', 'European Union'),
       ('JPY', 'Japan'),
       ('GBP', 'United Kingdom'),
       ('CHF', 'Switzerland'),
       ('CAD', 'Canada'),
       ('AUD', 'Australia'),
       ('NZD', 'New Zealand'),
       ('ZAR', 'South Africa');

INSERT INTO Owns
VALUES ('jeffbezos@amazon.com', 1),
       ('timcook@apple.com', 2),
       ('sundarpichai@google.com', 3),
       ('satyanadella@microsoft.com', 4),
       ('timcook@apple.com', 5),
       ('markzuckerberg@facebook.com', 5);

INSERT INTO Opens
VALUES ('jeffbezos@amazon.com', 1),
       ('timcook@apple.com', 2),
       ('sundarpichai@google.com', 3),
       ('satyanadella@microsoft.com', 4),
       ('markzuckerberg@facebook.com', 5);

INSERT INTO Watches
VALUES ('timcook@apple.com', 2),
       ('timcook@apple.com', 1),
       ('jeffbezos@amazon.com', 1),
       ('jeffbezos@amazon.com', 2),
       ('jeffbezos@amazon.com', 4),
       ('markzuckerberg@facebook.com', 5),
       ('markzuckerberg@facebook.com', 2),
       ('satyanadella@microsoft.com', 2),
       ('sundarpichai@google.com', 2);

INSERT INTO Manages
VALUES (1, 'Questrade'),
       (1, 'Wealthsimple'),
       (2, 'Questrade'),
       (3, 'Vanguard'),
       (4, 'QTrade'),
       (5, 'Scotia iTrade'),
       (5, 'QTrade');

INSERT INTO Uses
VALUES (13, 'EUR'),
       (13, 'USD'),
       (14, 'GBP'),
       (14, 'USD'),
       (15, 'USD'),
       (15, 'JPY'),
       (16, 'AUD'),
       (16, 'USD'),
       (17, 'USD'),
       (17, 'CAD');

INSERT INTO Commodity_Transaction(price, fees, quantity, transactionType, transactionDate, commodityID, currency, accountID, basketName, portfolioID)
VALUES (124.61, 5.00, 1000, 'BUY', '2021-05-31', 2, 'USD', 5, 'Tech', 5),
       (222.00, 5.00, 300, 'BUY', '2021-03-20', 1, 'USD', 5, 'Tech', 5),
       (222.00, 10.00, 1333, 'BUY', '2021-03-20', 1, 'USD', 1, 'Tech', 5),
       (222.00, 10.00, 1333, 'SELL', '2021-03-21', 1, 'USD', 1, 'Tech', 5),
       (222.00, 10.00, 503, 'SELL', '2021-03-19', 1, 'USD', 1, 'Tech', 5),
       (124.61, 5.00, 500, 'BUY', '2021-05-31', 2, 'USD', 4, 'Oil', 4),
       (222.00, 15.00, 100, 'BUY', '2021-03-20', 1, 'USD', 3, 'Fintech', 3),
       (222.00, 10.00, 150, 'BUY', '2021-03-20', 1, 'USD', 2, 'Forex', 2),
       (222.00, 10.00, 2000, 'SELL', '2021-03-21', 1, 'USD', 1, 'Crypto', 1),
       (222.00, 10.00, 50, 'SELL', '2021-03-19', 1, 'USD', 4, 'Oil', 4);
