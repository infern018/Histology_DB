import { createTheme } from "@mui/material/styles";

const COLORS = {
  primaryMain: "#E6E6E6",
  primaryContrastText: "#18181B",
  primaryDark: "#e4e4e7",
  backgroundDefault: "#18181B",
  backgroundPaper: "#27272a",
  backgroundLight: "#27272a",
  textPrimary: "#FFFFFF",
  textSecondary: "#d4d4d8",
  divider: "rgba(255, 255, 255, 0.1)",
  actionActive: "#B4B4B4",
  actionHover: "rgba(255, 255, 255, 0.08)",
  actionSelected: "rgba(255, 255, 255, 0.16)",
  infoMain: "#60a5fa",
  infoLight: "#93c5fd",
  infoDark: "#3b82f6",
  successMain: "#22c55e",
  successLight: "#4ade80",
  successDark: "#16a34a",
  warningMain: "#f59e0b",
  warningLight: "#fbbf24",
  warningDark: "#d97706",
  errorMain: "#ef4444",
  errorLight: "#f87171",
  errorDark: "#dc2626",
  neutral700: "#3F3F46",
  neutral300: "#E4E4E7",
  neutral800: "#424242",
  white: "#FFFFFF",
};

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: COLORS.primaryMain,
      contrastText: COLORS.primaryContrastText,
      dark: COLORS.primaryDark,
    },
    background: {
      default: COLORS.backgroundDefault,
      paper: COLORS.backgroundPaper,
      light: COLORS.backgroundLight,
    },
    text: {
      primary: COLORS.textPrimary,
      secondary: COLORS.textSecondary,
    },
    divider: COLORS.divider,
    action: {
      active: COLORS.actionActive,
      hover: COLORS.actionHover,
      selected: COLORS.actionSelected,
    },
    info: {
      main: COLORS.infoMain,
      light: COLORS.infoLight,
      dark: COLORS.infoDark,
    },
    success: {
      main: COLORS.successMain,
      light: COLORS.successLight,
      dark: COLORS.successDark,
    },
    warning: {
      main: COLORS.warningMain,
      light: COLORS.warningLight,
      dark: COLORS.warningDark,
    },
    error: {
      main: COLORS.errorMain,
      light: COLORS.errorLight,
      dark: COLORS.errorDark,
    },
  },
  typography: {
    fontFamily: "'Geist', sans-serif",
    h2: {
      fontWeight: "bold",
      color: COLORS.textPrimary,
    },
    h5: {
      fontWeight: 500,
      color: COLORS.textPrimary,
    },
    h6: {
      color: COLORS.textPrimary,
    },
    body1: {
      fontSize: 16,
      color: COLORS.textPrimary,
    },
    subtitle1: {
      color: COLORS.textPrimary,
    },
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          border: "1px solid",
        },
        standardSuccess: {
          "backgroundColor": "rgba(34, 197, 94, 0.1)",
          "borderColor": "rgba(34, 197, 94, 0.3)",
          "color": COLORS.successMain,
          "& .MuiAlert-icon": {
            color: COLORS.successMain,
          },
        },
        standardError: {
          "backgroundColor": "rgba(239, 68, 68, 0.1)",
          "borderColor": "rgba(239, 68, 68, 0.3)",
          "color": COLORS.errorMain,
          "& .MuiAlert-icon": {
            color: COLORS.errorMain,
          },
        },
        standardWarning: {
          "backgroundColor": "rgba(245, 158, 11, 0.1)",
          "borderColor": "rgba(245, 158, 11, 0.3)",
          "color": COLORS.warningMain,
          "& .MuiAlert-icon": {
            color: COLORS.warningMain,
          },
        },
        standardInfo: {
          "backgroundColor": "rgba(96, 165, 250, 0.1)",
          "borderColor": "rgba(96, 165, 250, 0.3)",
          "color": COLORS.infoMain,
          "& .MuiAlert-icon": {
            color: COLORS.infoMain,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          "backgroundImage": "none",
          "backgroundColor": COLORS.backgroundPaper,
          "&.admin-panel-paper": {
            backgroundColor: COLORS.backgroundDefault,
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          "backgroundImage": "none",
          "backgroundColor": COLORS.backgroundDefault,
          "border": "1px solid rgba(255, 255, 255, 0.1)",
          "&.admin-metrics-card": {
            backgroundColor: COLORS.backgroundDefault,
          },
        },
      },
    },
  },
});

export { COLORS };
export default theme;
