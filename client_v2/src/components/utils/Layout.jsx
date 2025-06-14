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
        height: "100vh",
        maxWidth: "100%",
        width: "100%",
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
    >
      <Navbar />
      <Box
        sx={{
          width: "100%",
          paddingX: 2,
          paddingTop: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          flex: 1,
          overflow: "auto",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
