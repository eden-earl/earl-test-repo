const CurrencyService = require("../services/CurrencyService");
const Token = require("../models/Token");
const SupportedCurrency = require("../models/SupportedCurrency");

exports.saveCoinsList = async (req, res) => {
  try {
    const result = await CurrencyService.fetchAndSaveCoins();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.saveSupportedCurrencies = async (req, res) => {
  try {
    const result = await CurrencyService.fetchAndSaveSupportedCurrencies();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getConversionRate = async (req, res) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res
        .status(400)
        .json({ error: "Missing required parameters: from, to" });
    }

    const result = await CurrencyService.getConversionRate(from, to);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Fetch tokens list from MongoDB
exports.getTokens = async (req, res) => {
  try {
    const tokens = await Token.find({});
    res.status(200).json(tokens);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tokens: " + error.message });
  }
};

// Fetch supported currencies from MongoDB
exports.getSupportedCurrencies = async (req, res) => {
  try {
    const currencies = await SupportedCurrency.find({});
    res.status(200).json(currencies);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching supported currencies: " + error.message });
  }
};
