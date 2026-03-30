import { useNavigate, useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { useState,useEffect } from "react";
import {
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
} from "chart.js";
import "./CoinDetail.css";

ChartJS.register(
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
);
const API_URL=import.meta.env.VITE_APP_URL

const CoinDetail = () => {
  const { coinId } = useParams();
  const [coin, setCoin] = useState(null);
  const cachedData = localStorage.getItem("cryptoData");
  console.log(cachedData, "cached Data");
  const coins = JSON.parse(cachedData);
  console.log(coins, "coins");
  const coinFromLocal = coins.find((c) => c.id === coinId);
 const navigate=useNavigate();
  useEffect(() => {
    if (coinFromLocal) {
      setCoin(coinFromLocal)
    }else{
      fetch(`${API_URL}/coins/${coinId}`)
        .then((response) => response.json())
        .then((data) => setCoin(data));
    }
  }, [coinId]);
 if(!coin) return <p>Loading...</p>

 const priceChange = coin.price_change_percentage_24h ?? coin.market_data?.price_change_percentage_24h ?? 0;
  const currentPrice = coin.current_price ?? coin.market_data?.current_price?.inr ?? 0;
  const marketCap = coin.market_cap ?? coin.market_data?.market_cap?.inr ?? 0;
  

  const isPositive = coin.price_change_percentage_24h >= 0;
  const sparkLinePrices = coin.sparkline_in_7d?.price || coin.market_data?.sparkline_in_7d?.price||[];
  console.log(coin.sparkline_in_7d);

  const data = {
    labels: sparkLinePrices.map((_, index) => index),
    datasets: [
      {
        label: `${coin.name} in 7d`,
        data: sparkLinePrices,
        borderColor: isPositive ? "#22c55e" : "#ef4444",
        pointRadius: 0,
        borderWidth: 1.5,
        fill:true
      },
    ],
  };

  return (
    <div className="detail-container">
      <div className="detail-left">
        <img src={coin.image?.large || coin.image || ""} alt={coin.name} />
        <p className="coin-info">{coin.name}</p>

        <div className="coin-price">
          Current Price: ₹{currentPrice.toLocaleString("en-IN")}
        </div>
        <div className={`coin-change ${isPositive ? "positive" : "negative"}`}>
          24Hrs Change: {isPositive ? "▲" : "▼"}
          {priceChange.toFixed(2)}%
        </div>
        <div className="coin-stat">
          Market cap: {(marketCap / 1e7).toFixed(2)} Cr
        </div>

        <div className="coin-stat">
          Supply: {(coin.circulating_supply??0).toLocaleString("en-IN")}
        </div>
        <div className="coin-stat">
          24hr Volume: {((coin.total_volume??0) / 1e7).toFixed(2)} Cr
        </div>
      </div>
      <div className="detail-right">
        <div className="chart-container">
          {sparkLinePrices.length>0 ?(
            <Line
              data={data}
              options={{ maintainApectRatio: false, responsive: true }}
            ></Line>
          ):(<div>
          <p>No chart available ...</p>
          </div>)
}
        </div>
      </div>
      <div>
        <button className="back" onClick={()=>navigate(-1)}>Back to list </button>
      </div>
    </div>
  );
};

export default CoinDetail;
