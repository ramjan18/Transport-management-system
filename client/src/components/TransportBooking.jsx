// TransportBookingTable.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Tooltip,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  useTheme,
  Stack,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Person,
  Phone,
  LocationOn,
  Straighten,
  AttachMoney,
  Edit,
  Delete,
  Payment,
  CreditCard,
} from "@mui/icons-material";
import axiosInstance from "../api/axios";

const statusColors = {
  pending: { color: "warning", label: "Pending" },
  accepted: { color: "success", label: "Accepted" },
  completed: { color: "info", label: "Completed" },
  cancelled: { color: "error", label: "Cancelled" },
};

const TransportBookingTable = () => {
  const theme = useTheme();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState({});

  // Payment dialog state
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
  });

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
    fetchBookings(role);
  }, []);

  const fetchBookings = async (role) => {
    setLoading(true);
    try {
      const id = localStorage.getItem("id");
      const url =
        role === "transporter"
          ? `/getBookingsByTransporterId/${id}`
          : `/getBookingsByFarmerId/${id}`;
      const { data } = await axiosInstance.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setBookings(data.bookings || []);
    } catch (err) {
      console.error("Fetch bookings error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (id, action) => async () => {
    await axiosInstance.patch(
      `/bookings/${id}`,
      { bookingStatus: action },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    fetchBookings(userRole);
  };

  const handleEdit = (b) => {
    setEditData({ ...b });
    setEditOpen(true);
  };
  const handleDelete = (id) => async () => {
    await axiosInstance.delete(`/bookings/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    fetchBookings(userRole);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const upd = { ...editData, [name]: +value || value };
    if (name === "distanceInKm" || name === "transportRatePerKm") {
      upd.totalCost = upd.distanceInKm * upd.transportRatePerKm;
    }
    setEditData(upd);
  };

  const handleSave = async () => {
    await axiosInstance.patch(`/bookings/${editData._id}`, editData, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setEditOpen(false);
    fetchBookings(userRole);
  };

  // --- PAYMENT HANDLERS ---
  const openPaymentDialog = (booking) => {
    setCurrentBooking(booking);
    setPaymentMethod("");
    setCardDetails({ number: "", expiry: "", cvv: "" });
    setPaymentOpen(true);
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((cd) => ({ ...cd, [name]: value }));
  };

  const confirmPayment = async () => {
    if (!currentBooking) return;

    // send paymentStatus to backend
    await axiosInstance.patch(
      `/bookings/${currentBooking._id}`,
      { paymentStatus: "paid" },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );

    setPaymentOpen(false);
    fetchBookings(userRole);
  };

  if (loading) {
    return (
      <Box p={4} textAlign="center">
        <Typography>Loading…</Typography>
      </Box>
    );
  }

  return (
    <Box p={4} sx={{ background: theme.palette.background.default }}>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={3}>
        <DashboardIcon fontSize="large" color="primary" />
        <Typography variant="h5" fontWeight="bold" color="primary" ml={1}>
          Transport Bookings
        </Typography>
      </Box>

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{ borderRadius: 3, boxShadow: 4, overflow: "hidden" }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: theme.palette.primary.light }}>
            <TableRow>
              <TableCell sx={{ color: "#000" }}>#</TableCell>
              <TableCell sx={{ color: "#000" }}>
                <Person fontSize="small" sx={{ mr: 0.5 }} />
                {userRole === "transporter" ? "Farmer" : "Transporter"}
              </TableCell>
              <TableCell sx={{ color: "#000" }}>
                <Phone fontSize="small" sx={{ mr: 0.5 }} />
                Phone
              </TableCell>
              <TableCell sx={{ color: "#000" }}>
                <LocationOn fontSize="small" sx={{ mr: 0.5 }} />
                Pickup
              </TableCell>
              <TableCell sx={{ color: "#000" }}>
                <LocationOn fontSize="small" sx={{ mr: 0.5 }} />
                Drop
              </TableCell>
              <TableCell sx={{ color: "#000" }}>
                <Straighten fontSize="small" sx={{ mr: 0.5 }} />
                Distance
              </TableCell>
              <TableCell sx={{ color: "#000" }}>
                <AttachMoney fontSize="small" sx={{ mr: 0.5 }} />
                Cost
              </TableCell>
              <TableCell sx={{ color: "#000" }}>Status</TableCell>
              <TableCell sx={{ color: "#000" }}>Payment</TableCell>
              <TableCell align="center" sx={{ color: "#000" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 4 }}>
                  <Typography color="textSecondary">
                    No bookings found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {bookings.map((b, i) => {
              const stat = statusColors[b.bookingStatus] || {};
              const isPaid = b.paymentStatus === "paid";
              return (
                <TableRow
                  key={b._id}
                  hover
                  sx={{
                    "&:nth-of-type(odd)": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>
                    {
                      (userRole === "transporter" ? b.farmer : b.transporter)
                        ?.name
                    }
                  </TableCell>
                  <TableCell>
                    {
                      (userRole === "transporter" ? b.farmer : b.transporter)
                        ?.phone
                    }
                  </TableCell>
                  <TableCell>{b.pickupLocation}</TableCell>
                  <TableCell>{b.dropLocation}</TableCell>
                  <TableCell>{b.distanceInKm}</TableCell>
                  <TableCell
                    sx={{
                      color: theme.palette.secondary.main,
                      fontWeight: 600,
                    }}
                  >
                    ₹{b.totalCost}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={stat.label || b.bookingStatus}
                      color={stat.color}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={isPaid ? "Paid" : "Unpaid"}
                      color={isPaid ? "success" : "warning"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    {userRole !== "transporter" ? (
                      <>
                        {/* Edit/Delete */}
                        <Tooltip title="Edit">
                          <Button
                            startIcon={<Edit />}
                            size="small"
                            variant="outlined"
                            color="info"
                            onClick={() => handleEdit(b)}
                            sx={{ mr: 1, textTransform: "none" }}
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
                            onClick={handleDelete(b._id)}
                            sx={{ mr: 1, textTransform: "none" }}
                          >
                            Delete
                          </Button>
                        </Tooltip>

                        {/* Pay button when accepted & not yet paid */}
                        {b.bookingStatus === "accepted" && !isPaid && (
                          <Tooltip title="Pay">
                            <IconButton
                              color="secondary"
                              onClick={() => openPaymentDialog(b)}
                            >
                              <Payment />
                            </IconButton>
                          </Tooltip>
                        )}
                      </>
                    ) : (
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                      >
                        {["accepted", "cancelled", "completed"].map(
                          (action) => (
                            <Tooltip
                              key={action}
                              title={
                                action.charAt(0).toUpperCase() + action.slice(1)
                              }
                            >
                              <span>
                                <Button
                                  size="small"
                                  variant="contained"
                                  color={statusColors[action]?.color}
                                  disabled={
                                    (action === "accepted" &&
                                      b.bookingStatus !== "pending") ||
                                    (action === "completed" &&
                                      b.bookingStatus !== "accepted") ||
                                    (action === "cancelled" &&
                                      b.bookingStatus !== "pending")
                                  }
                                  onClick={handleAction(b._id, action)}
                                  sx={{ textTransform: "none" }}
                                >
                                  {action.charAt(0).toUpperCase() +
                                    action.slice(1)}
                                </Button>
                              </span>
                            </Tooltip>
                          )
                        )}
                      </Stack>
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
        open={editOpen}
        onClose={() => setEditOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Edit Booking</DialogTitle>
        <DialogContent dividers>
          <Box component="form" display="grid" gap={2} pt={1}>
            <TextField
              label="Distance (Km)"
              name="distanceInKm"
              type="number"
              fullWidth
              value={editData.distanceInKm || ""}
              onChange={handleChange}
            />
            <TextField
              label="Rate Per Km"
              name="transportRatePerKm"
              type="number"
              fullWidth
              value={editData.transportRatePerKm || ""}
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Total Cost"
              name="totalCost"
              type="number"
              fullWidth
              value={editData.totalCost || ""}
              InputProps={{ readOnly: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setEditOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          sx={{ backgroundColor: theme.palette.primary.main, color: "#fff" }}
        >
          Make Payment
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} alignItems="center" pt={1}>
            <Stack direction="row" spacing={2}>
              <Button
                variant={paymentMethod === "upi" ? "contained" : "outlined"}
                onClick={() => setPaymentMethod("upi")}
              >
                UPI
              </Button>
              <Button
                variant={paymentMethod === "card" ? "contained" : "outlined"}
                startIcon={<CreditCard />}
                onClick={() => setPaymentMethod("card")}
              >
                Card
              </Button>
            </Stack>

            {paymentMethod === "upi" && (
              <Box textAlign="center" mt={2}>
                <img
                  src="https://via.placeholder.com/200?text=UPI+QR+Code"
                  alt="UPI QR Code"
                  style={{ maxWidth: "100%" }}
                />
                <Typography variant="caption" display="block" mt={1}>
                  Scan this QR with your UPI app
                </Typography>
              </Box>
            )}

            {paymentMethod === "card" && (
              <Box component="form" display="grid" gap={2} width="100%">
                <TextField
                  label="Card Number"
                  name="number"
                  value={cardDetails.number}
                  onChange={handleCardChange}
                  fullWidth
                />
                <TextField
                  label="Expiry"
                  name="expiry"
                  type="month"
                  value={cardDetails.expiry}
                  onChange={handleCardChange}
                  fullWidth
                />
                <TextField
                  label="CVV"
                  name="cvv"
                  type="password"
                  inputProps={{ maxLength: 3 }}
                  value={cardDetails.cvv}
                  onChange={handleCardChange}
                  fullWidth
                />
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPaymentOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            disabled={
              !paymentMethod ||
              (paymentMethod === "card" &&
                (!cardDetails.number ||
                  !cardDetails.expiry ||
                  !cardDetails.cvv))
            }
            onClick={confirmPayment}
          >
            Pay
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TransportBookingTable;
