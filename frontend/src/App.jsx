import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AppProvider } from "./context/AppContext.jsx";
import OrdersList from "./pages/OrdersList.jsx";
import OrderForm from "./pages/OrderForm.jsx";
import OrderDetails from "./pages/OrderDetails.jsx";

const App = () => {
  return (
    <AppProvider>
      <Router>
        <nav style={{ padding: "16px", borderBottom: "1px solid #ccc", marginBottom: "8px" }}>
          <Link to="/orders" style={{ marginRight: "16px" }}>Orders</Link>
          <Link to="/create">Create Order</Link>
        </nav>
        <Routes>
          <Route path="/" element={<OrdersList />} />
          <Route path="/orders" element={<OrdersList />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
          <Route path="/create" element={<OrderForm />} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;