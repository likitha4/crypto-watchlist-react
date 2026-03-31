
import { useNavigate } from "react-router-dom";
import './SearchDropDown.css'

const SearchDropDown = ({ searchResults }) => {
  const navigate = useNavigate();

  return (
    <div className="drop-down">
      {searchResults.map((coin) => (
        <div key={coin.id} className="drop-down-item" onClick={()=>navigate(`/coins/${coin.id}`)}>
            <img src={coin.thumb} alt={coin.name}/>
          <span>{coin.name}</span>
          <span>  {coin.symbol}</span>
          <span>{coin.market_cap_rank}</span>
        </div>
      ))}
    </div>
  );
};
export default SearchDropDown;
