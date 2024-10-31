// UploadCSVDialog.js
import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from "@mui/material";
import { CloudDownload } from "@mui/icons-material";
import CSVUploader from "../utils/CSVUploader";

const UploadCSVDialog = ({ open, onClose, onUpload }) => {
	const handleDownloadSample = () => {
		const link = document.createElement("a");
		link.href = `${process.env.PUBLIC_URL}/entries_upload_sample.csv`;
		link.download = "entries_upload_sample.csv";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="xl">
			<DialogTitle>Bulk Upload Your Data 🚀</DialogTitle>
			<DialogContent>
				<Typography variant="body1" gutterBottom>
					Easily import your data by uploading a CSV file. Follow the sample format shown below to ensure a
					smooth upload experience:
				</Typography>
				<Box display="flex" justifyContent="center" mb={2}>
					<img
						src={`${process.env.PUBLIC_URL}/entries_upload.png`}
						alt="Reference for CSV Upload"
						style={{ maxWidth: "100%", height: "auto" }}
					/>
				</Box>
				<Button
					variant="contained"
					color="primary"
					startIcon={<CloudDownload />}
					onClick={handleDownloadSample}>
					Sample CSV
				</Button>
				<CSVUploader onUpload={onUpload} />
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="primary">
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default UploadCSVDialog;
