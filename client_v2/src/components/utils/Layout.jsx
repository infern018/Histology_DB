// src/components/Layout.jsx
import React from "react";
import Box from "@mui/material/Box";
import Navbar from "../navbar/Navbar";

const Layout = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        margin: 0,
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
          marginTop: 2,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
