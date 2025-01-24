const axios = require("axios");
const { COINGECKO_API_URL } = require("../config/constant");

exports.convertCurrency = async (from, to, amount) => {
  try {
    // Fetch rates from CoinGecko
    const response = await axios.get(`${COINGECKO_API_URL}/simple/price`, {
      params: {
        ids: from,
        vs_currencies: to,
      },
    });

    // Check if the response contains required data
    const rates = response.data[from][to];
    if (!rates) throw new Error("Invalid currency pair or data not available.");

    // Perform conversion
    const convertedAmount = rates * amount;
    return { from, to, amount, convertedAmount, rate: rates };
  } catch (error) {
    throw new Error("Error fetching conversion rate. " + error.message);
  }
};
