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
import { Delete as DeleteIcon, CloudDownload } from "@mui/icons-material";

import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import {
	fetchEntriesByCollectionID,
	uploadCSVEntries,
	deleteEntriesAPI,
	fetchEntriesOfPublicCollection,
} from "../../utils/apiCalls";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Layout from "../../components/utils/Layout";
import { Link } from "react-router-dom";
import EntriesTable from "../../components/entries/EntriesTable";
import CSVUploader from "../../components/utils/CSVUploader";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { ErrorOutline } from "@mui/icons-material"; // Error icon

import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

const CollectionEntriesPage = () => {
	const { collectionID } = useParams();
	const location = useLocation();

	const queryParams = new URLSearchParams(location.search);
	const isPublic = queryParams.get("isPublic") === "true";
	const currUserMode = queryParams.get("mode");

	const currUser = useSelector((state) => state.auth.currentUser);

	const accessToken = currUser ? currUser.accessToken : null;

	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState("success");

	const [entries, setEntries] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedEntries, setSelectedEntries] = useState([]);
	const [openUploadDialog, setOpenUploadDialog] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [failedRows, setFailedRows] = useState([]);
	const [openFailedDialog, setOpenFailedDialog] = useState(false);

	// Pagination state
	const [page, setPage] = useState(1);
	const [totalEntries, setTotalEntries] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const [limit] = useState(10); // Entries per page

	// Search state
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		const fetchEntries = async () => {
			try {
				let data;
				if (isPublic) {
					// Fetch from the public endpoint without the accessToken
					data = await fetchEntriesOfPublicCollection(collectionID, page, limit, searchQuery, true);
				} else {
					// Fetch from the private endpoint with the accessToken
					data = await fetchEntriesByCollectionID(collectionID, accessToken, page, limit, searchQuery);
				}

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
	}, [collectionID, accessToken, page, limit, searchQuery, isPublic]);

	const handleCSVUpload = async (csvData) => {
		try {
			const response = await uploadCSVEntries(collectionID, csvData, accessToken);

			// Handle different response statuses
			if (response.data.status === "success") {
				setSnackbarMessage("CSV uploaded successfully!");
				setSnackbarSeverity("success");
				setOpenSnackbar(true); // Open Snackbar on success;
			} else if (response.data.status === "partial_success") {
				// Set failed rows and open the dialog
				setFailedRows(response.data.failedRows.slice(0, 5)); // Limit to first 5 failed rows
				setOpenFailedDialog(true);
			}

			const updatedEntries = await fetchEntriesByCollectionID(collectionID, accessToken, page, limit);
			setEntries(updatedEntries.entries);
			setTotalEntries(updatedEntries.totalEntries);
			setTotalPages(updatedEntries.totalPages);
		} catch (error) {
			console.error("Error uploading CSV:", error);
			alert("Error uploading CSV. Please try again.");
		} finally {
			setOpenUploadDialog(false);
		}
	};

	// Function to close the snackbar
	const handleCloseSnackbar = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}
		setOpenSnackbar(false);
	};

	const handleSelectAll = (event) => {
		setSelectedEntries(event.target.checked ? entries.map((entry) => entry._id) : []);
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
		setPage(1);
	};

	if (loading) {
		return <CircularProgress />;
	}

	return (
		<Layout>
			<Box mb={2}>
				<Grid container spacing={2} alignItems="center">
					<Grid item xs={12} md={3}>
						<Typography variant="h5" sx={{ fontWeight: "bold", color: "f0f0f0" }}>
							Collection Entries
						</Typography>
					</Grid>

					{/* TODO : Propogate a mode check, curr user is what mode for the collection */}
					{currUserMode !== "view" && (
						<Grid item xs={12} md={9}>
							<Grid container spacing={2} alignItems="center" justifyContent="flex-end">
								<Grid item>
									<Button
										variant="outlined"
										color="primary"
										onClick={() => setOpenUploadDialog(true)}
										startIcon={<VerticalAlignBottomIcon />}
										sx={{
											color: "#FFFFFF", // White text color
											borderColor: "#FFFFFF", // White border color
											"&:hover": {
												borderColor: "#FFFFFF",
												backgroundColor: "rgba(255, 255, 255, 0.1)", // Optional: light background on hover
											},
										}}>
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
							label={`Search in ${totalEntries} entries`}
							variant="outlined"
							fullWidth
							size="small"
							value={searchQuery}
							onChange={handleSearchChange}
							sx={{
								// Custom styles for the TextField
								"& .MuiOutlinedInput-root": {
									"& fieldset": {
										borderColor: "white", // Border color of the input
									},
									"&:hover fieldset": {
										borderColor: "white", // Border color on hover
									},
									"&.Mui-focused fieldset": {
										borderColor: "white", // Border color when focused
									},
									"& input": {
										color: "white", // Input text color
									},
								},
								"& .MuiInputLabel-root": {
									color: "white", // Label color
								},
								"& .MuiInputLabel-root.Mui-focused": {
									color: "white", // Label color when focused
								},
							}}
						/>
					</Grid>
				</Grid>
			</Box>

			<EntriesTable
				entries={entries}
				selectedEntries={selectedEntries}
				onSelectEntry={handleSelectEntry}
				onSelectAll={handleSelectAll}
				currUserMode={currUserMode}
                isPublic = {isPublic}
			/>

			<Grid container justifyContent="space-between" alignItems="center" mt={3}>
				<Grid item>
					<Pagination
						count={totalPages}
						page={page}
						onChange={handlePageChange}
						color="primary"
						sx={{
							"& .MuiPaginationItem-root": {
								color: "white", // Change the text color of pagination items to white
							},
							"& .MuiPaginationItem-root.Mui-selected": {
								color: "white", // Ensure the selected item text is also white
							},
							"& .MuiPaginationItem-root:hover": {
								backgroundColor: "rgba(255, 255, 255, 0.2)", // Optional: change background color on hover
							},
						}}
					/>
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

			{/* Failed Rows Dialog */}
			<Dialog open={openFailedDialog} onClose={() => setOpenFailedDialog(false)} maxWidth="lg" fullWidth>
				<DialogTitle sx={{ bgcolor: "#ffeef0", display: "flex", alignItems: "center" }}>
					<ErrorOutline sx={{ marginRight: 1 }} />
					Failed Rows Details
				</DialogTitle>
				<DialogContent sx={{ padding: 3, marginTop: 2 }}>
					<Typography variant="body1" gutterBottom>
						Partial Success: Some entries were processed with errors.
					</Typography>
					{/* Display the failed rows in a table or list */}
					{failedRows.length > 0 ? (
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Error Details</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{failedRows.map((row, index) => (
									<TableRow key={index}>
										<TableCell>
											<pre>{JSON.stringify(row, null, 2)}</pre>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					) : (
						<Typography>No failed rows to display.</Typography>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenFailedDialog(false)} color="primary">
						Close
					</Button>
				</DialogActions>
			</Dialog>

			<Snackbar
				open={openSnackbar}
				autoHideDuration={3000}
				onClose={handleCloseSnackbar}
				anchorOrigin={{ vertical: "top", horizontal: "center" }} // Positioning at top center
			>
				<Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
					{snackbarMessage}
				</Alert>
			</Snackbar>
		</Layout>
	);
};

export default CollectionEntriesPage;
