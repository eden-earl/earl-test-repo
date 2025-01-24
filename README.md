# Endpoints

`COINGECKO_API_URL=https://api.coingecko.com/api/v3`

### **Currency**

- **Save Coins List**:  
  `POST /api/currency/save-coins`  
  Saves the list of supported cryptocurrencies from CoinGecko into the database.

- **Save Supported Currencies**:  
  `POST /api/currency/save-supported-currencies`  
  Saves the list of supported fiat and cryptocurrency symbols from CoinGecko into the database.

- **Get Conversion Rate**:  
  `GET /api/currency/convert`  
  Fetches the live conversion rate between two currencies using CoinGecko.

---

### **Example Requests**

- **Save Coins List**:

  ```bash
  POST /api/currency/save-coins
  ```

  No request body is required.

- **Save Supported Currencies**:

  ```bash
  POST /api/currency/save-supported-currencies
  ```

  No request body is required.

- **Get Conversion Rate**:
  ```bash
  GET /api/currency/convert?from=bitcoin&to=usd
  ```

---

### **Example Responses**

- **Save Coins List**:

  ```json
  {
    "message": "Coins list saved successfully"
  }
  ```

- **Save Supported Currencies**:

  ```json
  {
    "message": "Supported currencies list saved successfully"
  }
  ```

- **Get Conversion Rate**:
  ```json
  {
    "from": "bitcoin",
    "to": "usd",
    "rate": 30000
  }
  ```

---
