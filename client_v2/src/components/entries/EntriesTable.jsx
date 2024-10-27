import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Checkbox } from "@mui/material";
import { Link } from "react-router-dom";

const EntriesTable = ({ entries, selectedEntries, onSelectEntry, onSelectAll, currUserMode }) => {
	const handleSelectAll = (event) => {
		onSelectAll(event);
	};

	const handleSelectEntry = (entryId) => {
		onSelectEntry(entryId);
	};

	const tableSize = currUserMode === "view" ? "medium" : "small";

	return (
		<TableContainer>
			<Table size={tableSize} sx={{ color: "#f0f0f0" }}>
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
							<Typography variant="subtitle1" fontWeight="bold" color="white">
								Bionomial Species Name
							</Typography>
						</TableCell>
						<TableCell>
							<Typography variant="subtitle1" fontWeight="bold" color="white">
								Developmental Stage
							</Typography>
						</TableCell>
						<TableCell>
							<Typography variant="subtitle1" fontWeight="bold" color="white">
								Sex
							</Typography>
						</TableCell>
						<TableCell>
							<Typography variant="subtitle1" fontWeight="bold" color="white">
								Body Weight
							</Typography>
						</TableCell>
						<TableCell>
							<Typography variant="subtitle1" fontWeight="bold" color="white">
								Brain Weight
							</Typography>
						</TableCell>
						<TableCell>
							<Typography variant="subtitle1" fontWeight="bold" color="white">
								Staining Method
							</Typography>
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{entries.map((entry) => (
						<TableRow key={entry._id} hover>
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
									/>
								</TableCell>
							)}
							<TableCell>
								<Typography
									variant="body1"
									component={Link}
									to={`/entry/${entry._id}`}
									sx={{
										color: "white",
										"&:hover": {
											color: "primary.main", // Standout color on hover
											textDecoration: "underline", // Underline on hover
										},
									}}>
									{entry.identification.bionomialSpeciesName}
								</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="body1" color={"white"}>
									{entry.physiologicalInformation.age.developmentalStage}
								</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="body1" color={"white"}>
									{entry.physiologicalInformation.sex}
								</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="body1" color={"white"}>
									{entry.physiologicalInformation.bodyWeight
										? entry.physiologicalInformation.bodyWeight
										: "N/A"}
								</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="body1" color={"white"}>
									{entry.physiologicalInformation.brainWeight
										? entry.physiologicalInformation.brainWeight
										: "N/A"}
								</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="body1" color={"white"}>
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
