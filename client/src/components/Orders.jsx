// PurchaseOrdersTable.jsx
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  Chip,
  useTheme,
  Tooltip,
  Stack,
} from "@mui/material";
import {
  Inventory2,
  Edit,
  Delete,
  CheckCircle,
  Cancel,
  LocalShipping,
  TaskAlt,
  HighlightOff,
  Person,
  CalendarMonth,
  LocationOn,
  HourglassEmpty,
  AttachMoney,
} from "@mui/icons-material";
import axiosInstance from "../api/axios";

const statusMap = {
  pending: { label: "Pending", color: "warning", icon: <HourglassEmpty /> },
  confirmed: { label: "Confirmed", color: "info", icon: <CheckCircle /> },
  shipped: { label: "Shipped", color: "primary", icon: <LocalShipping /> },
  delivered: { label: "Delivered", color: "success", icon: <TaskAlt /> },
  cancelled: { label: "Cancelled", color: "error", icon: <HighlightOff /> },
};

const PurchaseOrdersTable = () => {
  const theme = useTheme();
  const [orders, setOrders] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    quantity: "",
    pricePerUnit: "",
    deliveryAddress: "",
    deliveryDate: "",
  });

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
    fetchOrders(role);
  }, []);

  const fetchOrders = async (role) => {
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");
    const url =
      role === "farmer"
        ? `/getPurchaseOrdersByFarmer/${id}`
        : `/trader-purchase-orders/${id}`;
    try {
      const { data } = await axiosInstance.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(data.purchaseOrders || []);
    } catch (e) {
      console.error("Fetch failed:", e);
    }
  };

  const handleEditClick = (order) => {
    setEditData({ ...order });
    setEditModalOpen(true);
  };

  const handleDeleteClick = async (orderId) => {
    const token = localStorage.getItem("token");
    await axiosInstance.delete(`/purchase-orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchOrders(userRole);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    const token = localStorage.getItem("token");
    await axiosInstance.patch(
      `/purchase-orders/${orderId}`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchOrders(userRole);
  };

  const handleModalChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => {
      const upd = { ...prev, [name]: value };
      if (name === "quantity" || name === "pricePerUnit") {
        upd.totalAmount = upd.quantity * upd.pricePerUnit;
      }
      return upd;
    });
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    await axiosInstance.patch(
      `/purchase-orders/${editData._id}`,
      {
        quantity: editData.quantity,
        pricePerUnit: editData.pricePerUnit,
        totalAmount: editData.totalAmount,
        deliveryAddress: editData.deliveryAddress,
        deliveryDate: editData.deliveryDate,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setEditModalOpen(false);
    fetchOrders(userRole);
  };

  return (
    <Box p={4} sx={{ background: theme.palette.background.default }}>
      {/* Title */}
      <Box display="flex" alignItems="center" mb={3}>
        <Inventory2 fontSize="large" color="primary" />
        <Typography variant="h5" fontWeight="bold" color="primary" ml={1}>
          Orders List
        </Typography>
      </Box>

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: 4,
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: theme.palette.primary.light }}>
            <TableRow>
              <TableCell sx={{ color: "#000" }}>
                <strong>Goods</strong>
              </TableCell>
              <TableCell sx={{ color: "#000" }}>
                <Inventory2 fontSize="small" sx={{ mr: 0.5 }} />
                Qty
              </TableCell>
              <TableCell sx={{ color: "#000" }}>
                <AttachMoney fontSize="small" sx={{ mr: 0.5 }} />
                Price/Unit
              </TableCell>
              <TableCell sx={{ color: "#000" }}>
                <AttachMoney fontSize="small" sx={{ mr: 0.5 }} />
                Total
              </TableCell>
              <TableCell sx={{ color: "#000" }}>
                <LocationOn fontSize="small" sx={{ mr: 0.5 }} />
                Address
              </TableCell>
              <TableCell sx={{ color: "#000" }}>
                <CalendarMonth fontSize="small" sx={{ mr: 0.5 }} />
                Date
              </TableCell>
              <TableCell sx={{ color: "#000" , maxWidth: 10}} >
                <strong>Status</strong>
              </TableCell>
              <TableCell sx={{ color: "#000" }}>
                <Person fontSize="small" sx={{ mr: 0.5 }} />
                {userRole === "trader" ? "Farmer" : "Trader"}
              </TableCell>
              <TableCell align="center" sx={{ color: "#000" }}>
                <strong>Action</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {orders.map((o) => {
              const st = statusMap[o.status] || {};
              return (
                <TableRow
                  key={o._id}
                  hover
                  sx={{
                    "&:hover": { backgroundColor: theme.palette.action.hover },
                  }}
                >
                  <TableCell>{o.goods?.name}</TableCell>
                  <TableCell>{o.quantity}</TableCell>
                  <TableCell>₹{o.pricePerUnit}</TableCell>
                  <TableCell>₹{o.totalAmount}</TableCell>
                  <TableCell>{o.deliveryAddress}</TableCell>
                  <TableCell>
                    {new Date(o.deliveryDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={st.icon}
                      label={st.label}
                      color={st.color}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Stack spacing={0.5}>
                      <Typography>
                        {userRole === "trader"
                          ? o.goods?.farmer.name
                          : o.trader?.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {userRole === "trader"
                          ? o.goods?.farmer.phone
                          : o.trader?.phone}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="center">
                    {userRole === "trader" ? (
                      <>
                        <Tooltip title="Edit">
                          <Button
                            startIcon={<Edit />}
                            size="small"
                            variant="outlined"
                            sx={{
                              mr: 1,
                              borderColor: theme.palette.info.main,
                              color: theme.palette.info.main,
                            }}
                            onClick={() => handleEditClick(o)}
                          >
                            Edit
                          </Button>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <Button
                            startIcon={<Delete />}
                            size="small"
                            variant="contained"
                            color="error"
                            onClick={() => handleDeleteClick(o._id)}
                          >
                            Delete
                          </Button>
                        </Tooltip>
                      </>
                    ) : (
                      Object.entries(statusMap).map(([key, info]) =>
                        key === o.status ? (
                          <></>
                        ) : (
                          <Tooltip title={info.label} key={key}>
                            <Button
                              disabled={
                                o.status === "cancelled" ||
                                o.status === "delivered"
                                  ? "true"
                                  : ""
                              }
                              size="small"
                              variant="contained"
                              color={info.color}
                              sx={{ mr: 1 }}
                              onClick={() => handleStatusUpdate(o._id, key)}
                            >
                              {info.icon}
                            </Button>
                          </Tooltip>
                        )
                      )
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: "#fff",
          }}
        >
          Update Order
        </DialogTitle>
        <DialogContent dividers>
          <Box
            component="form"
            onSubmit={handleModalSubmit}
            sx={{ display: "grid", gap: 2, pt: 1 }}
          >
            <TextField
              label="Quantity"
              name="quantity"
              type="number"
              value={editData.quantity}
              onChange={handleModalChange}
              fullWidth
            />
            <TextField
              label="Price/Unit"
              name="pricePerUnit"
              type="number"
              value={editData.pricePerUnit}
              onChange={handleModalChange}
              fullWidth
            />
            <TextField
              label="Delivery Address"
              name="deliveryAddress"
              value={editData.deliveryAddress}
              onChange={handleModalChange}
              fullWidth
            />
            <TextField
              label="Delivery Date"
              name="deliveryDate"
              type="date"
              value={editData.deliveryDate?.split("T")[0] || ""}
              onChange={handleModalChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setEditModalOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" type="submit">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PurchaseOrdersTable;
