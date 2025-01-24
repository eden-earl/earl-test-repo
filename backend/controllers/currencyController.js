const CurrencyService = require("../services/CurrencyService");

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
