import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Box, InputAdornment, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import CustomTextField from "../mui/CustomTextField";

const SignupForm = ({ onSubmit }) => {
  const theme = useTheme();
  const { register, handleSubmit } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        width: "100%",
      }}
    >
      <CustomTextField {...register("username")} label="Username" required />

      <CustomTextField
        {...register("email")}
        label="Email"
        type="email"
        required
      />

      <CustomTextField
        {...register("password")}
        label="Password"
        type={showPassword ? "text" : "password"}
        required
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
        variant="contained"
        fullWidth
        sx={{
          "backgroundColor": theme.palette.primary.main,
          "color": theme.palette.primary.contrastText,
          "fontWeight": 600,
          "borderRadius": "0.5rem",
          "padding": "0.75rem",
          "textTransform": "none",
          "fontSize": "1rem",
          "marginTop": "0.5rem",
          "&:hover": {
            backgroundColor: theme.palette.primary.dark,
          },
        }}
      >
        Create Account
      </Button>
    </Box>
  );
};

export default SignupForm;
