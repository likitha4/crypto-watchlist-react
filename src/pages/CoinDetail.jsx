import { useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {Tooltip, Legend, PointElement, LineElement, CategoryScale, Chart as ChartJS, LinearScale} from 'chart.js'
import "./CoinDetail.css";

ChartJS.register(Tooltip, Legend, PointElement, LineElement, CategoryScale, LinearScale)
const CoinDetail = () => {


  const { coinId } = useParams();
  const cachedData = localStorage.getItem("cryptoData");
  console.log(cachedData, "cached Data");
  const coins = JSON.parse(cachedData);
  console.log(coins, "coins");
  const coin = coins.find((c) => c.id === coinId);

  if (!coin) return <p> No coins found </p>;
  const isPositive = coin.price_change_percentage_24h >= 0;
  const sparkLinePrices=coin.sparkline_in_7d.price;
  console.log(coin.sparkline_in_7d)
  const data={
    labels: sparkLinePrices.map((_,index)=>index),
    datasets:[
        {
            label:`${coin.name} in 7d`,
            data: sparkLinePrices,
            borderColor: isPositive? '#22c55e' : '#ef4444',
            pointRadius:0,
            borderWidth:1.5,

        }
    ]
  }

  return (
    <div className="detail-container">
      <div className="detail-left">
        <img src={coin.image} alt={coin.name} />
        <p className="coin-info">{coin.name}</p>

        <div className="coin-price">
          Current Price: ₹{coin.current_price.toLocaleString("en-IN")}
        </div>
        <div className={`coin-change ${isPositive?'positive': 'negative'}`}>
        24Hrs Change: {isPositive?'▲' : '▼'}
          {coin.price_change_percentage_24h.toFixed(2)}%
        </div>
        <div className="coin-stat">
          Market cap: {(coin.market_cap / 1e7).toFixed(2)} Cr
        </div>

        <div className="coin-stat">
          Supply: {coin.circulating_supply.toLocaleString('en-IN')} 
        </div>
        <div className="coin-stat">
          24hr Volume: {(coin.total_volume/1e7).toFixed(2)} Cr 
        </div>
    
      </div>
      <div className="detail-right">
        <div className="chart-container">
      <p><Line data={data} options={{maintainApectRatio:false,responsive:true} }></Line></p>
    </div>
    </div>
    </div>
  );
};

export default CoinDetail;
