import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../redux/reducers/authSlice";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  Divider,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import GitHubIcon from "@mui/icons-material/GitHub";
import { useTheme } from "@mui/material/styles";
import Loader from "../../components/utils/Loader";
import Layout from "../../components/utils/Layout";
import CustomTextField from "../../components/mui/CustomTextField";

const Login = () => {
  const theme = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const apiUrl = process.env.REACT_APP_API_URL;

  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(login({ username, password }));
    navigate("/");
  };

  const handleGitHubLogin = () => {
    setLoading(true);
    window.open(`${apiUrl}/auth/github`, "_self");
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Layout>
      {loading && <Loader />}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card
          sx={{
            width: "30rem",
            backgroundColor: theme.palette.background.paper,
            borderRadius: "0.75rem",
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
                Welcome Back
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: theme.palette.text.secondary }}
              >
                Sign in to your MiMe account
              </Typography>
            </Box>

            <Box
              component="form"
              onSubmit={handleLogin}
              sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <CustomTextField
                required
                id="username"
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <CustomTextField
                required
                id="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={(event) => event.preventDefault()}
                        edge="end"
                        sx={{ color: theme.palette.text.secondary }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  "backgroundColor": theme.palette.primary.main,
                  "color": theme.palette.primary.contrastText,
                  "fontWeight": 600,
                  "borderRadius": "0.5rem",
                  "padding": "0.75rem",
                  "textTransform": "none",
                  "fontSize": "1rem",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                Sign In
              </Button>

              <Divider
                sx={{
                  "margin": "1rem 0",
                  "color": theme.palette.text.secondary,
                  "&::before, &::after": {
                    borderColor: theme.palette.divider,
                  },
                }}
              >
                or
              </Divider>

              <Button
                fullWidth
                variant="outlined"
                onClick={handleGitHubLogin}
                startIcon={<GitHubIcon />}
                sx={{
                  "borderColor": theme.palette.divider,
                  "color": theme.palette.text.primary,
                  "borderRadius": "0.5rem",
                  "padding": "0.75rem",
                  "textTransform": "none",
                  "fontSize": "1rem",
                  "&:hover": {
                    borderColor: theme.palette.primary.main,
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                Continue with GitHub
              </Button>

              <Box sx={{ textAlign: "center", marginTop: "1rem" }}>
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  Don't have an account?{" "}
                  <Button
                    component="a"
                    href="/signup"
                    sx={{
                      "color": theme.palette.primary.main,
                      "textTransform": "none",
                      "padding": 0,
                      "minWidth": "auto",
                      "&:hover": {
                        backgroundColor: "transparent",
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Sign up
                  </Button>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
};

export default Login;
