import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Container,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { styled, width } from "@mui/system";
import axiosInstance from "../api/axios";

// Styled component for the root container with background image
const Root = styled(Box)({
  height: "100vh",
  width: "100vw",
  backgroundImage:
    "url(https://thumbs.dreamstime.com/b/empty-wooden-table-vibrant-outdoor-market-background-ambiance-340142885.jpg)", // Replace with your background image URL
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const FormContainer = styled(Box)({
  backgroundColor: "rgba(255, 255, 255, 0.8)", // Slightly transparent white background for the form
  padding: "40px",
  borderRadius: "8px",
  maxWidth: "450px",
  width: "100%",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
});

const Title = styled(Typography)({
  fontWeight: "600",
  marginBottom: "20px",
  textAlign: "center",
  color: "#333",
});

const ErrorMessage = styled(Typography)({
  color: "red",
  marginBottom: "20px",
  fontSize: "14px",
  textAlign: "center",
});

const SubmitButton = styled(Button)({
  marginTop: "20px",
  padding: "12px",
  fontSize: "16px",
  borderRadius: "5px",
  backgroundColor: "#1976d2",
  "&:hover": {
    backgroundColor: "#1565c0",
  },
});

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    role: "",
    address: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/signup", formData);
      // Redirect to login after successful signup
      navigate("/");
    } catch (err) {
      setError(err.response.data.message || "Something went wrong.");
    }
  };

  return (
    <Root>
      <FormContainer>
        <Title variant="h4">Sign Up</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <form onSubmit={handleSubmit}>
          <Grid
            sx={{ display: "flex", flexDirection: "column" }}
            container
            spacing={2}
          >
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  label="Role"
                >
                  <MenuItem value="farmer">Farmer</MenuItem>
                  <MenuItem value="trader">Trader</MenuItem>
                  <MenuItem value="transporter">Transporter</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <SubmitButton
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
              >
                Sign Up
              </SubmitButton>
            </Grid>
          </Grid>
        </form>
      </FormContainer>
    </Root>
  );
};

export default SignUp;
