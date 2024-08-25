import React from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";

const developmentalStages = {
  Embryo: "embryo",
  Fetus: "fetus",
  Neonate: "neonate",
  Infant: "infant",
  Juvenile: "juvenile",
  Adult: "adult",
};

const unitsOfNumber = {
  Days: "days",
  Weeks: "weeks",
  Months: "months",
  Years: "years",
};

const origins = {
  POST_NATAL: "postNatal",
  POST_CONCEPTION: "postConception",
};

const genders = {
  Male: "m",
  Female: "f",
  Undefined: "u",
};

export default function PhysiologicalInformationForm({ values, onChange }) {
  const handleAgeChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...values, age: { ...values.age, [name]: value } });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...values, [name]: value });
  };

  return (
    <Box>
      {/* Age Section */}
      <Box sx={{ mb: 2 }}>
        <TextField
          select
          label="Developmental Stage"
          name="developmentalStage"
          value={values.age?.developmentalStage || ""}
          onChange={handleAgeChange}
          fullWidth
          margin="normal"
        >
          {Object.entries(developmentalStages).map(([key, value]) => (
            <MenuItem key={value} value={value}>
              {key}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Age Number"
          name="number"
          type="number"
          value={values.age?.number || ""}
          onChange={handleAgeChange}
          fullWidth
          margin="normal"
        />

        <TextField
          select
          label="Unit of Number in Age"
          name="unitOfNumber"
          value={values.age?.unitOfNumber || ""}
          onChange={handleAgeChange}
          fullWidth
          margin="normal"
        >
          {Object.entries(unitsOfNumber).map(([key, value]) => (
            <MenuItem key={value} value={value}>
              {key}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Origin"
          name="origin"
          value={values.age?.origin || origins.POST_NATAL} // Default value as postNatal
          onChange={handleAgeChange}
          fullWidth
          margin="normal"
        >
          {Object.entries(origins).map(([key, value]) => (
            <MenuItem key={value} value={value}>
              {key.replace(/_/g, " ")}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Physiological Information Section */}
      <Box sx={{ mb: 2 }}>
        <TextField
          select
          label="Sex"
          name="sex"
          value={values.sex || genders.Undefined} // Default value as undefined ('u')
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        >
          {Object.entries(genders).map(([key, value]) => (
            <MenuItem key={value} value={value}>
              {key}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Body Weight (grams)"
          name="bodyWeight"
          type="number"
          value={values.bodyWeight || 0} // Default value as 0
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Brain Weight (grams)"
          name="brainWeight"
          type="number"
          value={values.brainWeight || 0} // Default value as 0
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
      </Box>
    </Box>
  );
}

