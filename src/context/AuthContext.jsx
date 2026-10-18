import { createContext, useContext, useState, useEffect } from "react";
const AuthContext = createContext();
const API_URL = import.meta.env.VITE_APP_URL;

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/auth/me`, {
      credentials: "include",
    })
      .then((res) => {
        console.log("/me status", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("/me data:", data);
        if (data.user) {
          setUser(data.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        setUser(null);
        setIsAuthenticated(false);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async () => {
    const res = await fetch(`${API_URL}/api/auth/me`, {
      credentials: "include",
    });
    const data = await res.json();
    if (res.ok && data.user) {
      setUser(data.user);
      setIsAuthenticated(true);
    }
  };

  const logout = async () => {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    setIsAuthenticated(false);
  };
  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
