import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerAPI } from "../../utils/apiCalls";
import SignupForm from "../../components/auth/SignupForm";
import { Box, Typography, Alert, Card, CardContent } from "@mui/material";
import { useDispatch } from "react-redux";
import { login } from "../../redux/reducers/authSlice";
import { useTheme } from "@mui/material/styles";
import Layout from "../../components/utils/Layout";

const Signup = () => {
  const theme = useTheme();
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
      // Check if the error has a response and handle it
      const errorMessage =
        error.response?.data?.message ||
        "An unexpected error occurred. Please try again.";
      setError(errorMessage);
    }
  };

  return (
    <Layout>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          minHeight: "60vh",
          padding: "3rem 2rem",
        }}
      >
        <Card
          sx={{
            maxWidth: "32rem",
            width: "100%",
            backgroundColor: theme.palette.background.paper,
            borderRadius: "0.75rem",
            boxShadow: `0 0.25rem 0.375rem -0.0625rem rgba(0, 0, 0, 0.1), 0 0.125rem 0.25rem -0.0625rem rgba(0, 0, 0, 0.06)`,
            border: `0.0625rem solid ${theme.palette.divider}`,
          }}
        >
          <CardContent sx={{ padding: "2.5rem" }}>
            <Box sx={{ textAlign: "center", marginBottom: "2rem" }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  marginBottom: "0.5rem",
                }}
              >
                Create Account
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: theme.palette.text.secondary }}
              >
                Join MiMe to get started
              </Typography>
            </Box>

            {error && (
              <Alert
                severity="error"
                sx={{
                  "marginBottom": "1.5rem",
                  "backgroundColor": "rgba(244, 67, 54, 0.1)",
                  "border": `0.0625rem solid rgba(244, 67, 54, 0.3)`,
                  "color": "#f44336",
                  "& .MuiAlert-icon": {
                    color: "#f44336",
                  },
                }}
              >
                {error}
              </Alert>
            )}

            <SignupForm onSubmit={handleSignup} />
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
};

export default Signup;
