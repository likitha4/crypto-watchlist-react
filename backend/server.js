require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const axios = require("axios");
const port = process.env.PORT || 8000;
const CoinCache = require("./models/CoinCache");
const connectDB = require("./config/db");

connectDB();

app.use(
	cors({
		origin: [
			"http://localhost:5173",
			"https://lessgo-crypto.onrender.com",
			"https://lessgocrypto.vercel.app",
		],
		methods: ["GET", "POST","DELETE"],
		credentials: true,
	}),
);

app.use(express.json());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/watchlist", require("./routes/watchlist"));
app.use('/api/payment',require('./routes/payment'));

app.get("/coins", async (req, res) => {
	try {
		const cache = await CoinCache.findOne().sort({ fetchedAt: -1 });
		const now = Date.now();
		const CACHE_DURATION = 10 * 60 * 1000;
		if (cache && now - new Date(cache.fetchedAt).getTime() < CACHE_DURATION) {
			return res.json(cache.coins);
		}

		const response = await axios.get(
			"https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=10&page=1&sparkline=true",
			{
				headers: {
					"User-Agent": "Mozilla/5.0",
					Accept: "application/json",
				},
			},
		);
		await CoinCache.deleteMany({});
		await CoinCache.create({ coins: response.data });
		return res.json(response.data);
	} catch (error) {
		const staleCache = await CoinCache.findOne().sort({ fetchedAt: -1 });
		if (staleCache) {
			return res.json(staleCache.coins);
		}
		return res.status(500).json({ error: "Failed to fetch" });
	}
});

app.get("/coins/:coinId", (req, res) => {
	const coinId = req.params.coinId;
	axios
		.get(
			`https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&sparkline=true`,
			{
				headers: {
					"User-Agent": "Mozilla/5.0",
					Accept: "application/json",
				},
			},
		)
		.then((response) => {
			res.json(response.data);
		})
		.catch((error) => {
			console.log(error.response?.status);
			console.log(error.response?.data);
			res.send(`Error in fetching data `);
		});
});

app.get("/search", (req, res) => {
	const query = req.query.q;
	axios
		.get(`https://api.coingecko.com/api/v3/search?query=${query}`, {
			headers: {
				"User-Agent": "Mozilla/5.0",
				Accept: "application/json",
			},
		})
		.then((result) => {
			res.json(result.data);
		})
		.catch((error) => {
			console.log(error);
			if (error.response?.status == 429) {
				return res.status(429).json({ error: "Rate Limit error " });
			}
		});
});

app.listen(port, () => {
	console.log(`server is running on port ${port}`);
});
