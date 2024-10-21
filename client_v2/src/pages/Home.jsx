import React from "react";
import { useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import Layout from "../components/utils/Layout";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";

const Home = () => {
	const user = useSelector((state) => state.auth.currentUser);

	return (
		<Layout>
			{user && user.username !== "anyone" && (
				<Typography variant="h3" color="primary" sx={{ mt: 3, mb: 4 }}>
					Hey, {user.username}!
				</Typography>
			)}
			<Typography variant="h4" sx={{ fontWeight: 500, color: "#0c2f57" }}>
				Welcome to MiMe,
			</Typography>
			<Typography paragraph sx={{ fontSize: 20, mt: 2 }}>
				Microscopy Metadata Index (MiMe) is a platform designed to streamline the sharing and collaboration of
				histology data. Discover, contribute, and manage your data seamlessly.
			</Typography>

			{/* show the option to explore public collections if the user is not logged in */}
			<Button component={Link} to={`/collection/public`} variant="contained">
				Explore Public Collections
			</Button>
		</Layout>
	);
};

export default Home;
