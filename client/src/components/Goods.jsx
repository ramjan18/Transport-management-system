// Goods.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
  Chip,
  useTheme,
  Grid,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Inventory2,
  AttachMoney,
  CalendarMonth,
  LocationOn,
  Person,
  Phone,
  LocalShipping,
} from "@mui/icons-material";
import axiosInstance from "../api/axios";

const Goods = () => {
  const theme = useTheme();
  const [goods, setGoods] = useState([]);
  const [openGood, setOpenGood] = useState(false);
  const [openOrder, setOpenOrder] = useState(false);
  const [current, setCurrent] = useState(null);
  const [form, setForm] = useState({
    name: "",
    quantity: "",
    pricePerUnit: "",
    unit: "kg",
    description: "",
    available: true,
  });
  const [order, setOrder] = useState({
    quantity: 1,
    deliveryAddress: "",
    deliveryDate: "",
  });
  const role = localStorage.getItem("userRole");

  useEffect(() => {
    fetchGoods();
  }, []);

  const fetchGoods = async () => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    const url = role === "farmer" ? `/getFarmerGoods/${id}` : "/getAllGoods";
    const res = await axiosInstance.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setGoods(res.data.goods || []);
  };

  const openGoodDialog = (g = null) => {
    setCurrent(g);
    setForm(
      g
        ? { ...g }
        : {
            name: "",
            quantity: "",
            pricePerUnit: "",
            unit: "kg",
            description: "",
            available: true,
          }
    );
    setOpenGood(true);
  };
  const closeGoodDialog = () => setOpenGood(false);

  const openOrderDialog = (g) => {
    setCurrent(g);
    setOrder({ quantity: 1, deliveryAddress: "", deliveryDate: "" });
    setOpenOrder(true);
  };
  const closeOrderDialog = () => setOpenOrder(false);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const submitGood = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    if (current) {
      await axiosInstance.patch(`/goods/${current._id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      await axiosInstance.post(
        "/createGoods",
        { ...form, farmer: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
    fetchGoods();
    closeGoodDialog();
  };

  const deleteGood = async (id) => {
    if (window.confirm("Are you sure you want to delete this good?")) {
      const token = localStorage.getItem("token");
      await axiosInstance.delete(`/goods/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchGoods();
    }
  };

  const handleOrderChange = (e) => {
    const { name, value } = e.target;
    setOrder((o) => ({ ...o, [name]: value }));
  };

  const submitOrder = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const trader = localStorage.getItem("id");
    await axiosInstance.post(
      "/purchase-orders",
      {
        trader,
        goods: current._id,
        quantity: order.quantity,
        pricePerUnit: current.pricePerUnit,
        totalAmount: order.quantity * current.pricePerUnit,
        deliveryAddress: order.deliveryAddress,
        deliveryDate: order.deliveryDate,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    closeOrderDialog();
    alert("Order placed successfully!");
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          <Inventory2 sx={{ verticalAlign: "middle", mr: 1 }} />
          Goods Inventory
        </Typography>
        {role === "farmer" && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => openGoodDialog()}
            sx={{ backgroundColor: theme.palette.success.main }}
          >
            Add Good
          </Button>
        )}
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: theme.palette.primary.light }}>
            <TableRow>
              <TableCell>
                <strong>#</strong>
              </TableCell>
              <TableCell>
                <Inventory2 sx={{ mr: 1 }} />
                Name
              </TableCell>
              <TableCell>Qty</TableCell>
              <TableCell>
                <AttachMoney sx={{ mr: 1 }} />
                Price/Unit
              </TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Available</TableCell>
              {role !== "farmer" && (
                <>
                  <TableCell>
                    <Person sx={{ mr: 1 }} />
                    Farmer
                  </TableCell>
                  <TableCell>
                    <Phone sx={{ mr: 1 }} />
                    Phone
                  </TableCell>
                </>
              )}
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {goods.length === 0 ? (
              <TableRow>
                <TableCell colSpan={role === "farmer" ? 8 : 10} align="center">
                  No goods found.
                </TableCell>
              </TableRow>
            ) : (
              goods.map((g, i) => (
                <TableRow key={g._id} hover>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{g.name}</TableCell>
                  <TableCell>{g.quantity}</TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      color: theme.palette.success.dark,
                    }}
                  >
                    ₹{g.pricePerUnit}
                  </TableCell>
                  <TableCell>{g.unit}</TableCell>
                  <TableCell>{g.description || "-"}</TableCell>
                  <TableCell>
                    <Chip
                      label={g.available ? "Yes" : "No"}
                      color={g.available ? "success" : "error"}
                      size="small"
                    />
                  </TableCell>
                  {role !== "farmer" && (
                    <>
                      <TableCell>{g.farmer?.name}</TableCell>
                      <TableCell>{g.farmer?.phone}</TableCell>
                    </>
                  )}
                  <TableCell align="center">
                    {role === "farmer" ? (
                      <>
                        <Tooltip title="Edit">
                          <IconButton
                            color="primary"
                            onClick={() => openGoodDialog(g)}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            onClick={() => deleteGood(g._id)}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </>
                    ) : (
                      <Button
                        startIcon={<LocalShipping />}
                        variant="contained"
                        size="small"
                        onClick={() => openOrderDialog(g)}
                        sx={{
                          background: `linear-gradient(to right, ${theme.palette.secondary.main}, )`,
                          color: "#fff",
                          borderRadius: 3,
                          textTransform: "none",
                          "&:hover": {
                            background: `linear-gradient(to right, ${theme.palette.secondary.dark}, ${theme.palette.secondary.main})`,
                          },
                        }}
                      >
                        Order
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Good Dialog */}
      <Dialog open={openGood} onClose={closeGoodDialog} maxWidth="xs" fullWidth>
        <DialogTitle>{current ? "Edit Good" : "Add Good"}</DialogTitle>
        <DialogContent dividers>
          <Box component="form" sx={{ display: "grid", gap: 2 }}>
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleFormChange}
              fullWidth
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Quantity"
                  name="quantity"
                  type="number"
                  value={form.quantity}
                  onChange={handleFormChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Price/Unit"
                  name="pricePerUnit"
                  type="number"
                  value={form.pricePerUnit}
                  onChange={handleFormChange}
                  fullWidth
                />
              </Grid>
            </Grid>
            <TextField
              label="Unit"
              name="unit"
              value={form.unit}
              onChange={handleFormChange}
              fullWidth
            />
            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleFormChange}
              fullWidth
              multiline
              rows={2}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="available"
                  checked={form.available}
                  onChange={handleFormChange}
                />
              }
              label="Available"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeGoodDialog}>Cancel</Button>
          <Button variant="contained" onClick={submitGood}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Order Dialog */}
      <Dialog
        open={openOrder}
        onClose={closeOrderDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Place Order</DialogTitle>
        <DialogContent dividers>
          <Box component="form" sx={{ display: "grid", gap: 2 }}>
            <TextField
              label="Quantity"
              name="quantity"
              type="number"
              value={order.quantity}
              onChange={handleOrderChange}
              fullWidth
            />
            <TextField
              label="Delivery Address"
              name="deliveryAddress"
              value={order.deliveryAddress}
              onChange={handleOrderChange}
              fullWidth
            />
            <TextField
              label="Delivery Date"
              name="deliveryDate"
              type="date"
              value={order.deliveryDate}
              onChange={handleOrderChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeOrderDialog}>Cancel</Button>
          <Button variant="contained" color="success" onClick={submitOrder}>
            Order
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Goods;
