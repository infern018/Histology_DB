// Home.js
import React from "react";
import { Typography, Box } from "@mui/material";
import Layout from "../components/utils/Layout";
import { useNavigate } from "react-router-dom";
import ButtonStyled from "../components/mui/Button";
import { COLORS } from "../theme";
import { styled, useTheme } from "@mui/material/styles";
import AdvancedSearch from "../components/search/AdvancedSearch";

import MemoryIcon from "@mui/icons-material/Memory";
import ShareIcon from "@mui/icons-material/Share";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";

const FeatureCard = styled(Box)(({ theme }) => ({
  backgroundColor: COLORS.backgroundPaper,
  border: `1px solid ${COLORS.divider}`,
  borderRadius: "8px",
  padding: "16px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  flex: "1 1 30%", // Allows cards to be responsive
  minWidth: "280px",
  maxWidth: "calc(33.33% - 12px)", // Approx 3 columns with gap
  [theme.breakpoints.down("md")]: {
    maxWidth: "calc(50% - 12px)",
  },
  [theme.breakpoints.down("sm")]: {
    maxWidth: "100%",
  },
}));

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSearch = (searchParams) => {
    const queryParams = new URLSearchParams(searchParams).toString();
    navigate(`/search/results?${queryParams}`);
  };

  const features = [
    {
      icon: <MemoryIcon sx={{ color: COLORS.white, fontSize: 24 }} />,
      title: "Data Discovery",
      description:
        "Easily find relevant datasets using our powerful search and filtering tools.",
    },
    {
      icon: <ShareIcon sx={{ color: COLORS.white, fontSize: 24 }} />,
      title: "Contribute Data",
      description:
        "Share your histological metadata entries with the community.",
    },
    {
      icon: <ManageSearchIcon sx={{ color: COLORS.white, fontSize: 24 }} />,
      title: "Data Management",
      description:
        "Manage your datasets, track contributions, and ensure data integrity.",
    },
  ];

  return (
    <Layout>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: theme.palette.background.default, // Overall dark background
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "20px 160px",
          [theme.breakpoints.down("lg")]: {
            padding: "20px 80px",
          },
          [theme.breakpoints.down("md")]: {
            padding: "20px 40px",
          },
          [theme.breakpoints.down("sm")]: {
            padding: "20px",
          },
        }}
      >
        {/* Hero Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            maxWidth: "900px",
            margin: "1rem auto",
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              fontSize: "48px",
              lineHeight: "1em",
              letterSpacing: "-1.2%",
              color: theme.palette.text.primary,
              marginBottom: "16px",
              [theme.breakpoints.down("sm")]: {
                fontSize: "36px",
              },
            }}
          >
            MiMe: Metadata Microscopy Index
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: "16px",
              lineHeight: "1.5em",
              color: theme.palette.text.primary,
              marginBottom: "40px",
            }}
          >
            A centralized platform for researchers to discover, contribute, and
            manage histological metadata entries.
          </Typography>

          {/* Search Section - Now using AdvancedSearch component */}
          <Box sx={{ width: "100%", maxWidth: "720px" }}>
            <AdvancedSearch onSearch={handleSearch} />
          </Box>
        </Box>

        {/* Key Features Section */}
        <Box
          sx={{
            width: "100%",
            maxWidth: "928px",
            margin: "80px auto",
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              fontSize: "35px",
              lineHeight: "1.0285714285714285em",
              letterSpacing: "-0.75%",
              color: theme.palette.text.primary,
              marginBottom: "16px",
            }}
          >
            Key Features
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: "16px",
              lineHeight: "1.5em",
              color: theme.palette.text.primary,
              marginBottom: "32px",
            }}
          >
            Explore the core functionalities of our platform designed to enhance
            your research workflow.
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              justifyContent: "center",
            }}
          >
            {features.map((feature, index) => (
              <FeatureCard key={index}>
                {feature.icon}
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 500,
                    fontSize: "16px",
                    lineHeight: "1.5em",
                    color: theme.palette.text.primary,
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "14px",
                    lineHeight: "1.5em",
                    color: theme.palette.text.primary,
                  }}
                >
                  {feature.description}
                </Typography>
              </FeatureCard>
            ))}
          </Box>
        </Box>

        {/* Explore Public Collections Button */}
        <Box sx={{ margin: "40px auto 80px auto" }}>
          <ButtonStyled
            variant="contained"
            onClick={() => navigate(`/collection/public`)}
          >
            Explore Public Collections
          </ButtonStyled>
        </Box>
      </Box>
    </Layout>
  );
};

export default Home;
