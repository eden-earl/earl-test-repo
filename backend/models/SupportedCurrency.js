const mongoose = require("mongoose");

const SupportedCurrencySchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true },
});

const SupportedCurrency = mongoose.model(
  "SupportedCurrency",
  SupportedCurrencySchema
);

module.exports = SupportedCurrency;
