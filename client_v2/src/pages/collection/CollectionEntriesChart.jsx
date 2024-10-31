// CollectionEntriesChartPage.js
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { fetchEntriesByCollectionID, fetchEntriesOfPublicCollection } from "../../utils/apiCalls";
import { CircularProgress, Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import ParallelCoordinatesChart from "../../components/entries/ParallelCoordinatesChart";
import Navbar from "../../components/navbar/Navbar";

const CollectionEntriesChart = () => {
	const { collectionID } = useParams();
	const [data, setData] = useState([]);
	const [collectionName, setCollectionName] = useState("");
	const [loading, setLoading] = useState(true);

	const location = useLocation();

	const queryParams = new URLSearchParams(location.search);
	const isPublic = queryParams.get("isPublic") === "true";

	const currUser = useSelector((state) => state.auth.currentUser);

	useEffect(() => {
		const loadEntries = async () => {
			try {
				let response;

				if (isPublic) {
					response = await fetchEntriesOfPublicCollection(collectionID, 1, 1000000);
				} else {
					// TODO : ADD SUPPORT FOR PUBLIC COLLECTIONS
					response = await fetchEntriesByCollectionID(collectionID, currUser.accessToken, 1, 1000000);
				}

				setData(response.entries);
				setCollectionName(response.collectionName);
			} catch (error) {
				console.error("Failed to fetch collection entries:", error);
			} finally {
				setLoading(false);
			}
		};
		loadEntries();
	}, [collectionID, currUser, isPublic]);

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
					maxWidth: "100vw",
					paddingX: 2,
					marginTop: 15,
				}}>
				{loading ? (
					<Box display="flex" justifyContent="center" alignItems="center" height="100vh">
						<CircularProgress />
					</Box>
				) : (
					<>
						<Typography variant="h4" align="center">
							{collectionName}
						</Typography>
						<ParallelCoordinatesChart data={data} />
					</>
				)}
			</Box>
		</Box>
	);
};

export default CollectionEntriesChart;
