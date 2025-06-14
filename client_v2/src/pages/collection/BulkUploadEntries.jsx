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
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  Description as DescriptionIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import Layout from "../../components/utils/Layout";
import { uploadCSVEntries } from "../../utils/apiCalls";
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
  const [uploadStep, setUploadStep] = useState("upload"); // upload, validation, confirm

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
    reader.onload = (e) => {
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

      // Validate the data immediately
      const validationResult = validateCSVData(data, collectionID);
      setValidationReport(validationResult);

      // Show validation report immediately
      setUploadStep("validation");
      setLoading(false);
    };
    reader.readAsText(file);
  };

  const handleConfirmUpload = async () => {
    setLoading(true);
    try {
      // Convert back to CSV format for the API - send only the valid original rows
      const validOriginalRows = csvData.filter((row, index) => {
        return !validationReport?.invalidEntries?.some(
          (invalid) => invalid.rowNumber === index + 1
        );
      });

      const response = await uploadCSVEntries(
        collectionID,
        validOriginalRows,
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
      <Alert
        severity="success"
        sx={{
          "mb": 3,
          "& .MuiAlert-icon": {
            color: "#81c784",
          },
          "& .MuiAlert-message": {
            color: theme.palette.text.primary,
          },
          "backgroundColor": "rgba(129, 199, 132, 0.1)",
        }}
      >
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
            sx={{ color: theme.palette.text.secondary }}
          >
            <strong>{validationReport?.processedCount || 0}</strong> valid
            entries ready to be uploaded
          </Typography>
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
                        {entry.stainingMethod}
                      </TableCell>
                      <TableCell sx={{ color: theme.palette.text.secondary }}>
                        {entry.brainPart}
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
          onClick={() => setUploadStep("upload")}
          sx={{
            color: theme.palette.text.secondary,
            borderColor: theme.palette.text.secondary,
          }}
        >
          Cancel
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

    return (
      <Box>
        <Alert
          severity={
            hasErrors ? (hasValidEntries ? "warning" : "error") : "success"
          }
          sx={{
            "mb": 3,
            "& .MuiAlert-icon": {
              color: hasErrors
                ? hasValidEntries
                  ? "#ffb74d"
                  : "#ef5350"
                : "#81c784",
            },
            "& .MuiAlert-message": {
              color: theme.palette.text.primary,
            },
            "backgroundColor": hasErrors
              ? hasValidEntries
                ? "rgba(255, 183, 77, 0.1)"
                : "rgba(239, 83, 80, 0.1)"
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
              onClick={() => setUploadStep("confirm")}
              color="primary"
            >
              Proceed with {validationReport?.processedCount} Valid Entries
            </Button>
          )}
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
