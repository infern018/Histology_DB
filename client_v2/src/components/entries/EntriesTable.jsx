import React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	Checkbox,
	Paper,
} from "@mui/material";
import { Link } from "react-router-dom";

const EntriesTable = ({ entries, selectedEntries, onSelectEntry, onSelectAll, currUserMode, isPublic }) => {
	const handleSelectAll = (event) => {
		onSelectAll(event);
	};

	const handleSelectEntry = (entryId) => {
		onSelectEntry(entryId);
	};

	return (
		<TableContainer
			component={Paper}
			sx={{
				maxHeight: "900px", // Set a fixed height
				overflowY: "auto", // Enable vertical scrolling if content overflows
				backgroundColor: "#262625", // Optional: Dark background for better contrast
			}}>
			<Table size="small">
				<TableHead>
					<TableRow>
						{currUserMode !== "view" && (
							<TableCell>
								<Checkbox
									sx={{
										color: "white",
										"&.Mui-checked": {
											color: "white",
										},
										"&.Mui-checked:hover": {
											backgroundColor: "transparent",
										},
									}}
									checked={selectedEntries.length === entries.length && entries.length !== 0}
									onChange={handleSelectAll}
								/>
							</TableCell>
						)}
						<TableCell>
							<Typography variant="subtitle2" fontWeight="bold" color="white" fontSize="small">
								Bionomial Species Name
							</Typography>
						</TableCell>
						<TableCell>
							<Typography variant="subtitle2" fontWeight="bold" color="white" fontSize="small">
								Developmental Stage
							</Typography>
						</TableCell>
						<TableCell>
							<Typography variant="subtitle2" fontWeight="bold" color="white" fontSize="small">
								Sex
							</Typography>
						</TableCell>
						<TableCell>
							<Typography variant="subtitle2" fontWeight="bold" color="white" fontSize="small">
								Body Weight
							</Typography>
						</TableCell>
						<TableCell>
							<Typography variant="subtitle2" fontWeight="bold" color="white" fontSize="small">
								Brain Weight
							</Typography>
						</TableCell>
						<TableCell>
							<Typography variant="subtitle2" fontWeight="bold" color="white" fontSize="small">
								Staining Method
							</Typography>
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{entries.map((entry) => (
						<TableRow
							key={entry._id}
							hover
							component={Link}
							to={`/entry/${entry._id}?isPublic=${isPublic}`}
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
							{currUserMode !== "view" && (
								<TableCell>
									<Checkbox
										sx={{
											color: "white",
											"&.Mui-checked": {
												color: "white",
											},
											"&.Mui-checked:hover": {
												backgroundColor: "transparent",
											},
										}}
										checked={selectedEntries.includes(entry._id)}
										onChange={() => handleSelectEntry(entry._id)}
										onClick={(e) => e.stopPropagation()} // Prevent checkbox click from triggering row click
									/>
								</TableCell>
							)}
							<TableCell>
								<Typography variant="body2" color="white">
									{entry.identification.bionomialSpeciesName}
								</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="body2" color="white">
									{entry.physiologicalInformation.age.developmentalStage}
								</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="body2" color="white">
									{entry.physiologicalInformation.sex}
								</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="body2" color="white">
									{entry.physiologicalInformation.bodyWeight || "N/A"}
								</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="body2" color="white">
									{entry.physiologicalInformation.brainWeight || "N/A"}
								</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="body2" color="white">
									{entry.histologicalInformation.stainingMethod}
								</Typography>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default EntriesTable;
