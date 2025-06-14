// theme file
import { createTheme } from "@mui/material/styles";

// color palette
const theme = createTheme({
  palette: {
    mode: "dark", // dark mode
    primary: {
      main: "#E6E6E6", // Light gray for primary actions (similar to shadcn primary-foreground in dark mode)
      contrastText: "#18181B", // Dark text on the primary color (similar to shadcn primary in dark mode)
      dark: "#e4e4e7", // Shadcn/ui-like darker shade for hover effect
    },

    background: {
      default: "#18181B", // Very dark gray for overall background (similar to shadcn background in dark mode)
      paper: "#27272a", // Slightly lighter dark gray for paper elements (similar to shadcn card in dark mode)
      light: "#27272a",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#d4d4d8", // Lighter gray for secondary text (similar to shadcn muted-foreground in dark mode)
    },
    divider: "rgba(255, 255, 255, 0.1)", // For borders, similar to shadcn border
    action: {
      active: "#B4B4B4", // For active state, similar to muted-foreground
      hover: "rgba(255, 255, 255, 0.08)", // Light hover effect
      selected: "rgba(255, 255, 255, 0.16)", // Light selected effect
    },
  },
  typography: {
    fontFamily: "'Geist', sans-serif",
    h2: {
      fontWeight: "bold",
      color: "#F4F4F5", // Using new text primary
    },
    h5: {
      fontWeight: 500,
      color: "#F4F4F5", // Using new text primary
    },
    h6: {
      color: "#F4F4F5", // Using new text primary
    },
    body1: {
      fontSize: 16, // Adjusted for typical web use
      color: "#F4F4F5", // Using new text primary
    },
    subtitle1: {
      color: "#F4F4F5", // Using new text primary
    },
  },
});

export const COLORS = {
  // Map to palette colors for direct access and new shadcn colors
  background: theme.palette.background.default,
  backgroundPaper: theme.palette.background.paper,
  textPrimary: theme.palette.text.primary,
  textSecondary: theme.palette.text.secondary,
  primaryMain: theme.palette.primary.main,
  primaryContrastText: theme.palette.primary.contrastText,
  primaryDark: theme.palette.primary.dark,
  secondaryMain: theme.palette.secondary.main,
  secondaryContrastText: theme.palette.secondary.contrastText,
  divider: theme.palette.divider,
  neutral700: "#3F3F46", // From Figma for search bar and feature cards
  neutral300: "#E4E4E7", // From Figma for search bar text
  neutral800: "#424242", // For navbar border
  white: "#FFFFFF", // Explicitly define white
};

export default theme;
