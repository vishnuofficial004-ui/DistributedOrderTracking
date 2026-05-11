import React, { createContext, useState, useEffect, useContext } from "react";
import { getOrders, getUsers, getProducts } from "../api/api.js";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [ordersRes, usersRes, productsRes] = await Promise.all([
        getOrders(),
        getUsers(),
        getProducts(),
      ]);
      setOrders(ordersRes?.data || []);
      setUsers(usersRes?.data || []);
      setProducts(productsRes?.data || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <AppContext.Provider
      value={{
        orders, setOrders,
        users, setUsers,
        products, setProducts,
        loading, error,
        fetchAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
import React, { createContext, useState, useEffect, useCallback, useContext } from "react";
import { getOrders, getUsers, getProducts } from "../api/api.js";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  }, []);

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [ordersRes, usersRes, productsRes] = await Promise.all([
        getOrders(),
        getUsers(),
        getProducts(),
      ]);
      setOrders(ordersRes?.data || []);
      setUsers(usersRes?.data || []);
      setProducts(productsRes?.data || []);
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to fetch data from server.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, []);

  return (
    <AppContext.Provider
      value={{
        orders, setOrders,
        users, setUsers,
        products, setProducts,
        loading, error,
        notification,
        fetchAllData,
        showNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};