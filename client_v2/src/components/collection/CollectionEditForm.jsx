import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box, TextField, Button, Typography } from "@mui/material";

const CollectionEditForm = ({ collection, onSubmit }) => {
	const { register, handleSubmit, setValue } = useForm();

	useEffect(() => {
		if (collection) {
			setValue("name", collection.name || "");
			setValue("description", collection.description || "");
			setValue("contact.name", collection.contact?.name || "");
			setValue("contact.email", collection.contact?.email || "");
			setValue("contact.phone", collection.contact?.phone || "");
			setValue("contact.doi", collection.contact?.doi || "");
		}
	}, [collection, setValue]);

	const handleFormSubmit = (data) => {
		onSubmit(data);
	};

	const inputStyles = {
		mb: 2,
		width: "100%",
		borderRadius: "10px",
		"& .MuiInputBase-input": {
			color: "#FFFFFF", // White text inside input
		},
		"& .MuiInputLabel-root": {
			color: "#CCCCCC", // Light grey label
		},
		"& .MuiFilledInput-root": {
			backgroundColor: "#3C3C3C", // Dark background
			borderRadius: "10px",
		},
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
				{collection ? "Edit Collection" : "Add a New Collection"}
			</Typography>
			<TextField
				required
				id="name"
				label="Collection Name"
				variant="filled"
				{...register("name")}
				sx={inputStyles}
				InputProps={{ disableUnderline: true }}
			/>
			<TextField
				required
				id="description"
				label="Description"
				variant="filled"
				{...register("description")}
				sx={inputStyles}
				InputProps={{ disableUnderline: true }}
			/>
			<Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
				Contact Information
			</Typography>
			<TextField
				required
				id="contact-name"
				label="Contact Name"
				variant="filled"
				{...register("contact.name")}
				sx={inputStyles}
				InputProps={{ disableUnderline: true }}
			/>
			<TextField
				required
				id="contact-email"
				label="Contact Email"
				variant="filled"
				{...register("contact.email")}
				sx={inputStyles}
				InputProps={{ disableUnderline: true }}
			/>
			<TextField
				id="contact-phone"
				label="Contact Phone"
				variant="filled"
				{...register("contact.phone")}
				sx={inputStyles}
				InputProps={{ disableUnderline: true }}
			/>
			<TextField
				required
				id="contact-doi"
				label="Contact DOI"
				variant="filled"
				{...register("contact.doi")}
				sx={inputStyles}
				InputProps={{ disableUnderline: true }}
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
				{collection ? "Save Changes" : "Add"}
			</Button>
		</Box>
	);
};

export default CollectionEditForm;
