import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const SignupForm = ({ onSubmit }) => {
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
        alignItems: "center",
        width: "100%",
      }}
    >
      <TextField
        {...register("username")}
        label="Username"
        variant="filled"
        required
        sx={{ mb: 2, width: "100%", borderRadius: "10px" }}
        InputProps={{
          style: {
            borderRadius: "10px",
          },
          disableUnderline: true,
        }}
      />
      <TextField
        {...register("password")}
        label="Password"
        type={showPassword ? "text" : "password"}
        variant="filled"
        required
        sx={{ mb: 2, width: "100%", borderRadius: "10px" }}
        InputProps={{
          style: {
            borderRadius: "10px",
          },
          disableUnderline: true,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={(event) => event.preventDefault()}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <TextField
        {...register("email")}
        label="Email"
        type="email"
        variant="filled"
        required
        sx={{ mb: 2, width: "100%", borderRadius: "10px" }}
        InputProps={{
          style: {
            borderRadius: "10px",
          },
          disableUnderline: true,
        }}
      />
      <Button
        type="submit"
        variant="contained"
        sx={{
          width: "100%",
          backgroundColor: "#0056b3",
          color: "#ffffff",
        }}
      >
        Sign Up
      </Button>
    </Box>
  );
};

export default SignupForm;
