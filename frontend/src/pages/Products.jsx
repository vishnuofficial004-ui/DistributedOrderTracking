import React, { useState } from "react";
import {
  Box, Typography, Card, CardContent, Grid, Button,
  TextField, Dialog, DialogTitle, DialogContent,
  DialogActions, CircularProgress, IconButton,
  Tooltip, InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import InventoryIcon from "@mui/icons-material/Inventory";
import { useApp } from "../context/AppContext.jsx";
import { createProduct, updateProduct, deleteProduct } from "../api/api.js";

// add these to api.js too — see Step 7
const emptyForm = { name: "", price: "" };

const Products = () => {
  const { products, fetchAllData, showNotification } = useApp();
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState({
    open: false, mode: "create", data: emptyForm, id: null,
  });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  const validate = () => {
    const e = {};
    if (!dialog.data.name.trim()) e.name = "Name is required";
    if (!dialog.data.price || isNaN(dialog.data.price) || +dialog.data.price <= 0)
      e.price = "Valid price required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = { name: dialog.data.name.trim(), price: +dialog.data.price };
      if (dialog.mode === "create") await createProduct(payload);
      else await updateProduct(dialog.id, payload);
      showNotification(`Product ${dialog.mode === "create" ? "created" : "updated"}!`);
      fetchAllData();
      setDialog({ open: false, mode: "create", data: emptyForm, id: null });
    } catch {
      showNotification("Failed to save product", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProduct(deleteDialog.id);
      showNotification("Product deleted.");
      fetchAllData();
      setDeleteDialog({ open: false, id: null });
    } catch {
      showNotification("Failed to delete product", "error");
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: "auto" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between",
        alignItems: "flex-start", mb: 4, flexWrap: "wrap", gap: 2 }}>
        <Box>
          <Typography variant="h4">Products</Typography>
          <Typography color="text.secondary">{filtered.length} products</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialog({ open: true, mode: "create", data: emptyForm, id: null })}
        >
          Add Product
        </Button>
      </Box>

      <TextField
        placeholder="Search products…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3, width: { xs: "100%", sm: 320 } }}
      />

      <Grid container spacing={2}>
        {filtered.length === 0 ? (
          <Grid item xs={12}>
            <Card sx={{ p: 6, textAlign: "center" }}>
              <InventoryIcon sx={{ fontSize: 48, color: "text.disabled", mb: 2 }} />
              <Typography color="text.secondary">
                No products yet. Add your first product!
              </Typography>
            </Card>
          </Grid>
        ) : (
          filtered.map((p) => (
            <Grid item xs={12} sm={6} md={4} key={p.id}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between",
                    alignItems: "flex-start", mb: 1 }}>
                    <Typography variant="h6" fontWeight={600} sx={{ flex: 1, mr: 1 }}>
                      {p.name}
                    </Typography>
                    <Box>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => setDialog({
                            open: true, mode: "edit",
                            data: { name: p.name, price: p.price }, id: p.id,
                          })}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteDialog({ open: true, id: p.id })}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Typography variant="h5" fontWeight={700} color="primary" sx={{ mt: 2 }}>
                    ₹{(p.price || 0).toLocaleString("en-IN")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Create / Edit Dialog */}
      <Dialog
        open={dialog.open}
        onClose={() => setDialog({ open: false, mode: "create", data: emptyForm, id: null })}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          {dialog.mode === "create" ? "Add Product" : "Edit Product"}
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
          <TextField
            label="Product Name"
            value={dialog.data.name}
            onChange={(e) =>
              setDialog((prev) => ({ ...prev, data: { ...prev.data, name: e.target.value } }))
            }
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
          />
          <TextField
            label="Price (₹)"
            value={dialog.data.price}
            onChange={(e) =>
              setDialog((prev) => ({ ...prev, data: { ...prev.data, price: e.target.value } }))
            }
            error={!!errors.price}
            helperText={errors.price}
            type="number"
            fullWidth
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() =>
            setDialog({ open: false, mode: "create", data: emptyForm, id: null })}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? <CircularProgress size={18} /> : dialog.mode === "create" ? "Create" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, id: null })}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Product?</DialogTitle>
        <DialogContent>
          <Typography>This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialog({ open: false, id: null })}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Products;