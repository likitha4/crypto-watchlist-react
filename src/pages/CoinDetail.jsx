import { useNavigate, useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";
import { useState, useEffect } from "react";
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
import { useAuth } from "../context/AuthContext";

ChartJS.register(
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
);
const API_URL = import.meta.env.VITE_APP_URL;

const CoinDetail = () => {
  const { coinId } = useParams();
  const [coin, setCoin] = useState(null);
  const [amount, setAmount] = useState("");
  const [investing, setInvesting] = useState(false);
  const [investments, setInvestments] = useState([]);
  const [loadingInvestments, setLoadingInvestments] = useState(true);
  const navigate = useNavigate();
  const { token } = useAuth();
  if (!token) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
        }}
      >
        <p> Please login to view coin details</p>
        <button className="btn-register" onClick={() => navigate("/login")}>
          {" "}
          Login
        </button>
        <button className="btn-login" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    );
  }

  const cachedData = localStorage.getItem("cryptoData");
  console.log(cachedData, "cached Data");
  const coins = cachedData ? JSON.parse(cachedData) : [];
  console.log(coins, "coins");
  const coinFromLocal = coins.find((c) => c.id === coinId);

  useEffect(() => {
    if (coinFromLocal) {
      setCoin(coinFromLocal);
    } else {
      fetch(`${API_URL}/coins/${coinId}`)
        .then((response) => response.json())
        .then((data) => setCoin(data));
    }
    const fetchInvestments = async () => {
      try {
        setLoadingInvestments(true);
        const res = await fetch(
          `${API_URL}/api/payment/investments/${coinId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await res.json();
        setInvestments(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingInvestments(false);
      }
    };
    if (token && coinId) fetchInvestments();
  }, [coinId, token]);

  if (!coin)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
        }}
      >
        <p>Loading...</p>
      </div>
    );

  const priceChange =
    coin.price_change_percentage_24h ??
    coin.market_data?.price_change_percentage_24h ??
    0;
  const currentPrice =
    coin.current_price ?? coin.market_data?.current_price?.inr ?? 0;
  const marketCap = coin.market_cap ?? coin.market_data?.market_cap?.inr ?? 0;

  const isPositive = coin.price_change_percentage_24h >= 0;
  const sparkLinePrices =
    coin.sparkline_in_7d?.price ||
    coin.market_data?.sparkline_in_7d?.price ||
    [];
  console.log(coin.sparkline_in_7d);

  const data = {
    labels: sparkLinePrices.map((_, index) => index),
    datasets: [
      {
        label: `${coin.name} in 7d`,
        data: sparkLinePrices,
        borderColor: isPositive ? "#22c55e" : "#ef4444",
        backgroundColor: isPositive
          ? "rgba(34, 197, 94, 0.1)"
          : "rgba(239, 68, 68, 0.1)",
        pointRadius: 0,
        borderWidth: 1.5,
        fill: true,
      },
    ],
  };
  const handleInvest = async () => {
    if (investing) return;
    if (amount < 0 || !amount) {
      alert("Enter valid amount");
      return;
    }
    setInvesting(true);
    try {
      const res = await fetch(`${API_URL}/api/payment/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ coinId: coinId, coinName: coin.name, amount }),
      });
      const order = await res.json();
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "LessGoCrypto",
        description: `Investing in ${coin.name}`,
        handler: async function (response) {
          const verifyRes = await fetch(`${API_URL}/api/payment/verify`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(response),
          });
          const data = await verifyRes.json();
          if(verifyRes.ok){
          setAmount("");
          await fetchInvestments();
          }
          setInvesting(false);
          alert(data.message || data.error);
        },
      };

      const razorPayInstance = new window.Razorpay(options);
      razorPayInstance.open();
    } catch (error) {
      setInvesting(false);
    }
  };

  return (
    <div style={{ padding: "16px", minHeight: "100vh" }}>
      <button className="btn-back" onClick={() => navigate("/")}>
        Back
      </button>
      <div className="detail-container">
        <div className="detail-left">
          <img src={coin.image?.large || coin.image || ""} alt={coin.name} />
          <p className="coin-info">{coin.name}</p>

          <span className="coin-price">
            Current Price: ₹{currentPrice.toLocaleString("en-IN")}
          </span>
          <span
            className={`coin-change ${isPositive ? "positive" : "negative"}`}
          >
            24Hrs Change: {isPositive ? "▲" : "▼"}
            {priceChange.toFixed(2)}%
          </span>
          <span className="coin-stat">
            Market cap: {(marketCap / 1e7).toFixed(2)} Cr
          </span>
          <div className="invest-section">
            <input
              type="number"
              className="invest-input"
              placeholder="Enter amount in Rs"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
            />
            <button
              className="btn-invest"
              onClick={handleInvest}
              disabled={investing}
            >
              {" "}
              {investing ? "Processing" : "💰 Invest Now"}
            </button>
          </div>
          <span className="coin-stat">
            Supply: {(coin.circulating_supply ?? 0).toLocaleString("en-IN")}
          </span>
          <span className="coin-stat">
            24hr Volume: {((coin.total_volume ?? 0) / 1e7).toFixed(2)} Cr
          </span>
        </div>
        <div className="detail-right">
          <div className="chart-container">
            {sparkLinePrices.length > 0 ? (
              <Line
                data={data}
                options={{
                  maintainApectRatio: false,
                  responsive: true,
                  plugins: {
                    legend: {
                      labels: {
                        usePointStyle: true,
                        pointStyle: "circle",
                        color: "black",
                        font: { size: 12 },
                      },
                    },
                  },
                }}
              ></Line>
            ) : (
              <div>
                <p>No chart available ...</p>
              </div>
            )}
          </div>
          <div className="investment-history">
            <h3>Investments in {coin.name}</h3>
            {loadingInvestments ?(
              <p>Loading Investments... </p>
            ):
            investments.length == 0 ? (
              <p>No successful investment yet.</p>
            ) : (
              investments.map((investment) => {
                return (
                  <div key={investment._id}>
                    <p>Amount: {investment.amount}</p>
                    <p> Status: {investment.status}</p>
                    <p>Payment Id: {investment.razorpayPaymentId}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinDetail;
