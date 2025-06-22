import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert,
  CircularProgress,
  Grid,
  Autocomplete,
  TextField,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Description as DescriptionIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import Layout from "../../components/utils/Layout";
import {
  uploadCSVEntries,
  getAllStandardizedStainingMethods,
  batchSuggestStainings,
  getAllStandardizedBrainParts,
  batchSuggestBrainParts,
} from "../../utils/apiCalls";
import { validateCSVData } from "../../utils/entryValidator";
import theme from "../../theme";

const csvFields = [
  {
    field: "bionomialSpeciesName",
    description: "Scientific name",
    required: true,
  },
  {
    field: "stainingMethod",
    description: "Staining method used",
    required: true,
  },
  {
    field: "bodyWeight",
    description: "Body weight in grams",
    required: false,
  },
  {
    field: "brainWeight",
    description: "Brain weight in grams",
    required: false,
  },
  {
    field: "sex",
    description: "Sex (m/f/u)",
    required: false,
  },
  {
    field: "ageNumber",
    description: "Age as a number (optional)",
    required: false,
  },
  {
    field: "ageUnit",
    description: "Unit in (days, months,...)",
    required: false,
  },
  {
    field: "origin",
    description: "Origin type (postNatal, etc.)",
    required: false,
  },
  {
    field: "sectionThickness",
    description: "Thickness of slice",
    required: false,
  },
  {
    field: "planeOfSectioning",
    description: "Plane of sectioning",
    required: false,
  },
  {
    field: "interSectionDistance",
    description: "Distance between sections",
    required: false,
  },
  {
    field: "brainPart",
    description: "Part of brain analyzed",
    required: false,
  },
  { field: "comments", description: "Additional comments", required: false },
  {
    field: "NCBITaxonomyCode",
    description: "NCBI taxonomy ID",
    required: false,
  },
  {
    field: "microdraw_link",
    description: "Link to microdraw",
    required: false,
  },
  {
    field: "source_link",
    description: "Source URL or reference",
    required: false,
  },
  { field: "thumbnail", description: "Thumbnail image URL", required: false },
  {
    field: "archivalCode",
    description: "Archival specimen code",
    required: false,
  },
];

