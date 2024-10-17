// src/components/EntriesTable.js
import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Checkbox } from "@mui/material";

import { Link } from "react-router-dom";

const EntriesTable = ({ entries, selectedEntries, onSelectEntry, onSelectAll }) => {
	const handleSelectAll = (event) => {
		onSelectAll(event);
	};

	const handleSelectEntry = (entryId) => {
		onSelectEntry(entryId);
	};

	return (
		<TableContainer>
			<Table size="small">
				<TableHead>
					<TableRow>
						<TableCell>
							<Checkbox
								checked={selectedEntries.length === entries.length && entries.length !== 0}
								onChange={handleSelectAll}
							/>
						</TableCell>
						<TableCell>
							<Typography variant="subtitle1" fontWeight="bold">
								Bionomial Species Name
							</Typography>
						</TableCell>
						<TableCell>
							<Typography variant="subtitle1" fontWeight="bold">
								Developmental Stage
							</Typography>
						</TableCell>
						<TableCell>
							<Typography variant="subtitle1" fontWeight="bold">
								Sex
							</Typography>
						</TableCell>
						<TableCell>
							<Typography variant="subtitle1" fontWeight="bold">
								Body Weight
							</Typography>
						</TableCell>
						<TableCell>
							<Typography variant="subtitle1" fontWeight="bold">
								Brain Weight
							</Typography>
						</TableCell>
						<TableCell>
							<Typography variant="subtitle1" fontWeight="bold">
								Staining Method
							</Typography>
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{entries.map((entry) => (
						<TableRow key={entry._id} hover>
							<TableCell>
								<Checkbox
									checked={selectedEntries.includes(entry._id)}
									onChange={() => handleSelectEntry(entry._id)}
								/>
							</TableCell>
							<TableCell>
								<Typography
									variant="body1"
									component={Link}
									to={`/entry/${entry._id}`}
									sx={{
										color: "black",
										"&:hover": {
											color: "primary.main", // Standout color on hover
											textDecoration: "underline", // Underline on hover
										},
									}}>
									{entry.identification.bionomialSpeciesName}
								</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="body1">
									{entry.physiologicalInformation.age.developmentalStage}
								</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="body1">{entry.physiologicalInformation.sex}</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="body1">
									{entry.physiologicalInformation.bodyWeight
										? entry.physiologicalInformation.bodyWeight
										: "N/A"}
								</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="body1">
									{entry.physiologicalInformation.brainWeight
										? entry.physiologicalInformation.brainWeight
										: "N/A"}
								</Typography>
							</TableCell>
							<TableCell>
								<Typography variant="body1">{entry.histologicalInformation.stainingMethod}</Typography>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default EntriesTable;
