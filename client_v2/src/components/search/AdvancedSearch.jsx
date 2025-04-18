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
	Checkbox,
	ListItemText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { fetchDistinctOrders, fetchPublicCollections } from "../../utils/apiCalls";

const AdvancedSearch = ({ initialValues, onSearch }) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [brainWeightRange, setBrainWeightRange] = useState([0, 1000]);
	const [allowNAWeight, setAllowNAWeight] = useState(true);
	const [bodyWeightRange, setBodyWeightRange] = useState([0, 1000]);
	const [developmentalStage, setDevelopmentalStage] = useState("");
	const [sex, setSex] = useState("");

	const [drawerOpen, setDrawerOpen] = useState(false);
	const [orders, setOrders] = useState([]);
	const [selectedOrder, setSelectedOrder] = useState("");

	// const [stainings, setStainings] = useState([]);
	// const [selectedStaining, setSelectedStaining] = useState("");

	// const [brainParts, setBrainParts] = useState([]);
	// const [selectedBrainPart, setSelectedBrainPart] = useState("");

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

		// const fetchStainings = async () => {
		// 	try {
		// 		const stainingsData = await fetchDistinctStainings();
		// 		setStainings(stainingsData);
		// 	} catch (error) {
		// 		console.error("Error fetching distinct stainings:", error);
		// 	}
		// };

		// const fetchBrainParts = async () => {
		// 	try {
		// 		const brainPartsData = await fetchDistinctBrainParts();
		// 		setBrainParts(brainPartsData);
		// 	} catch (error) {
		// 		console.error("Error fetching distinct brain parts:", error);
		// 	}
		// };

		const fetchCollections = async () => {
			try {
				const collectionsData = await fetchPublicCollections();
				console.log("collectionsData", collectionsData);
				setCollections(collectionsData);
			} catch (error) {
				console.error("Error fetching public collections:", error);
			}
		};

		fetchOrders();
		// fetchStainings();
		// fetchBrainParts();
		fetchCollections();
	}, []);

	useEffect(() => {
		if (initialValues) {
			console.log("initialValues", initialValues);
			setSearchQuery(initialValues.searchQuery || "");
			setBrainWeightRange(
				initialValues.brainWeightRange ? initialValues.brainWeightRange.split(",").map(Number) : [0, 1000]
			);
			setAllowNAWeight(
				initialValues.allowNAWeight === undefined ||
					initialValues.allowNAWeight === "true" ||
					initialValues.allowNAWeight === true
			);
			setBodyWeightRange(
				initialValues.bodyWeightRange ? initialValues.bodyWeightRange.split(",").map(Number) : [0, 1000]
			);
			setDevelopmentalStage(initialValues.developmentalStage || "");
			setSex(initialValues.sex || "");
			setSelectedOrder(initialValues.selectedOrder || "");
			setSelectedCollections(
				initialValues.selectedCollections
					? initialValues.selectedCollections.split(",").map(
							(colId) =>
								collections.find((col) => col.collection_id === colId) || {
									collection_id: colId,
									name: "Unknown",
								}
					  )
					: []
			);
		}
	}, [initialValues, collections]);

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
	};

	const dropDownStyles = {
		color: "white",
		"& .MuiOutlinedInput-notchedOutline": {
			borderColor: "white",
		},
		"&:hover .MuiOutlinedInput-notchedOutline": {
			borderColor: "white",
		},
		"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
			borderColor: "white",
		},
		"& .MuiSvgIcon-root": {
			color: "white", // This targets the dropdown arrow
		},
	};

	const searchStyles = {
		mb: 1,
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
			"&.Mui-focused": {
				color: "white", // Prevent label from turning blue
			},
		},
	};

	return (
		<Box>
			<Tooltip
				arrow
				placement="bottom-start"
				title={
					<Typography variant="body2" sx={{ whiteSpace: "pre-line", color: "white" }}>
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
					sx={{
						...searchStyles,
						backgroundColor: "rgba(255, 255, 255, 0.1)",
						borderRadius: 2,
					}}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<Button
									onClick={handleNormalSearch}
									variant="contained"
									sx={{
										color: "white",
										backgroundColor: "primary.main",
										"&:hover": { backgroundColor: "primary.dark" },
									}}>
									<SearchIcon />
								</Button>
							</InputAdornment>
						),
					}}
				/>
			</Tooltip>

			<Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0 }}>
				<Button
					variant="text"
					onClick={() => setDrawerOpen(true)}
					sx={{
						color: "white",
						textTransform: "none",
						fontSize: "0.95rem",
						"&:hover": { textDecoration: "underline" },
					}}>
					Filters
				</Button>
			</Box>

			<Drawer
				anchor="left"
				open={drawerOpen}
				onClose={() => setDrawerOpen(false)}
				PaperProps={{
					sx: {
						width: 350,
						backgroundColor: "rgba(35, 35, 35, 0.5)", // Transparent background
						backdropFilter: "blur(10px)", // Blurry effect
						color: "white", // Set text color to white
					},
				}}>
				<Box sx={{ p: 3 }}>
					<Typography variant="h6" sx={{ mb: 3, color: "white" }}>
						Filtering Options
					</Typography>

					{/* Brain Weight Range */}
					<Box sx={{ mb: 3 }}>
						<Typography variant="subtitle1" gutterBottom sx={{ color: "white" }}>
							Brain Weight Range (g)
						</Typography>
						<Slider
							value={brainWeightRange}
							onChange={(e, newValue) => setBrainWeightRange(newValue)}
							valueLabelDisplay="auto"
							min={0}
							max={1000}
							sx={{
								color:
									brainWeightRange[0] === 0 && brainWeightRange[1] === 1000
										? "grey.500"
										: "primary.main",
							}}
						/>
					</Box>

					{/* Body Weight Range */}
					<Box sx={{ mb: 3 }}>
						<Typography variant="subtitle1" gutterBottom sx={{ color: "white" }}>
							Body Weight Range (g)
						</Typography>
						<Slider
							value={bodyWeightRange}
							onChange={(e, newValue) => setBodyWeightRange(newValue)}
							valueLabelDisplay="auto"
							min={0}
							max={1000}
							sx={{
								color:
									bodyWeightRange[0] === 0 && bodyWeightRange[1] === 1000
										? "grey.500"
										: "primary.main",
							}}
						/>
					</Box>

					{/* Allow N/A Brain Weight */}
					<Box sx={{ mb: 3 }}>
						<FormControlLabel
							control={
								<Checkbox
									checked={allowNAWeight}
									onChange={(e) => setAllowNAWeight(e.target.checked)}
									color="primary"
									sx={{
										color: "white", // for unchecked state
										"&.Mui-checked": {
											color: "white", // for checked state (tick + box)
										},
										"& .MuiSvgIcon-root": {
											fontSize: 24, // optional: resize the icon
										},
									}}
								/>
							}
							label="Allow N/A Brain Weight"
							sx={{ color: "white" }}
						/>
					</Box>

					{/* Developmental Stage */}
					<Box sx={{ mb: 3 }}>
						<FormControl fullWidth>
							<InputLabel sx={{ color: "white" }}>Developmental Stage</InputLabel>
							<Select
								value={developmentalStage}
								onChange={(e) => setDevelopmentalStage(e.target.value)}
								label="Developmental Stage"
								sx={dropDownStyles}>
								<MenuItem value="embryo">Embryo</MenuItem>
								<MenuItem value="fetus">Fetus</MenuItem>
								<MenuItem value="neonate">Neonate</MenuItem>
								<MenuItem value="infant">Infant</MenuItem>
								<MenuItem value="juvenile">Juvenile</MenuItem>
								<MenuItem value="adult">Adult</MenuItem>
							</Select>
						</FormControl>
					</Box>

					{/* Sex */}
					<Box sx={{ mb: 3 }}>
						<FormControl fullWidth>
							<InputLabel sx={{ color: "white" }}>Sex</InputLabel>
							<Select
								value={sex}
								onChange={(e) => setSex(e.target.value)}
								label="Sex"
								sx={dropDownStyles}>
								<MenuItem value="male">Male</MenuItem>
								<MenuItem value="female">Female</MenuItem>
								<MenuItem value="undefined">Undefined</MenuItem>
							</Select>
						</FormControl>
					</Box>

					{/* Order */}
					<Box sx={{ mb: 3 }}>
						<FormControl fullWidth>
							<InputLabel sx={{ color: "white" }}>Order</InputLabel>
							<Select
								value={selectedOrder}
								onChange={(e) => setSelectedOrder(e.target.value)}
								label="Order"
								sx={dropDownStyles}>
								{orders.map((order) => (
									<MenuItem key={order} value={order}>
										{order}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Box>

					{/* Collections */}
					<Box sx={{ mb: 3 }}>
						<FormControl fullWidth>
							<InputLabel sx={{ color: "white" }}>Collections</InputLabel>
							<Select
								multiple
								value={selectedCollections}
								onChange={(e) => setSelectedCollections(e.target.value)}
								renderValue={(selected) => selected.map((col) => col.name).join(", ")}
								sx={dropDownStyles}>
								{collections.map((collection) => (
									<MenuItem key={collection.name} value={collection}>
										<Checkbox checked={selectedCollections.indexOf(collection) > -1} />
										<ListItemText primary={collection.name} />
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Box>

					<Button
						variant="contained"
						color="primary"
						onClick={handleSearch}
						fullWidth
						sx={{ mt: 2, py: 1.5 }}>
						Search
					</Button>
				</Box>
			</Drawer>
		</Box>
	);
};

export default AdvancedSearch;
