const express = require("express");
const router = express.Router();
const CurrencyController = require("../controllers/currencyController");

// Save coins list
router.post("/save-coins", CurrencyController.saveCoinsList);

// Save supported currencies list
router.post(
  "/save-supported-currencies",
  CurrencyController.saveSupportedCurrencies
);

// Get conversion rate
router.get("/convert", CurrencyController.getConversionRate);

// Get tokens list
router.get("/tokens", CurrencyController.getTokens);

// Get supported currencies list
router.get("/supported-currencies", CurrencyController.getSupportedCurrencies);

module.exports = router;
