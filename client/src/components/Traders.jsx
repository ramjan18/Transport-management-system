import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Avatar,
  Stack,
  useTheme,
  IconButton,
  Tooltip,
  Button
} from "@mui/material";
import { People, Email, Phone, LocationOn, Delete } from "@mui/icons-material";
import axiosInstance from "../api/axios";

const TradersList = ({ traders = [], loading, role = "user", onDelete  }) => {
  const theme = useTheme();

  const handleDelete =async (id) => {
    if (window.confirm(`Are you sure you want to delete this ${role}?`)) {
      onDelete?.(id);
     
    }
    // const id = localStorage.getItem("id");
    // await axiosInstance.delete(`/deleteUser/${id}`);
  };

  return (
    <Box sx={{ p: 4, background: theme.palette.background.default }}>
      <Box display="flex" alignItems="center" mb={3}>
        <People fontSize="large" color="primary" />
        <Typography variant="h5" fontWeight="bold" color="primary" ml={1}>
          Traders List
        </Typography>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={6}>
          <CircularProgress color="secondary" />
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 3,
            boxShadow: 4,
            overflowX: "auto",
          }}
        >
          <Table>
            <TableHead
              sx={{
                backgroundColor: theme.palette.primary.light,
              }}
            >
              <TableRow>
                <TableCell sx={{ color: "#000" }}>
                  <strong>#</strong>
                </TableCell>
                <TableCell sx={{ color: "#000" }}>
                  <People
                    fontSize="small"
                    sx={{ verticalAlign: "middle", mr: 0.5 }}
                  />
                  Name
                </TableCell>
                <TableCell sx={{ color: "#000" }}>
                  <Email
                    fontSize="small"
                    sx={{ verticalAlign: "middle", mr: 0.5 }}
                  />
                  Email
                </TableCell>
                <TableCell sx={{ color: "#000" }}>
                  <Phone
                    fontSize="small"
                    sx={{ verticalAlign: "middle", mr: 0.5 }}
                  />
                  Phone
                </TableCell>
                <TableCell sx={{ color: "#000" }}>
                  <LocationOn
                    fontSize="small"
                    sx={{ verticalAlign: "middle", mr: 0.5 }}
                  />
                  Address
                </TableCell>
                {role === "admin" && (
                  <TableCell sx={{ color: "#000" }}>Action</TableCell>
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {traders.length > 0 ? (
                traders.map((trader, index) => {
                  const initials = trader.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase();

                  return (
                    <TableRow
                      key={trader._id}
                      hover
                      sx={{
                        transition: "background 0.3s",
                        "&:hover": {
                          backgroundColor: theme.palette.action.hover,
                        },
                      }}
                    >
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Avatar
                            sx={{
                              bgcolor: theme.palette.secondary.main,
                              width: 32,
                              height: 32,
                            }}
                          >
                            {initials}
                          </Avatar>
                          <Typography>{trader.name}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography noWrap>{trader.email}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography noWrap>{trader.phone}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography noWrap>{trader.address || "—"}</Typography>
                      </TableCell>
                      {role === "admin" && (
                        <TableCell>
                          <Tooltip title="Delete">
                            <Button
                              startIcon={<Delete />}
                              size="small"
                              variant="contained"
                              color="error"
                              onClick={() => handleDelete(trader._id)}
                              sx={{ mr: 1, textTransform: "none" }}
                            >
                              Delete
                            </Button>
                          </Tooltip>
                          {/* <Tooltip title="Delete Trader">
                            <IconButton color="error">
                              <Delete />
                            </IconButton>
                          </Tooltip> */}
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={role === "admin" ? 6 : 5}
                    align="center"
                    sx={{ py: 4 }}
                  >
                    <Typography color="textSecondary">
                      No traders found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default TradersList;
