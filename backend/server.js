require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const axios = require("axios");
const port = process.env.PORT || 8000;

app.use(cors({
  origin: ['http://localhost:5173', 'https://lessgo-crypto.onrender.com']
}))

app.get("/coins", (req, res) => {
  axios
    .get(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=10&page=1&sparkline=true",{
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
        if(error.response?.status==429){
         return  res.status(429).json({error:"Exceeded the Rate Limit"})

        }
      return res.status(500).json({error:`Error in fetching data `});
    });
});

app.get("/coins/:coinId", (req, res) => {
  const coinId=req.params.coinId;
  axios
    .get(
      `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&sparkline=true`,{
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

app.get("/search",(req,res)=>{
  const query=req.query.q;
  axios.get(`https://api.coingecko.com/api/v3/search?query=${query}`,{
    headers:{
      'User-Agent':'Mozilla/5.0',
      'Accept':'application/json'
    }
  }).then((result)=>{
    res.json(result.data)
  }).catch((error)=>{
    console.log(error);
    if(error.response?.status ==429){
     return res.status(429).json({error:"Rate Limit error "});
    }
  })
});


app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
