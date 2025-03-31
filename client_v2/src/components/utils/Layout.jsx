import React from "react";
import Box from "@mui/material/Box";
import Navbar from "../navbar/Navbar";

const Layout = ({ children }) => {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				minHeight: "100vh",
				maxWidth: "100%",
				width: "100%",
				margin: 0,
				padding: 0,
			}}>
			<Navbar />
			<Box
				sx={{
					width: "100%",
					paddingX: 2,
					marginTop: 15,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
				}}>
				{children}
			</Box>
		</Box>
	);
};

export default Layout;
