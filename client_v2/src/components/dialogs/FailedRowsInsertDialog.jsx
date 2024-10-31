// FailedRowsDialog.js
import React from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Typography,
	Table,
	TableBody,
	TableRow,
	TableCell,
	TableHead,
} from "@mui/material";
import { ErrorOutline } from "@mui/icons-material";

const FailedRowsInsertDialog = ({ open, onClose, failedRows }) => {
	return (
		<Dialog open={open} onClose={onClose} maxWidth="lg">
			<DialogTitle sx={{ bgcolor: "#ffeef0", display: "flex", alignItems: "center" }}>
				<ErrorOutline sx={{ marginRight: 1 }} />
				Failed Rows Details
			</DialogTitle>
			<DialogContent sx={{ padding: 3, marginTop: 2 }}>
				<Typography variant="body1" gutterBottom>
					Partial Success: Some entries were processed with errors.
				</Typography>
				{/* Display the failed rows in a table or list */}
				{failedRows.length > 0 ? (
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Error Details</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{failedRows.map((row, index) => (
								<TableRow key={index}>
									<TableCell>
										<pre>{JSON.stringify(row, null, 2)}</pre>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				) : (
					<Typography>No failed rows to display.</Typography>
				)}
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="primary">
					Close
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default FailedRowsInsertDialog;
