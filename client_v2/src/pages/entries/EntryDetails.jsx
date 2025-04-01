// src/pages/EntryDetailsPage.js
import React, { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Typography, Paper, Box, Button, Divider, Grid } from "@mui/material";
import { getEntryAPI, getPublicEntryAPI, getCollectionAPI, getPublicCollectionAPI } from "../../utils/apiCalls";
import Layout from "../../components/utils/Layout";
import { useSelector } from "react-redux";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import CardSkeleton from "../../components/utils/CardSkeleton";

const EntryDetailsPage = () => {
	const user = useSelector((state) => state.auth.currentUser);

	const { entryID } = useParams();
	const [entry, setEntry] = useState(null);
	const [collection, setCollection] = useState(null);
	const [loading, setLoading] = useState(true);
	const [loadingEntry, setLoadingEntry] = useState(true);
	const [loadingCollection, setLoadingCollection] = useState(true);

	const location = useLocation();

	const queryParams = new URLSearchParams(location.search);
	const isPublic = queryParams.get("isPublic") === "true";

	useEffect(() => {
		const fetchEntry = async () => {
			try {
				let data;
				if (isPublic) {
					data = await getPublicEntryAPI(entryID);
				} else {
					data = await getEntryAPI(entryID, user.accessToken);
				}

				setEntry(data);
			} catch (error) {
				console.error("Error fetching entry:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchEntry();
	}, [entryID, user, isPublic]);

	useEffect(() => {
		const fetchCollection = async () => {
			if (entry?.collectionID) {
				try {
					let collection;
					if (isPublic) {
						collection = await getPublicCollectionAPI(entry.collectionID);
					} else {
						collection = await getCollectionAPI(entry.collectionID, user.accessToken);
					}
					setCollection(collection);
				} catch (error) {
					console.error("Error fetching collection:", error);
				}
			}
		};

		fetchCollection();
	}, [entry, user, isPublic]);

	if (loading) {
		return (
			<Layout>
				<CardSkeleton />
			</Layout>
		);
	}

	if (!entry) {
		return <Typography variant="h6">Entry not found</Typography>;
	}

	return (
		<Layout>
			<Paper
				style={{
					padding: "20px",
					marginTop: "20px",
					maxWidth: "1500px",
					margin: "0 auto",
					background: "rgba(255, 255, 255, 0.8)",
				}}>
				<Grid container alignItems="center" justifyContent="space-between">
					{/* Collection Name on the Right */}
					<Grid item>
						<Typography variant="h6" gutterBottom>
							Collection:{" "}
							{collection?.name ? (
								<a
									href={`/collection/${collection._id}?isPublic=${isPublic}`}
									style={{ textDecoration: "none", color: "#1976d2" }}>
									{collection.name}
								</a>
							) : (
								"N/A"
							)}
							<ArrowOutwardIcon sx={{ color: "#1976d2", ml: 1 }} />
						</Typography>
					</Grid>

					<Grid item>
						{!isPublic && user && (
							<Button
								component={Link}
								variant="contained"
								to={`/collection/${collection?._id}/entry/${entry._id}/edit`}
								edge="end">
								Edit
							</Button>
						)}
					</Grid>
				</Grid>

				<Divider style={{ margin: "5px 0" }} />

				<Grid container spacing={2} sx={{ maxWidth: "1000px", margin: "auto" }}>
					{/* Thumbnail (Full Width on Small, Side on Large) */}
					{entry.identification.thumbnail && (
						<Grid item xs={12} md={4}>
							<Box sx={{ border: "1px solid #858585", padding: 2, borderRadius: "8px" }}>
								<Typography variant="h6">Data Thumbnail</Typography>
								<img
									src={entry.identification.thumbnail}
									alt="Thumbnail"
									style={{
										maxWidth: "100%",
										height: "auto",
									}}
								/>
							</Box>
						</Grid>
					)}

					{/* Identification */}
					<Grid item xs={6}>
						<Box sx={{ border: "1px solid #858585", padding: 2, borderRadius: "8px" }}>
							<Typography variant="h6">Identification</Typography>
							{entry.archivalIdentification?.archivalSpeciesCode && (
								<Typography>
									<strong>Specimen ID: </strong> {entry.archivalIdentification.archivalSpeciesCode}
								</Typography>
							)}
							<Typography>
								<strong>NCBI Taxonomy Code: </strong> {entry.identification.NCBITaxonomyCode || "N/A"}
							</Typography>
							<Typography>
								<strong>Species Name:</strong> {entry.identification.bionomialSpeciesName || "N/A"}
							</Typography>
							<Typography>
								<strong>Order:</strong> {entry.identification.order || "N/A"}
							</Typography>
							<Typography>
								<strong>Wikipedia:</strong>
								{entry.identification.wikipediaSpeciesName ? (
									<a
										href={entry.identification.wikipediaSpeciesName}
										target="_blank"
										rel="noopener noreferrer">
										{` wikipedia.org/${entry.identification.wikipediaSpeciesName.split("/").pop()}`}{" "}
									</a>
								) : (
									"N/A"
								)}
							</Typography>
						</Box>
					</Grid>

					{/* Physiological Information */}
					<Grid item xs={6}>
						<Box sx={{ border: "1px solid #858585", padding: 2, borderRadius: "8px" }}>
							<Typography variant="h6">Physiological Information</Typography>
							<Typography>
								<strong>Developmental Stage:</strong>{" "}
								{entry.physiologicalInformation.age.developmentalStage || "N/A"}
							</Typography>
							<Typography>
								<strong>Sex:</strong>{" "}
								{{ m: "Male", f: "Female", u: "Undefined" }[entry.physiologicalInformation.sex] ||
									"N/A"}
							</Typography>
							<Typography>
								<strong>Body Weight:</strong> {entry.physiologicalInformation.bodyWeight || "N/A"} g
							</Typography>
							<Typography>
								<strong>Brain Weight:</strong> {entry.physiologicalInformation.brainWeight || "N/A"} g
							</Typography>
						</Box>
					</Grid>

					{/* Histological Information */}
					<Grid item xs={6}>
						<Box sx={{ border: "1px solid #858585", padding: 2, borderRadius: "8px" }}>
							<Typography variant="h6">Histological Information</Typography>
							<Typography>
								<strong>Brain Part:</strong> {entry.histologicalInformation.brainPart || "N/A"}
							</Typography>
							<Typography>
								<strong>Staining Method:</strong>{" "}
								{entry.histologicalInformation.stainingMethod || "N/A"}
							</Typography>
							<Typography>
								<strong>Plane of Sectioning:</strong>{" "}
								{entry.histologicalInformation.planeOfSectioning || "N/A"}
							</Typography>
							<Typography>
								<strong>Inter-Section Distance:</strong>{" "}
								{entry.histologicalInformation.interSectionDistance || "N/A"} µm
							</Typography>
						</Box>
					</Grid>

					{/* Links & Sources */}
					<Grid item xs={12}>
						<Box sx={{ border: "1px solid #858585", padding: 2, borderRadius: "8px" }}>
							<Typography variant="h6">Links & Sources</Typography>
							{entry.identification?.microdraw_link && (
								<Typography>
									<strong>MicroDraw:</strong>{" "}
									<a
										href={entry.identification.microdraw_link}
										target="_blank"
										rel="noopener noreferrer">
										{entry.identification.microdraw_link.length > 50
											? entry.identification.microdraw_link.substring(0, 50) + "..."
											: entry.identification.microdraw_link}
									</a>
								</Typography>
							)}

							<Typography>
								<strong>Source:</strong>
								{entry.identification.source_link ? (
									<a
										href={entry.identification.source_link}
										target="_blank"
										rel="noopener noreferrer">
										{" "}
										{entry.identification.source_link}
									</a>
								) : (
									"N/A"
								)}
							</Typography>
						</Box>
					</Grid>
				</Grid>

				<Box mt={3} textAlign="center">
					<Button variant="contained" color="primary" onClick={() => window.history.back()}>
						Back
					</Button>
				</Box>
			</Paper>
		</Layout>
	);
};

export default EntryDetailsPage;
