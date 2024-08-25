import React from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

export default function IdentificationForm({ values, onChange }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let updatedValues = { ...values, [name]: value };

    onChange(updatedValues);
  };

  return (
    <Box>
      <TextField
        label="NCBI Taxonomy Code"
        name="NCBITaxonomyCode"
        value={values.NCBITaxonomyCode || ""}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Collection Code"
        name="collectionCode"
        value={values.collectionCode || ""}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
    </Box>
  );
}
