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
	InputLabel,
	InputAdornment,
	Link,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { fetchDistinctOrders } from "../../utils/apiCalls";

const AdvancedSearch = ({ onSearch }) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [brainWeightRange, setBrainWeightRange] = useState([0, 100]);
	const [bodyWeightRange, setBodyWeightRange] = useState([0, 1000]);
	const [developmentalStage, setDevelopmentalStage] = useState("");
	const [unitsOfNumber, setUnitsOfNumber] = useState("");
	const [sex, setSex] = useState("");

	const [drawerOpen, setDrawerOpen] = useState(false);
	const [orders, setOrders] = useState([]);
	const [selectedOrder, setSelectedOrder] = useState("");

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

	const handleSearch = () => {
		const searchParams = {
			searchQuery,
			brainWeightRange,
			bodyWeightRange,
			developmentalStage,
			unitsOfNumber,
			sex,
			selectedOrder,
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

	return (
		<Box>
			<TextField
				label="Search via taxon, species..."
				variant="outlined"
				fullWidth
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				sx={{
					mb: 2,
					"& .MuiOutlinedInput-root": {
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
				}}
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
						/>
					</Box>
					<Box sx={{ mb: 2 }}>
						<FormControl fullWidth>
							<InputLabel>Developmental Stage</InputLabel>
							<Select
								value={developmentalStage}
								onChange={(e) => setDevelopmentalStage(e.target.value)}
								label="Developmental Stage">
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
							<InputLabel>Units of Number</InputLabel>
							<Select
								value={unitsOfNumber}
								onChange={(e) => setUnitsOfNumber(e.target.value)}
								label="Units of Number">
								<MenuItem value="days">Days</MenuItem>
								<MenuItem value="weeks">Weeks</MenuItem>
								<MenuItem value="months">Months</MenuItem>
								<MenuItem value="years">Years</MenuItem>
							</Select>
						</FormControl>
					</Box>
					<Box sx={{ mb: 2 }}>
						<FormControl fullWidth>
							<InputLabel>Sex</InputLabel>
							<Select value={sex} onChange={(e) => setSex(e.target.value)} label="Sex">
								<MenuItem value="male">Male</MenuItem>
								<MenuItem value="female">Female</MenuItem>
								<MenuItem value="undefined">Undefined</MenuItem>
							</Select>
						</FormControl>
					</Box>
					<Box sx={{ mb: 2 }}>
						<FormControl fullWidth>
							<InputLabel>Order</InputLabel>
							<Select
								value={selectedOrder}
								onChange={(e) => setSelectedOrder(e.target.value)}
								label="Order">
								{orders.map((order) => (
									<MenuItem key={order} value={order}>
										{order}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Box>

					<Button variant="contained" color="primary" onClick={handleSearch} sx={{ mt: 2 }}>
						Search
					</Button>
				</Box>
			</Drawer>
		</Box>
	);
};

export default AdvancedSearch;
