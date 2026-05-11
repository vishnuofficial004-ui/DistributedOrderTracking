import React from "react";
import { Snackbar, Alert } from "@mui/material";
import { useApp } from "../context/AppContext.jsx";

const Notification = () => {
  const { notification } = useApp();
  if (!notification) return null;
  return (
    <Snackbar
      open
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      sx={{ mt: 8 }}
    >
      <Alert
        severity={notification.type}
        variant="filled"
        sx={{ borderRadius: 2, minWidth: 280 }}
      >
        {notification.message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;