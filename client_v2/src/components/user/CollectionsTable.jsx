import React from "react";
import { Link } from "react-router-dom";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	IconButton,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteIcon from "@mui/icons-material/Delete";
import { deleteCollectionAPI } from "../../utils/apiCalls";
import { useState } from "react";
import { useSelector } from "react-redux";

const CollectionTable = ({ collections, isPublic }) => {
	if (!isPublic) {
		isPublic = false;
	}

	const user = useSelector((state) => state.auth.currentUser);

	const [displayCollections, setDisplayCollections] = useState(collections);

	const handleDeleteCollection = async (collectionId) => {
		try {
			await deleteCollectionAPI(collectionId, user.accessToken);
			// Remove the collection from the state
			const updatedCollections = collections.filter((collection) => collection.collection_id !== collectionId);
			setDisplayCollections(updatedCollections);
		} catch (error) {
			console.error("Failed to delete collection:", error);
		}
	};

	return (
		<TableContainer sx={{ backgroundColor: "#262625" }}>
			<Table>
				<TableHead>
					<TableRow sx={{ backgroundColor: "#333333" }}>
						<TableCell>
							<Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#ffffff" }}>
								Name
							</Typography>
						</TableCell>
						{/* <TableCell>
							<Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#ffffff" }}>
								Collaborators
							</Typography>
						</TableCell> */}
						<TableCell>
							<Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#ffffff" }}>
								Mode
							</Typography>
						</TableCell>
						<TableCell align="left" sx={{ width: "50px" }}></TableCell>
						<TableCell align="left" sx={{ width: "50px" }}></TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{displayCollections.map((collection, index) => (
						<TableRow
							key={index}
							hover
							sx={{
								cursor: "pointer", // Makes the row indicate clickability
								"&:hover": {
									backgroundColor: "#333333 !important", // Stronger hover color with !important
									borderColor: "#ffffff", // Optional border color on hover
									borderWidth: "1px",
									borderStyle: "solid",
								},
							}}>
							<TableCell>
								<Link
									to={`/collection/${collection.collection_id}?isPublic=${isPublic}`}
									style={{ textDecoration: "none", color: "inherit" }}>
									<Typography variant="body2" color="white">
										{collection.name}
									</Typography>
								</Link>
							</TableCell>
							{/* <TableCell>
								<Typography variant="body2" color="white">
									{collection.numCollaborators}
								</Typography>
							</TableCell> */}
							<TableCell>
								<Typography variant="body2" color="white">
									{collection.mode}
								</Typography>
							</TableCell>
							<TableCell align="right" sx={{ padding: "0px 16px" }}>
								{(collection.mode === "edit" || collection.mode === "owner") && (
									<IconButton
										component={Link}
										to={`/collection/${collection.collection_id}/settings`}
										sx={{
											color: "#f0f0f0", // Slight red color
											"&:hover": {
												backgroundColor: "#0f0f0f", // Example hover background color
											},
											cursor: "pointer",
										}}
										size="small"
										edge="end">
										<SettingsIcon fontSize="small" />
									</IconButton>
								)}
							</TableCell>
							<TableCell align="right" sx={{ padding: "0px 16px" }}>
								{collection.mode === "owner" && (
									<IconButton
										onClick={() => handleDeleteCollection(collection.collection_id)}
										sx={{
											color: "#f0f0f0", // Slight red color
											"&:hover": {
												backgroundColor: "#ff6666", // Example hover background color
											},
											cursor: "pointer",
										}}
										size="small"
										edge="end">
										<DeleteIcon fontSize="small" />
									</IconButton>
								)}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default CollectionTable;
