// src/components/utils/Loader.js
import { Box, CircularProgress, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const Loader = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,

        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",

        /* Glassy dark overlay */
        backgroundColor: "rgba(24, 24, 27, 0.75)",
        backdropFilter: "blur(6px)",

        /* Smooth appearance */
        animation: "fadeIn 200ms ease-out",

        "@keyframes fadeIn": {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      }}
    >
      <CircularProgress
        size={36}
        thickness={4}
        sx={{
          color: theme.palette.primary.main,
          marginBottom: "12px",
        }}
      />

      <Typography
        variant="body1"
        sx={{
          fontSize: "16px",
          lineHeight: "1.2em",
          color: theme.palette.text.secondary,
          letterSpacing: "0.02em",
        }}
      >
        Signing you in…
      </Typography>
    </Box>
  );
};

export default Loader;
