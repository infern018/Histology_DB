import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";

const EntriesTable = ({ entries, selectedEntries, onSelectEntry, onSelectAll, currUserMode, isPublic, handleSort }) => {
	const [sortField, setSortField] = useState("identification.bionomialSpeciesName");
	const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"
	const navigate = useNavigate();

	const handleFieldSort = (field) => {
		const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
		setSortField(field);
		setSortOrder(newSortOrder);
		handleSort(field, newSortOrder);
	};

	const handleSelectAll = (event) => {
		onSelectAll(event);
	};

	const handleSelectEntry = (entryId) => {
		onSelectEntry(entryId);
	};

	const handleRowClick = (entryId) => {
		navigate(`/entry/${entryId}?isPublic=${isPublic}`);
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
							<Typography
								variant="subtitle2"
								fontWeight="bold"
								color="white"
								fontSize="small"
								onClick={() => handleFieldSort("identification.bionomialSpeciesName")}
								sx={{ cursor: "pointer" }}>
								Bionomial Species Name{" "}
								{sortField === "identification.bionomialSpeciesName" &&
									(sortOrder === "asc" ? "↑" : "↓")}
							</Typography>
						</TableCell>
						<TableCell>
							<Typography
								variant="subtitle2"
								fontWeight="bold"
								color="white"
								fontSize="small"
								onClick={() => handleFieldSort("physiologicalInformation.age.developmentalStage")}
								sx={{ cursor: "pointer" }}>
								Developmental Stage{" "}
								{sortField === "physiologicalInformation.age.developmentalStage" &&
									(sortOrder === "asc" ? "↑" : "↓")}
							</Typography>
						</TableCell>
						<TableCell>
							<Typography
								variant="subtitle2"
								fontWeight="bold"
								color="white"
								fontSize="small"
								onClick={() => handleFieldSort("physiologicalInformation.sex")}
								sx={{ cursor: "pointer" }}>
								Sex {sortField === "physiologicalInformation.sex" && (sortOrder === "asc" ? "↑" : "↓")}
							</Typography>
						</TableCell>
						<TableCell>
							<Typography
								variant="subtitle2"
								fontWeight="bold"
								color="white"
								fontSize="small"
								onClick={() => handleFieldSort("physiologicalInformation.bodyWeight")}
								sx={{ cursor: "pointer" }}>
								Body Weight{" "}
								{sortField === "physiologicalInformation.bodyWeight" &&
									(sortOrder === "asc" ? "↑" : "↓")}
							</Typography>
						</TableCell>
						<TableCell>
							<Typography
								variant="subtitle2"
								fontWeight="bold"
								color="white"
								fontSize="small"
								onClick={() => handleFieldSort("physiologicalInformation.brainWeight")}
								sx={{ cursor: "pointer" }}>
								Brain Weight{" "}
								{sortField === "physiologicalInformation.brainWeight" &&
									(sortOrder === "asc" ? "↑" : "↓")}
							</Typography>
						</TableCell>
						<TableCell>
							<Typography
								variant="subtitle2"
								fontWeight="bold"
								color="white"
								fontSize="small"
								onClick={() => handleFieldSort("histologicalInformation.stainingMethod")}
								sx={{ cursor: "pointer" }}>
								Staining Method{" "}
								{sortField === "histologicalInformation.stainingMethod" &&
									(sortOrder === "asc" ? "↑" : "↓")}
							</Typography>
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{entries.map((entry) => (
						<TableRow
							key={entry._id}
							hover
							onClick={() => handleRowClick(entry._id)}
							sx={{
								cursor: "pointer", // Makes the row indicate clickability
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
