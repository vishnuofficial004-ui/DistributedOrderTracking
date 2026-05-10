import React, { useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { Link } from "react-router-dom";

const OrdersList = () => {
  const { orders, loading, error } = useContext(AppContext);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet. <Link to="/create">Create one</Link></p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.user?.name || "—"}</td>
                <td>₹{order.totalPrice || 0}</td>
                <td>{order.orderStatus?.status || "PENDING"}</td>
                <td>
                  {order.orderDate
                    ? new Date(order.orderDate).toLocaleDateString("en-IN")
                    : "—"}
                </td>
                <td>
                  <Link to={`/orders/${order.id}`}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrdersList;