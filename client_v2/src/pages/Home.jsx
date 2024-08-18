import React from "react";
import Navbar from "../components/navbar/Navbar";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const Home = () => {
  const user = useSelector((state) => state.auth.currentUser);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh", // Ensure it covers the full viewport height
        margin: 0,
        padding: 0,
        background: "linear-gradient(to bottom, #b2d5fb, #f0f2f5)",
      }}
    >
      <Navbar />
      <Box
        sx={{
          textAlign: "left",
          px: 2,
          maxWidth: 900,
          width: "100%",
          mx: "auto", // Center the box horizontally
          mt: 0, // Adjust top margin as needed
        }}
      >
        <Typography variant="h1" sx={{ fontWeight: 500, color: "#0c2f57" }}>
          Welcome to MiMe,
        </Typography>
        <Typography paragraph sx={{ fontSize: 20, mt: 2 }}>
          Microscopy Metadata Index (MiMe) is a platform designed to
          streamline the sharing and collaboration of histology data.
          Discover, contribute, and manage your data seamlessly.
        </Typography>
        {user && (
          <Typography variant="h5" color="primary" sx={{ mt: 3 }}>
            Hey, {user.username}!
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Home;
