import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerAPI } from "../../utils/apiCalls";
import SignupForm from "../../components/auth/SignupForm";
import { Box, Typography, Alert } from "@mui/material";
import Navbar from "../../components/navbar/Navbar";
import { useDispatch } from "react-redux";
import { login } from "../../redux/reducers/authSlice";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  const handleSignup = async (formData) => {
    try {
      const response = await registerAPI(formData);
      if (response.status === 200) {
        const { username, password } = formData;
        dispatch(login({ username, password }));
        navigate("/");
      } else {
        setError(response.data.message || "Registration failed");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "linear-gradient(to bottom, #b2d5fb, #f0f2f5)",
          padding: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: 400,
            width: "100%",
            padding: 4,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            borderRadius: 2,
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 500, mb: 5 }}>
            Sign Up for MiMe
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <SignupForm onSubmit={handleSignup} />
        </Box>
      </Box>
    </>
  );
};

export default Signup;
