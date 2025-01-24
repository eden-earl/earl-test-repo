const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // CoinGecko ID
  name: { type: String, required: true }, // Name of the coin
  symbol: { type: String, required: true }, // Symbol of the coin
});

const Token = mongoose.model("Token", TokenSchema);

module.exports = Token;
