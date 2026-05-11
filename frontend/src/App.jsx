import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline, Box, CircularProgress } from "@mui/material";
import { AppProvider } from "./context/AppContext.jsx";
import theme from "./theme/theme.js";
import Navbar from "./components/Navbar.jsx";
import Notification from "./components/Notification.jsx";

const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const OrdersList = lazy(() => import("./pages/OrdersList.jsx"));
const OrderDetails = lazy(() => import("./pages/OrderDetails.jsx"));
const OrderForm = lazy(() => import("./pages/OrderForm.jsx"));
const Products = lazy(() => import("./pages/Products.jsx"));

const Loading = () => (
  <Box sx={{ display: "flex", justifyContent: "center",
    alignItems: "center", minHeight: "60vh" }}>
    <CircularProgress />
  </Box>
);

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <Router>
          <Navbar />
          <Box component="main" sx={{ minHeight: "100vh", bgcolor: "background.default", pt: 1 }}>
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/orders" element={<OrdersList />} />
                <Route path="/orders/:id" element={<OrderDetails />} />
                <Route path="/create" element={<OrderForm />} />
                <Route path="/products" element={<Products />} />
              </Routes>
            </Suspense>
          </Box>
          <Notification />
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
};

export default App;