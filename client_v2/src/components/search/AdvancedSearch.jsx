import React, { useState, useEffect } from "react";
import {
	Box,
	Button,
	TextField,
	Typography,
	Drawer,
	Slider,
	MenuItem,
	Select,
	FormControl,
	FormControlLabel,
	InputLabel,
	InputAdornment,
	Tooltip,
	Link,
	Checkbox,
	ListItemText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { fetchDistinctOrders, fetchPublicCollections } from "../../utils/apiCalls";
import { Link as RouterLink } from "react-router-dom";

const AdvancedSearch = ({ onSearch }) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [brainWeightRange, setBrainWeightRange] = useState([0, 1000]);
	const [allowNAWeight, setAllowNAWeight] = useState(true);
	const [bodyWeightRange, setBodyWeightRange] = useState([0, 1000]);
	const [developmentalStage, setDevelopmentalStage] = useState("");
	const [sex, setSex] = useState("");

	const [drawerOpen, setDrawerOpen] = useState(false);
	const [orders, setOrders] = useState([]);
	const [selectedOrder, setSelectedOrder] = useState("");
	const [collections, setCollections] = useState([]);
	const [selectedCollections, setSelectedCollections] = useState([]);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const ordersData = await fetchDistinctOrders();
				setOrders(ordersData);
			} catch (error) {
				console.error("Error fetching distinct orders:", error);
			}
		};

		const fetchCollections = async () => {
			try {
				const collectionsData = await fetchPublicCollections();
				setCollections(collectionsData);
			} catch (error) {
				console.error("Error fetching public collections:", error);
			}
		};

		fetchOrders();
		fetchCollections();
	}, []);

	const handleSearch = () => {
		const searchParams = {
			searchQuery,
			brainWeightRange,
			bodyWeightRange,
			allowNAWeight,
			developmentalStage,
			sex,
			selectedOrder,
			selectedCollections: selectedCollections.map((col) => col.collection_id),
			page: 1, // Start from the first page
			limit: 10, // Default limit per page
		};
		onSearch(searchParams);
		setDrawerOpen(false);
	};

	const handleNormalSearch = () => {
		const searchParams = {
			searchQuery,
			page: 1, // Start from the first page
			limit: 10, // Default limit per page
		};
		onSearch(searchParams);
	};

	const searchStyles = {
		mb: 2,
		"& .MuiOutlinedInput-root": {
			borderRadius: 2, // Set border radius here
			"& fieldset": {
				borderColor: "white",
			},
			"&:hover fieldset": {
				borderColor: "white",
			},
			"&.Mui-focused fieldset": {
				borderColor: "white",
			},
		},
		"& .MuiInputBase-input": {
			color: "white",
		},
		"& .MuiInputLabel-root": {
			color: "white",
		},
	};

	return (
		<Box>
			<Tooltip
				arrow
				placement="bottom-start"
				title={
					<Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
						<strong>Search Formats:</strong>
						{"\n"}
						<strong>• species:</strong> Homo sapiens{"\n"}
						<strong>• common_name:</strong> Human{"\n"}
						<strong>• taxonomy_id:</strong> 9606{"\n"}
						<strong>• archival_name:</strong> tupa{"\n"}
						<strong>• staining:</strong> cresyl {"\n"}
						<strong>• speciemen_id: </strong> 1088{"\n"}
					</Typography>
				}>
				<TextField
					label="Search via taxon, species..."
					variant="outlined"
					fullWidth
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					sx={searchStyles}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<Button onClick={handleNormalSearch} variant="contained" sx={{ color: "white" }}>
									<SearchIcon />
								</Button>
							</InputAdornment>
						),
					}}
				/>
			</Tooltip>

			<Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
				<Link component="button" variant="body2" onClick={() => setDrawerOpen(true)} sx={{ color: "white" }}>
					Advanced Search
				</Link>
			</Box>
			<Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
				<Box sx={{ width: 300, p: 2 }}>
					<Typography variant="h6">Advanced Search Options</Typography>
					<Box sx={{ mb: 2 }}>
						<Typography gutterBottom>Brain Weight Range (g)</Typography>
						<Slider
							value={brainWeightRange}
							onChange={(e, newValue) => setBrainWeightRange(newValue)}
							valueLabelDisplay="auto"
							min={0}
							max={1000}
							sx={{
								color:
									brainWeightRange[0] === 0 && brainWeightRange[1] === 1000 ? "grey" : "primary.main",
							}}
						/>
					</Box>
					<Box sx={{ mb: 2 }}>
						<Typography gutterBottom>Body Weight Range (g)</Typography>
						<Slider
							value={bodyWeightRange}
							onChange={(e, newValue) => setBodyWeightRange(newValue)}
							valueLabelDisplay="auto"
							min={0}
							max={1000}
							sx={{
								color:
									bodyWeightRange[0] === 0 && bodyWeightRange[1] === 1000 ? "grey" : "primary.main",
							}}
						/>
					</Box>

					<Box sx={{ mb: 2 }}>
						<FormControlLabel
							control={
								<Checkbox
									checked={allowNAWeight}
									onChange={(e) => setAllowNAWeight(e.target.checked)}
									color="primary"
								/>
							}
							label="Allow N/A Brain Weight"
						/>
					</Box>

					<Box sx={{ mb: 2 }}>
						<FormControl fullWidth>
							<InputLabel sx={{ color: developmentalStage === "" ? "grey" : "primary.main" }}>
								Developmental Stage
							</InputLabel>
							<Select
								value={developmentalStage}
								onChange={(e) => setDevelopmentalStage(e.target.value)}
								label="Developmental Stage"
								sx={{ color: developmentalStage === "" ? "grey" : "primary.main" }}>
								<MenuItem value="embryo">Embryo</MenuItem>
								<MenuItem value="fetus">Fetus</MenuItem>
								<MenuItem value="neonate">Neonate</MenuItem>
								<MenuItem value="infant">Infant</MenuItem>
								<MenuItem value="juvenile">Juvenile</MenuItem>
								<MenuItem value="adult">Adult</MenuItem>
							</Select>
						</FormControl>
					</Box>
					<Box sx={{ mb: 2 }}>
						<FormControl fullWidth>
							<InputLabel sx={{ color: sex === "" ? "grey" : "primary.main" }}>Sex</InputLabel>
							<Select
								value={sex}
								onChange={(e) => setSex(e.target.value)}
								label="Sex"
								sx={{ color: sex === "" ? "grey" : "primary.main" }}>
								<MenuItem value="male">Male</MenuItem>
								<MenuItem value="female">Female</MenuItem>
								<MenuItem value="undefined">Undefined</MenuItem>
							</Select>
						</FormControl>
					</Box>
					<Box sx={{ mb: 2 }}>
						<FormControl fullWidth>
							<InputLabel sx={{ color: selectedOrder === "" ? "grey" : "primary.main" }}>
								Order
							</InputLabel>
							<Select
								value={selectedOrder}
								onChange={(e) => setSelectedOrder(e.target.value)}
								label="Order"
								sx={{ color: selectedOrder === "" ? "grey" : "primary.main" }}>
								{orders.map((order) => (
									<MenuItem key={order} value={order}>
										{order}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Box>

					<Box sx={{ mb: 2 }}>
						<FormControl fullWidth>
							<InputLabel>Collections</InputLabel>
							<Select
								multiple
								value={selectedCollections}
								onChange={(e) => setSelectedCollections(e.target.value)}
								renderValue={(selected) => selected.map((col) => col.name).join(", ")}>
								{collections.map((collection) => (
									<MenuItem key={collection.name} value={collection}>
										<Checkbox checked={selectedCollections.indexOf(collection) > -1} />
										<ListItemText primary={collection.name} />
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Box>

					<Button variant="contained" color="primary" onClick={handleSearch} sx={{ mt: 2 }}>
						Search
					</Button>

					<Box sx={{ mt: 2 }}>
						<Button component={RouterLink} to={`/collection/public`} variant="text">
							Explore public collections {">"}
						</Button>
					</Box>
				</Box>
			</Drawer>
		</Box>
	);
};

export default AdvancedSearch;
