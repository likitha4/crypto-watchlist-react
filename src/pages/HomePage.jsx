import { useEffect, useState, useMemo } from "react";
import CoinCard from "../components/CoinCard";
import { useNavigate } from "react-router-dom";
import useDebounce from "../hooks/useDebounce";
import "../App.css";
import SearchDropDown from "../components/SearchDropDown";
import { useAuth } from "../context/AuthContext";
import { FixedSizeList } from "react-window";

const API_URL = import.meta.env.VITE_APP_URL;
const CACHE_KEY = "cryptoData";
const CACHE_TIME_KEY = "lastFetch";
const CACHE_DURATION = 5 * 60 * 1000;


const Row = ({ index, style, data  }) => {
  const {filteredCoins, columnCount, navigate} = data 
  const start = index * columnCount;
  const rowCoins = filteredCoins.slice(start, start + columnCount);
  return (
    <div
      style={{
        ...style,
        display: "flex",
        gap: "12px",
        padding: "0 8px",
        boxSizing: "border-box",
      }}
    >
      {rowCoins.map((coin) => (
        <div key={coin.id} style={{ flex: 1, minWidth:0 }}>
          <CoinCard
            coin={coin}
            onClick={() => navigate(`/coins/${coin.id}`)}
          />
        </div>
      ))}
    </div>
  );
};
const HomePage = () => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const debouncedSearch = useDebounce(search, 1500);
  const [columnCount, setColumnCount]= useState(2);
  const [agentQuestion, setAgentQuestion]= useState("");
  const [agentAnswer, setAgentAnswer]= useState("");
  const [agentLoading, setAgentLoading] =useState(false);

  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // const COLUMN_COUNT = 2;
  const ROW_HEIGHT = 160;

  useEffect(() => {
    const cachedData = localStorage.getItem(CACHE_KEY);
    const lastFetch = Number(localStorage.getItem(CACHE_TIME_KEY));
    const now = Date.now();

    if (cachedData && lastFetch && now - lastFetch < CACHE_DURATION) {
      setCoins(JSON.parse(cachedData));
      setLoading(false);

      console.log("coins", coins.length);

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
          const parsed = JSON.parse(staleData);
          if (Array.isArray(parsed)) {
            setCoins(parsed);
            setLoading(false);
            return;
          }
        } else {
          setError("failed to fetch data");
          setLoading(false);
        }
      });
  }, []);

  useEffect(() => {
    if (!debouncedSearch) return;
    let cancelled = false;

    const cached = localStorage.getItem(`search_${debouncedSearch}`);
    if (cached) {
      setSearchResults(JSON.parse(cached));
      return;
    }
    fetch(`${API_URL}/search?q=${debouncedSearch}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data.coins[0]);
        if (!cancelled) {
          setSearchResults(data.coins || []);
          localStorage.setItem(
            `search_${debouncedSearch}`,
            JSON.stringify(data.coins || []),
          );
        }
      })
      .catch((error) => {
        setError("No coins found");
        console.log(error);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch]);

  useEffect(()=>{
    const updateColumns =()=>{
      setColumnCount(window.innerWidth<640? 1:2);

    };
    updateColumns();
    window.addEventListener("resize",updateColumns);
    return ()=>window.removeEventListener("resize", updateColumns);
  },[])

  const askAgent= async()=>{
    if(!agentQuestion.trim()) return;
    setAgentLoading(true)
    setAgentAnswer("");
    try{
      const res= await fetch(`${import.meta.env.VITE_AGENT_URL}/ask`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({question:agentQuestion}),
      });
      const data = await res.json();
      setAgentAnswer(data.answer || "No answer");
    }catch(error){
      setAgentAnswer("Agent is offline. Start it on  port 8001.");
    }finally{
      setAgentLoading(false);
    }
  }
  const filteredCoins = useMemo(() => {
    if (!Array.isArray(coins)) return [];
    return coins.filter((coin) =>
      coin.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );
  }, [coins, debouncedSearch]);

  const externalResults = searchResults.filter(
    (result) => !coins.some((coin) => coin.id === result.id),
  );
  
  if (loading)
    return (
      <div className="status-screen"
      >
        <p style={{ color: "red" }}>Loading Prices...</p>
      </div>
    );
  if (error)
    return (
      <div className="status-screen"
      >
        <p>{error}</p>
        <button className="back" onClick={() => (window.location.href = "/")}>
          Try again
        </button>
      </div>
    );

  return (
    <div className="app">
      <header className="app-header">
        <div className="auth-buttons">
          {isAuthenticated ? (
            <>
              <button className="btn-logout" onClick={logout}>
                Logout
              </button>
              <button
                className="btn-watchlist"
                onClick={() => navigate("/watchlist")}
              >
                Watchlist
              </button>
            </>
          ) : (
            <>
              <button className="btn-login" onClick={() => navigate("/login")}>
                Login
              </button>
              <button
                className="btn-register"
                onClick={() => navigate("/register")}
              >
                Register
              </button>
            </>
          )}
        </div>

        <h1>LessGoCrypto</h1>
        <p className="app-subtitle">Live Prices in INR</p>
        <input
          type="text"
          placeholder="Search coin"
          className="search-bar"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {isAuthenticated && debouncedSearch && externalResults.length > 0 && (
          <SearchDropDown searchResults={externalResults}></SearchDropDown>
        )}
      </header>
      <div className="home-layout">
      <main
        className="coins-panel">
        {filteredCoins.length > 0 ?(
          <FixedSizeList itemData={{filteredCoins, columnCount, navigate}}
            height={window.innerHeight - 300}
            width="100%"
            itemCount={Math.ceil(filteredCoins.length / columnCount)}
            itemSize={ROW_HEIGHT}
          >
            {Row}
          </FixedSizeList>
        ):(
          <p className="no-coins">No coins found</p>
        )}
      </main>
      <aside className="info-panel">
        <h3>Why LessGoCrypto?</h3>
        <ul>
          <li>Live crypto prices in indian Rupees</li>
          <li> Create your personal watchlist</li>
          <li>Track investments easily</li>
          <li>Clean & fast experience</li>
        </ul>
        <div className="agent-placeholder">
          <h4>Crypto Agent </h4>
          <p>
             heyy! Ask me about prices or coin suggestions.
          </p>
         <textarea value={agentQuestion} onChange={(e)=>setAgentQuestion(e.target.value)}
         placeholder="e.g. suggest 5 coins " rows={3}
         style={{width:"100%", color:"#111", background:"#fff"}}/>
         <button onClick ={askAgent} disabled={agentLoading}>
          {agentLoading?"Thinking...":"Ask"}
         </button>
          {agentAnswer &&(
            <div className="agent-answer" style= {{marginTop:12, whiteSpace:"pre-wrap", color:"#111", background:"#fff"}}>
              {agentAnswer}
</div>
          )}
        </div>
      </aside>
      </div>
    </div>
  );
};

export default HomePage;
