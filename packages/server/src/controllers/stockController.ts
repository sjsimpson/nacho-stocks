import _ from 'lodash';

const finnhubToken = process.env.FINNHUB_TOKEN;
const baseUrl = 'https://finnhub.io/api/v1';

export const getFinancials = async (symbol: string) => {
  if (!finnhubToken) {
    throw Error('Finnhub Token is undefined. Unable to interact with API.');
  }

  const endpoint = `${baseUrl}/stock/metric`;
  const params: URLSearchParams = new URLSearchParams({
    symbol,
    metric: 'all',
  });
  const requestUrl: URL = new URL(`${endpoint}?` + params);
  const config: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Finnhub-Token': finnhubToken,
    },
  };

  try {
    const response = await fetch(requestUrl, config);
    return response.json();
  } catch (e) {
    throw Error('Error getting financials from Finnhub.');
  }
};

export const getStock = async (symbol: string) => {
  if (!finnhubToken) {
    throw Error('Finnhub Token is undefined. Unable to interact with API.');
  }

  const endpoint = `${baseUrl}/stock/profile2`;
  const params: URLSearchParams = new URLSearchParams({
    symbol,
  });

  const requestUrl: URL = new URL(`${endpoint}?` + params);
  const config: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Finnhub-Token': finnhubToken,
    },
  };

  try {
    const response = await fetch(requestUrl, config);
    const rawStock = await response.json();
    const stock = {
      name: rawStock.name,
      symbol: rawStock.ticker,
    };
    return stock;
  } catch (e) {
    throw Error('Error getting stock from Finnhub.');
  }
};

export const getPrice = async (symbol: string) => {
  if (!finnhubToken) {
    throw Error('Finnhub Token is undefined. Unable to interact with API.');
  }

  const endpoint = `${baseUrl}/quote`;
  const params: URLSearchParams = new URLSearchParams({ symbol });
  const requestUrl: URL = new URL(`${endpoint}?` + params);
  const config: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Finnhub-Token': finnhubToken,
    },
  };

  try {
    const response = await fetch(requestUrl, config);
    const price = await response.json();
    return price.c;
  } catch (e) {
    throw Error('Error getting price from Finnhub.');
  }
};

export const getPriceHistory = async (symbol: string) => {
  if (!finnhubToken) {
    throw Error('Finnhub Token is undefined. Unable to interact with API.');
  }

  const now = Date.now();
  const lastWeek = now - 2592000000;

  const nowString = now.toString();
  const nowFiltered = nowString.substring(0, nowString.length - 3);
  const lastWeekString = lastWeek.toString();
  const lastWeekFiltered = lastWeekString.substring(
    0,
    lastWeekString.length - 3
  );

  const endpoint = `${baseUrl}/stock/candle`;
  const params: URLSearchParams = new URLSearchParams({
    symbol: symbol,
    resolution: 'D',
    from: lastWeekFiltered,
    to: nowFiltered,
  });

  const requestUrl: URL = new URL(`${endpoint}?` + params);
  const config: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Finnhub-Token': finnhubToken,
    },
  };

  try {
    const response = await fetch(requestUrl, config);
    const rawPriceHistory = await response.json();
    const priceHistory = rawPriceHistory.c.map(
      (price: number, index: number) => ({ x: index, y: price })
    );
    return priceHistory;
  } catch (e) {
    throw Error('Error getting price history from Finnhub.');
  }
};

export const searchStocks = async (query: string) => {
  if (!finnhubToken) {
    throw Error('Finnhub Token is undefined. Unable to interact with API.');
  }

  try {
    const lookupResponse = await _symbolLookup(query);
    const stocks = lookupResponse.result
      .filter((stock: any) => !stock.symbol.includes('.'))
      .map((stock: any) => ({
        name: _.startCase(_.toLower(stock.description)),
        symbol: stock.displaySymbol,
      }));

    return stocks;
  } catch (e) {
    throw Error('Error searching stocks in Finnhub.');
  }
};

const _symbolLookup = async (query: string) => {
  if (!finnhubToken) {
    throw Error('Finnhub Token is undefined. Unable to interact with API.');
  }

  const endpoint = `${baseUrl}/search`;
  const params: URLSearchParams = new URLSearchParams({
    q: query,
  });
  const requestUrl: URL = new URL(`${endpoint}?` + params);
  const config: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Finnhub-Token': finnhubToken,
    },
  };

  try {
    const response = await fetch(requestUrl, config);
    return response.json();
  } catch (e) {
    console.log('Error:', e);
  }
};
