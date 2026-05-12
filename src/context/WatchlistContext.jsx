import { useState, useEffect, createContext, useContext } from "react";
import { useAuth } from "./AuthContext";

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
	const [watchlist, setWatchlist] = useState([]);
	const { token } = useAuth();
	const API_URL = import.meta.env.VITE_APP_URL;
    useEffect(()=>{
        if(!token)
        {
            setWatchlist([])
            return 
        }
        const getWatchlist=async()=>{
      try{
         const response= await fetch(`${API_URL}/api/watchlist`,{
            method:'GET',
            headers:`Bearer ${token}`,
         })
         const data= response.json();
         setWatchlist(data)
         

      }catch(error){

      }
    }

    },[token])


	return <div>WatchlistContext</div>;
};
