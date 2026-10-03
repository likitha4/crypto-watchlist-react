import { useWatchlist } from "../context/WatchlistContext";
import { useAuth } from "../context/AuthContext";
import {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";

const API_URL= import.meta.env.VITE_APP_URL
const Watchlist = () => {
	const { watchlist, removeFromWatchlist } = useWatchlist();
	const { isAuthenticated } = useAuth();
	const [investments, setInvestments]= useState([])
	const [loadingInvestments, setLoadingInvestments]= useState(true)
	const navigate = useNavigate();
	
	useEffect(()=>{
		if(!isAuthenticated) return;
		const fetchInvestments= async()=>{
			try{
				setLoadingInvestments(true);
				const res= await fetch(`${API_URL}/api/payment/investments`,{
					credentials:'include',
				});
				const data= await res.json();
				setInvestments(Array.isArray(data)? data:[])

			}catch(error){
				console.error("Failed to load investments", error);
				setInvestments([]);
			}finally{
				setLoadingInvestments(false);
			}
		};
		fetchInvestments()
	},[isAuthenticated]);

	if (!isAuthenticated) {
		return (
			<div className="watchlist-container">
				<p>Login to view your portfolio</p>
				<button className="btn-register" onClick={() => navigate("/login")}>Login</button>
			</div>
		);
	}
	return (
		<div className="watchlist-container">
			<div className="watchlist-header">
				<h2> My Portfolio </h2>
				<button className="btn-login" onClick={() => navigate("/")}>
					Back to Home
				</button>
			</div>
			<section className="portfolio-section">
				<h3>My Watchlist ❤️ </h3>
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
								{item.coinName || "Loading..."}
							</span>
							<div className="watchlist-actions">
								<button
									className="view-coin"
									onClick={() =>
										item.coinId && navigate(`/coins/${item.coinId}`)
									}
									disabled={!item.coinId}
								>
									View 
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
			</section>
			<section className="portfolio-section">
				<h3> My Investments 💰</h3>
				{loadingInvestments ?(
					<p> Loading Investments ... </p>
				):investments.length ===0 ?(
					<div className="watchlist-empty">
						<p>You haven't invested in any coin yet</p>
						<button className="btn-register" onClick={()=>navigate("/")}>
						Start Investing
						</button>
					</div>
				):(
					<div className="investments-list">
						{investments.map((inv)=>(
							<div className="investment-item" key={inv._id}>
							<div className="investment-info">
								<span className="investment-coin">{inv.coinName}</span>
								<span className="investment-amount">
								₹{inv.amount.toLocaleString("en-IN")}
								</span><span className="investment-date"> {new Date(inv.createdAt).toLocaleDateString("en-IN",{
									day:"numeric",
									month:"short",
									year:"numeric",
								})}
								</span>
							</div>
							<button className="view-coin" onClick={()=>navigate(`/coins/${inv.coinId}`)}>View Coin </button>
					</div>
							))}
							</div>
				)}
			</section>
		</div>
	);
};
export default Watchlist;
