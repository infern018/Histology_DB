import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerAPI } from "../../utils/apiCalls";
import SignupForm from "../../components/auth/SignupForm";
import { Box, Typography, Alert } from "@mui/material";
import { useDispatch } from "react-redux";
import { login } from "../../redux/reducers/authSlice";
import Layout from "../../components/utils/Layout";

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
			// Check if the error has a response and handle it
			const errorMessage = error.response?.data?.message || "An unexpected error occurred. Please try again.";
			setError(errorMessage);
		}
	};

	return (
		<Layout>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					maxWidth: 450,
					width: "100%",
					padding: 4,
					borderRadius: 2,
					backgroundColor: "rgba(20, 20, 0)", // Dark background similar to Login
					margin: "0 auto",
				}}>
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
		</Layout>
	);
};

export default Signup;
