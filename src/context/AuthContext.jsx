import { createContext, useContext, useState, useEffect } from "react";
const AuthContext = createContext();
const API_URL = import.meta.env.VITE_APP_URL;

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {

    fetch(`${API_URL}/api/auth/me`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          setIsAuthenticated(true);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));

  }, []);

  const login = () => {
    fetch(`${API_URL}/api/auth/me`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          setIsAuthenticated(true);
        }
      });
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
    <AuthContext.Provider value={{  user, isAuthenticated,login, logout,loading }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
