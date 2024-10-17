import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
	CircularProgress,
	Button,
	Grid,
	Typography,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Box,
	Pagination,
	TextField, // Import TextField for search bar
} from "@mui/material";
import { Delete as DeleteIcon, Upload as UploadIcon, CloudDownload } from "@mui/icons-material";

import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import { fetchEntriesByCollectionID, uploadCSVEntries, deleteEntriesAPI } from "../../utils/apiCalls";
import { useSelector } from "react-redux";
import Layout from "../../components/utils/Layout";
import { Link } from "react-router-dom";
import EntriesTable from "../../components/entries/EntriesTable";
import CSVUploader from "../../components/utils/CSVUploader";

const CollectionEntriesPage = () => {
	const { collectionID } = useParams();
	const accessToken = useSelector((state) => state.auth.currentUser.accessToken);

	const currUser = useSelector((state) => state.auth.currentUser);

	const [entries, setEntries] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedEntries, setSelectedEntries] = useState([]);
	const [openUploadDialog, setOpenUploadDialog] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

	// Pagination state
	const [page, setPage] = useState(1);
	const [totalEntries, setTotalEntries] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const [limit] = useState(10); // Entries per page

	// Search state
	const [searchQuery, setSearchQuery] = useState("");
	const [filteredEntries, setFilteredEntries] = useState([]);

	useEffect(() => {
		const fetchEntries = async () => {
			try {
				const data = await fetchEntriesByCollectionID(collectionID, accessToken, page, limit);
				setEntries(data.entries);
				setTotalEntries(data.totalEntries);
				setTotalPages(data.totalPages);
			} catch (error) {
				console.error("Error fetching entries:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchEntries();
	}, [collectionID, accessToken, page, limit]);

	useEffect(() => {
		filterEntries(searchQuery);
	}, [entries, searchQuery]);

	const filterEntries = (query) => {
		if (!query) {
			setFilteredEntries(entries);
		} else {
			const lowercasedQuery = query.toLowerCase();
			const filtered = entries.filter((entry) =>
				entry.identification.bionomialSpeciesName.toLowerCase().includes(lowercasedQuery)
			);
			setFilteredEntries(filtered);
		}
	};

	const handleCSVUpload = async (csvData) => {
		try {
			await uploadCSVEntries(collectionID, csvData, accessToken);
			const updatedEntries = await fetchEntriesByCollectionID(collectionID, accessToken, page, limit);
			setEntries(updatedEntries.entries);
			setTotalEntries(updatedEntries.totalEntries);
			setTotalPages(updatedEntries.totalPages);
		} catch (error) {
			console.error("Error uploading CSV:", error);
		} finally {
			setOpenUploadDialog(false);
		}
	};

	const handleSelectAll = (event) => {
		setSelectedEntries(event.target.checked ? filteredEntries.map((entry) => entry._id) : []);
	};

	const handleSelectEntry = (entryId) => {
		setSelectedEntries((prevSelected) =>
			prevSelected.includes(entryId) ? prevSelected.filter((id) => id !== entryId) : [...prevSelected, entryId]
		);
	};

	const handleDeleteSelected = async () => {
		try {
			await deleteEntriesAPI(collectionID, selectedEntries, accessToken);

			// Fetch updated entries after deletion
			const updatedEntries = await fetchEntriesByCollectionID(collectionID, accessToken, page, limit);

			// Check if the current page has no entries and adjust the page number
			if (updatedEntries.entries.length === 0 && page > 1) {
				setPage((prevPage) => prevPage - 1); // Go to the previous page
			} else {
				setEntries(updatedEntries.entries);
				setTotalEntries(updatedEntries.totalEntries);
				setTotalPages(updatedEntries.totalPages);
				setSelectedEntries([]);
			}
		} catch (error) {
			console.error("Error deleting entries:", error);
		} finally {
			setOpenDeleteDialog(false);
		}
	};

	const handlePageChange = (event, newPage) => {
		setPage(newPage);
	};

	const handleSearchChange = (event) => {
		const query = event.target.value;
		setSearchQuery(query);
		filterEntries(query);
	};

	if (loading) {
		return <CircularProgress />;
	}

	return (
		<Layout>
			<Box mb={2}>
				<Grid container spacing={2} alignItems="center">
					<Grid item xs={12} md={3}>
						<Typography variant="h5" sx={{ fontWeight: "bold" }}>
							Collection Entries
						</Typography>
					</Grid>
					{/* TODO : Propogate a mode check, curr user is what mode for the collection */}
					{currUser && currUser.username !== "anyone" && (
						<Grid item xs={12} md={9}>
							<Grid container spacing={2} alignItems="center" justifyContent="flex-end">
								<Grid item>
									<Button
										variant="outlined"
										color="primary"
										onClick={() => setOpenUploadDialog(true)}
										startIcon={<VerticalAlignBottomIcon />}>
										Import
									</Button>
								</Grid>
								<Grid item>
									<Button
										component={Link}
										to={`/collection/${collectionID}/entry/create`}
										variant="contained"
										color="primary">
										+ New Entry
									</Button>
								</Grid>
							</Grid>
						</Grid>
					)}
					<Grid item xs={12} md={3}>
						<TextField
							label={`Search in ${entries.length} entries`}
							variant="outlined"
							fullWidth
							size="small"
							value={searchQuery}
							onChange={handleSearchChange}
						/>
					</Grid>
				</Grid>
			</Box>

			<EntriesTable
				entries={filteredEntries}
				selectedEntries={selectedEntries}
				onSelectEntry={handleSelectEntry}
				onSelectAll={handleSelectAll}
			/>

			<Grid container justifyContent="space-between" alignItems="center" mt={3}>
				<Grid item>
					<Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
				</Grid>

				{selectedEntries.length > 0 && (
					<Grid item>
						<Button
							variant="contained"
							color="secondary"
							onClick={() => setOpenDeleteDialog(true)}
							startIcon={<DeleteIcon />}>
							Delete Selected
						</Button>
					</Grid>
				)}
			</Grid>

			{/* Upload CSV Dialog */}
			<Dialog
				open={openUploadDialog}
				onClose={() => setOpenUploadDialog(false)}
				// make the dialog bigger
				maxWidth="xl">
				<DialogTitle>Bulk Upload Your Data 🚀</DialogTitle>
				<DialogContent>
					<Typography variant="body1" gutterBottom>
						Easily import your data by uploading a CSV file. Follow the sample format shown below to ensure
						a smooth upload experience :
					</Typography>
					<br />

					{/* Reference Image */}
					<Box display="flex" justifyContent="center" mb={2}>
						<img
							src={`${process.env.PUBLIC_URL}/entries_upload.png`} // Update with your image path
							alt="Reference for CSV Upload"
							style={{ maxWidth: "100%", height: "auto" }} // Responsive styling
						/>
					</Box>
					<div style={{ marginBottom: 16, marginTop: 10 }}>
						<Button
							variant="contained"
							color="primary"
							startIcon={<CloudDownload />} // Add the download icon at the start
							onClick={() => {
								const link = document.createElement("a");
								link.href = `${process.env.PUBLIC_URL}/entries_upload_sample.csv`;
								link.download = "entries_upload_sample.csv"; // Specify the download attribute
								document.body.appendChild(link);
								link.click();
								document.body.removeChild(link);
							}} // Trigger download on click
						>
							Sample CSV
						</Button>
					</div>

					<CSVUploader onUpload={handleCSVUpload} />
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenUploadDialog(false)} color="primary">
						Cancel
					</Button>
				</DialogActions>
			</Dialog>

			{/* Delete Confirmation Dialog */}
			<Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
				<DialogTitle>Confirm Deletion</DialogTitle>
				<DialogContent>
					<Typography variant="body1">Are you sure you want to delete the selected entries?</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenDeleteDialog(false)} color="primary">
						Cancel
					</Button>
					<Button onClick={handleDeleteSelected} color="secondary">
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</Layout>
	);
};

export default CollectionEntriesPage;
