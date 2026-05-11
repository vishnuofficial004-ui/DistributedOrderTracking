import React, { useState } from "react";
import {
  AppBar, Toolbar, Typography, Button, Box,
  IconButton, Drawer, List, ListItem,
  ListItemText, useMediaQuery, useTheme, Badge,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { useApp } from "../context/AppContext.jsx";

const navItems = [
  { label: "Dashboard", path: "/" },
  { label: "Orders", path: "/orders" },
  { label: "Create Order", path: "/create" },
  { label: "Products", path: "/products" },
];

const Navbar = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { orders } = useApp();

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: "rgba(26,26,46,0.97)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <LocalShippingIcon sx={{ color: "#e94560", fontSize: 28 }} />
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "#fff", flex: 1, letterSpacing: "-0.02em" }}
          >
            OrderTrack<span style={{ color: "#e94560" }}>.</span>
          </Typography>

          {!isMobile && (
            <Box sx={{ display: "flex", gap: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  sx={{
                    color:
                      location.pathname === item.path
                        ? "#e94560"
                        : "rgba(255,255,255,0.7)",
                    fontWeight: location.pathname === item.path ? 600 : 400,
                    "&:hover": {
                      color: "#fff",
                      background: "rgba(255,255,255,0.06)",
                    },
                    borderRadius: 2,
                  }}
                >
                  {item.label === "Orders" ? (
                    <Badge badgeContent={orders.length} color="error" max={99}>
                      {item.label}
                    </Badge>
                  ) : (
                    item.label
                  )}
                </Button>
              ))}
            </Box>
          )}

          {isMobile && (
            <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: "#fff" }}>
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 240, pt: 2 }}>
          <List>
            {navItems.map((item) => (
              <ListItem
                key={item.path}
                component={Link}
                to={item.path}
                onClick={() => setDrawerOpen(false)}
                sx={{
                  color:
                    location.pathname === item.path
                      ? "primary.main"
                      : "text.primary",
                }}
              >
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Spacer so content doesn't go under the fixed AppBar */}
      <Toolbar />
    </>
  );
};

export default Navbar;