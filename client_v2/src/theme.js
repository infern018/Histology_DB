// theme.js
import { createTheme } from "@mui/material/styles";

// Define the custom color palette
const theme = createTheme({
	palette: {
		primary: {
			main: "#4A4E69", // Slate blue
		},
		secondary: {
			main: "#9A8C98", // Warm gray
		},
		background: {
			default: "#2E2E2E", // Dark gray background
			paper: "#3C3C3C", // Slightly lighter gray for paper elements
		},
		text: {
			primary: "#F2E9E4", // Off-white text
			secondary: "#C9ADA7", // Light warm gray for secondary text
		},
	},
	typography: {
		fontFamily: "Roboto, sans-serif",
		h2: {
			fontWeight: "bold",
			color: "#F2E9E4",
		},
		h5: {
			fontWeight: 500,
			color: "#F2E9E4",
		},
		body1: {
			fontSize: 20,
			color: "#F2E9E4",
		},
	},
});

export default theme;
