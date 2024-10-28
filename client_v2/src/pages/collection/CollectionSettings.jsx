import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
	fetchCollaboratorsAPI,
	fetchUserDetails,
	updateCollaboratorAPI,
	deleteCollaboratorAPI,
	addCollaboratorAPI,
	getAllUserMetas,
} from "../../utils/apiCalls";
import Layout from "../../components/utils/Layout";
import {
	Box,
	Typography,
	CircularProgress,
	Paper,
	IconButton,
	Button,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Select,
	MenuItem,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Grid,
} from "@mui/material";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import AddIcon from "@mui/icons-material/Add";
import SearchUserSelectComponent from "../../components/user/SearchUserSelect";

const CollectionSettings = () => {
	const { collectionID } = useParams();
	const [collaborators, setCollaborators] = useState([]);
	const [loading, setLoading] = useState(true);
	const [allUsers, setAllUsers] = useState([]);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [openAddDialog, setOpenAddDialog] = useState(false);
	const [selectedCollaborator, setSelectedCollaborator] = useState(null);
	const accessToken = useSelector((state) => state.auth.currentUser.accessToken);
	const currentUserID = useSelector((state) => state.auth.currentUser._id);

	useEffect(() => {
		const fetchCollaborators = async () => {
			const collaboratorsData = await fetchCollaboratorsAPI(collectionID, accessToken);
			return collaboratorsData;
		};

		const fetchUsersAndFilter = async (collaboratorsWithDetails) => {
			const allUsers = await getAllUserMetas(accessToken);
			return allUsers.filter(
				(user) =>
					user._id !== currentUserID &&
					!collaboratorsWithDetails.some((collaborator) => collaborator.user_id === user._id)
			);
		};

		const fetchData = async () => {
			try {
				const collaboratorsData = await fetchCollaborators();
				const userIds = collaboratorsData.map((collaborator) => collaborator.user_id);
				const userDetails = await fetchUserDetails(userIds, accessToken);

				const collaboratorsWithDetails = collaboratorsData.map((collaborator) => {
					const user = userDetails.find((user) => user._id === collaborator.user_id);
					return {
						...collaborator,
						username: user.username,
						email: user.email,
					};
				});

				const filteredUsers = await fetchUsersAndFilter(collaboratorsWithDetails);

				setCollaborators(collaboratorsWithDetails);
				setAllUsers(filteredUsers);
			} catch (error) {
				console.error("Failed to fetch collaborators", error);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [collectionID, accessToken, currentUserID]);

	const handleModeToggle = async (collaboratorID, newMode) => {
		try {
			const updatedCollaborator = { user_id: collaboratorID, mode: newMode };
			await updateCollaboratorAPI(collectionID, updatedCollaborator, accessToken);
			setCollaborators((prevCollaborators) =>
				prevCollaborators.map((collaborator) =>
					collaborator.user_id === collaboratorID ? { ...collaborator, mode: newMode } : collaborator
				)
			);
		} catch (error) {
			console.error("Failed to update collaborator mode", error);
		}
	};

	const handleRemoveCollaborator = async () => {
		if (!selectedCollaborator) return;
		try {
			await deleteCollaboratorAPI(collectionID, selectedCollaborator.user_id, accessToken);
			const removedUser = collaborators.find(
				(collaborator) => collaborator.user_id === selectedCollaborator.user_id
			);
			setCollaborators((prevCollaborators) =>
				prevCollaborators.filter((collaborator) => collaborator.user_id !== selectedCollaborator.user_id)
			);
			setAllUsers((prevUsers) => [...prevUsers, { _id: removedUser.user_id, username: removedUser.username }]);
			setOpenDeleteDialog(false);
			setSelectedCollaborator(null);
		} catch (error) {
			console.error("Failed to remove collaborator", error);
		}
	};

	const handleAddCollaborator = async (collaboratorID) => {
		try {
			const newCollaborator = { user_id: collaboratorID, mode: "view" };
			const updatedCollection = await addCollaboratorAPI(collectionID, newCollaborator, accessToken);
			const userIds = updatedCollection.collaborators.map((collaborator) => collaborator.user_id);
			const userDetails = await fetchUserDetails(userIds, accessToken);
			const collaboratorsWithDetails = updatedCollection.collaborators.map((collaborator) => {
				const user = userDetails.find((user) => user._id === collaborator.user_id);
				return {
					...collaborator,
					username: user.username,
					email: user.email,
				};
			});
			const filteredUsers = await getAllUserMetas(accessToken).then((allUsers) =>
				allUsers.filter(
					(user) =>
						user._id !== currentUserID &&
						!collaboratorsWithDetails.some((collaborator) => collaborator.user_id === user._id)
				)
			);
			setCollaborators(collaboratorsWithDetails);
			setAllUsers(filteredUsers);
			setOpenAddDialog(false);
		} catch (error) {
			console.error("Failed to add collaborator", error);
		}
	};

	const handleUserAdd = (selectedUser) => {
		if (selectedUser) {
			handleAddCollaborator(selectedUser.user_id);
		}
	};

	const handleDeleteClick = (collaborator) => {
		setSelectedCollaborator(collaborator);
		setOpenDeleteDialog(true);
	};

	if (loading) {
		return <CircularProgress />;
	}

	return (
		<Layout>
			<Box sx={{ padding: 0 }}>
				<Paper sx={{ padding: 4, marginBottom: 3, background: "#2e2e2e" }}>
					<Grid container spacing={0} alignItems="center">
						<Grid item xs={6}>
							<Typography variant="h6" gutterBottom sx={{ color: "#F2E9E4" }}>
								Collaborators
							</Typography>
						</Grid>
						<Grid item xs={6} sx={{ textAlign: "right" }}>
							<Button variant="contained" sx={{ marginBottom: 2 }} onClick={() => setOpenAddDialog(true)}>
								<AddIcon /> Add Collaborator
							</Button>
						</Grid>
					</Grid>
					<TableContainer
						component={Paper}
						sx={{
							paddingLeft: 0.8,
							paddingRight: 1,
							boxShadow: "none",
							background: "#2E2E2E",
						}}>
						<Table
							sx={{
								border: "none",
							}}>
							<TableHead>
								<TableRow>
									<TableCell sx={{ padding: "8px", color: "#F2E9E4" }}>Name</TableCell>
									<TableCell sx={{ padding: "8px", color: "#F2E9E4" }}>Email</TableCell>
									<TableCell sx={{ padding: "8px", color: "#F2E9E4" }}>Mode</TableCell>
									<TableCell sx={{ padding: "8px", color: "#F2E9E4" }} align="right"></TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{collaborators.map((collaborator) => (
									<TableRow key={collaborator.user_id}>
										<TableCell sx={{ color: "#F2E9E4", padding: "8px" }}>
											{collaborator.username}
										</TableCell>
										<TableCell sx={{ color: "#F2E9E4", padding: "8px" }}>
											{collaborator.email}
										</TableCell>
										<TableCell sx={{ color: "#F2E9E4", padding: "8px" }}>
											<Select
												value={collaborator.mode}
												onChange={(e) => handleModeToggle(collaborator.user_id, e.target.value)}
												variant="outlined"
												sx={{
													width: "95px",
													height: "40px",
													borderRadius: "50px",
													backgroundColor: "#d9d9d9",
													"& .MuiOutlinedInput-notchedOutline": {
														border: "none", // Remove the border
													},
													"&:hover .MuiOutlinedInput-notchedOutline": {
														border: "none", // Remove the border on hover
													},
													"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
														border: "none", // Remove the border when focused
													},
												}}>
												<MenuItem value="view">View</MenuItem>
												<MenuItem value="edit">Edit</MenuItem>
											</Select>
										</TableCell>
										<TableCell sx={{ padding: "8px" }} align="right">
											<IconButton
												onClick={() => handleDeleteClick(collaborator)}
												sx={{
													color: "gray",
													"&:hover": {
														backgroundColor: "#f8d7da",
														"& .MuiSvgIcon-root": {
															color: "#cf4553", // Change the color of the icon on hover
														},
													},
												}}>
												<PersonRemoveIcon />
											</IconButton>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</Paper>
				{/* wrap search user select in a dialog */}
				<Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} fullWidth>
					<DialogTitle>Add Collaborator</DialogTitle>
					<DialogContent
						sx={{
							minHeight: "100px", // Set a minimum height to prevent squishing
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
						}}>
						<SearchUserSelectComponent users={allUsers} onUserSelect={handleUserAdd} />
					</DialogContent>
				</Dialog>
			</Box>

			{/* Confirmation Dialog */}
			<Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
				<DialogTitle>Confirm Delete</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Are you sure you want to remove <strong>{selectedCollaborator?.username} </strong>as
						collaborator from this collection?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenDeleteDialog(false)} color="primary">
						Cancel
					</Button>
					<Button onClick={handleRemoveCollaborator} color="secondary">
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</Layout>
	);
};

export default CollectionSettings;
