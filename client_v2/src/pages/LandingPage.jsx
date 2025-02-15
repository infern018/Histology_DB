import React from "react";
import { Box, Typography } from "@mui/material";
import Layout from "../components/utils/Layout";
import { useNavigate } from "react-router-dom";
import AdvancedSearch from "../components/search/AdvancedSearch";

const LandingPage = () => {
	const navigate = useNavigate();

	const handleSearch = (searchParams) => {
		const queryParams = new URLSearchParams(searchParams).toString();
		navigate(`/search/results?${queryParams}`);
	};

	return (
		<Layout>
			<Box sx={{ padding: 3 }}>
				<Typography variant="h4" gutterBottom>
					Welcome to Histology DB
				</Typography>
				<AdvancedSearch onSearch={handleSearch} />
			</Box>
		</Layout>
	);
};

export default LandingPage;
