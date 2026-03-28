require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const axios = require("axios");
const port = process.env.PORT;

app.use(cors());

app.get("/api/coins", (req, res) => {
  axios
    .get(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=10&page=1",{
        headers:{
            'User-Agent':'Mozilla/5.0',
            'Accept':'application/json'

        }
      }
    )
    .then((response) => {
     res.json(response.data)
    })
    .catch((error) => {
        console.log(error.response?.status);
        console.log(error.response?.data);
      res.send(`Error in fetching data `);
    });
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
