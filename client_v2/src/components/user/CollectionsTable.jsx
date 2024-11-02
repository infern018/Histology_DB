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

const CollectionTable = ({ collections, isPublic }) => {
	if (!isPublic) {
		isPublic = false;
	}

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
						<TableCell>
							<Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#ffffff" }}>
								Collaborators
							</Typography>
						</TableCell>
						<TableCell>
							<Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#ffffff" }}>
								Mode
							</Typography>
						</TableCell>
						<TableCell align="left" sx={{ width: "50px" }}></TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{collections.map((collection, index) => (
						<TableRow
							key={index}
							hover
							component={Link}
							to={`/collection/${collection.collection_id}/entries?mode=${collection.mode}&isPublic=${isPublic}`}
							sx={{
								cursor: "pointer", // Makes the row indicate clickability
								textDecoration: "none", // Remove underline from Link
								color: "inherit", // Inherit text color
								"&:hover": {
									backgroundColor: "#333333 !important", // Stronger hover color with !important
									borderColor: "#ffffff", // Optional border color on hover
									borderWidth: "1px",
									borderStyle: "solid",
								},
							}}>
							<TableCell>
								<Typography variant="body2" color="white">
									{collection.name}
								</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="body2" color="white">
									{collection.numCollaborators}
								</Typography>
							</TableCell>
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
											color: "#f0f0f0",
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
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default CollectionTable;
