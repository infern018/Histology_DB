// theme.js
import { createTheme } from "@mui/material/styles";

// Define the custom color palette
const theme = createTheme({
	palette: {
		primary: {
			main: "#F2E9E4", // Slate blue
		},
		secondary: {
			main: "#9A8C98", // Warm gray
		},
		background: {
			default: "#2E2E2E", // Dark gray background
			paper: "#2E2E2E", // Slightly lighter gray for paper elements
		},
		text: {
			primary: "#F2E9E4", // Off-white text
			secondary: "#C9ADA7", // Light warm gray for secondary text
		},
	},
	typography: {
		fontFamily: "Roboto, sans-serif",
		color: "#ffffff",
		h2: {
			fontWeight: "bold",
			color: "#FFFFFF",
		},
		h5: {
			fontWeight: 500,
			color: "#FFFFFF",
		},
		h6: {
			color: "#FFFFFF",
		},
		body1: {
			fontSize: 20,
			color: "#FFFFFF",
		},
		subtitle1: {
			color: "#FFFFFF",
		},
	},
});

export default theme;
