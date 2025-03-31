import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import { getCollectionAPI, getPublicCollectionAPI } from "../../utils/apiCalls";
import Layout from "../../components/utils/Layout";
import { Link } from "react-router-dom";
import { Box, Button } from "@mui/material";

const CollectionDetails = () => {
	const { collectionID } = useParams();
	const user = useSelector((state) => state.auth.currentUser);
	const [collection, setCollection] = useState(null);

	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const isPublic = queryParams.get("isPublic") === "true";

	useEffect(() => {
		const fetchCollection = async () => {
			try {
				let collection;
				if (isPublic) {
					collection = await getPublicCollectionAPI(collectionID);
				} else {
					collection = await getCollectionAPI(collectionID, user.accessToken);
				}
				setCollection(collection);
			} catch (error) {
				console.error("Error fetching collection:", error);
			}
		};

		fetchCollection();
	}, [collectionID, user, isPublic]);

	return (
		<Layout>
			<Box
				sx={{
					textAlign: "left",
					maxWidth: "65%",
				}}>
				{collection ? (
					<div style={{ color: "white" }}>
						{/* Required Field */}
						<h1>{collection.name} Collection</h1>

						{/* Optional Fields */}
						{collection.description && <p>{collection.description}</p>}

						{/* Contact Information */}
						{collection.contact?.name && (
							<p>
								<strong>Contact Name:</strong> {collection.contact.name}
							</p>
						)}

						{collection.contact?.email && (
							<p>
								<strong>Contact Email:</strong>{" "}
								<a href={`mailto:${collection.contact.email}`} style={{ color: "white" }}>
									{collection.contact.email}
								</a>
							</p>
						)}

						{collection.contact?.phone && (
							<p>
								<strong>Contact Phone:</strong> {collection.contact.phone}
							</p>
						)}

						{collection.contact?.doi && (
							<p>
								<strong>DOI:</strong>{" "}
								<a href={`${collection.contact.doi}`} style={{ color: "white" }}>
									{collection.contact.doi}
								</a>
							</p>
						)}

						{/* View Entries */}
						<Button
							component={Link}
							to={`/collection/${collection._id}/entries?mode=view&isPublic=${isPublic}&collectionName=${collection.name}`}
							variant="contained"
							sx={{
								backgroundColor: "#212020",
								color: "white",
								"&:hover": {
									backgroundColor: "#555", // Slightly lighter grey on hover
								},
							}}>
							View all entries in {collection.name}
						</Button>
					</div>
				) : (
					<p style={{ color: "white" }}>Loading...</p>
				)}
			</Box>
		</Layout>
	);
};

export default CollectionDetails;
