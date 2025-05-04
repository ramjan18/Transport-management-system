// UserProfile.js
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
  Avatar,
  IconButton,
  Chip,
  Stack,
} from "@mui/material";
import {
  CgProfile,
  CgMail,
  CgPhone,
  CgHome,
  CgEditBlackPoint,
} from "react-icons/cg";
import axiosInstance from "../api/axios";

const UserProfile = () => {
  const theme = useTheme();
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const fetchUser = async () => {
    try {
      const id = localStorage.getItem("id");
      const res = await axiosInstance.get(`/getUserById/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUser(res.data.user);
      setForm(res.data.user);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const handleSave = async () => {
    try {
      const id = localStorage.getItem("id");
      const res = await axiosInstance.patch(`/updateUser/${id}`, form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUser(res.data);
      handleClose();
      fetchUser();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box
      sx={{
        p: 4,
        maxWidth: 800,
        mx: "auto",
        bgcolor: theme.palette.background.paper,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,
        }}
      >
        <Avatar
          sx={{
            bgcolor: theme.palette.primary.main,
            width: 56,
            height: 56,
            mr: 2,
          }}
        >
          <CgProfile size={32} />
        </Avatar>
        <Typography variant="h4" color="primary">
          My Profile
        </Typography>
        <IconButton
          onClick={handleOpen}
          sx={{
            ml: 2,
            bgcolor: theme.palette.secondary.light,
            "&:hover": { bgcolor: theme.palette.secondary.main, color: "#fff" },
          }}
        >
          <CgEditBlackPoint />
        </IconButton>
      </Box>

      {user && (
        <Card
          sx={{
            mb: 3,
            boxShadow: 2,
            borderLeft: `6px solid ${theme.palette.primary.main}`,
            borderRadius: 2,
          }}
        >
          <CardContent>
            <Stack spacing={2}>
              {/* Name */}
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  Name
                </Typography>
                <Typography variant="h6">{user.name}</Typography>
              </Box>
              {/* Email */}
              <Chip
                icon={<CgMail />}
                label={user.email}
                variant="outlined"
                sx={{ alignSelf: "flex-start" }}
              />
              {/* Phone */}
              <Chip
                icon={<CgPhone />}
                label={user.phone}
                color="success"
                variant="outlined"
                sx={{ alignSelf: "flex-start" }}
              />
              {/* Address */}
              <Chip
                icon={<CgHome />}
                label={user.address || "-"}
                color="info"
                variant="outlined"
                sx={{ alignSelf: "flex-start" }}
              />
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                name="name"
                fullWidth
                value={form.name}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <CgProfile style={{ marginRight: 8 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                fullWidth
                value={form.email}
                disabled
                InputProps={{
                  startAdornment: <CgMail style={{ marginRight: 8 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone"
                name="phone"
                fullWidth
                value={form.phone}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <CgPhone style={{ marginRight: 8 }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Address"
                name="address"
                fullWidth
                value={form.address}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <CgHome style={{ marginRight: 8 }} />,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserProfile;
