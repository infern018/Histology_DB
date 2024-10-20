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
			console.log(response);
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
			console.log(error); // For debugging purposes
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
					maxWidth: 400,
					width: "100%",
					padding: 4,
					backgroundColor: "rgba(255, 255, 255, 0.7)",
					borderRadius: 2,
					boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
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
