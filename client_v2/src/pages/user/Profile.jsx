import React, { useEffect, useState } from "react";
import { fetchUserCollections, fetchCollectionStats, fetchUserDetails } from "../../utils/apiCalls";
import CollectionTable from "../../components/user/CollectionsTable";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import { useSelector } from "react-redux";
import Layout from "../../components/utils/Layout";
import { Link } from "react-router-dom";

const Profile = () => {
	const user = useSelector((state) => state.auth.currentUser);
	const [collections, setCollections] = useState([]);
	const [loading, setLoading] = useState(true);
	const [userInfo, setUserInfo] = useState({});
	const [error, setError] = useState(null); // Add an error state

	useEffect(() => {
		const fetchData = async () => {
			try {
				const userResponse = await fetchUserDetails([user._id]);
				const { username, email, createdAt } = userResponse[0];

				const date = new Date(createdAt);
				const formattedDate = date.toLocaleDateString("en-GB");

				setUserInfo({
					username,
					email,
					createdAt: formattedDate,
				});

				const collectionsData = await fetchUserCollections(user._id);
				const collectionsWithStats = await Promise.all(
					collectionsData.map(async (collection) => {
						const stats = await fetchCollectionStats(collection.collection_id);
						return {
							...collection,
							numCollaborators: stats.numCollaborators,
						};
					})
				);

				setCollections(collectionsWithStats);
				setLoading(false);
			} catch (error) {
				console.error("Failed to fetch data", error);
				setError(error.message || "Failed to fetch user collections");
				setLoading(false);
			}
		};

		fetchData();
	}, [user]);

	return (
		<Layout>
			{/* Error Display */}
			{error && (
				<Typography color="error" variant="body1">
					{error}
				</Typography>
			)}
			<Box
				sx={{
					display: "flex",
					flexDirection: "row",
					gap: 3,
					width: "100%",
					alignItems: "flex-start",
					justifyContent: "center",
					padding: 2,
					margin: "0 auto",
				}}>
				{/* User Meta Info Section */}
				<Box
					sx={{
						flex: 1,
						maxWidth: 400,
						padding: 3,
						borderRadius: 2,
						textAlign: "left",
						boxShadow: 3,
					}}>
					{loading ? (
						<CircularProgress />
					) : (
						<Box>
							<Typography variant="body1">
								<strong>Username:</strong> {userInfo.username}
							</Typography>
							<Typography variant="body1">
								<strong>Email:</strong> {userInfo.email}
							</Typography>
							<Typography variant="body1">
								<strong>Joined:</strong> {userInfo.createdAt}
							</Typography>
						</Box>
					)}
				</Box>

				{/* Collections Section */}
				<Box
					sx={{
						flex: 2,
						maxWidth: 800,
						padding: 3,
						borderRadius: 2,
						textAlign: "center",
						boxShadow: 3,
						display: "flex",
						flexDirection: "column",
						gap: 2,
					}}>
					<Typography variant="h5" sx={{ fontWeight: 500, mb: 2 }} textAlign={"left"}>
						My Collections
					</Typography>
					{loading ? <CircularProgress /> : <CollectionTable collections={collections} />}
					{/* Button placed at the bottom */}
					<Box sx={{ marginTop: "auto", textAlign: "right" }}>
						<Button component={Link} to={`/collection/create`} variant="contained" color="primary">
							+ Add Collection
						</Button>
					</Box>
				</Box>
			</Box>
		</Layout>
	);
};

export default Profile;
