import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Box, InputAdornment, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

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
				padding: 4,
				backgroundColor: "rgba(20, 20, 0, 0.7)", // Dark background similar to Login
				borderRadius: 2,
			}}>
			<TextField
				{...register("username")}
				label="Username"
				variant="filled"
				required
				sx={{
					mb: 2,
					width: "100%",
					borderRadius: "10px",
					backgroundColor: "#333333", // Darker input field
				}}
				InputProps={{
					style: {
						borderRadius: "10px",
						color: "#ffffff", // White text color
					},
					disableUnderline: true,
				}}
				InputLabelProps={{
					sx: {
						color: "#ffffff", // Set label color to white
					},
				}}
			/>
			<TextField
				{...register("password")}
				label="Password"
				type={showPassword ? "text" : "password"}
				variant="filled"
				required
				sx={{
					mb: 2,
					width: "100%",
					borderRadius: "10px",
					backgroundColor: "#333333", // Darker input field
				}}
				InputProps={{
					style: {
						borderRadius: "10px",
						color: "#ffffff", // White text color
					},
					disableUnderline: true,
					endAdornment: (
						<InputAdornment position="end">
							<IconButton
								aria-label="toggle password visibility"
								onClick={handleClickShowPassword}
								onMouseDown={(event) => event.preventDefault()}
								edge="end">
								{showPassword ? (
									<VisibilityOff sx={{ color: "#ffffff" }} />
								) : (
									<Visibility sx={{ color: "#ffffff" }} />
								)}
							</IconButton>
						</InputAdornment>
					),
				}}
				InputLabelProps={{
					sx: {
						color: "#ffffff", // Set label color to white
					},
				}}
			/>
			<TextField
				{...register("email")}
				label="Email"
				type="email"
				variant="filled"
				required
				sx={{
					mb: 2,
					width: "100%",
					borderRadius: "10px",
					backgroundColor: "#333333", // Darker input field
				}}
				InputProps={{
					style: {
						borderRadius: "10px",
						color: "#ffffff", // White text color
					},
					disableUnderline: true,
				}}
				InputLabelProps={{
					sx: {
						color: "#ffffff", // Set label color to white
					},
				}}
			/>
			<Button
				type="submit"
				variant="contained"
				sx={{
					width: "100%",
					backgroundColor: "#0056b3", // Primary button color
					color: "#ffffff", // White text
					"&:hover": {
						backgroundColor: "#004494", // Darker shade on hover
					},
				}}>
				Sign Up
			</Button>
		</Box>
	);
};

export default SignupForm;
