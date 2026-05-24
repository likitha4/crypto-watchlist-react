import { useWatchlist } from "../context/WatchlistContext";
import { useAuth } from "../context/AuthContext";

import { useNavigate } from "react-router-dom";

const Watchlist = () => {
	const { watchlist, removeFromWatchlist } = useWatchlist();
	const { token } = useAuth();
	const navigate = useNavigate();
	if (!token) {
		return (
			<>
				<p>Login to view watchlist</p>
				<button onClick={() => navigate("/login")}>Login</button>
			</>
		);
	}
	return (
		<div className="watchlist-container">
			<div className="watchlist-header">
				<h2> My Watchlist ❤️</h2>
				<button className="btn-login" onClick={() => navigate("/")}>
					Back to Home
				</button>
			</div>
			{watchlist.length == 0 ? (
				<div className="watchlist-empty">
					<p>No coins in watchlist yet</p>
					<button className="btn-register" onClick={() => navigate("/")}>
						Browse Coins
					</button>
				</div>
			) : (
				<div className="watchlist-list">
					{watchlist.map((item) => (
						<div className="watchlist-item" key={item.coinId}>
							<span className="watchlistt-coin-name">
								{item.coinName || item.name || "Loading..."}
							</span>
							<div className="watchlist-actions">
								<button
									className="view-coin"
									onClick={() =>
										item.coinId && navigate(`/coins/${item.coinId}`)
									}
									disabled={!item.coinId}
								>
									View details
								</button>
								<button
									className="remove-coin"
									onClick={() => removeFromWatchlist(item.coinId)}
								>
									Remove
								</button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};
export default Watchlist;
