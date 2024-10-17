import React, { useEffect, useState } from "react";
import { fetchPublicCollections } from "../../utils/apiCalls";
import CollectionTable from "../../components/user/CollectionsTable";
import { Box, Typography, CircularProgress } from "@mui/material";
import Layout from "../../components/utils/Layout";
import { useDispatch } from "react-redux";
import { login } from "../../redux/reducers/authSlice";

const PublicCollections = () => {
	const [collections, setCollections] = useState([]);
	const [loading, setLoading] = useState(true);
	const dispatch = useDispatch();

	const username = "anyone";
	const password = "123456";
	dispatch(login({ username, password }));

	useEffect(() => {
		const fetchData = async () => {
			try {
				const collectionsData = await fetchPublicCollections();

				const collectionsWithStats = collectionsData.map((collection) => {
					return {
						...collection,
						numCollaborators: 0,
					};
				});

				console.log(collectionsWithStats);

				setCollections(collectionsWithStats);
				setLoading(false);
			} catch (error) {
				console.error("Failed to fetch data", error);
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	return (
		<Layout>
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
				{/* Collections Section */}
				<Box
					sx={{
						flex: 2,
						maxWidth: 800,
						padding: 3,
						backgroundColor: "#ffffff",
						borderRadius: 2,
						textAlign: "center",
						boxShadow: 3,
						display: "flex",
						flexDirection: "column",
						gap: 2,
					}}>
					<Typography variant="h5" sx={{ fontWeight: 500, mb: 2 }} textAlign={"left"}>
						Public Collections
					</Typography>
					{loading ? <CircularProgress /> : <CollectionTable collections={collections} />}
				</Box>
			</Box>
		</Layout>
	);
};

export default PublicCollections;
