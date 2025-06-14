import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { COLORS } from "../../theme";

const ButtonStyled = styled(Button)(({ theme }) => ({
  "backgroundColor": COLORS.primaryMain, // White background from theme
  "color": COLORS.primaryContrastText, // Dark text from theme
  "&:hover": {
    backgroundColor: COLORS.primaryDark, // Darker shade on hover
  },
  "borderRadius": "6px",
  "padding": "8px 16px",
  "textTransform": "none",
  "fontFamily": theme.typography.fontFamily,
  "fontSize": theme.typography.body1.fontSize,
}));

export default ButtonStyled;
