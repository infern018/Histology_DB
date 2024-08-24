import React from "react";
import Box from "@mui/material/Box";
import Navbar from "../navbar/Navbar";

const Layout = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center", // Remove this if you want to avoid vertical centering
        justifyContent: "flex-start", // Aligns content to the top
        minHeight: "100vh",
        margin: -1,
        padding: 0,
        background: "linear-gradient(to bottom, #b2d5fb, #f0f2f5)",
      }}
    >
      <Navbar />
      <Box
        sx={{
          width: "100%",
          maxWidth: 950,
          paddingX: 2,
          marginTop: 15 // Adjust this margin to push the content below the navbar
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
