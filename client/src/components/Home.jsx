import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  useTheme,
  Stack,
} from "@mui/material";
import { Link } from "react-router-dom";
import Dashboard from "./Dashboard";
import axiosInstance from "../api/axios";
import { PieChart } from "@mui/x-charts";
import {
  AiOutlineUnorderedList,
  AiOutlineClockCircle,
  AiOutlineCheckCircle,
  AiOutlineCheckSquare,
  AiOutlineCloseCircle,
} from "react-icons/ai";

// configuration for transporter stat cards
const statusConfig = {
  Total: { icon: <AiOutlineUnorderedList />, colorKey: "primary" },
  Pending: { icon: <AiOutlineClockCircle />, colorKey: "warning" },
  Accepted: { icon: <AiOutlineCheckCircle />, colorKey: "success" },
  Completed: { icon: <AiOutlineCheckSquare />, colorKey: "info" },
  Cancelled: { icon: <AiOutlineCloseCircle />, colorKey: "error" },
};

// enhanced stat card with icon & accent border
const EnhancedStatCard = ({ label, value }) => {
  const theme = useTheme();
  const { icon, colorKey } = statusConfig[label];
  const color = theme.palette[colorKey].main;

  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        p: 2,
        boxShadow: 2,
        borderLeft: `4px solid ${color}`,
        "&:hover": { boxShadow: 6 },
        bgcolor: theme.palette.background.paper,
      }}
    >
      <Box sx={{ mr: 2, color, fontSize: "1.8rem" }}>{icon}</Box>
      <CardContent sx={{ py: 0, "&:last-child": { pb: 0 } }}>
        <Typography variant="subtitle2" color="textSecondary">
          {label} Requests
        </Typography>
        <Typography variant="h4" sx={{ color, fontWeight: "bold" }}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

// reusable action card
const ActionCard = ({
  title,
  to,
  variant = "contained",
  color = "primary",
}) => (
  <Card sx={{ boxShadow: 2, "&:hover": { boxShadow: 6 } }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
    </CardContent>
    <CardActions sx={{ px: 2, pb: 2 }}>
      <Button
        component={Link}
        to={to}
        fullWidth
        variant={variant}
        color={color}
      >
        {title.includes("View") ? title : `Go to ${title}`}
      </Button>
    </CardActions>
  </Card>
);

const Home = () => {
  const [userRole, setUserRole] = useState("");
  const [user, setUser] = useState({});
  const [stats, setStats] = useState({
    pending: 0,
    accepted: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  });
  const [transStats, setTransStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    completed: 0,
    cancelled: 0,
  });
  const [roleData, setRoleData] = useState([]);

  useEffect(() => {
    setUserRole(localStorage.getItem("userRole"));
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const id = localStorage.getItem("id");
      const role = localStorage.getItem("userRole");
      const userRes = await axiosInstance.get(`/getUserById/${id}`);
      setUser(userRes.data.user);

      // reset counters
      const orderCounts = {
        pending: 0,
        accepted: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
      };
      const tCounts = {
        total: 0,
        pending: 0,
        accepted: 0,
        completed: 0,
        cancelled: 0,
      };

      if (role === "farmer" || role === "trader") {
        const url =
          role === "farmer"
            ? `/getPurchaseOrdersByFarmer/${id}`
            : `/trader-purchase-orders/${id}`;
        const res = await axiosInstance.get(url);
        res.data.purchaseOrders.forEach((o) => {
          const k =
            o.status === "confirmed"
              ? "accepted"
              : ["shipped", "delivered", "pending"].includes(o.status)
              ? o.status
              : "cancelled";
          orderCounts[k]++;
        });
        setStats(orderCounts);
      }

      if (role === "transporter") {
        const res = await axiosInstance.get(
          `/getBookingsByTransporterId/${id}`
        );
        res.data.bookings.forEach((o) => {
          tCounts.total++;
          const k =
            o.bookingStatus === "complited" ? "completed" : o.bookingStatus;
          tCounts[k]++;
        });
        setTransStats(tCounts);
      }

      if (role === "admin") {
        fetchUserRolesCount();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUserRolesCount = async () => {
    try {
      const res = await axiosInstance.get("/getAllUsers"); // adjust endpoint as needed
      const users = res.data.users;

      const roleCounts = users.reduce(
        (acc, user) => {
          acc[user.role] = (acc[user.role] || 0) + 1;
          return acc;
        },
        { trader: 0, farmer: 0, transporter: 0 }
      );

      setRoleData([
        { label: "Trader", value: roleCounts.trader },
        { label: "Farmer", value: roleCounts.farmer },
        { label: "Transporter", value: roleCounts.transporter },
      ]);
    } catch (err) {
      console.error("Failed to fetch role data:", err);
    }
  };

  const orderData = [
    { label: "Pending", value: stats.pending },
    { label: "Accepted", value: stats.accepted },
    { label: "Shipped", value: stats.shipped },
    { label: "Delivered", value: stats.delivered },
    { label: "Cancelled", value: stats.cancelled },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <Dashboard />
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: "background.default", py: 4 }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" color="primary" gutterBottom>
            Welcome Back, {user?.name || "User"}!
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" gutterBottom>
            You are logged in as <strong>{userRole}</strong>
          </Typography>

          <Box sx={{ my: 4 }}>
            {(userRole === "farmer" ||
              userRole === "trader" 
              ) && (
              <Stack alignItems="center" spacing={2}>
                <PieChart
                  series={[
                    { data: orderData, innerRadius: 50, outerRadius: 120 },
                  ]}
                  height={280}
                  width={280}
                />
                <Typography variant="caption" color="textSecondary">
                  Order Status Breakdown
                </Typography>
              </Stack>
            )}

            {userRole === "admin" && roleData.length > 0 && (
              <Stack alignItems="center" spacing={2} mt={4}>
                <PieChart
                  series={[
                    { data: roleData, innerRadius: 50, outerRadius: 120 },
                  ]}
                  height={280}
                  width={280}
                />
                <Typography variant="caption" color="textSecondary">
                  Users by Role
                </Typography>
              </Stack>
            )}

            {userRole === "admin" ||
              (userRole === "transporter" && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Transport Requests Overview
                  </Typography>
                  <Grid container spacing={3}>
                    {Object.entries(transStats).map(([key, value]) => (
                      <Grid key={key} item xs={12} sm={6} md={4} lg={2}>
                        <EnhancedStatCard
                          label={key.charAt(0).toUpperCase() + key.slice(1)}
                          value={value}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}
          </Box>

          <Grid container spacing={3}>
            {userRole === "admin" ||
              (userRole === "farmer" && (
                <>
                  <Grid item xs={12} sm={6} md={4}>
                    <ActionCard title="Manage Your Goods" to="/manage-goods" />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <ActionCard
                      title="View Order Requests"
                      to="/requests"
                      color="secondary"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <ActionCard
                      title="Contact Traders"
                      to="/view-traders"
                      variant="outlined"
                    />
                  </Grid>
                </>
              ))}
            {userRole === "admin" ||
              (userRole === "trader" && (
                <Grid item xs={12} sm={6} md={4}>
                  <ActionCard title="Go to Goods List" to="/manage-goods" />
                </Grid>
              ))}
            {userRole === "admin" ||
              (userRole === "transporter" && (
                <Grid item xs={12} sm={6} md={3}>
                  <ActionCard
                    title="View Requests"
                    to="/requests"
                    color="secondary"
                  />
                </Grid>
              ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
