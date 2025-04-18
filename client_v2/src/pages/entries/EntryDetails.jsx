// src/pages/EntryDetailsPage.js
import React, { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Typography, Paper, Box, Button, Grid } from "@mui/material";
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
				elevation={3}
				sx={{
					padding: 4,
					marginTop: 4,
					maxWidth: "1200px",
					margin: "0 auto",
					background: "rgba(255, 255, 255, 0.9)",
					borderRadius: 2,
				}}>
				{/* Header Section */}
				<Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
					<Typography variant="h4" fontWeight="bold">
						Entry Details
					</Typography>
					{!isPublic && user && (
						<Button
							component={Link}
							variant="contained"
							to={`/collection/${collection?._id}/entry/${entry._id}/edit`}
							startIcon={<ArrowOutwardIcon />}>
							Edit Entry
						</Button>
					)}
				</Box>

				{/* Collection Info */}
				<Box mb={3}>
					<Typography variant="h6" color="textSecondary">
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
					</Typography>
				</Box>

				{/* Main Content */}
				<Grid container spacing={3}>
					{/* Thumbnail */}
					{entry.identification.thumbnail && (
						<Grid item xs={12} md={4}>
							<Box
								sx={{
									border: "1px solid #ddd",
									padding: 2,
									borderRadius: 2,
									textAlign: "center",
									backgroundColor: "#f9f9f9",
									height: "100%",
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									justifyContent: "center",
								}}>
								<Typography variant="subtitle1" fontWeight="bold" mb={2}>
									Data Thumbnail
								</Typography>
								<img
									src={entry.identification.thumbnail}
									alt="Thumbnail"
									style={{
										width: "140px",
										height: "140px",
										objectFit: "cover",
										borderRadius: "8px",
									}}
								/>
							</Box>
						</Grid>
					)}

					{/* Identification */}
					<Grid item xs={12} md={8}>
						<Box
							sx={{
								border: "1px solid #ddd",
								padding: 3,
								borderRadius: 2,
								backgroundColor: "#f9f9f9",
								height: "100%",
							}}>
							<Typography variant="h6" fontWeight="bold" mb={2}>
								Identification
							</Typography>
							<Typography>
								<strong>Specimen ID:</strong>{" "}
								{entry.archivalIdentification?.archivalSpeciesCode || "N/A"}
							</Typography>
							<Typography>
								<strong>NCBI Taxonomy Code:</strong> {entry.identification.NCBITaxonomyCode || "N/A"}
							</Typography>
							<Typography>
								<strong>Species Name:</strong> {entry.identification.bionomialSpeciesName || "N/A"}
							</Typography>
							<Typography>
								<strong>Order:</strong> {entry.identification.order || "N/A"}
							</Typography>
							<Typography>
								<strong>Wikipedia:</strong>{" "}
								{entry.identification.wikipediaSpeciesName ? (
									<a
										href={entry.identification.wikipediaSpeciesName}
										target="_blank"
										rel="noopener noreferrer">
										{entry.identification.wikipediaSpeciesName.split("/").pop()}
									</a>
								) : (
									"N/A"
								)}
							</Typography>
						</Box>
					</Grid>

					{/* Physiological Information */}
					<Grid item xs={12} md={6}>
						<Box
							sx={{
								border: "1px solid #ddd",
								padding: 3,
								borderRadius: 2,
								backgroundColor: "#f9f9f9",
								height: "100%",
							}}>
							<Typography variant="h6" fontWeight="bold" mb={2}>
								Physiological Information
							</Typography>
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
					<Grid item xs={12} md={6}>
						<Box
							sx={{
								border: "1px solid #ddd",
								padding: 3,
								borderRadius: 2,
								backgroundColor: "#f9f9f9",
								height: "100%",
							}}>
							<Typography variant="h6" fontWeight="bold" mb={2}>
								Histological Information
							</Typography>
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
								<strong>Section Thickness:</strong>{" "}
								{entry.histologicalInformation.sectionThickness || "N/A"} µm
							</Typography>
							<Typography>
								<strong>Inter-Section Distance:</strong>{" "}
								{entry.histologicalInformation.interSectionDistance || "N/A"}
							</Typography>
						</Box>
					</Grid>

					{/* Links & Sources */}
					<Grid item xs={12}>
						<Box
							sx={{
								border: "1px solid #ddd",
								padding: 3,
								borderRadius: 2,
								backgroundColor: "#f9f9f9",
								height: "100%",
							}}>
							<Typography variant="h6" fontWeight="bold" mb={2}>
								Links & Sources
							</Typography>
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
								<strong>Source:</strong>{" "}
								{entry.identification.source_link ? (
									<a
										href={entry.identification.source_link}
										target="_blank"
										rel="noopener noreferrer">
										{entry.identification.source_link}
									</a>
								) : (
									"N/A"
								)}
							</Typography>
						</Box>
					</Grid>
				</Grid>

				{/* Back Button */}
				<Box mt={1} textAlign="left">
					<Button variant="contained" color="primary" onClick={() => window.history.back()}>
						{"< "}Back
					</Button>
				</Box>
			</Paper>
		</Layout>
	);
};

export default EntryDetailsPage;
