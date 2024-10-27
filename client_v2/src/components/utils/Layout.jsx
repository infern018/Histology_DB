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
				justifyContent: "flex-start",
				minHeight: "100vh",
				margin: -1,
				padding: 0,
			}}>
			<Navbar />
			<Box
				sx={{
					width: "100%",
					maxWidth: 950,
					paddingX: 2,
					marginTop: 15,
				}}>
				{children}
			</Box>
		</Box>
	);
};

export default Layout;