const BulkUploadEntries = () => {
  const { collectionID } = useParams();
  const navigate = useNavigate();
  const currUser = useSelector((state) => state.auth.currentUser);
  const accessToken = currUser?.accessToken;

  const [dragActive, setDragActive] = useState(false);
  const [csvData, setCsvData] = useState(null);
  const [validationReport, setValidationReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadStep, setUploadStep] = useState("upload"); // upload, validation, standardize, confirm

  // New state for staining standardization
  const [standardizedStainingMethods, setStandardizedStainingMethods] =
    useState([]);
  const [stainingMappings, setStainingMappings] = useState({});
  const [uniqueStainingMethods, setUniqueStainingMethods] = useState([]);
  const [stainingStandardizationComplete, setStainingStandardizationComplete] =
    useState(false);

  // New state for brain part standardization
  const [standardizedBrainParts, setStandardizedBrainParts] = useState([]);
  const [brainPartMappings, setBrainPartMappings] = useState({});
  const [uniqueBrainParts, setUniqueBrainParts] = useState([]);
  const [
    brainPartStandardizationComplete,
    setBrainPartStandardizationComplete,
  ] = useState(false);

  // Functions for staining method standardization
  const prepareStainingStandardization = async () => {
    try {
      setLoading(true);

      // Get valid rows
      const validRows = csvData.filter((row, index) => {
        return !validationReport?.invalidEntries?.some(
          (invalid) => invalid.rowNumber === index + 1
        );
      });

      // Extract unique staining methods
      const uniqueMethods = [
        ...new Set(validRows.map((row) => row.stainingMethod)),
      ]
        .filter((method) => method && method.trim())
        .map((method) => method.trim());

      setUniqueStainingMethods(uniqueMethods);

      // Get standardized staining methods from API
      const standardizedResponse = await getAllStandardizedStainingMethods();

      // Flatten the categorized staining methods into a single array
      const flattenedMethods = [];
      const methodsData = standardizedResponse.data || standardizedResponse;

      if (typeof methodsData === "object" && methodsData !== null) {
        Object.entries(methodsData).forEach(([category, methods]) => {
          if (Array.isArray(methods)) {
            methods.forEach((method) => {
              flattenedMethods.push({
                name: method,
                category: category,
              });
            });
          }
        });
      }

      console.log("flattenedMethods", flattenedMethods);
      setStandardizedStainingMethods(flattenedMethods);

      // Get batch suggestions for automatic mapping
      const suggestionsResponse = await batchSuggestStainings(uniqueMethods);
      const suggestions = suggestionsResponse || {};

      console.log("SUGGESTED STAININGS", suggestionsResponse);
      console.log("UNIQUE METHODS", uniqueMethods);

      // Initialize mappings with exact matches and high-confidence suggestions
      const initialMappings = {};
      uniqueMethods.forEach((method) => {
        if (suggestions[method]) {
          // First check for exact match
          if (suggestions[method].exact_match) {
            initialMappings[method] = suggestions[method].exact_match;
          }
          // If no exact match, check for suggestions
          else if (suggestions[method].suggestions.length > 0) {
            const bestMatch = suggestions[method].suggestions[0];
            initialMappings[method] = bestMatch.standardized_name;
          } else {
            initialMappings[method] = method; // Keep original for manual review
          }
        } else {
          initialMappings[method] = method; // Keep original
        }
      });

      console.log("INITIAL MAPPINGS", initialMappings);

      setStainingMappings(initialMappings);
      setUploadStep("standardize");
    } catch (error) {
      console.error("Error preparing standardization:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStainingMapping = (originalMethod, newMethod) => {
    setStainingMappings((prev) => ({
      ...prev,
      [originalMethod]: newMethod,
    }));
  };

  const applyStainingStandardization = async () => {
    setStainingStandardizationComplete(true);
    // Automatically trigger brain part standardization
    await prepareBrainPartStandardization();
  };

  // Functions for brain part standardization
  const prepareBrainPartStandardization = async () => {
    try {
      setLoading(true);

      // Get valid rows
      const validRows = csvData.filter((row, index) => {
        return !validationReport?.invalidEntries?.some(
          (invalid) => invalid.rowNumber === index + 1
        );
      });

      // Extract unique brain parts
      const uniqueParts = [...new Set(validRows.map((row) => row.brainPart))]
        .filter((part) => part && part.trim())
        .map((part) => part.trim());

      setUniqueBrainParts(uniqueParts);

      // Get standardized brain parts from API
      const brainPartsData = await getAllStandardizedBrainParts();

      // Flatten the categorized structure to get all brain parts
      const flattenedBrainParts = [];
      Object.entries(brainPartsData).forEach(([category, parts]) => {
        parts.forEach((part) => {
          flattenedBrainParts.push({
            name: part,
            category: category,
          });
        });
      });

      setStandardizedBrainParts(flattenedBrainParts);

      // Get batch suggestions for automatic mapping
      const suggestionsResponse = await batchSuggestBrainParts(uniqueParts);
      const suggestions = suggestionsResponse || {};

      // Initialize mappings with exact matches and high-confidence suggestions
      const initialMappings = {};
      uniqueParts.forEach((part) => {
        if (suggestions[part]) {
          // First check for exact match
          if (suggestions[part].exact_match) {
            initialMappings[part] = suggestions[part].exact_match;
          }
          // If no exact match, check for suggestions
          else if (suggestions[part].suggestions.length > 0) {
            const bestMatch = suggestions[part].suggestions[0];
            initialMappings[part] = bestMatch.standardized_name;
          } else {
            initialMappings[part] = part; // Keep original for manual review
          }
        } else {
          initialMappings[part] = part; // Keep original
        }
      });

      setBrainPartMappings(initialMappings);
      setUploadStep("brainPartStandardize");
    } catch (error) {
      console.error("Error preparing brain part standardization:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateBrainPartMapping = (originalPart, newPart) => {
    setBrainPartMappings((prev) => ({
      ...prev,
      [originalPart]: newPart,
    }));
  };

  const applyBrainPartStandardization = () => {
    setBrainPartStandardizationComplete(true);
    setUploadStep("confirm");
  };

  // Function to generate and download sample CSV
  const downloadSampleCSV = () => {
    const sampleData = [
      {
        bionomialSpeciesName: "Homo sapiens",
        stainingMethod: "Nissl",
        bodyWeight: "70000",
        brainWeight: "1400",
        developmentalStage: "adult",
        sex: "m",
        ageNumber: "25",
        ageUnit: "years",
        origin: "postNatal",
        sectionThickness: "40",
        planeOfSectioning: "coronal",
        interSectionDistance: "200",
        brainPart: "frontal cortex",
        comments: "Sample entry for demonstration",
        NCBITaxonomyCode: "9606",
        microdraw_link: "",
        source_link: "",
        thumbnail: "",
        archivalCode: "HS001",
      },
      {
        bionomialSpeciesName: "Mus musculus",
        stainingMethod: "H&E",
        bodyWeight: "25",
        brainWeight: "0.4",
        developmentalStage: "adult",
        sex: "f",
        ageNumber: "8",
        ageUnit: "weeks",
        origin: "postNatal",
        sectionThickness: "20",
        planeOfSectioning: "sagittal",
        interSectionDistance: "100",
        brainPart: "hippocampus",
        comments: "Control group specimen",
        NCBITaxonomyCode: "10090",
        microdraw_link: "",
        source_link: "",
        thumbnail: "",
        archivalCode: "MM002",
      },
    ];

    const headers = csvFields.map((field) => field.field);
    const csvContent = [
      headers.join(","),
      ...sampleData.map((row) =>
        headers.map((header) => row[header] || "").join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sample_entries.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.type !== "text/csv") {
      alert("Please upload a CSV file");
      return;
    }

    setLoading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const csv = e.target.result;
      const lines = csv.split("\n");
      const headers = lines[0].split(",").map((h) => h.trim());

      const data = lines
        .slice(1)
        .filter((line) => line.trim())
        .map((line) => {
          const values = line.split(",").map((v) => v.trim());
          const row = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || "";
          });
          return row;
        });

      setCsvData(data);

      // Validate the data
      const validationResult = validateCSVData(data, collectionID);
      setValidationReport(validationResult);

      // Show validation report
      setUploadStep("validation");
      setLoading(false);
    };
    reader.readAsText(file);
  };

  const handleConfirmUpload = async () => {
    setLoading(true);
    try {
      // Convert back to CSV format for the API - send only the valid processed rows
      const validProcessedRows = csvData.filter((row, index) => {
        return !validationReport?.invalidEntries?.some(
          (invalid) => invalid.rowNumber === index + 1
        );
      });

      // Apply staining method standardization if completed
      if (
        stainingStandardizationComplete &&
        Object.keys(stainingMappings).length > 0
      ) {
        validProcessedRows.forEach((row) => {
          if (row.stainingMethod && stainingMappings[row.stainingMethod]) {
            row.stainingMethod = stainingMappings[row.stainingMethod];
          }
        });
      }

      // Apply brain part standardization if completed
      if (
        brainPartStandardizationComplete &&
        Object.keys(brainPartMappings).length > 0
      ) {
        validProcessedRows.forEach((row) => {
          if (row.brainPart && brainPartMappings[row.brainPart]) {
            row.brainPart = brainPartMappings[row.brainPart];
          }
        });
      }

      const response = await uploadCSVEntries(
        collectionID,
        validProcessedRows,
        accessToken
      );

      if (
        response.data.status === "success" ||
        response.data.status === "partial_success"
      ) {
        navigate(`/collection/${collectionID}/entries`);
      }
    } catch (error) {
      console.error("Error uploading CSV:", error);
      alert("Error uploading CSV. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderUploadArea = () => (
    <Card
      sx={{
        "backgroundColor": theme.palette.background.default,
        "border": `2px dashed ${
          dragActive ? theme.palette.primary.main : theme.palette.text.secondary
        }`,
        "borderRadius": 2,
        "transition": "all 0.3s ease",
        "cursor": "pointer",
        "&:hover": {
          borderColor: theme.palette.primary.main,
          backgroundColor: theme.palette.action.hover,
        },
      }}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => document.getElementById("file-input").click()}
    >
      <CardContent sx={{ textAlign: "center", py: 6 }}>
        <CloudUploadIcon
          sx={{ fontSize: 64, color: theme.palette.text.secondary, mb: 2 }}
        />
        <Typography
          variant="h6"
          sx={{ color: theme.palette.text.primary, mb: 1 }}
        >
          Drop your CSV file here or click to browse
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary }}
        >
          Supports CSV files up to 10MB
        </Typography>
        <input
          id="file-input"
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />
      </CardContent>
    </Card>
  );

  const renderConfirmation = () => (
    <Box>
      <Alert severity="success" sx={{ mb: 3 }}>
        Validation complete! Review the valid entries below and confirm to
        upload.
      </Alert>

      <Card sx={{ backgroundColor: theme.palette.background.default, mb: 3 }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{ color: theme.palette.text.primary, mb: 2 }}
          >
            Upload Summary
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: theme.palette.text.secondary, mb: 1 }}
          >
            <strong>{validationReport?.processedCount || 0}</strong> valid
            entries ready to be uploaded
          </Typography>
          {stainingStandardizationComplete && (
            <Typography
              variant="body2"
              sx={{ color: theme.palette.success.main }}
            >
              ✓ Staining methods have been standardized (
              {uniqueStainingMethods.length} methods processed)
            </Typography>
          )}
          {brainPartStandardizationComplete && (
            <Typography
              variant="body2"
              sx={{ color: theme.palette.success.main }}
            >
              ✓ Brain parts have been standardized ({uniqueBrainParts.length}{" "}
              parts processed)
            </Typography>
          )}
        </CardContent>
      </Card>

      <Card sx={{ backgroundColor: theme.palette.background.default, mb: 3 }}>
        <CardContent>
          <Typography
            variant="h6"
            sx={{ color: theme.palette.text.primary, mb: 2 }}
          >
            Data Preview (First 5 entries)
          </Typography>
          <TableContainer
            component={Paper}
            sx={{ backgroundColor: theme.palette.background.default }}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: theme.palette.text.primary }}>
                    Species Name
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary }}>
                    Staining Method
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary }}>
                    Brain Part
                  </TableCell>
                  <TableCell sx={{ color: theme.palette.text.primary }}>
                    Sex
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {csvData
                  ?.filter(
                    (row, index) =>
                      !validationReport?.invalidEntries?.some(
                        (invalid) => invalid.rowNumber === index + 1
                      )
                  )
                  .slice(0, 5)
                  .map((entry, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ color: theme.palette.text.secondary }}>
                        {entry.bionomialSpeciesName}
                      </TableCell>
                      <TableCell sx={{ color: theme.palette.text.secondary }}>
                        {stainingStandardizationComplete &&
                        stainingMappings[entry.stainingMethod]
                          ? stainingMappings[entry.stainingMethod]
                          : entry.stainingMethod}
                      </TableCell>
                      <TableCell sx={{ color: theme.palette.text.secondary }}>
                        {brainPartStandardizationComplete &&
                        brainPartMappings[entry.brainPart]
                          ? brainPartMappings[entry.brainPart]
                          : entry.brainPart}
                      </TableCell>
                      <TableCell sx={{ color: theme.palette.text.secondary }}>
                        {entry.sex}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
        <Button
          variant="outlined"
          onClick={() =>
            setUploadStep(
              brainPartStandardizationComplete
                ? "brainPartStandardize"
                : stainingStandardizationComplete
                ? "standardize"
                : "validation"
            )
          }
          sx={{
            color: theme.palette.text.secondary,
            borderColor: theme.palette.text.secondary,
          }}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirmUpload}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          Confirm Upload ({validationReport?.processedCount || 0} Entries)
        </Button>
      </Box>
    </Box>
  );

  const renderValidationReport = () => {
    const hasValidEntries = validationReport?.processedCount > 0;
    const hasErrors = validationReport?.failedCount > 0;
    const hasWarnings = validationReport?.warningCount > 0;

    return (
      <Box>
        <Alert
          severity={
            hasErrors
              ? hasValidEntries
                ? "warning"
                : "error"
              : hasWarnings
              ? "info"
              : "success"
          }
          sx={{
            "mb": 3,
            "& .MuiAlert-icon": {
              color: hasErrors
                ? hasValidEntries
                  ? "#ffb74d"
                  : "#ef5350"
                : hasWarnings
                ? "#2196f3"
                : "#81c784",
            },
            "& .MuiAlert-message": {
              color: theme.palette.text.primary,
            },
            "backgroundColor": hasErrors
              ? hasValidEntries
                ? "rgba(255, 183, 77, 0.1)"
                : "rgba(239, 83, 80, 0.1)"
              : hasWarnings
              ? "rgba(33, 150, 243, 0.1)"
              : "rgba(129, 199, 132, 0.1)",
          }}
        >
          {hasErrors &&
            hasValidEntries &&
            "Some entries have validation errors, but valid entries can still be uploaded."}
          {hasErrors &&
            !hasValidEntries &&
            "All entries have validation errors. Please fix the issues and try again."}
          {!hasErrors &&
            hasWarnings &&
            "All entries passed validation but some have warnings. You can proceed with upload."}
          {!hasErrors &&
            !hasWarnings &&
            "All entries passed validation! You can proceed to upload."}
        </Alert>

        <Card sx={{ backgroundColor: theme.palette.background.default, mb: 3 }}>
          <CardContent>
            <Typography
              variant="h6"
              sx={{ color: theme.palette.text.primary, mb: 2 }}
            >
              Validation Results
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <Chip
                label={`${validationReport?.processedCount || 0} Valid`}
                color="success"
                variant="outlined"
              />
              <Chip
                label={`${validationReport?.failedCount || 0} Invalid`}
                color="error"
                variant="outlined"
              />
              {hasWarnings && (
                <Chip
                  label={`${validationReport?.warningCount || 0} Warnings`}
                  color="info"
                  variant="outlined"
                />
              )}
              <Chip
                label={`${validationReport?.totalCount || 0} Total`}
                color="default"
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>

        {hasErrors && validationReport?.invalidEntries && (
          <Card
            sx={{ backgroundColor: theme.palette.background.default, mb: 3 }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{ color: theme.palette.text.primary, mb: 2 }}
              >
                Invalid Entries (First 5)
              </Typography>
              {validationReport.invalidEntries.slice(0, 5).map((row, index) => (
                <Box
                  key={index}
                  sx={{
                    mb: 2,
                    p: 2,
                    backgroundColor: theme.palette.background.default,
                    borderRadius: 1,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{ color: theme.palette.text.primary, mb: 1 }}
                  >
                    Row {row.rowNumber}:{" "}
                    {row.originalRow?.bionomialSpeciesName || "Unknown Species"}
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {row.errors?.map((error, errorIndex) => (
                      <Chip
                        key={errorIndex}
                        label={error}
                        size="small"
                        color="error"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        )}

        {hasValidEntries && (
          <Card
            sx={{ backgroundColor: theme.palette.background.default, mb: 3 }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{ color: theme.palette.text.primary, mb: 2 }}
              >
                Valid Entries Preview (First 5)
              </Typography>
              <TableContainer
                component={Paper}
                sx={{ backgroundColor: theme.palette.background.default }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: theme.palette.text.primary }}>
                        Species Name
                      </TableCell>
                      <TableCell sx={{ color: theme.palette.text.primary }}>
                        Staining Method
                      </TableCell>
                      <TableCell sx={{ color: theme.palette.text.primary }}>
                        Brain Part
                      </TableCell>
                      <TableCell sx={{ color: theme.palette.text.primary }}>
                        Sex
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {csvData
                      ?.filter(
                        (row, index) =>
                          !validationReport?.invalidEntries?.some(
                            (invalid) => invalid.rowNumber === index + 1
                          )
                      )
                      .slice(0, 5)
                      .map((entry, index) => (
                        <TableRow key={index}>
                          <TableCell
                            sx={{ color: theme.palette.text.secondary }}
                          >
                            {entry.bionomialSpeciesName}
                          </TableCell>
                          <TableCell
                            sx={{ color: theme.palette.text.secondary }}
                          >
                            {entry.stainingMethod}
                          </TableCell>
                          <TableCell
                            sx={{ color: theme.palette.text.secondary }}
                          >
                            {entry.brainPart}
                          </TableCell>
                          <TableCell
                            sx={{ color: theme.palette.text.secondary }}
                          >
                            {entry.sex}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}

        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            onClick={() => setUploadStep("upload")}
            sx={{
              color: theme.palette.text.secondary,
              borderColor: theme.palette.text.secondary,
            }}
          >
            Upload New File
          </Button>

          {hasValidEntries && (
            <Button
              variant="contained"
              onClick={prepareStainingStandardization}
              color="primary"
            >
              Proceed with {validationReport?.processedCount} Valid Entries
            </Button>
          )}
        </Box>
      </Box>
    );
  };

  const renderStainingStandardization = () => {
    return (
      <Box>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            Review and standardize the staining methods in your data. We've
            automatically matched some methods, but please review and adjust as
            needed.
          </Typography>
        </Alert>

        <Card sx={{ backgroundColor: theme.palette.background.default, mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
              Staining Method Standardization ({uniqueStainingMethods.length}{" "}
              unique methods found)
            </Typography>

            <TableContainer
              component={Paper}
              sx={{ backgroundColor: theme.palette.background.default }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: theme.palette.text.primary }}>
                      Original Method
                    </TableCell>
                    <TableCell sx={{ color: theme.palette.text.primary }}>
                      Standardized Method
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {uniqueStainingMethods.map((originalMethod, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ color: theme.palette.text.secondary }}>
                        <Typography
                          variant="body2"
                          sx={{ fontFamily: "monospace" }}
                        >
                          {originalMethod}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ minWidth: 300 }}>
                        <Autocomplete
                          size="small"
                          value={stainingMappings[originalMethod] || ""}
                          onChange={(event, newValue) => {
                            updateStainingMapping(
                              originalMethod,
                              newValue || originalMethod
                            );
                          }}
                          onInputChange={(event, newInputValue) => {
                            updateStainingMapping(
                              originalMethod,
                              newInputValue || originalMethod
                            );
                          }}
                          options={standardizedStainingMethods.map(
                            (method) => method.name
                          )}
                          freeSolo
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              placeholder="Choose or type staining method"
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  backgroundColor:
                                    theme.palette.background.default,
                                },
                              }}
                            />
                          )}
                          renderOption={(props, option) => {
                            const { key, ...otherProps } = props;
                            return (
                              <Box component="li" key={key} {...otherProps}>
                                <Box>
                                  <Typography variant="body2">
                                    {option}
                                  </Typography>
                                  {standardizedStainingMethods.find(
                                    (m) => m.name === option
                                  )?.category && (
                                    <Typography
                                      variant="caption"
                                      color="textSecondary"
                                    >
                                      {
                                        standardizedStainingMethods.find(
                                          (m) => m.name === option
                                        ).category
                                      }
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                            );
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            onClick={() => setUploadStep("validation")}
            sx={{
              color: theme.palette.text.secondary,
              borderColor: theme.palette.text.secondary,
            }}
          >
            Back to Validation
          </Button>
          <Button
            variant="contained"
            onClick={applyStainingStandardization}
            color="primary"
          >
            Apply Standardization & Continue
          </Button>
        </Box>
      </Box>
    );
  };

  const renderBrainPartStandardization = () => {
    return (
      <Box>
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            Review and standardize the brain parts in your data. We've
            automatically matched some parts, but please review and adjust as
            needed.
          </Typography>
        </Alert>

        <Card sx={{ backgroundColor: theme.palette.background.default, mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
              Brain Part Standardization ({uniqueBrainParts.length} unique parts
              found)
            </Typography>

            <TableContainer
              component={Paper}
              sx={{ backgroundColor: theme.palette.background.default }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: theme.palette.text.primary }}>
                      Original Brain Part
                    </TableCell>
                    <TableCell sx={{ color: theme.palette.text.primary }}>
                      Standardized Brain Part
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {uniqueBrainParts.map((originalPart, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ color: theme.palette.text.secondary }}>
                        <Typography
                          variant="body2"
                          sx={{ fontFamily: "monospace" }}
                        >
                          {originalPart}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ minWidth: 300 }}>
                        <Autocomplete
                          size="small"
                          value={brainPartMappings[originalPart] || ""}
                          onChange={(event, newValue) => {
                            updateBrainPartMapping(
                              originalPart,
                              newValue || originalPart
                            );
                          }}
                          onInputChange={(event, newInputValue) => {
                            updateBrainPartMapping(
                              originalPart,
                              newInputValue || originalPart
                            );
                          }}
                          options={standardizedBrainParts.map(
                            (part) => part.name
                          )}
                          freeSolo
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              placeholder="Choose or type brain part"
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  backgroundColor:
                                    theme.palette.background.default,
                                },
                              }}
                            />
                          )}
                          renderOption={(props, option) => {
                            const { key, ...otherProps } = props;
                            return (
                              <Box component="li" key={key} {...otherProps}>
                                <Box>
                                  <Typography variant="body2">
                                    {option}
                                  </Typography>
                                </Box>
                              </Box>
                            );
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            onClick={() => setUploadStep("standardize")}
            sx={{
              color: theme.palette.text.secondary,
              borderColor: theme.palette.text.secondary,
            }}
          >
            Back to Staining Standardization
          </Button>
          <Button
            variant="contained"
            onClick={applyBrainPartStandardization}
            color="primary"
          >
            Apply Standardization & Continue
          </Button>
        </Box>
      </Box>
    );
  };

  return (
    <Layout>
      <Box sx={{ width: "75%", mx: "auto", p: 3 }}>
        <Typography
          variant="h4"
          sx={{ color: theme.palette.text.primary, mb: 1 }}
        >
          Bulk Upload Entries
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: theme.palette.text.secondary, mb: 4 }}
        >
          Upload multiple entries to your collection using a CSV file
        </Typography>

        {uploadStep === "upload" && (
          <>
            <Card
              sx={{ backgroundColor: theme.palette.background.default, mb: 4 }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <DescriptionIcon
                      sx={{ color: theme.palette.text.secondary, mr: 1 }}
                    />
                    <Typography
                      variant="h6"
                      sx={{ color: theme.palette.text.primary }}
                    >
                      CSV Format Requirements
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={downloadSampleCSV}
                    sx={{
                      "color": theme.palette.text.secondary,
                      "borderColor": theme.palette.text.secondary,
                      "&:hover": {
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                      },
                    }}
                  >
                    Download Sample CSV
                  </Button>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.secondary, mb: 3 }}
                >
                  Your CSV file should contain the following columns. Download
                  the sample CSV to see the exact format.
                </Typography>

                <Grid container spacing={3}>
                  {/* Left Column */}
                  <Grid item xs={12} md={6}>
                    <TableContainer
                      component={Paper}
                      sx={{ backgroundColor: theme.palette.background.default }}
                    >
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell
                              sx={{ color: theme.palette.text.primary }}
                            >
                              Field Name
                            </TableCell>
                            <TableCell
                              sx={{ color: theme.palette.text.primary }}
                            >
                              Description
                            </TableCell>
                            {/* <TableCell
                              sx={{ color: theme.palette.text.primary }}
                            >
                              Required
                            </TableCell> */}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {csvFields
                            .slice(0, Math.ceil(csvFields.length / 2))
                            .map((field) => (
                              <TableRow key={field.field}>
                                <TableCell
                                  sx={{
                                    color: theme.palette.text.secondary,
                                    fontFamily: "monospace",
                                    fontSize: "0.75rem",
                                  }}
                                >
                                  {field.field}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    color: theme.palette.text.secondary,
                                    fontSize: "0.75rem",
                                  }}
                                >
                                  {field.description}
                                </TableCell>
                                {/* <TableCell>
                                  <Chip
                                    label={
                                      field.required ? "Required" : "Optional"
                                    }
                                    size="small"
                                    color={field.required ? "error" : "default"}
                                    variant="outlined"
                                  />
                                </TableCell> */}
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>

                  {/* Right Column */}
                  <Grid item xs={12} md={6}>
                    <TableContainer
                      component={Paper}
                      sx={{ backgroundColor: theme.palette.background.default }}
                    >
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell
                              sx={{ color: theme.palette.text.primary }}
                            >
                              Field Name
                            </TableCell>
                            <TableCell
                              sx={{ color: theme.palette.text.primary }}
                            >
                              Description
                            </TableCell>
                            {/* <TableCell
                              sx={{ color: theme.palette.text.primary }}
                            >
                              Required
                            </TableCell> */}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {csvFields
                            .slice(Math.ceil(csvFields.length / 2))
                            .map((field) => (
                              <TableRow key={field.field}>
                                <TableCell
                                  sx={{
                                    color: theme.palette.text.secondary,
                                    fontFamily: "monospace",
                                    fontSize: "0.75rem",
                                  }}
                                >
                                  {field.field}
                                </TableCell>
                                <TableCell
                                  sx={{
                                    color: theme.palette.text.secondary,
                                    fontSize: "0.75rem",
                                  }}
                                >
                                  {field.description}
                                </TableCell>
                                {/* <TableCell>
                                  <Chip
                                    label={
                                      field.required ? "Required" : "Optional"
                                    }
                                    size="small"
                                    color={field.required ? "error" : "default"}
                                    variant="outlined"
                                  />
                                </TableCell> */}
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {renderUploadArea()}
          </>
        )}

        {uploadStep === "validation" && renderValidationReport()}
        {uploadStep === "standardize" && renderStainingStandardization()}
        {uploadStep === "brainPartStandardize" &&
          renderBrainPartStandardization()}
        {uploadStep === "confirm" && renderConfirmation()}

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <CircularProgress />
          </Box>
        )}
      </Box>
    </Layout>
  );
};

export default BulkUploadEntries;
