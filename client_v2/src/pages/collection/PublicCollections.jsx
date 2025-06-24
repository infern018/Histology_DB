import React, { useEffect, useState } from "react";
import { fetchPublicCollections } from "../../utils/apiCalls";
import CollectionTable from "../../components/user/CollectionsTable";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { COLORS } from "../../theme";
import Layout from "../../components/utils/Layout";

const PublicCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const collectionsData = await fetchPublicCollections();

        const collectionsWithStats = collectionsData.map((collection) => {
          return {
            ...collection,
            numCollaborators: 0,
          };
        });

        setCollections(collectionsWithStats);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch data", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          py: 3,
        }}
      >
        {/* Collections Section */}
        <Box
          sx={{
            flex: 1,
            maxWidth: "80rem",
            padding: 3,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          {/* Header Section */}
          <Box sx={{ textAlign: "left" }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 2,
              }}
            >
              Public Collections
            </Typography>

            {/* Summary */}
            <Paper
              sx={{
                p: 3,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${COLORS.neutral700}`,
                borderRadius: 2,
                mb: 3,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: theme.palette.text.secondary,
                  lineHeight: 1.6,
                  mb: 2,
                }}
              >
                Explore publicly available histological data collections from
                researchers around the world. These datasets have been made
                freely accessible to support scientific research and
                collaboration in the field of histology and microscopy.
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography
                variant="body2"
                sx={{
                  color: theme.palette.text.secondary,
                  fontStyle: "italic",
                }}
              >
                Click on any collection name to view detailed information and
                browse the available entries.
              </Typography>
            </Paper>
          </Box>

          {/* Collections Table */}
          <Box>
            {loading ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <CircularProgress />
                <Typography
                  variant="body2"
                  sx={{ mt: 2, color: theme.palette.text.secondary }}
                >
                  Loading public collections...
                </Typography>
              </Box>
            ) : (
              <CollectionTable collections={collections} isPublic={true} />
            )}
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default PublicCollections;
