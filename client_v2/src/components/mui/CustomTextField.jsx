import React from "react";
import { TextField } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const CustomTextField = ({ sx, ...props }) => {
  const theme = useTheme();

  const defaultSx = {
    "& .MuiOutlinedInput-root": {
      "backgroundColor": theme.palette.background.default,
      "borderRadius": "0.5rem",
      "& fieldset": {
        borderColor: theme.palette.divider,
      },
      "&:hover fieldset": {
        borderColor: theme.palette.primary.main,
      },
      "&.Mui-focused fieldset": {
        borderColor: theme.palette.primary.main,
      },
    },
    "& .MuiInputLabel-root": {
      color: theme.palette.text.secondary,
    },
    "& .MuiOutlinedInput-input": {
      color: theme.palette.text.primary,
    },
    // Merge with any additional sx passed as props
    ...sx,
  };

  return <TextField variant="outlined" fullWidth sx={defaultSx} {...props} />;
};

export default CustomTextField;
