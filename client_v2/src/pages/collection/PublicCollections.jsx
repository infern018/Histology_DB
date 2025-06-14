import React, { useEffect, useState } from "react";
import { fetchPublicCollections } from "../../utils/apiCalls";
import CollectionTable from "../../components/user/CollectionsTable";
import { Box, Typography, CircularProgress } from "@mui/material";
import Layout from "../../components/utils/Layout";

const PublicCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

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
        }}
      >
        {/* Collections Section */}
        <Box
          sx={{
            flex: 2,
            maxWidth: "60rem",
            padding: 3,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: 500, mb: 2 }}
            textAlign={"left"}
          >
            Public Collections
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : (
            <CollectionTable collections={collections} isPublic={true} />
          )}
        </Box>
      </Box>
    </Layout>
  );
};

export default PublicCollections;
