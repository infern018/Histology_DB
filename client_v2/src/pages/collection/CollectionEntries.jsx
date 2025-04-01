import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CircularProgress, Button, Grid, Typography, Box, Pagination } from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";

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
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

import UploadCSVDialog from "../../components/dialogs/UploadCSVDialog";
import DeleteConfirmationDialog from "../../components/dialogs/DeleteConfirmationDialog";
import FailedRowsInsertDialog from "../../components/dialogs/FailedRowsInsertDialog";
import TableSkeleton from "../../components/utils/TableSkeleton";

const CollectionEntriesPage = () => {
	const { collectionID } = useParams();

	const location = useLocation();

	const queryParams = new URLSearchParams(location.search);
	const isPublic = queryParams.get("isPublic") === "true";
	const collectionName = queryParams.get("collectionName");
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

	const [sortField, setSortField] = useState("_id");
	const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"

	// Pagination state
	const [page, setPage] = useState(1);
	// const [totalEntries, setTotalEntries] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const [limit] = useState(10); // Entries per page

	useEffect(() => {
		const fetchEntries = async () => {
			try {
				let data;
				if (isPublic) {
					// Fetch from the public endpoint without the accessToken
					data = await fetchEntriesOfPublicCollection(collectionID, page, limit, sortField, sortOrder);
				} else {
					// Fetch from the private endpoint with the accessToken
					data = await fetchEntriesByCollectionID(
						collectionID,
						accessToken,
						page,
						limit,
						sortField,
						sortOrder
					);
				}

				setEntries(data.entries);
				// setTotalEntries(data.totalEntries);
				setTotalPages(data.totalPages);
			} catch (error) {
				console.error("Error fetching entries:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchEntries();
	}, [collectionID, accessToken, page, limit, isPublic, sortField, sortOrder]);

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
			// setTotalEntries(updatedEntries.totalEntries);
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

	const handleSort = (field, order) => {
		setSortField(field);
		setSortOrder(order);
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
				// setTotalEntries(updatedEntries.totalEntries);
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

	if (loading) {
		return (
			<Layout>
				<Typography
					variant="h5"
					gutterBottom
					sx={{ display: "flex", textAlign: "left", marginBottom: "1.3rem" }}>
					Loading Collection...
				</Typography>
				<TableSkeleton />
			</Layout>
		);
	}

	return (
		<Layout>
			<Box mb={2} sx={{ width: "100%" }}>
				<Grid container spacing={2} alignItems="center" justifyContent="space-between">
					{/* Collection Name & Visualize Button - Always on the Left */}
					<Grid item sx={{ display: "flex", alignItems: "center", gap: 2 }}>
						<Typography variant="h5">{collectionName}</Typography>
						<Button
							component={Link}
							to={`/visualize/collection/${collectionID}?isPublic=${isPublic}`}
							variant="contained"
							startIcon={<AutoFixHighIcon />}
							color="primary">
							Visualize
						</Button>
					</Grid>

					{/* Import & New Entry Buttons - Always on the Right */}
					{currUserMode !== "view" && (
						<Grid item sx={{ display: "flex", gap: 2 }}>
							<Button
								variant="outlined"
								color="primary"
								onClick={() => setOpenUploadDialog(true)}
								startIcon={<VerticalAlignBottomIcon />}
								sx={{
									color: "#FFFFFF",
									borderColor: "#FFFFFF",
									"&:hover": {
										borderColor: "#FFFFFF",
										backgroundColor: "rgba(255, 255, 255, 0.1)",
									},
								}}>
								Import
							</Button>
							<Button
								component={Link}
								to={`/collection/${collectionID}/entry/create`}
								variant="contained"
								color="primary">
								+ New Entry
							</Button>
						</Grid>
					)}
				</Grid>
			</Box>

			<EntriesTable
				entries={entries}
				selectedEntries={selectedEntries}
				onSelectEntry={handleSelectEntry}
				onSelectAll={handleSelectAll}
				currUserMode={currUserMode}
				isPublic={isPublic}
				handleSort={handleSort}
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
			<UploadCSVDialog
				open={openUploadDialog}
				onClose={() => setOpenUploadDialog(false)}
				onUpload={handleCSVUpload}
			/>

			{/* Delete Confirmation Dialog */}
			<DeleteConfirmationDialog
				open={openDeleteDialog}
				onClose={() => setOpenDeleteDialog(false)}
				onConfirm={handleDeleteSelected}
			/>

			{/* Failed Rows Dialog */}
			<FailedRowsInsertDialog
				open={openFailedDialog}
				onClose={() => setOpenFailedDialog(false)}
				failedRows={failedRows}
			/>

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
