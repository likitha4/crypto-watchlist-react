import CoinDetail from "./pages/CoinDetail";
import HomePage from "./pages/HomePage";
import "./App.css";
import { Routes,Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Watchlist from "./pages/Watchlist";
function App() {
  return (
    <>
    <Routes>
      <Route path='/' element ={<HomePage></HomePage>}></Route>
      <Route path='/coins/:coinId' element={<CoinDetail></CoinDetail>}></Route>
      <Route path='/login' element={<Login></Login>}/>
      <Route path='/register' element={<Register></Register>}/>
      <Route path='/watchlist' element={<Watchlist></Watchlist>}/>
    </Routes>  
    </>
  );
}
export default App;
