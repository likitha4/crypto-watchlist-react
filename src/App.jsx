import { useEffect, useState } from "react";
import CoinCard from "./components/CoinCard";
import "./App.css";
import useDebounce from './hooks/useDebounce'

function App() {
	const [coins, setCoins] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [search, setSearch]= useState('')
	const debouncedSearch=useDebounce(search, 300)

	const filteredCoins=coins.filter((coin)=>{
		return coin.name.toLowerCase().includes(debouncedSearch.toLowerCase())
	});
	useEffect(() => {
		const cachedData = localStorage.getItem('cryptoData');
    const lastFetch = localStorage.getItem('lastFetch');
    const now = Date.now();

    // If we have data and it's less than 5 minutes old, use it
    if (cachedData && lastFetch && (now - lastFetch < 300000)) {
        setCoins(JSON.parse(cachedData));
        setLoading(false);
        return;
    }

		fetch(
			"https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc",
		)
			.then((response) => response.json())
			.then((data) => {
				if (data.status?.error_code === 429) {
                throw new Error("Rate limit exceeded");
            }
            setCoins(data);
            localStorage.setItem('cryptoData', JSON.stringify(data));
            localStorage.setItem('lastFetch', now.toString());
            setLoading(false);
			})
			.catch((err) => {
				setError("failed to fetch data");
				setLoading(false);
			});
	}, []);

	if (loading) return <p>Loading Prices...</p>;
	if (error) return <p>{error}</p>;

	return (
		<>
			<div className="app">
				<header className="app-header">
					<h1>LessGoCrypto</h1>
					<p className="app-subtitle">Live Prices in INR</p>
					<input type="text" placeholder="Search coin" className="search-bar" value={search} onChange={(e)=>setSearch(e.target.value)}/>
				</header>
				<main className="app-main">
          {/* <div className="table-header">
            <span className="">#</span>
            <span className="">Coin</span>
            <span className="">Price</span>
            <span className="">24h change</span>
            <span className="">Market Cap</span>
			</div> */}
					{filteredCoins.map((coin, index) => (
						<CoinCard key={coin.id} coin={coin} index={index}>
						</CoinCard>))}
            
				</main>
			</div>
		</>
	);
}

export default App;
