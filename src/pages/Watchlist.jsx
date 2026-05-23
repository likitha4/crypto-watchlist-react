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
		<div
			style={{
				
			}}
		>
			<h2> My Watchlist </h2>
			{watchlist.length == 0 ? (
				<p>No coins in watchlist yet</p>
			) : (
				watchlist.map((item) => (
					<div className="watchlist-container">
						<div className="watchlist-item" key={item.coinId}>
							<span>{item.coinName}</span>
							<button
								className="remove-coin"
								onClick={() => removeFromWatchlist(item.coinId)}
							>
								Remove
							</button>
							<button
								className="view-coin"
								onClick={() => navigate(`/coins/${item.coinId}`)}
							>
								View
							</button>
						</div>
					</div>
				))
			)}
			<button className="btn-home" onClick={() => navigate("/")}>
				Back to Home
			</button>
		</div>
	);
};
export default Watchlist;
