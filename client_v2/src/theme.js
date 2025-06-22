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
    // Enhanced colors for admin panel
    info: {
      main: "#60a5fa", // Blue for admin elements
      light: "#93c5fd",
      dark: "#3b82f6",
    },
    success: {
      main: "#22c55e", // Green that works well on dark
      light: "#4ade80",
      dark: "#16a34a",
    },
    warning: {
      main: "#f59e0b", // Amber that works well on dark
      light: "#fbbf24",
      dark: "#d97706",
    },
    error: {
      main: "#ef4444", // Red that works well on dark
      light: "#f87171",
      dark: "#dc2626",
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
  components: {
    // Enhanced Alert styling for dark mode
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          border: "1px solid",
        },
        standardSuccess: {
          "backgroundColor": "rgba(34, 197, 94, 0.1)",
          "borderColor": "rgba(34, 197, 94, 0.3)",
          "color": "#22c55e",
          "& .MuiAlert-icon": {
            color: "#22c55e",
          },
        },
        standardError: {
          "backgroundColor": "rgba(239, 68, 68, 0.1)",
          "borderColor": "rgba(239, 68, 68, 0.3)",
          "color": "#ef4444",
          "& .MuiAlert-icon": {
            color: "#ef4444",
          },
        },
        standardWarning: {
          "backgroundColor": "rgba(245, 158, 11, 0.1)",
          "borderColor": "rgba(245, 158, 11, 0.3)",
          "color": "#f59e0b",
          "& .MuiAlert-icon": {
            color: "#f59e0b",
          },
        },
        standardInfo: {
          "backgroundColor": "rgba(96, 165, 250, 0.1)",
          "borderColor": "rgba(96, 165, 250, 0.3)",
          "color": "#60a5fa",
          "& .MuiAlert-icon": {
            color: "#60a5fa",
          },
        },
      },
    },
    // Enhanced Paper styling for admin panel
    MuiPaper: {
      styleOverrides: {
        root: {
          "backgroundImage": "none", // Remove default paper gradient
          "border": "1px solid rgba(255, 255, 255, 0.1)",
          "&.admin-panel-paper": {
            backgroundColor: "rgba(39, 39, 42, 0.6)", // Semi-transparent effect
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
          },
        },
      },
    },
    // Enhanced Card styling
    MuiCard: {
      styleOverrides: {
        root: {
          "backgroundImage": "none",
          "backgroundColor": "rgba(39, 39, 42, 0.8)",
          "border": "1px solid rgba(255, 255, 255, 0.1)",
          "&.admin-metrics-card": {
            "backgroundColor": "rgba(39, 39, 42, 0.6)",
            "backdropFilter": "blur(8px)",
            "border": "1px solid rgba(255, 255, 255, 0.15)",
            "transition": "all 0.2s ease",
            "&:hover": {
              backgroundColor: "rgba(39, 39, 42, 0.8)",
              borderColor: "rgba(255, 255, 255, 0.2)",
            },
          },
        },
      },
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

  // Admin panel colors
  adminInfo: theme.palette.info.main,
  adminSuccess: theme.palette.success.main,
  adminWarning: theme.palette.warning.main,
  adminError: theme.palette.error.main,

  // Transparent backgrounds for glass effect
  glassPaper: "rgba(39, 39, 42, 0.6)",
  glassCard: "rgba(39, 39, 42, 0.8)",
  glassBorder: "rgba(255, 255, 255, 0.15)",
};

export default theme;
