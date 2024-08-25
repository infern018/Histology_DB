// src/pages/EntryDetailsPage.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  CircularProgress,
  Typography,
  Paper,
  Box,
  Button,
  Divider,
  Grid,
  Avatar,
} from "@mui/material";
import { getEntryAPI } from "../../utils/apiCalls";
import Layout from "../../components/utils/Layout";
import { useSelector } from "react-redux";

const EntryDetailsPage = () => {
  const user = useSelector((state) => state.auth.currentUser);

  const { entryID } = useParams();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const data = await getEntryAPI(entryID, user.accessToken);
        setEntry(data);
      } catch (error) {
        console.error("Error fetching entry:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, [entryID, user.accessToken]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!entry) {
    return <Typography variant="h6">Entry not found</Typography>;
  }

  return (
    <Layout>
      <Paper
        style={{
          padding: "20px",
          marginTop: "20px",
          maxWidth: "1200px",
          margin: "0 auto",
          background: "rgba(255, 255, 255, 0.8)",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Entry Details
        </Typography>
        <Divider style={{ margin: "20px 0" }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box mb={2}>
              <Typography variant="h6">Binomial Species Name:</Typography>
              <Typography variant="body1">
                {entry.identification.bionomialSpeciesName || "N/A"}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box mb={2}>
              <Typography variant="h6">Wikipedia Link:</Typography>
              <Typography variant="body1">
                <a
                  href={entry.identification.wikipediaSpeciesName}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {entry.identification.wikipediaSpeciesName || "N/A"}
                </a>
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box mb={2}>
              <Typography variant="h6">Developmental Stage:</Typography>
              <Typography variant="body1">
                {entry.physiologicalInformation.age.developmentalStage || "N/A"}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box mb={2}>
              <Typography variant="h6">Sex:</Typography>
              <Typography variant="body1">
                {entry.physiologicalInformation.sex || "N/A"}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box mb={2}>
              <Typography variant="h6">Body Weight (grams):</Typography>
              <Typography variant="body1">
                {entry.physiologicalInformation.bodyWeight || "N/A"}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box mb={2}>
              <Typography variant="h6">Brain Weight (grams):</Typography>
              <Typography variant="body1">
                {entry.physiologicalInformation.brainWeight || "N/A"}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box mb={2}>
              <Typography variant="h6">Staining Method:</Typography>
              <Typography variant="body1">
                {entry.histologicalInformation.stainingMethod || "N/A"}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box mb={2}>
              <Typography variant="h6">Plane of Sectioning:</Typography>
              <Typography variant="body1">
                {entry.histologicalInformation.planeOfSectioning || "N/A"}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box mb={2}>
              <Typography variant="h6">Inter-Section Distance:</Typography>
              <Typography variant="body1">
                {entry.histologicalInformation.interSectionDistance || "N/A"}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box mb={2}>
              <Typography variant="h6">Comments:</Typography>
              <Typography variant="body1">
                {entry.histologicalInformation.comments || "N/A"}
              </Typography>
            </Box>
          </Grid>

          {entry.histologicalInformation.dataThumbnailImage && (
            <Grid item xs={12}>
              <Box mb={2} textAlign="center">
                <Typography variant="h6">Data Thumbnail:</Typography>
                <img
                  src={entry.histologicalInformation.dataThumbnailImage}
                  alt="Thumbnail"
                  style={{
                    maxWidth: "100%",
                    height: "auto",
                    borderRadius: "8px",
                  }}
                />
              </Box>
            </Grid>
          )}
        </Grid>

        <Box mt={3} textAlign="center">
          <Button
            variant="contained"
            color="primary"
            onClick={() => window.history.back()}
          >
            Back
          </Button>
        </Box>
      </Paper>
    </Layout>
  );
};

export default EntryDetailsPage;
