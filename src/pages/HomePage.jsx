import { useEffect, useState, useMemo } from "react";
import CoinCard from "../components/CoinCard";
import { useNavigate } from "react-router-dom";
import useDebounce from "../hooks/useDebounce";
import "../App.css";
import SearchDropDown from "../components/SearchDropDown";

const API_URL=import.meta.env.VITE_APP_URL
const CACHE_KEY = "cryptoData";
const CACHE_TIME_KEY = "lastFetch";
const CACHE_DURATION = 5 * 60 * 1000;

const HomePage = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const debouncedSearch = useDebounce(search, 1500);

  const navigate = useNavigate();

  useEffect(() => {
    const cachedData = localStorage.getItem(CACHE_KEY);
    const lastFetch = Number(localStorage.getItem(CACHE_TIME_KEY));
    const now = Date.now();

    if (cachedData && lastFetch && now - lastFetch < CACHE_DURATION) {
      setCoins(JSON.parse(cachedData));
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/coins`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status?.error_code === 429) {
          throw new Error("Rate limit exceeded");
        }
        setCoins(data);
        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(CACHE_TIME_KEY, now.toString());
        setLoading(false);
      })
      .catch(() => {
        const staleData = localStorage.getItem(CACHE_KEY);
        if (staleData) {
          setCoins(JSON.parse(staleData));
          setLoading(false);
        } else {
          setError("failed to fetch data");
          setLoading(false);
        }
      });
  }, []);

  useEffect(() => {
    if (debouncedSearch === "") return;
    let cancelled = false;

    fetch(`${API_URL}/search?q=${debouncedSearch}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data.coins[0]);
        if (!cancelled) setSearchResults(data.coins);
      })
      .catch((error) => {
        setError("No coins found");
        console.log(error);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch]);

  const filteredCoins = useMemo(() => {
    return coins.filter((coin) =>
      coin.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );
  }, [coins, debouncedSearch]);

  if (loading) return <p>Loading Prices...</p>;

  if (error) return (<><p>{error}</p>
    <button className="back" onClick={()=>window.location.href='/'}>Try again </button>
  </>);

  return (
    <>
      <div className="app">
        <header className="app-header">
          <h1>LessGoCrypto</h1>
          <p className="app-subtitle">Live Prices in INR</p>
          <input
            type="text"
            placeholder="Search coin"
            className="search-bar"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {debouncedSearch && searchResults.length > 0 && (
            <SearchDropDown searchResults={searchResults}></SearchDropDown>
          )}
        </header>
        <main className="app-main">
          {filteredCoins.length > 0
            ? filteredCoins.map((coin, index) => (
                <CoinCard
                  key={coin.id}
                  coin={coin}
                  index={index}
                  onClick={() => navigate(`/coins/${coin.id}`)}
                ></CoinCard>
              ))
            : null}
        </main>
      </div>
    </>
  );
};

export default HomePage;
