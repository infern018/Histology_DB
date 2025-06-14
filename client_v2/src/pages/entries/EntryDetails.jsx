// src/pages/EntryDetailsPage.js
import React, { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  getEntryAPI,
  getPublicEntryAPI,
  getCollectionAPI,
  getPublicCollectionAPI,
} from "../../utils/apiCalls";
import Layout from "../../components/utils/Layout";
import { useSelector } from "react-redux";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CardSkeleton from "../../components/utils/CardSkeleton";

const EntryDetailsPage = () => {
  const theme = useTheme();
  const user = useSelector((state) => state.auth.currentUser);
  const { entryID } = useParams();
  const [entry, setEntry] = useState(null);
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isPublic = queryParams.get("isPublic") === "true";

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        let data;
        if (isPublic) {
          data = await getPublicEntryAPI(entryID);
        } else {
          data = await getEntryAPI(entryID, user.accessToken);
        }
        setEntry(data);
      } catch (error) {
        console.error("Error fetching entry:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, [entryID, user, isPublic]);

  useEffect(() => {
    const fetchCollection = async () => {
      if (entry?.collectionID) {
        try {
          let collection;
          if (isPublic) {
            collection = await getPublicCollectionAPI(entry.collectionID);
          } else {
            collection = await getCollectionAPI(
              entry.collectionID,
              user.accessToken
            );
          }
          setCollection(collection);
        } catch (error) {
          console.error("Error fetching collection:", error);
        }
      }
    };

    fetchCollection();
  }, [entry, user, isPublic]);

  if (loading) {
    return (
      <Layout>
        <CardSkeleton />
      </Layout>
    );
  }

  if (!entry) {
    return (
      <Layout>
        <Box sx={{ textAlign: "center", padding: "2rem" }}>
          <Typography variant="h6" color="text.secondary">
            Entry not found
          </Typography>
        </Box>
      </Layout>
    );
  }

  const InfoCard = ({ title, children, icon }) => (
    <Card
      sx={{
        "backgroundColor": theme.palette.background.paper,
        "borderRadius": "0.75rem",
        "border": `0.0625rem solid ${theme.palette.divider}`,
        "height": "100%",
        "transition": "all 0.2s ease",
        "&:hover": {
          boxShadow: `0 0.5rem 1rem -0.25rem rgba(0, 0, 0, 0.1)`,
        },
      }}
    >
      <CardContent sx={{ padding: "1.5rem" }}>
        <Box
          sx={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}
        >
          {icon}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              marginLeft: icon ? "0.5rem" : 0,
            }}
          >
            {title}
          </Typography>
        </Box>
        {children}
      </CardContent>
    </Card>
  );

  const InfoItem = ({ label, value, isLink }) => (
    <Box sx={{ marginBottom: "0.75rem" }}>
      <Typography
        variant="body2"
        sx={{
          color: theme.palette.text.secondary,
          fontSize: "0.75rem",
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: "0.25rem",
        }}
      >
        {label}
      </Typography>
      {isLink ? (
        <Button
          component="a"
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          startIcon={<OpenInNewIcon />}
          sx={{
            "color": theme.palette.primary.main,
            "textTransform": "none",
            "padding": 0,
            "minWidth": "auto",
            "justifyContent": "flex-start",
            "&:hover": {
              backgroundColor: "transparent",
              textDecoration: "underline",
            },
          }}
        >
          {value?.length > 50 ? `${value.substring(0, 50)}...` : value}
        </Button>
      ) : (
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 400,
            wordBreak: "break-word",
          }}
        >
          {value || "N/A"}
        </Typography>
      )}
    </Box>
  );

  return (
    <Layout>
      <Box
        sx={{
          maxWidth: "80rem",
          margin: "0 auto",
          padding: "2rem",
        }}
      >
        {/* Header */}
        <Box sx={{ marginBottom: "2rem" }}>
          <Box
            sx={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}
          >
            <Button
              onClick={() => window.history.back()}
              startIcon={<ArrowBackIcon />}
              sx={{
                "color": theme.palette.text.secondary,
                "textTransform": "none",
                "padding": "0.5rem 1rem",
                "marginRight": "1rem",
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              Back
            </Button>
            {!isPublic && user && (
              <Button
                component={Link}
                to={`/collection/${collection?._id}/entry/${entry._id}/edit`}
                variant="contained"
                startIcon={<ArrowOutwardIcon />}
                sx={{
                  "backgroundColor": theme.palette.primary.main,
                  "color": theme.palette.primary.contrastText,
                  "textTransform": "none",
                  "borderRadius": "0.5rem",
                  "&:hover": {
                    backgroundColor: theme.palette.primary.dark,
                  },
                }}
              >
                Edit Entry
              </Button>
            )}
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: theme.palette.text.primary,
              marginBottom: "0.5rem",
            }}
          >
            Entry Details
          </Typography>

          {collection?.name && (
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
              }}
            >
              Collection:{" "}
              <Button
                component="a"
                href={`/collection/${collection._id}?isPublic=${isPublic}`}
                sx={{
                  "color": theme.palette.primary.main,
                  "textTransform": "none",
                  "padding": 0,
                  "minWidth": "auto",
                  "&:hover": {
                    backgroundColor: "transparent",
                    textDecoration: "underline",
                  },
                }}
              >
                {collection.name}
              </Button>
            </Typography>
          )}
        </Box>

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Thumbnail */}
          {entry.identification.thumbnail && (
            <Grid item xs={12} md={4}>
              <InfoCard title="Data Thumbnail">
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "200px",
                  }}
                >
                  <img
                    src={entry.identification.thumbnail}
                    alt="Thumbnail"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "200px",
                      objectFit: "contain",
                      borderRadius: "0.5rem",
                    }}
                  />
                </Box>
              </InfoCard>
            </Grid>
          )}

          {/* Identification */}
          <Grid item xs={12} md={entry.identification.thumbnail ? 8 : 12}>
            <InfoCard title="Identification">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <InfoItem
                    label="Specimen ID"
                    value={entry.archivalIdentification?.archivalSpeciesCode}
                  />
                  <InfoItem
                    label="Species Name"
                    value={entry.identification.bionomialSpeciesName}
                  />
                  <InfoItem label="Order" value={entry.identification.order} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InfoItem
                    label="NCBI Taxonomy Code"
                    value={entry.identification.NCBITaxonomyCode}
                  />
                  <InfoItem
                    label="Wikipedia"
                    value={entry.identification.wikipediaSpeciesName}
                    isLink={!!entry.identification.wikipediaSpeciesName}
                  />
                </Grid>
              </Grid>
            </InfoCard>
          </Grid>

          {/* Physiological Information */}
          <Grid item xs={12} md={6}>
            <InfoCard title="Physiological Information">
              <InfoItem
                label="Developmental Stage"
                value={entry.physiologicalInformation.age.developmentalStage}
              />
              <InfoItem
                label="Sex"
                value={
                  { m: "Male", f: "Female", u: "Undefined" }[
                    entry.physiologicalInformation.sex
                  ]
                }
              />
              <InfoItem
                label="Body Weight"
                value={
                  entry.physiologicalInformation.bodyWeight
                    ? `${entry.physiologicalInformation.bodyWeight} g`
                    : null
                }
              />
              <InfoItem
                label="Brain Weight"
                value={
                  entry.physiologicalInformation.brainWeight
                    ? `${entry.physiologicalInformation.brainWeight} g`
                    : null
                }
              />
            </InfoCard>
          </Grid>

          {/* Histological Information */}
          <Grid item xs={12} md={6}>
            <InfoCard title="Histological Information">
              <InfoItem
                label="Brain Part"
                value={entry.histologicalInformation.brainPart}
              />
              <InfoItem
                label="Staining Method"
                value={entry.histologicalInformation.stainingMethod}
              />
              <InfoItem
                label="Plane of Sectioning"
                value={entry.histologicalInformation.planeOfSectioning}
              />
              <InfoItem
                label="Section Thickness"
                value={
                  entry.histologicalInformation.sectionThickness
                    ? `${entry.histologicalInformation.sectionThickness} µm`
                    : null
                }
              />
              <InfoItem
                label="Inter-Section Distance"
                value={entry.histologicalInformation.interSectionDistance}
              />
            </InfoCard>
          </Grid>

          {/* Links & Sources */}
          <Grid item xs={12}>
            <InfoCard title="Links & Sources">
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <InfoItem
                    label="MicroDraw Link"
                    value={entry.identification?.microdraw_link}
                    isLink={!!entry.identification?.microdraw_link}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoItem
                    label="Source Link"
                    value={entry.identification.source_link}
                    isLink={!!entry.identification.source_link}
                  />
                </Grid>
              </Grid>
            </InfoCard>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default EntryDetailsPage;
