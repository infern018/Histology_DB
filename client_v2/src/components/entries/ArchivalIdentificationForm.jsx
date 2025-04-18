import React from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { Tooltip } from "@mui/material";

export default function ArchivalIdentificationForm({ values, onChange }) {
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		onChange({ ...values, [name]: value });
	};

	return (
		<Box>
			<Tooltip title="This is the raw ID used to identify the specimen at source" arrow>
				<TextField
					label="Archival Species Code"
					name="archivalSpeciesCode"
					value={values?.archivalSpeciesCode || ""}
					onChange={handleInputChange}
					fullWidth
					margin="normal"
				/>
			</Tooltip>
		</Box>
	);
}
