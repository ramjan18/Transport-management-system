import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Typography,
  Divider,
} from "@mui/material";
import { CgProfile } from "react-icons/cg";
import { IoIosLogOut } from "react-icons/io";

const Dashboard = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    setUserRole(localStorage.getItem("userRole"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    window.location.href = "/";
  };

  const renderSidebarItems = () => {
    const items = {
      admin: [
        { to: "/home", label: "Home" },
        { to: "/farmers", label: "Manage Farmers" },
        { to: "/traders", label: "Manage Traders" },
        { to: "/transporters", label: "Manage Transporters" },
        // { to: "/requests", label: "Your Bookings" },
        // { to: "/orders", label: "Order Requests" },
      ],
      farmer: [
        { to: "/home", label: "Home" },
        { to: "/manage-goods", label: "Add Goods" },
        { to: "/view-traders", label: "View Traders" },
        { to: "/view-transporters", label: "View Transporters" },
        { to: "/requests", label: "Your Bookings" },
        { to: "/orders", label: "Order Requests" },
      ],
      trader: [
        { to: "/home", label: "Home" },
        { to: "/manage-goods", label: "Goods List" },
        { to: "/orders", label: "Your Orders" },
        { to: "/view-transporters", label: "View Transporters" },
        { to: "/requests", label: "Your Bookings" },
      ],
      transporter: [
        { to: "/home", label: "Home" },
        { to: "/requests", label: "Requests" },
        { to: "/view-transporters", label: "Manage Vehicles" },
      ],
    };
    return (items[userRole] || []).map(({ to, label }) => (
      <SidebarLink key={to} to={to} label={label} />
    ));
  };

  return (
    <Box
      sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f9f9f9" }}
    >
      <Drawer
        sx={{
          width: 260,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 260,
            boxSizing: "border-box",
            backgroundColor: "#fff",
            boxShadow: "2px 0 8px rgba(0,0,0,0.05)",
            borderRight: "1px solid #eee",
            display: "flex",
            flexDirection: "column",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Box sx={{ p: 3 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "#1976d2",
              textAlign: "center",
              mb: 3,
            }}
          >
            {userRole
              ? `${
                  userRole.charAt(0).toUpperCase() + userRole.slice(1)
                } Dashboard`
              : "Dashboard"}
          </Typography>
        </Box>

        <Divider />

        <List sx={{ flexGrow: 1, px: 1 }}>{renderSidebarItems()}</List>

        <Divider />

        <List sx={{ px: 1, pt: 1 }}>
          <SidebarLink to="/profile" label="Profile" Icon={CgProfile} />
          <ListItem
            button
            onClick={handleLogout}
            sx={{
              mt: 1,
              borderRadius: 2,
              bgcolor: "#f44336",
              color: "#fff",
              "&:hover": { bgcolor: "#d32f2f" },
            }}
          >
            <IoIosLogOut style={{ marginRight: 12, fontSize: 24 }} />
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
};

const SidebarLink = ({ to, label, Icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <ListItem
      button
      component={Link}
      to={to}
      selected={isActive}
      sx={{
        mb: 1,
        borderRadius: 2,
        py: 1.2,
        px: 2,
        bgcolor: isActive ? "#1976d2" : "",
        color: isActive ? "#fff" : "#000",
        "&.Mui-selected": {
          bgcolor: "#e3f2fd", // light blue background when active
        },
        "&:hover": {
          bgcolor: isActive ? "#e3f2fd" : "#f0f4ff",
          transition: "all 0.3s ease",
        },
      }}
    >
      {Icon && <Icon style={{ marginRight: 12, fontSize: 24 }} />}
      <ListItemText primary={label} />
    </ListItem>
  );
};

export default Dashboard;
