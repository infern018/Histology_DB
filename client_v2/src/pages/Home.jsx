// Home.js
import React from "react";
import { Typography, Button, Box } from "@mui/material";
import Layout from "../components/utils/Layout";
import { Link } from "react-router-dom";
import BiotechIcon from "@mui/icons-material/Biotech";

const Home = () => {
	return (
		<Layout>
			<Box
				sx={{
					marginTop: -25,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					height: "100vh",
					textAlign: "center",
				}}>
				<BiotechIcon sx={{ width: 80, height: 80, fontSize: 40, color: "rgba(255, 255, 255, 0.8)" }} />
				<Typography variant="h2">MiMe</Typography>
				<Typography variant="h5" sx={{ mt: 2 }}>
					Welcome to MiMe,
				</Typography>
				<Typography paragraph sx={{ mt: 2 }}>
					Microscopy Metadata Index (MiMe) is a platform designed to streamline the sharing and collaboration
					of histology data. Discover, contribute, and manage your data seamlessly.
				</Typography>
				<Button component={Link} to={`/collection/public`} variant="contained" sx={{ mt: 3 }}>
					Explore Public Collections
				</Button>
			</Box>
		</Layout>
	);
};

export default Home;
