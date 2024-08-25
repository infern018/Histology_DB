import React from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

export default function HistologicalInformationForm({ values, onChange }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...values, [name]: value });
  };

  return (
    <Box>
      <TextField
        label="Staining Method"
        name="stainingMethod"
        value={values.stainingMethod || ""}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Section Thickness (μm)"
        name="sectionThickness"
        value={values.sectionThickness || ""}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Plane of Sectioning"
        name="planeOfSectioning"
        value={values.planeOfSectioning || ""}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Inter-Section Distance"
        name="interSectionDistance"
        value={values.interSectionDistance || ""}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Brain Part"
        name="brainPart"
        value={values.brainPart || ""}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Comments"
        name="comments"
        value={values.comments || ""}
        onChange={handleInputChange}
        fullWidth
        multiline
        rows={4}
        margin="normal"
      />
    </Box>
  );
}
