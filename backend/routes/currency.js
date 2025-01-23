const express = require("express");
const router = express.Router();
const CurrencyController = require("../controllers/currencyController");

router.get("/price", CurrencyController.getCurrencyData);

module.exports = router;
