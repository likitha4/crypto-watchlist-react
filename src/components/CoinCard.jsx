import React from "react";
import { useAuth } from "../context/AuthContext";
import { useWatchlist } from "../context/WatchlistContext";

const CoinCard = ({ coin, index, onClick }) => {
	const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
	const { token } = useAuth();
	const handleWatchlist = (e) => {
		e.stopPropagation();
		if (!token) return;
		if (isInWatchlist(coin.id)) {
			removeFromWatchlist(coin.id);
		} else {
			addToWatchlist(coin.id, coin.name);
		}
	};
	const isPositive = coin.price_change_percentage_24h >= 0;
	return (
		<div className="coin-card" onClick={onClick}>
			<div className="coin-card-top">
				<div className="coin-card-identity">
					<img src={coin.image} alt={coin.name} />
					<div>
						<p className="coin-name">{coin.name}</p>
						{token && (
							<button className="add-watchlist-btn" onClick={handleWatchlist}> Add to Watchlist
								{" "}
								{isInWatchlist(coin.id) ? "❤️" : "🤍"}
							</button>
						)}
						<p className="coin-symbol">{coin.symbol.toUpperCase()}</p>
					</div>
				</div>
				<span className={`coin-badge ${isPositive ? "positive" : "negative"}`}>
					{isPositive ? "▲" : "▼"}
					{Math.abs(coin.price_change_percentage_24h ?? 0).toFixed(2)}%
				</span>
			</div>
			<span className="coin-price">
				₹{coin.current_price.toLocaleString("en-IN")}{" "}
			</span>
			<p className="coin-marketcap">
				Mkt Cap: ₹{(coin.market_cap / 1e7).toFixed(2)} Cr
			</p>
		</div>
	);
};

export default CoinCard;
