// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    const data = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.data.token);
    setUser(data.data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const fetchUser = async () => {
    try {
      const response = await api.get("/users/me");
      setUser(response.data);
    } catch (err) {
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetchUser();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
