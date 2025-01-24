const axios = require("axios");
const { COINGECKO_API_URL } = require("../config/constant");
const Token = require("../models/Token");
const SupportedCurrency = require("../models/SupportedCurrency");

exports.fetchAndSaveCoins = async () => {
  try {
    // Fetch coins list from CoinGecko
    const response = await axios.get(`${COINGECKO_API_URL}/coins/list`);
    const coins = response.data;

    if (!coins || coins.length === 0) {
      throw new Error("No coins data found from CoinGecko");
    }

    // Filter out invalid entries (e.g., missing `symbol`)
    const validTokens = coins.filter(
      (coin) => coin.symbol && coin.name && coin.id
    );

    if (validTokens.length === 0) {
      throw new Error("No valid coins with required fields (id, name, symbol)");
    }

    // Prepare the data for bulk insertion
    const tokens = validTokens.map((coin) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
    }));

    // Perform bulk insert into the 'tokens' table
    await Token.deleteMany({}); // Clear the existing table before inserting new data
    await Token.insertMany(tokens); // Insert all valid tokens at once

    return { message: "Coins list saved successfully to the tokens table" };
  } catch (error) {
    throw new Error("Error fetching and saving coins list: " + error.message);
  }
};

exports.fetchAndSaveSupportedCurrencies = async () => {
  try {
    // Fetch the list of supported currencies from CoinGecko
    const response = await axios.get(
      `${COINGECKO_API_URL}/simple/supported_vs_currencies`
    );
    const currencies = response.data;

    if (!currencies || currencies.length === 0) {
      throw new Error("No supported currencies data found from CoinGecko");
    }

    // Prepare the data for bulk insertion
    const currencyDocuments = currencies.map((symbol) => ({ symbol }));

    // Perform bulk insert into the 'supported_currencies' table
    await SupportedCurrency.deleteMany({}); // Clear the existing table before inserting new data
    await SupportedCurrency.insertMany(currencyDocuments); // Insert all supported currencies at once

    return {
      message:
        "Supported currencies list saved successfully to the supported_currencies table",
    };
  } catch (error) {
    throw new Error(
      "Error fetching and saving supported currencies: " + error.message
    );
  }
};

exports.getConversionRate = async (from, to) => {
  try {
    // Validate input
    if (!from || !to) {
      throw new Error("Both 'from' and 'to' parameters are required");
    }

    // Fetch the conversion rate from CoinGecko
    const response = await axios.get(`${COINGECKO_API_URL}/simple/price`, {
      params: {
        ids: from, // Cryptocurrency ID (e.g., 'bitcoin')
        vs_currencies: to, // Target currency (e.g., 'usd')
      },
    });

    // Extract the conversion rate from the response
    const rate = response.data[from]?.[to];
    if (!rate) {
      throw new Error(`Conversion rate not found for '${from}' to '${to}'`);
    }
    return {
      from,
      to,
      rate,
    };
  } catch (error) {
    throw new Error("Error fetching conversion rate: " + error.message);
  }
};
