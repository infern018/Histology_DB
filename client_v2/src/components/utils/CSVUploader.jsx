import React, { useState } from "react";
import { Button, Input, Typography, Box } from "@mui/material";
import Papa from "papaparse";

function CSVUploader({ onUpload }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
    console.log("Selected file:", e.target.files[0]); // Log the selected file
  };

  const handleUpload = () => {
    if (file) {
      console.log("Starting CSV parsing for file:", file.name); // Log the file name before parsing

      Papa.parse(file, {
        header: true,
        complete: (results) => {
          console.log("CSV parsing complete. Results:", results.data); // Log the parsed data

          const requiredFields = [
            "bionomialSpeciesName",
            "stainingMethod",
            "bodyWeight",
            "brainWeight",
            "developmentalStage",
            "sex",
          ];
          const missingFields = requiredFields.filter(
            (field) => !results.meta.fields.includes(field)
          );

          if (missingFields.length > 0) {
            setError(
              `The following fields are missing in the CSV: ${missingFields.join(
                ", "
              )}`
            );
            console.log("Missing fields:", missingFields); // Log the missing fields
          } else {
            console.log("CSV data is valid. Proceeding with upload."); // Log validation success
            onUpload(results.data);
          }
        },
        error: (error) => {
          setError(`Error parsing CSV: ${error.message}`);
          console.error("Error during CSV parsing:", error.message); // Log parsing error
        },
      });
    } else {
      setError("Please select a CSV file.");
      console.log("No file selected."); // Log when no file is selected
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2,
        mt: 3, // margin top
      }}
    >
      <Input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        sx={{ mb: 2 }} // margin bottom for spacing
      />
      <Button
        onClick={handleUpload}
        variant="contained"
        color="primary"
        disabled={!file} // Disable if no file is selected
      >
        Upload CSV
      </Button>
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}

export default CSVUploader;
