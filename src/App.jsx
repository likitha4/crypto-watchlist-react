import CoinDetail from "./pages/CoinDetail";
import HomePage from "./pages/HomePage";
import "./App.css";
import { Routes,Route } from "react-router-dom";
import SearchDropDown from "./components/SearchDropDown";


function App() {
  

  return (
    <>
    <Routes>
      <Route path='/' element ={<HomePage></HomePage>}></Route>
      <Route path='/coins/:coinId' element={<CoinDetail></CoinDetail>}></Route>
    </Routes>  
    </>
  );
}

export default App;
