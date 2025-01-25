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
    const { q = "", page = 1, limit = 20 } = req.query;

    // Search query: case-insensitive search on token name
    const query = q ? { name: { $regex: q, $options: "i" } } : {};

    // Fetch tokens with pagination
    const tokens = await Token.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Count total matching tokens
    const total = await Token.countDocuments(query);

    res.json({
      tokens,
      total,
      hasMore: page * limit < total, // Check if more pages exist
    });
  } catch (error) {
    console.error("Error fetching tokens:", error);
    res.status(500).json({ error: "Error fetching tokens: " + error.message });
  }
};

// Fetch supported currencies from MongoDB
exports.getSupportedCurrencies = async (req, res) => {
  try {
    const { q = "", page = 1, limit = 20 } = req.query;

    // Search query: case-insensitive search on the `symbol`
    const query = q ? { symbol: { $regex: q, $options: "i" } } : {};

    // Fetch supported currencies with pagination
    const currencies = await SupportedCurrency.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Count total matching currencies
    const total = await SupportedCurrency.countDocuments(query);

    res.json({
      currencies,
      total,
      hasMore: page * limit < total, // Check if more pages exist
    });
  } catch (error) {
    console.error("Error fetching supported currencies:", error);
    res
      .status(500)
      .json({ error: "Error fetching supported currencies: " + error.message });
  }
};
