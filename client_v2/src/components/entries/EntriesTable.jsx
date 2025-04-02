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
import ImageCell from "../utils/ImageSkeleton";

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

	const tableRowHeight = 68;

	return (
		<TableContainer
			component={Paper}
			sx={{
				width: "100%",
				maxWidth: "100%",
				maxHeight: "900px", // Set a fixed height
				overflowY: "auto", // Enable vertical scrolling if content overflows
				backgroundColor: "#262625", // Optional: Dark background for better contrast
			}}>
			<Table sx={{ width: "100%" }} size="small">
				<TableHead>
					<TableRow sx={{ height: tableRowHeight }}>
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
								sx={{ cursor: "pointer" }}>
								Specimen ID
							</Typography>
						</TableCell>
						<TableCell>
							<Typography
								variant="subtitle2"
								fontWeight="bold"
								color="white"
								fontSize="small"
								sx={{ cursor: "pointer" }}>
								Brain Part
							</Typography>
						</TableCell>

						<TableCell>
							<Typography
								variant="subtitle2"
								fontWeight="bold"
								color="white"
								fontSize="small"
								sx={{ cursor: "pointer" }}>
								Thumbnail
							</Typography>
						</TableCell>
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
								onClick={() => handleFieldSort("histologicalInformation.stainingMethod")}
								sx={{ cursor: "pointer" }}>
								Staining Method{" "}
								{sortField === "histologicalInformation.stainingMethod" &&
									(sortOrder === "asc" ? "↑" : "↓")}
							</Typography>
						</TableCell>
						<TableCell>
							<Typography
								variant="subtitle2"
								fontWeight="bold"
								color="white"
								fontSize="small"
								onClick={() => handleFieldSort("identification.order")}
								sx={{ cursor: "pointer" }}>
								Order {sortField === "identification.order" && (sortOrder === "asc" ? "↑" : "↓")}
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
								height: tableRowHeight,
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
								{entry.archivalIdentification?.archivalSpeciesCode && (
									<Typography variant="body2" color="white">
										{entry.archivalIdentification.archivalSpeciesCode}
									</Typography>
								)}
							</TableCell>
							<TableCell>
								<Typography variant="body2" color="white">
									{entry.histologicalInformation.brainPart}
								</Typography>
							</TableCell>
							<TableCell>
								{entry.identification.thumbnail ? (
									<ImageCell src={entry.identification.thumbnail} />
								) : null}
							</TableCell>
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
									{entry.histologicalInformation.stainingMethod}
								</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="body2" color="white">
									{entry.identification.order}
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
