import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById } from "../api/api.js";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrderById(id);
        setOrder(res.data);
      } catch {
        setError("Order not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <Link to="/orders">← Back to Orders</Link>
      <h2 style={{ marginTop: "16px" }}>Order #{order.id}</h2>

      <p><strong>Customer:</strong> {order.user?.name} ({order.user?.email})</p>
      <p><strong>Total Price:</strong> ₹{order.totalPrice}</p>
      <p><strong>Status:</strong> {order.orderStatus?.status || "PENDING"}</p>
      <p><strong>Date:</strong> {
        order.orderDate
          ? new Date(order.orderDate).toLocaleDateString("en-IN")
          : "—"
      }</p>

      <h3 style={{ marginTop: "16px" }}>Products</h3>
      {order.products?.length === 0 ? (
        <p>No products.</p>
      ) : (
        <ul>
          {order.products?.map((p) => (
            <li key={p.id}>
              {p.name} — ₹{p.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderDetails;