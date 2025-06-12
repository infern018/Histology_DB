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
  Checkbox,
  ListItemText,
  Autocomplete,
} from "@mui/material";
import {
  fetchDistinctOrders,
  fetchPublicCollections,
  fetchDistinctStainings,
} from "../../utils/apiCalls";
import SearchInput from "../mui/SearchInput";
import ButtonStyled from "../mui/Button";
import theme from "../../theme";

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

  const [stainings, setStainings] = useState({});
  const [selectedStaining, setSelectedStaining] = useState([]);

  const [selectedBrainParts, setSelectedBrainParts] = useState([]);

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

    const fetchStainings = async () => {
      try {
        const stainingsData = await fetchDistinctStainings();

        setStainings(stainingsData);
      } catch (error) {
        console.error("Error fetching distinct stainings:", error);
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
    fetchStainings();
    fetchCollections();
  }, []);

  useEffect(() => {
    if (initialValues) {
      console.log("initialValues", initialValues);
      setSearchQuery(initialValues.searchQuery || "");
      setBrainWeightRange(
        initialValues.brainWeightRange
          ? initialValues.brainWeightRange.split(",").map(Number)
          : [0, 1000]
      );
      setAllowNAWeight(
        initialValues.allowNAWeight === undefined ||
          initialValues.allowNAWeight === "true" ||
          initialValues.allowNAWeight === true
      );
      setBodyWeightRange(
        initialValues.bodyWeightRange
          ? initialValues.bodyWeightRange.split(",").map(Number)
          : [0, 1000]
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
      setSelectedStaining(
        initialValues.selectedStaining
          ? initialValues.selectedStaining.split(",").map((stain) => ({
              option: stain,
            }))
          : []
      );
      setSelectedBrainParts(
        initialValues.selectedBrainParts
          ? initialValues.selectedBrainParts.split(",")
          : []
      );
    }
  }, [initialValues, collections]);

  const handleSearch = () => {
    console.log("SELECTED STAINING", selectedStaining);
    console.log("SELECTED BRAIN PARTS", selectedBrainParts);

    const searchParams = {
      searchQuery,
      brainWeightRange,
      bodyWeightRange,
      allowNAWeight,
      developmentalStage,
      sex,
      selectedOrder,
      selectedCollections: selectedCollections.map((col) => col.collection_id),
      selectedStaining: selectedStaining.map((stain) => stain.option),
      selectedBrainParts,
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
      selectedStaining: selectedStaining.map((stain) => stain.option),
      selectedBrainParts,
      page: 1, // Start from the first page
      limit: 10, // Default limit per page
    };
    onSearch(searchParams);
  };

  const dropDownStyles = {
    "color": "white",
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

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleNormalSearch}
          placeholder="Search via taxon, species..."
        />
        <ButtonStyled onClick={handleNormalSearch}>Search</ButtonStyled>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0 }}>
        <Button
          variant="text"
          onClick={() => setDrawerOpen(true)}
          sx={{
            "color": "white",
            "textTransform": "none",
            "fontSize": "0.95rem",
            "&:hover": {
              textDecoration: "underline",
              backgroundColor: theme.palette.background.default,
            },
          }}
        >
          Filters
        </Button>
      </Box>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: "40%",
            backgroundColor: "rgba(35, 35, 35, 0.5)", // Transparent background
            backdropFilter: "blur(10px)", // Blurry effect
            color: "white", // Set text color to white
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 3, color: "white" }}>
            Filtering Options
          </Typography>
          {/* Brain Weight Range */}
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ color: "white" }}
            >
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
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ color: "white" }}
            >
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
                    "color": "white", // for unchecked state
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
              <InputLabel sx={{ color: "white" }}>
                Developmental Stage
              </InputLabel>
              <Select
                value={developmentalStage}
                onChange={(e) => setDevelopmentalStage(e.target.value)}
                label="Developmental Stage"
                sx={dropDownStyles}
              >
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
                sx={dropDownStyles}
              >
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
                sx={dropDownStyles}
              >
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
                renderValue={(selected) =>
                  selected.map((col) => col.name).join(", ")
                }
                sx={dropDownStyles}
              >
                {collections.map((collection) => (
                  <MenuItem key={collection.name} value={collection}>
                    <Checkbox
                      checked={selectedCollections.indexOf(collection) > -1}
                    />
                    <ListItemText primary={collection.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          {/* Stainings */}
          <Box sx={{ mb: 3 }}>
            <Autocomplete
              multiple
              options={Object.entries(stainings).flatMap(([group, options]) =>
                options.map((option) => ({ group, option }))
              )}
              groupBy={(option) => option.group}
              getOptionLabel={(option) => option.option}
              value={selectedStaining}
              onChange={(event, newValue) => setSelectedStaining(newValue)}
              isOptionEqualToValue={(option, value) =>
                option.group === value.group && option.option === value.option
              }
              disableCloseOnSelect
              renderGroup={(params) => (
                <li key={params.key}>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "1rem",
                      padding: "4px 10px",
                      backgroundColor: "#242424",
                      color: "#fff",
                      borderBottom: "1px solid #444",
                      marginTop: 0,
                    }}
                  >
                    {params.group}
                  </div>
                  <ul style={{ paddingLeft: 0 }}>{params.children}</ul>
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Select Stainings"
                  placeholder="Choose..."
                  sx={{
                    ...dropDownStyles,
                    "& .MuiInputLabel-root": {
                      color: "white", // Set label color to white
                    },
                  }}
                />
              )}
              sx={{
                "& .MuiAutocomplete-popupIndicator": {
                  color: "white",
                },
                "& .MuiAutocomplete-clearIndicator": {
                  color: "white",
                },
                "& .MuiAutocomplete-tag": {
                  backgroundColor: "#333", // Dark background for tags
                  color: "white", // White text
                },
                "& .MuiInputBase-input": {
                  color: "white", // White input text
                },
                "& .MuiInputLabel-root": {
                  color: "white", // White label text
                },
                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                  borderColor: "white", // Outline color
                },
              }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: "white" }}>Brain Parts</InputLabel>
              <Select
                multiple
                value={selectedBrainParts}
                onChange={(e) => setSelectedBrainParts(e.target.value)}
                renderValue={(selected) => selected.join(", ")}
                sx={dropDownStyles}
              >
                {[
                  "Whole Brain",
                  "Bilateral Hemispheres",
                  "Left Hemisphere",
                  "Right Hemisphere",
                  "Brainstem",
                  "Left Frontal Lobe",
                  "Right Frontal Lobe",
                  "Left Occipital Lobe",
                  "Right Occipital Pole",
                ].map((part) => (
                  <MenuItem key={part} value={part}>
                    <Checkbox checked={selectedBrainParts.indexOf(part) > -1} />
                    <ListItemText primary={part} />
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
            sx={{ mt: 2, py: 1.5 }}
          >
            Search
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
};

export default AdvancedSearch;
