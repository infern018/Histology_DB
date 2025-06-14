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
  Divider,
  Chip,
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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CardSkeleton from "../../components/utils/CardSkeleton";
import EditIcon from "@mui/icons-material/Edit";

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
        <Box sx={{ width: "75%", mx: "auto", p: 3, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            Entry not found
          </Typography>
        </Box>
      </Layout>
    );
  }

  const InfoItem = ({ label, value, isLink }) => (
    <Box sx={{ mb: 1.5 }}>
      <Typography
        variant="body2"
        sx={{
          color: theme.palette.text.secondary,
          fontSize: "0.7rem",
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          mb: 0.25,
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
            "fontSize": "0.875rem",
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
          variant="body2"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 400,
            wordBreak: "break-word",
            fontSize: "0.875rem",
          }}
        >
          {value || "N/A"}
        </Typography>
      )}
    </Box>
  );

  return (
    <Layout>
      <Box sx={{ width: "75%", mx: "auto", p: "0 2rem" }}>
        {/* Header Card */}
        <Card
          sx={{
            backgroundColor: theme.palette.background.default,
            mb: 2,
          }}
        >
          <CardContent sx={{ py: 1.5, px: 2 }}>
            <Button
              onClick={() => window.history.back()}
              startIcon={<ArrowBackIcon />}
              sx={{
                "color": theme.palette.text.secondary,
                "textTransform": "none",
                "mb": 1,
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              Back
            </Button>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 0.5,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Entry Details
              </Typography>
              {!isPublic && user && (
                <Button
                  component={Link}
                  to={`/collection/${collection?._id}/entry/${entry._id}/edit`}
                  variant="contained"
                  startIcon={<EditIcon />}
                  size="small"
                >
                  Edit Entry
                </Button>
              )}
            </Box>

            {collection?.name && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Collection:
                </Typography>
                <Chip
                  label={collection.name}
                  size="small"
                  variant="outlined"
                  component={Link}
                  to={`/collection/${collection._id}?isPublic=${isPublic}`}
                  clickable
                  sx={{
                    "textDecoration": "none",
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                />
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Main Content Card */}
        <Card
          sx={{
            backgroundColor: theme.palette.background.default,
          }}
        >
          <CardContent sx={{ p: 2 }}>
            {/* Identification Section with Thumbnail */}
            <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
              <Box sx={{ flex: 1, pr: entry.identification.thumbnail ? 2 : 0 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Identification
                </Typography>
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
                    <InfoItem
                      label="Order"
                      value={entry.identification.order}
                    />
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
              </Box>

              {/* Thumbnail positioned on the right */}
              {entry.identification.thumbnail && (
                <Box
                  sx={{
                    flexShrink: 0,
                    width: "150px",
                    height: "150px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={entry.identification.thumbnail}
                    alt="Thumbnail"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                      borderRadius: "0.5rem",
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  />
                </Box>
              )}
            </Box>
            <Divider sx={{ my: 1 }} />

            {/* Physiological Information Section */}
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Physiological Information
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
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
              </Grid>
              <Grid item xs={12} sm={6}>
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
              </Grid>
            </Grid>
            <Divider sx={{ my: 1 }} />

            {/* Histological Information Section */}
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Histological Information
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={6}>
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
              </Grid>
              <Grid item xs={12} sm={6}>
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
              </Grid>
            </Grid>
            <Divider sx={{ my: 1 }} />

            {/* Links & Sources Section */}
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Links & Sources
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <InfoItem
                  label="MicroDraw Link"
                  value={entry.identification?.microdraw_link}
                  isLink={!!entry.identification?.microdraw_link}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoItem
                  label="Source Link"
                  value={entry.identification.source_link}
                  isLink={!!entry.identification.source_link}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
};

export default EntryDetailsPage;
