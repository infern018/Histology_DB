// Home.js
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import SettingsIcon from "@mui/icons-material/Settings";
import { Box, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ButtonStyled from "../components/mui/Button";
import AdvancedSearch from "../components/search/AdvancedSearch";
import Layout from "../components/utils/Layout";
import { COLORS } from "../theme";

const features = [
  {
    type: "discovery",
    icon: <SearchIcon sx={{ color: COLORS.white, fontSize: 24 }} />,
    title: "Data Discovery",
    description:
      "Easily find relevant datasets using our powerful search and filtering tools.",
  },
  {
    type: "contribute",
    icon: <AddIcon sx={{ color: COLORS.white, fontSize: 24 }} />,
    title: "Contribute Data",
    description:
      "Share your histological metadata entries with the community.",
  },
  {
    type: "management",
    icon: <SettingsIcon sx={{ color: COLORS.white, fontSize: 24 }} />,
    title: "Data Management",
    description:
      "Manage your datasets, track contributions, and ensure data integrity.",
  },
];


const FeatureCard = styled(Box)(({ theme }) => ({
  backgroundColor: COLORS.backgroundPaper,
  border: `1px solid ${COLORS.divider}`,
  borderRadius: "6px",
  padding: "1rem 1rem 2rem 1rem",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  flex: "1 1 30%", // Allows cards to be responsive
  minWidth: "280px",
  maxWidth: "calc(33.33% - 12px)", // Approx 3 columns with gap

  transition: `
    transform 320ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 320ms cubic-bezier(0.22, 1, 0.36, 1),
    border-color 200ms ease
  `,

  "&:hover": {
    cursor: "pointer",
    transform: "translateY(-6px)",
    boxShadow: "0 12px 30px rgba(0, 0, 0, 0.35)",
    borderColor: theme.palette.primary.main,
  },

  "&:active": {
    transform: "translateY(-3px)",
  },

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

  const currentUser = useSelector((state) => state.auth.currentUser);

  const handleFeatureClick = (type) => {
    switch (type) {
      case "discovery":
        // Navigate to search results (no filters)
        navigate("/search/results");
        break;

      case "contribute":
        if (!currentUser) {
          navigate("/login");
        } else {
          navigate("/collection/create");
        }
        break;

      case "management":
        if (!currentUser) {
          navigate("/login");
        } else {
          navigate("/user/infern018");
        }
        break;

      default:
        break;
    }
  };


  const handleSearch = (searchParams) => {
    const queryParams = new URLSearchParams(searchParams).toString();
    navigate(`/search/results?${queryParams}`);
  };

  // const features = [
  //   {
  //     icon: <SearchIcon sx={{ color: COLORS.white, fontSize: 24 }} />,
  //     title: "Data Discovery",
  //     description:
  //       "Easily find relevant datasets using our powerful search and filtering tools.",
  //   },
  //   {
  //     icon: <AddIcon sx={{ color: COLORS.white, fontSize: 24 }} />,
  //     title: "Contribute Data",
  //     description:
  //       "Share your histological metadata entries with the community.",
  //   },
  //   {
  //     icon: <SettingsIcon sx={{ color: COLORS.white, fontSize: 24 }} />,
  //     title: "Data Management",
  //     description:
  //       "Manage your datasets, track contributions, and ensure data integrity.",
  //   },
  // ];

  return (
    <Layout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
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
            background:
              "linear-gradient(135deg,rgba(9, 9, 11, 0.4) 0%,rgb(24, 24, 27) 100%)",
            padding: "5rem 3.5rem 3rem 3.5rem",
            borderRadius: "2px",
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
              lineHeight: "1.2em",
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
            margin: "3rem auto",
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              fontSize: "35px",
              lineHeight: "1em",
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
              lineHeight: "1.2em",
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
              gap: "1.2rem",
              justifyContent: "center",
            }}
          >
            {features.map((feature, index) => (
              <FeatureCard key={index} onClick={() => handleFeatureClick(feature.type)}>
                {feature.icon}
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    fontSize: "1.15rem",
                    lineHeight: "1.2em",
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
                    color: theme.palette.text.secondary,
                  }}
                >
                  {feature.description}
                </Typography>
              </FeatureCard>
            ))}
          </Box>
        </Box>

        {/* Explore Public Collections Button */}
        <Box sx={{ margin: "0 auto" }}>
          <ButtonStyled
            variant="contained"
            onClick={() => navigate(`/collection/public`)}
          >
            Explore Public Collections
          </ButtonStyled>
        </Box>
      </Box>
    </Layout >
  );
};

export default Home;
