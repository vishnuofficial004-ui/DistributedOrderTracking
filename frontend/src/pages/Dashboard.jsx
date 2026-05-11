import React from "react";
import {
  Box, Grid, Card, CardContent, Typography, Chip,
  Table, TableBody, TableCell, TableHead, TableRow,
  CircularProgress, Button, Avatar,
} from "@mui/material";
import { Link } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useApp } from "../context/AppContext.jsx";

const statusColor = (status) => {
  const map = {
    PENDING: "warning",
    PROCESSING: "info",
    SHIPPED: "primary",
    DELIVERED: "success",
    CANCELLED: "error",
  };
  return map[status?.toUpperCase()] || "default";
};

const StatCard = ({ icon, label, value, color }) => (
  <Card>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 1, fontWeight: 500, textTransform: "uppercase",
              letterSpacing: "0.05em", fontSize: "0.72rem" }}
          >
            {label}
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {value}
          </Typography>
        </Box>
        <Avatar sx={{ bgcolor: `${color}.100`, color: `${color}.main`, width: 48, height: 48 }}>
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { orders, users, products, loading } = useApp();

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const recentOrders = [...orders].slice(0, 5);

  if (loading) return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 12 }}>
      <CircularProgress size={40} />
    </Box>
  );

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: "auto" }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 0.5 }}>Dashboard</Typography>
        <Typography color="text.secondary">
          Welcome back — here's what's happening today.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<ShoppingCartIcon />}
            label="Total Orders"
            value={orders.length}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<TrendingUpIcon />}
            label="Revenue"
            value={`₹${totalRevenue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<PeopleIcon />}
            label="Users"
            value={users.length}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={<InventoryIcon />}
            label="Products"
            value={products.length}
            color="warning"
          />
        </Grid>
      </Grid>

      <Card>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between",
            alignItems: "center", p: 3, pb: 2 }}>
            <Typography variant="h6">Recent Orders</Typography>
            <Button component={Link} to="/orders" endIcon={<ArrowForwardIcon />} size="small">
              View all
            </Button>
          </Box>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Items</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6, color: "text.secondary" }}>
                    No orders yet.{" "}
                    <Link to="/create" style={{ fontWeight: 600 }}>
                      Create one →
                    </Link>
                  </TableCell>
                </TableRow>
              ) : (
                recentOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    hover
                    component={Link}
                    to={`/orders/${order.id}`}
                    sx={{ cursor: "pointer", textDecoration: "none" }}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight={600} color="primary">
                        #{order.id}
                      </Typography>
                    </TableCell>
                    <TableCell>{order.user?.name || "—"}</TableCell>
                    <TableCell>{order.products?.length ?? 0} items</TableCell>
                    <TableCell>₹{(order.totalPrice || 0).toLocaleString("en-IN")}</TableCell>
                    <TableCell>
                      <Chip
                        label={order.orderStatus?.status || "PENDING"}
                        color={statusColor(order.orderStatus?.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: "0.82rem", color: "text.secondary" }}>
                      {order.orderDate
                        ? new Date(order.orderDate).toLocaleDateString("en-IN")
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;