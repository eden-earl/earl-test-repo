import React, { useState, useEffect } from "react";
import { AsyncPaginate } from "react-select-async-paginate"; // Use named import
import axios from "axios";

const CurrencyConverter = () => {
  const [fromCurrency, setFromCurrency] = useState(null); // Use object for value and label
  const [toCurrency, setToCurrency] = useState(null); // Use object for value and label
  const [amount, setAmount] = useState("");
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_BACKEND_API_URL;

  // Load tokens for AsyncPaginate
  const loadTokens = async (inputValue, loadedOptions, { page }) => {
    try {
      const res = await axios.get(`${API_URL}/tokens`, {
        params: {
          q: inputValue || "",
          page: page || 1,
          limit: 50,
        },
      });

      const { tokens, hasMore } = res.data;

      return {
        options: tokens.map((token) => ({
          value: token.id,
          label: `${token.name} (${token.symbol.toUpperCase()})`,
        })),
        hasMore,
        additional: {
          page: hasMore ? page + 1 : page,
        },
      };
    } catch (err) {
      console.error("Error fetching tokens:", err);
      return { options: [], hasMore: false, additional: { page } };
    }
  };

  // Load currencies for AsyncPaginate
  const loadCurrencies = async (inputValue, loadedOptions, { page }) => {
    try {
      const res = await axios.get(`${API_URL}/supported-currencies`, {
        params: {
          q: inputValue || "",
          page: page || 1,
          limit: 50,
        },
      });

      const { currencies, hasMore } = res.data;

      return {
        options: currencies.map((currency) => ({
          value: currency.symbol,
          label: currency.symbol.toUpperCase(),
        })),
        hasMore,
        additional: {
          page: hasMore ? page + 1 : page,
        },
      };
    } catch (err) {
      console.error("Error fetching supported currencies:", err);
      return { options: [], hasMore: false, additional: { page } };
    }
  };

  // Fetch conversion rate when currencies change
  useEffect(() => {
    const fetchConversion = async () => {
      if (!fromCurrency || !toCurrency) return;

      try {
        const res = await axios.get(`${API_URL}/convert`, {
          params: { from: fromCurrency.value, to: toCurrency.value },
        });
        setAmount(res.data.rate);
      } catch (err) {
        console.error("Error fetching conversion rate:", err);
        setError("Failed to fetch conversion rate. Please try again later.");
      }
    };

    fetchConversion();
  }, [fromCurrency, toCurrency, API_URL]);

  // Enhanced Selector component
  const Selector = ({ label, value, loadOptions, onChange, placeholder }) => {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">{label}</label>
        <AsyncPaginate
          value={value}
          loadOptions={loadOptions}
          onChange={onChange}
          additional={{ page: 1 }}
          placeholder={placeholder}
          styles={{
            control: (base) => ({
              ...base,
              backgroundColor: "#1A202C", // Dark mode background
              color: "white",
              borderColor: "#2D3748", // Dark border
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: "#2D3748", // Dark dropdown menu
              color: "white",
            }),
            input: (base) => ({
              ...base,
              color: "white", // White text while typing in the search box
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isFocused ? "#4A5568" : "#2D3748", // Hover effect
              color: state.isSelected ? "#E2E8F0" : "white", // Selected text color
            }),
            singleValue: (base) => ({
              ...base,
              color: "white",
            }),
          }}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Currency Converter</h1>
      <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        {error && (
          <div className="bg-red-500 text-white p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <Selector
          label="From Currency"
          value={fromCurrency}
          loadOptions={loadTokens}
          onChange={setFromCurrency}
          placeholder="Search or select a token"
        />

        <Selector
          label="To Currency"
          value={toCurrency}
          loadOptions={loadCurrencies}
          onChange={setToCurrency}
          placeholder="Search or select a currency"
        />

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Amount</label>
          <input
            type="text"
            className="w-full bg-gray-700 p-3 rounded-lg"
            value={amount || ""}
            readOnly
          />
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;