import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Box, CircularProgress, Typography, Pagination } from "@mui/material";
import Layout from "../components/utils/Layout";
import EntriesTable from "../components/entries/EntriesTable";
import { fetchSearchResults } from "../utils/apiCalls";

const SearchResults = () => {
	const location = useLocation();

	const [entries, setEntries] = useState([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);

	useEffect(() => {
		const queryParams = new URLSearchParams(location.search);
		const fetchResults = async () => {
			try {
				const searchParams = Object.fromEntries(queryParams.entries());
				searchParams.page = page;

				const data = await fetchSearchResults(searchParams);
				setEntries(data.entries);
				setTotalPages(data.totalPages);
			} catch (error) {
				console.error("Error fetching search results:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchResults();
	}, [location.search, page]);

	const handlePageChange = (event, newPage) => {
		setPage(newPage);
	};

	if (loading) {
		return <CircularProgress />;
	}

	return (
		<Layout>
			<Box sx={{ padding: 3 }}>
				<Typography variant="h5" gutterBottom>
					Search Results
				</Typography>
				<EntriesTable
					entries={entries}
					currUserMode={"view"}
					selectedEntries={[]}
					onSelectEntry={() => {}}
					onSelectAll={() => {}}
				/>
				<Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
					<Pagination
						count={totalPages}
						page={page}
						onChange={handlePageChange}
						color="primary"
						sx={{
							"& .MuiPaginationItem-root": {
								color: "white", // Change the text color of pagination items to white
							},
							"& .MuiPaginationItem-root.Mui-selected": {
								color: "white", // Ensure the selected item text is also white
							},
							"& .MuiPaginationItem-root:hover": {
								backgroundColor: "rgba(255, 255, 255, 0.2)", // Optional: change background color on hover
							},
						}}
					/>
				</Box>
			</Box>
		</Layout>
	);
};

export default SearchResults;
