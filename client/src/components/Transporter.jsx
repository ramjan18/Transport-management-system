// TransportersTable.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
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
  Stack,
} from "@mui/material";
import {
  DirectionsCar,
  Person,
  Phone,
  LocationOn,
  Straighten,
  AttachMoney,
  Edit,
  Delete,
  Add,
  LocalShipping,
} from "@mui/icons-material";
import axiosInstance from "../api/axios";

const statusColors = {
  pending: { color: "warning", label: "Pending" },
  accepted: { color: "success", label: "Accepted" },
  completed: { color: "info", label: "Completed" },
  cancelled: { color: "error", label: "Cancelled" },
};

const TransportersTable = () => {
  const theme = useTheme();
  const [transporters, setTransporters] = useState([]);
  const [role, setRole] = useState("");
  const [userId, setUserId] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [current, setCurrent] = useState({
    vehicleNumber: "",
    vehicleType: "",
    transportRatePerKm: "",
    available: false,
  });
  const [requestData, setRequestData] = useState({
    pickupLocation: "",
    dropLocation: "",
    distanceInKm: "",
    transportRatePerKm: "",
  });

  useEffect(() => {
    const r = localStorage.getItem("userRole");
    const id = localStorage.getItem("id");
    setRole(r);
    setUserId(id);
    fetchTransporters(r, id);
  }, []);

  const fetchTransporters = async (r, id) => {
    const token = localStorage.getItem("token");
    const url =
      r === "transporter"
        ? `/getTransporterByUser/${id}`
        : `/getAllTransporters`;
    const { data } = await axiosInstance.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTransporters(data.transporters || []);
  };

  const openAdd = () => {
    setIsEditMode(false);
    setCurrent({
      vehicleNumber: "",
      vehicleType: "",
      transportRatePerKm: "",
      available: false,
    });
    setEditOpen(true);
  };
  const openEdit = (t) => {
    setIsEditMode(true);
    setCurrent({ ...t });
    setEditOpen(true);
  };
  const saveTransporter = async () => {
    const token = localStorage.getItem("token");
    const payload = { ...current, user: userId };
    if (isEditMode) {
      await axiosInstance.patch(`/editTransporter/${current._id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      await axiosInstance.post("/createtransporter", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    setEditOpen(false);
    fetchTransporters(role, userId);
  };
  const deleteTransporter = async (id) => {
    if (!window.confirm("Delete this vehicle?")) return;
    const token = localStorage.getItem("token");
    await axiosInstance.delete(`/deleteTransporter/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchTransporters(role, userId);
  };

  const openRequest = (t) => {
    setCurrent(t);
    setRequestData({
      pickupLocation: "",
      dropLocation: "",
      distanceInKm: "",
      transportRatePerKm: t.transportRatePerKm,
    });
    setRequestOpen(true);
  };
  const sendRequest = async () => {
    const token = localStorage.getItem("token");
    const farmer = localStorage.getItem("id");
    const payload = {
      farmer,
      transporter: current._id,
      ...requestData,
      totalCost:
        Number(requestData.distanceInKm) *
        Number(requestData.transportRatePerKm),
    };
    await axiosInstance.post("/book", payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRequestOpen(false);
    alert("Request sent!");
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrent((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleRequestChange = (e) => {
    const { name, value } = e.target;
    setRequestData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Box p={4} sx={{ background: theme.palette.background.default }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <DirectionsCar fontSize="large" color="primary" />
          <Typography variant="h5" fontWeight="bold" color="primary">
            Transporters
          </Typography>
        </Stack>

        {role === "transporter" && (
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{
              background: `linear-gradient(to right, ${theme.palette.success.main}, )`,
              color: "#fff",
              borderRadius: 3,
              "&:hover": {
                background: `linear-gradient(to right, ${theme.palette.success.dark}, ${theme.palette.success.main})`,
              },
            }}
            onClick={openAdd}
          >
            Add Vehicle
          </Button>
        )}
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
              {role !== "transporter" && (
                <>
                  <TableCell sx={{ color: "#000" }}>
                    <Person fontSize="small" sx={{ mr: 0.5 }} />
                    Name
                  </TableCell>
                  <TableCell sx={{ color: "#000" }}>
                    <Phone fontSize="small" sx={{ mr: 0.5 }} />
                    Phone
                  </TableCell>
                  <TableCell sx={{ color: "#000" }}>
                    <LocationOn fontSize="small" sx={{ mr: 0.5 }} />
                    Address
                  </TableCell>
                </>
              )}
              <TableCell sx={{ color: "#000" }}>Vehicle №</TableCell>
              <TableCell sx={{ color: "#000" }}>Type</TableCell>
              <TableCell sx={{ color: "#000" }}>Rate/km</TableCell>
              <TableCell sx={{ color: "#000" }}>Available</TableCell>
              <TableCell align="center" sx={{ color: "#000" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transporters.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={role === "transporter" ? 5 : 8}
                  align="center"
                  sx={{ py: 4 }}
                >
                  <Typography color="textSecondary">
                    No transporters found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}

            {transporters.map((t, i) => (
              <TableRow
                key={t._id}
                hover
                sx={{
                  "&:nth-of-type(odd)": {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                <TableCell>{i + 1}</TableCell>
                {role !== "transporter" && (
                  <>
                    <TableCell>{t.user?.name}</TableCell>
                    <TableCell>{t.user?.phone}</TableCell>
                    <TableCell>{t.user?.address}</TableCell>
                  </>
                )}
                <TableCell>{t.vehicleNumber}</TableCell>
                <TableCell>{t.vehicleType}</TableCell>
                <TableCell
                  sx={{
                    color: theme.palette.secondary.main,
                    fontWeight: 600,
                  }}
                >
                  ₹{t.transportRatePerKm}
                </TableCell>
                <TableCell>
                  <Chip
                    label={t.available ? "Yes" : "No"}
                    color={t.available ? "success" : "error"}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  {role === "transporter" ? (
                    <>
                      <Tooltip title="Edit">
                        <Button
                          startIcon={<Edit />}
                          size="small"
                          variant="outlined"
                          color="info"
                          onClick={() => openEdit(t)}
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
                          onClick={() => deleteTransporter(t._id)}
                          sx={{ textTransform: "none" }}
                        >
                          Delete
                        </Button>
                      </Tooltip>
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      startIcon={<LocalShipping />}
                      size="small"
                      onClick={() => openRequest(t)}
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
                      Request
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          sx={{
            color: "#000",
          }}
        >
          {isEditMode ? "Edit Vehicle" : "Add Vehicle"}
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" display="grid" gap={2} pt={1}>
            <TextField
              label="Vehicle Number"
              name="vehicleNumber"
              value={current.vehicleNumber}
              onChange={handleEditChange}
              fullWidth
            />
            <TextField
              label="Vehicle Type"
              name="vehicleType"
              value={current.vehicleType}
              onChange={handleEditChange}
              fullWidth
            />
            <TextField
              label="Rate per Km"
              name="transportRatePerKm"
              type="number"
              value={current.transportRatePerKm}
              onChange={handleEditChange}
              fullWidth
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="available"
                  checked={current.available}
                  onChange={handleEditChange}
                />
              }
              label="Available"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setEditOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={saveTransporter}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Request Dialog */}
      <Dialog
        open={requestOpen}
        onClose={() => setRequestOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          sx={{
            color: "#000",
          }}
        >
          Request Transport
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" display="grid" gap={2} pt={1}>
            <TextField
              label="Pickup Location"
              name="pickupLocation"
              value={requestData.pickupLocation}
              onChange={handleRequestChange}
              fullWidth
            />
            <TextField
              label="Drop Location"
              name="dropLocation"
              value={requestData.dropLocation}
              onChange={handleRequestChange}
              fullWidth
            />
            <TextField
              label="Distance (Km)"
              name="distanceInKm"
              type="number"
              value={requestData.distanceInKm}
              onChange={handleRequestChange}
              fullWidth
            />
            <TextField
              label="Rate per Km"
              name="transportRatePerKm"
              type="number"
              value={requestData.transportRatePerKm}
              disabled
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setRequestOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={sendRequest}>
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TransportersTable;
