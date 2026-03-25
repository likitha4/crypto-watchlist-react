import React from "react";

const CoinCard = ({ coin, index }) => {
	const isPositive = coin.price_change_percentage_24h >= 0;
	return (
		// <div className="coin-row">
		// 	<span className="coin-rank">#{index+1}</span>
        //         <div className="coin-name-cell">
        //         <img src={coin.image} alt={coin.name} />
        //         <div>
        //             <p className="coin-name">{coin.name}</p>
        //             <p className="coin-symbol">{coin.symbol.toUpperCase()}</p>
        //         </div>
        //         </div>
				
		// 		<span className="coin-price">
		// 			₹ {coin.current_price.toLocaleString("en-IN")}
		// 		</span>
		// 		<span className={`coin-change ${isPositive ? "positive" : "negative"}`}>
		// 			{isPositive ? "↑" : "↓"}
		// 			{Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
		// 		</span>
        //         <span className="coin-marketcap">
        //             {(coin.market_cap).toLocaleString('en-IN')} Cr
        //         </span>
			
		// </div>

		<div className="coin-card">
			<div className="coin-card-top">
				<div className="coin-card-identity">
					<img src={coin.image} alt={coin.name} />
				<div>
				<p className="coin-name">{coin.name}</p>
				<p className="coin-symbol">{coin.symbol.toUpperCase()}</p>
			</div>
			</div>
			<span className={`coin-badge ${isPositive?'positive': 'negative'}`}>{isPositive? '▲' : '▼'}{Math.abs(coin.price_change_percentage_24h).toFixed(2)}%</span>
		</div>
		<p className="coin-price">₹{coin.current_price.toLocaleString('en-IN')} </p>
		<p className="coin-marketcap">Mkt Cap: ₹{(coin.market_cap/1e7).toFixed(2)} Cr</p>
	</div>
	);
};

export default CoinCard;
