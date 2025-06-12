import React from "react";
import { Box, InputBase } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import { COLORS } from "../../theme";

const SearchInputContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  borderRadius: "8px",
  backgroundColor: COLORS.neutral700,
  height: "48px",
  width: "100%",
  overflow: "hidden",
}));

const SearchInputIconWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: COLORS.neutral700,
  borderRadius: "8px 0 0 8px",
  padding: "0 16px",
  height: "100%",
  display: "flex",
  alignItems: "center",
  color: COLORS.neutral300,
}));

const CustomInputBase = styled(InputBase)(({ theme }) => ({
  "marginLeft": theme.spacing(1),
  "flex": 1,
  "color": COLORS.neutral300,
  "fontFamily": theme.typography.fontFamily,
  "fontSize": "16px",
  "lineHeight": "1.5em",
  "& .MuiInputBase-input": {
    padding: "8px 0",
  },
}));

const SearchInput = ({ value, onChange, onKeyPress, placeholder }) => {
  return (
    <SearchInputContainer>
      <SearchInputIconWrapper>
        <SearchIcon />
      </SearchInputIconWrapper>
      <CustomInputBase
        placeholder={placeholder}
        inputProps={{ "aria-label": "search" }}
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
      />
    </SearchInputContainer>
  );
};

export default SearchInput;
