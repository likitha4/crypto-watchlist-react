import { useState, useEffect, createContext, useContext } from "react";
import { useAuth } from "./AuthContext";

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
	const [watchlist, setWatchlist] = useState([]);
	const { token } = useAuth();
	const API_URL = import.meta.env.VITE_APP_URL;
	useEffect(() => {
		console.log(token, "token");
		if (!token) {
			setWatchlist([]);
			return;
		}
		const getWatchlist = async () => {
			try {
				const response = await fetch(`${API_URL}/api/watchlist`, {
					method: "GET",
					headers: { Authorization: `Bearer ${token}` },
				});
				console.log("Watchlist response status", response.status);
				const data = await response.json();
				console.log("watchlist data", data);
				setWatchlist(data);
			} catch (error) {}
		};
		getWatchlist();
	}, [token]);
	const addToWatchlist = async (coinId, coinName) => {
		setWatchlist((prev) => [...prev, { coinId, coinName }]);
		try {
			const res = await fetch(`${API_URL}/api/watchlist`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ coinId, coinName }),
			});
			const data = await res.json();
			if (!res.ok) {
				setWatchlist((prev) => prev.filter((item) => item.coinId !== coinId));
				console.log(data.error);
				return;
			}
			console.log(data,"data-db response")
		} catch (error) {
			console.log("Unable to add the selected coin");
			setWatchlist((prev) => prev.filter((item) => item.coinId !== coinId));
		}
	};

	const removeFromWatchlist = async (coinId) => {
		try {
			const res = await fetch(`${API_URL}/api/watchlist/${coinId}`, {
				method: "DELETE",
				headers: { Authorization: `Bearer ${token}` },
			});
			await res.json();
			setWatchlist((prev) => prev.filter((coin) => coin.coinId !== coinId));
		} catch (error) {
			console.log("Error in removing coin", error);
		}
	};
	const isInWatchlist = (coinId) => {
		return watchlist.some((item) => item.coinId == coinId);
	};
	return (
		<WatchlistContext.Provider
			value={{
				isInWatchlist,
				watchlist,
				removeFromWatchlist,
				addToWatchlist,
			}}
		>
			{children}
		</WatchlistContext.Provider>
	);
};
export const useWatchlist = () => useContext(WatchlistContext);
