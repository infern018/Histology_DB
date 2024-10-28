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
		<TableContainer>
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
						<TableRow key={index} hover>
							<TableCell>
								<Typography
									variant="body1"
									component={Link}
									to={`/collection/${collection.collection_id}/entries?mode=${collection.mode}&isPublic=${isPublic}`}
									sx={{
										textDecoration: "none",
										color: "#f0f0f0", // Set link color to light
										"&:hover": {
											color: "primary.main", // Standout color on hover
											textDecoration: "underline", // Underline on hover
										},
									}}>
									{collection.name}
								</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="body1" sx={{ color: "#f0f0f0" }}>
									{collection.numCollaborators}
								</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="body1" sx={{ color: "#f0f0f0" }}>
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
