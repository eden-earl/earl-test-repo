const axios = require("axios");

const { COINGECKO_API_URL } = require("../config/constant");

exports.getCurrencyData = async (req, res) => {
  const apiLink = `${COINGECKO_API_URL}/${req.body.coin}`;
  const currencyData = await axios.get(apiLink);
  //console.log(currencyData.data.market_data.current_price.usd);
  res.status(200).json(currencyData.data.market_data.current_price.usd);
};
