import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { createOrder } from "../api/api.js";
import { useNavigate } from "react-router-dom";

const OrderForm = () => {
  const { users, products, fetchAllData, loading } = useContext(AppContext);
  const navigate = useNavigate();

  const [selectedUser, setSelectedUser] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleProductToggle = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!selectedUser) {
      setMessage("Please select a customer.");
      return;
    }
    if (selectedProducts.length === 0) {
      setMessage("Please select at least one product.");
      return;
    }

    setSubmitting(true);
    try {
      await createOrder({
        userId: Number(selectedUser),
        productIds: selectedProducts,
      });
      setMessage("Order created successfully!");
      fetchAllData();
      setTimeout(() => navigate("/orders"), 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to create order.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "500px" }}>
      <h2>Create New Order</h2>
      <form onSubmit={handleSubmit}>

        {/* User select */}
        <div style={{ marginBottom: "16px" }}>
          <label><strong>Customer</strong></label><br />
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          >
            <option value="">-- Select a customer --</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.email})
              </option>
            ))}
          </select>
        </div>

        {/* Products checkboxes */}
        <div style={{ marginBottom: "16px" }}>
          <label><strong>Products</strong></label>
          <div style={{ marginTop: "8px" }}>
            {products.map((p) => (
              <div key={p.id} style={{ marginBottom: "6px" }}>
                <label>
                  <input
                    type="checkbox"
                    value={p.id}
                    checked={selectedProducts.includes(p.id)}
                    onChange={() => handleProductToggle(p.id)}
                    style={{ marginRight: "8px" }}
                  />
                  {p.name} — ₹{p.price}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        {selectedProducts.length > 0 && (
          <div style={{ marginBottom: "16px" }}>
            <strong>Total: ₹{
              selectedProducts.reduce((sum, pid) => {
                const p = products.find((pr) => pr.id === pid);
                return sum + (p?.price || 0);
              }, 0)
            }</strong>
          </div>
        )}

        {message && (
          <p style={{ color: message.includes("success") ? "green" : "red" }}>
            {message}
          </p>
        )}

        <button type="submit" disabled={submitting} style={{ padding: "10px 24px" }}>
          {submitting ? "Placing order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
};

export default OrderForm;