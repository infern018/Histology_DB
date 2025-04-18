// Home.js
import React from "react";
import { Typography, Box, Button } from "@mui/material";
import Layout from "../components/utils/Layout";
import { useNavigate } from "react-router-dom";
import BiotechIcon from "@mui/icons-material/Biotech";
import AdvancedSearch from "../components/search/AdvancedSearch";
import { Link as RouterLink } from "react-router-dom";

const Home = () => {
	const navigate = useNavigate();

	const handleSearch = (searchParams) => {
		const queryParams = new URLSearchParams(searchParams).toString();
		navigate(`/search/results?${queryParams}`);
	};

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
					maxWidth: "69%",
				}}>
				<BiotechIcon sx={{ width: 100, height: 100, color: "rgba(255, 255, 255, 0.8)", marginBottom: 2 }} />
				<Typography variant="h2" sx={{ fontWeight: 600, marginBottom: 2 }}>
					MiMe
				</Typography>
				<Typography paragraph sx={{ fontSize: "1.2rem", lineHeight: 1.8, marginBottom: 3 }}>
					Microscopy Metadata Index (MiMe) is a platform designed to streamline the sharing and collaboration
					of histology data. Discover, contribute, and manage your data seamlessly.
				</Typography>
				<Box sx={{ width: "85%", mt: 3 }}>
					<AdvancedSearch onSearch={handleSearch} />
				</Box>
				<Typography variant="body1" sx={{ marginBottom: 2 }}>
					or
				</Typography>
				<Button component={RouterLink} to={`/collection/public`} variant="contained">
					Explore Public Collections
				</Button>
			</Box>
		</Layout>
	);
};

export default Home;
