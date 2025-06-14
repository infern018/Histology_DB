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
  Tooltip,
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

  const dropDownStyles = {};

  const searchExamples = [
    "species: Homo sapiens",
    "common_name: Human",
    "taxonomy_id: 9606",
    "archival_name: tupa",
    "staining: cresyl",
    "specimen_id: 1088",
  ];

  const tooltipContent = (
    <Box sx={{ p: 1 }}>
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
        💡 Try these examples:
      </Typography>
      {searchExamples.map((example, index) => (
        <Typography
          key={index}
          variant="body2"
          sx={{
            fontFamily: "monospace",
            fontSize: "0.75rem",
            mb: 0.5,
            display: "block",
          }}
        >
          {example}
        </Typography>
      ))}
    </Box>
  );

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <Tooltip
          title={tooltipContent}
          placement="left"
          arrow
          enterDelay={500}
          leaveDelay={200}
          componentsProps={{
            tooltip: {
              sx: {
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                maxWidth: 300,
                fontSize: "0.75rem",
              },
            },
            arrow: {
              sx: {
                "color": theme.palette.background.paper,
                "&:before": {
                  border: `1px solid ${theme.palette.divider}`,
                },
              },
            },
          }}
        >
          <Box sx={{ flex: 1 }}>
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") handleNormalSearch();
              }}
              placeholder="Search via taxon, species..."
            />
          </Box>
        </Tooltip>
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
            width: "25%",
            margin: "4rem 0",
            borderRadius: "8px",
          },
        }}
      >
        <Box
          sx={{
            p: 3,
            backgroundColor: theme.palette.background.default,
            height: "100%",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: "white" }}>
            {"<"}
          </Typography>
          {/* Brain Weight Range */}
          <Box sx={{ mb: 2 }}>
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
          <Box sx={{ mb: 2 }}>
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
          <Box sx={{ mb: 2 }}>
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
          <Box sx={{ mb: 2 }}>
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
          <Box sx={{ mb: 2 }}>
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
          <Box sx={{ mb: 2 }}>
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
          <Box sx={{ mb: 2 }}>
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
          <Box sx={{ mb: 2 }}>
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
            />
          </Box>

          <Box sx={{ mb: 2 }}>
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
            sx={{ mt: 2 }}
          >
            Search
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
};

export default AdvancedSearch;
