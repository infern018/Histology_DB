import React from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { useEffect } from "react";
import { fetchDistinctOrders } from "../../utils/apiCalls";
import { useState } from "react";
import { Autocomplete, Typography } from "@mui/material";

export default function IdentificationForm({ values, onChange }) {
	const [orders, setOrders] = useState([]);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const ordersData = await fetchDistinctOrders();

				setOrders(ordersData);
			} catch (error) {
				console.error("Error fetching distinct orders:", error);
			}
		};
		fetchOrders();
	}, []);

	const handleInputChange = (e) => {
		const { name, value } = e.target;

		let updatedValues = { ...values, [name]: value };

		onChange(updatedValues);
	};

	return (
		<Box>
			<TextField
				label="NCBI Taxonomy Code"
				name="NCBITaxonomyCode"
				value={values.NCBITaxonomyCode || ""}
				onChange={handleInputChange}
				fullWidth
				margin="normal"
			/>
			<Autocomplete
				freeSolo
				options={orders} // Options fetched from API
				value={values.order || ""}
				onChange={(event, newValue) => onChange({ ...values, order: newValue })}
				renderInput={(params) => <TextField {...params} label="Order" name="order" fullWidth margin="normal" />}
			/>
			<TextField
				label="Microdraw Link"
				name="microdraw_link"
				value={values.microdraw_link || ""}
				onChange={handleInputChange}
				fullWidth
				margin="normal"
			/>
			<TextField
				label="Source Link"
				name="source_link"
				value={values.source_link || ""}
				onChange={handleInputChange}
				fullWidth
				margin="normal"
			/>
			<TextField
				label="Thumbnail URL"
				name="thumbnail"
				value={values.thumbnail || ""}
				onChange={handleInputChange}
				fullWidth
				margin="normal"
			/>

			{values.thumbnail && (
				<>
					<Typography sx={{ color: "black" }}>Preview : </Typography>
					<Box mt={2}>
						<img
							src={values.thumbnail}
							alt="Thumbnail Preview"
							style={{
								maxWidth: "100%",
								maxHeight: "200px",
								border: "1px solid #ccc",
								borderRadius: "4px",
							}}
						/>
					</Box>
				</>
			)}
		</Box>
	);
}
