import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../redux/reducers/authSlice";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Divider, InputAdornment, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import GitHubIcon from "@mui/icons-material/GitHub";
import { styled } from "@mui/material/styles";
import Loader from "../../components/utils/Loader";
import Layout from "../../components/utils/Layout";

const Root = styled("div")(({ theme }) => ({
	width: "100%",
	...theme.typography.body2,
	color: theme.palette.text.secondary,
	"& > :not(style) ~ :not(style)": {
		marginTop: theme.spacing(2),
	},
}));

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false); // Add loading state
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
				component="form"
				onSubmit={handleLogin}
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					maxWidth: 500,
					width: "100%",
					padding: 10,
					backgroundColor: "rgba(14, 14, 10, 0.7)", // Dark background
					borderRadius: 1,
					boxShadow: "0 4px 8px rgba(50, 50, 50, 0.2)", // Light shadow
					margin: "0 auto",
				}}
				noValidate
				autoComplete="off">
				<Typography variant="h4" sx={{ fontWeight: 500, mb: 5, color: "#ffffff" }}>
					Login to MiMe
				</Typography>
				<TextField
					required
					id="username"
					label="Username"
					variant="filled"
					onChange={(e) => setUsername(e.target.value)}
					InputProps={{
						style: {
							borderRadius: "10px",
							backgroundColor: "#333333", // Darker input field
							color: "#ffffff", // White text color
						},
						disableUnderline: true,
					}}
					InputLabelProps={{
						sx: {
							color: "#ffffff", // Set label color to white
						},
					}}
					sx={{ mb: 2, width: "100%" }}
				/>
				<TextField
					required
					id="password"
					label="Password"
					type={showPassword ? "text" : "password"}
					variant="filled"
					onChange={(e) => setPassword(e.target.value)}
					InputProps={{
						style: {
							borderRadius: "10px",
							backgroundColor: "#333333", // Darker input field
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
					sx={{ mb: 3, width: "100%", borderRadius: "10px" }}
				/>
				<Button
					variant="contained"
					type="submit"
					sx={{
						mb: 2,
						width: "100%",
						backgroundColor: "#0056b3", // Primary button color
						color: "#ffffff", // White text
						"&:hover": {
							backgroundColor: "#004494", // Darker shade on hover
						},
					}}>
					Login
				</Button>
				<Root sx={{ mb: 2 }}>
					<Divider sx={{ color: "#ffffff" }}>or </Divider>
				</Root>
				<Button
					variant="outlined"
					onClick={handleGitHubLogin}
					sx={{
						width: "100%",
						borderColor: "#ffffff", // White border color
						color: "#ffffff", // White text color
						"&:hover": {
							borderColor: "#ffffff", // Keep border color white on hover
							backgroundColor: "rgba(255, 255, 255, 0.1)", // Slightly lighter background on hover
						},
					}}>
					<GitHubIcon sx={{ mr: 1, color: "#ffffff" }} />
					Sign in with GitHub
				</Button>
				<Typography variant="body2" sx={{ mt: 2, color: "#ffffff" }}>
					New Here?{" "}
					<Button component="a" href="/signup" sx={{ color: "rgb(0, 179, 255)", textTransform: "none" }}>
						Sign up
					</Button>
				</Typography>
			</Box>
		</Layout>
	);
};

export default Login;
