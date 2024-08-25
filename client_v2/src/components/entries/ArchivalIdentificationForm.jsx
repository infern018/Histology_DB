import React from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

export default function ArchivalIdentificationForm({ values, onChange }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...values, [name]: value });
  };

  return (
    <Box>
      <TextField
        label="Archival Individual Code"
        name="archivalIndividualCode"
        value={values.archivalIndividualCode || ""}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Archival Species Code"
        name="archivalSpeciesCode"
        value={values.archivalSpeciesCode || ""}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Archival Species Order"
        name="archivalSpeciesOrder"
        value={values.archivalSpeciesOrder || ""}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Archival Species Name"
        name="archivalSpeciesName"
        value={values.archivalSpeciesName || ""}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
    </Box>
  );
}
