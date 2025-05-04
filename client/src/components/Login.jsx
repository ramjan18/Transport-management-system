import React, { useState } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  Grid,
  Typography,
  Paper,
  Box,
  Container,
} from "@mui/material";
import { styled } from "@mui/system";
import { Link } from "react-router-dom"; // Import Link for routing
import axiosInstance from "../api/axios";

// Styled components using the `styled` API
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

const FormContainer = styled(Paper)({
  padding: "30px",
  backgroundColor: "rgba(255, 255, 255, 0.9)", // Semi-transparent white background
  borderRadius: "8px",
  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",

  maxWidth: "450px",
  width: "100%",
});

const Title = styled(Typography)({
  fontWeight: 600,
  marginBottom: "20px",
  color: "#333",
});

const ErrorMessage = styled(Typography)({
  color: "red",
  marginBottom: "20px",
  fontSize: "14px",
});

const SubmitButton = styled(Button)({
  marginTop: "20px",
  padding: "10px",
  fontSize: "16px",
  borderRadius: "5px",
  backgroundColor: "#1976d2",
  "&:hover": {
    backgroundColor: "#1565c0",
  },
});

const RegisterLink = styled(Typography)({
  marginTop: "20px",
  fontSize: "14px",
  textAlign: "center",
  color: "#1976d2",
  cursor: "pointer",
  "&:hover": {
    textDecoration: "underline",
  },
});

const Login = () => {
  const [phoneOrEmail, setPhoneOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post("/login", {
        phoneOrEmail,
        password,
      });
      console.log(response.data.user);
      localStorage.setItem("token", response.data.token);
       localStorage.setItem("userRole", response.data.user.role);
       localStorage.setItem("id", response.data.user.id);
      localStorage.setItem("user", response.data.user);
      // Redirect to dashboard or home page after successful login
       window.location.href = "/home"; // or use React Router to navigate
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <Root>
      <Container sx={{display:"flex" , alignItems:"center", justifyContent:"center"}}>
        <FormContainer>
          <Title variant="h4" align="center">
            Login
          </Title>
          {error && <ErrorMessage align="center">{error}</ErrorMessage>}
          <form onSubmit={handleSubmit}>
            <Grid sx={{display: "flex" , flexDirection : 'column'}} container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  label="Phone/Email"
                  variant="outlined"
                  fullWidth
                  value={phoneOrEmail}
                  onChange={(e) => setPhoneOrEmail(e.target.value)}
                  required
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Password"
                  variant="outlined"
                  type="password"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <SubmitButton
                  variant="contained"
                  color="primary"
                  fullWidth
                  type="submit"
                >
                  Login
                </SubmitButton>
              </Grid>
            </Grid>
          </form>
          <div className="text-center mt-4">
            <Link to="/signUp" style={{ textDecoration: "none" }}>
              <RegisterLink>Don't have an account? Register</RegisterLink>
            </Link>
          </div>
        </FormContainer>
      </Container>
    </Root>
  );
};

export default Login;
