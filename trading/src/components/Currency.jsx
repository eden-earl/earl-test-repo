import React, { useState, useEffect } from "react";
import axios from "axios";

const CurrencyConverter = () => {
  const [tokens, setTokens] = useState([]);
  const [supportedCurrencies, setSupportedCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState(null);

  // Base API URL from environment variables
  const API_URL = import.meta.env.VITE_BACKEND_API_URL;

  // Fetch tokens and supported currencies on page load
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const tokensRes = await axios.get(`${API_URL}/api/currency/tokens`);

        // Ensure tokensRes.data is an array
        if (Array.isArray(tokensRes.data)) {
          setTokens(tokensRes.data);

          // Autofill the first token as default for "fromCurrency"
          if (tokensRes.data.length > 0) {
            setFromCurrency(tokensRes.data[0].id);
          }
        } else {
          throw new Error("Tokens API did not return an array.");
        }
      } catch (err) {
        console.error("Error fetching tokens:", err);
        setError("Failed to fetch tokens. Please try again later.");
      }
    };

    const fetchSupportedCurrencies = async () => {
      try {
        const currenciesRes = await axios.get(`${API_URL}/api/currency/supported-currencies`);
        // Ensure currenciesRes.data is an array
        debugger;
        if (Array.isArray(currenciesRes.data)) {
          // Map currencies if needed
          const currencies = currenciesRes.data.map((c) => (typeof c === "object" ? c.symbol : c));
          setSupportedCurrencies(currencies);

          // Autofill the first supported currency as default for "toCurrency"
          if (currencies.length > 0) {
            setToCurrency(currencies[0]);
          }
        } else {
          throw new Error("Supported currencies API did not return an array.");
        }
      } catch (err) {
        console.error("Error fetching supported currencies:", err);
        setError("Failed to fetch supported currencies. Please try again later.");
      }
    };

    fetchTokens();
    fetchSupportedCurrencies();
  }, []);

  // Fetch conversion amount on currency or token change
  useEffect(() => {
    const fetchConversion = async () => {
      if (!fromCurrency || !toCurrency) return;

      try {
        const res = await axios.get(`${API_URL}/api/currency/convert`, {
          params: { from: fromCurrency, to: toCurrency },
        });
        const rate = res.data.rate;
        setAmount(rate);
      } catch (err) {
        console.error("Error fetching conversion rate:", err);
        setError("Failed to fetch conversion rate. Please try again later.");
      }
    };

    fetchConversion();
  }, [fromCurrency, toCurrency]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Currency Converter</h1>
      <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        {error && (
          <div className="bg-red-500 text-white p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* From Currency Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">From Currency</label>
          <select
            className="w-full bg-gray-700 p-3 rounded-lg"
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
          >
            <option value="">Select Currency</option>
            {Array.isArray(tokens) &&
              tokens.map((token) => (
                <option key={token.id} value={token.id}>
                  {token.name} ({token.symbol.toUpperCase()})
                </option>
              ))}
          </select>
        </div>

        {/* To Currency Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">To Currency</label>
          <select
            className="w-full bg-gray-700 p-3 rounded-lg"
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
          >
            <option value="">Select Currency</option>
            {Array.isArray(supportedCurrencies) &&
              supportedCurrencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency.toUpperCase()}
                </option>
              ))}
          </select>
        </div>

        {/* Amount Display */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Amount</label>
          <input
            type="text"
            className="w-full bg-gray-700 p-3 rounded-lg"
            value={amount}
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
