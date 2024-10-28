import React from "react";
import { useForm } from "react-hook-form";
import { Box, TextField, Button, Typography } from "@mui/material";

const CollectionCreateForm = ({ onSubmit }) => {
	const { register, handleSubmit } = useForm();

	const handleFormSubmit = (data) => {
		onSubmit(data);
	};

	return (
		<Box
			component="form"
			onSubmit={handleSubmit(handleFormSubmit)}
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				maxWidth: 400,
				width: "100%",
				padding: 4,
				borderRadius: 2,
				boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
				margin: "0 auto",
			}}
			noValidate
			autoComplete="off">
			<Typography variant="h5" sx={{ fontWeight: 500, mb: 3 }}>
				Add a new collection
			</Typography>
			<TextField
				required
				id="name"
				label="Collection Name"
				variant="filled"
				{...register("name")}
				sx={{
					mb: 2,
					width: "100%",
					borderRadius: "10px",
					"& .MuiInputLabel-root": {
						color: "#FFFFFF", // White label color
					},
					"& .MuiFilledInput-root": {
						backgroundColor: "#3C3C3C", // Optional: set background color for the input field
						borderRadius: "10px",
					},
				}}
				InputProps={{
					disableUnderline: true,
				}}
				InputLabelProps={{
					style: {
						color: "#FFFFFF", // White label color
					},
				}}
			/>
			<TextField
				required
				id="description"
				label="Description"
				variant="filled"
				{...register("description")}
				sx={{
					mb: 2,
					width: "100%",
					borderRadius: "10px",
					"& .MuiInputLabel-root": {
						color: "#FFFFFF", // White label color
					},
					"& .MuiFilledInput-root": {
						backgroundColor: "#3C3C3C", // Optional: set background color for the input field
						borderRadius: "10px",
					},
				}}
				InputProps={{
					disableUnderline: true,
				}}
				InputLabelProps={{
					style: {
						color: "#FFFFFF", // White label color
					},
				}}
			/>
			<Button
				variant="contained"
				type="submit"
				sx={{
					width: "100%",
					backgroundColor: "#0056b3",
					color: "#ffffff",
					borderRadius: "10px",
				}}>
				Add
			</Button>
		</Box>
	);
};

export default CollectionCreateForm;
