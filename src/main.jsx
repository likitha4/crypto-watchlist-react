import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { WatchlistProvider } from './context/WatchlistContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <WatchlistProvider>
    <BrowserRouter>
    <App />
    </BrowserRouter>
    </WatchlistProvider>
    </AuthProvider>
  </StrictMode>,
)
