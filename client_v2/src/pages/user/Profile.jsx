import React, { useEffect, useState } from "react";
import {
  fetchUserCollections,
  fetchCollectionStats,
  fetchUserDetails,
} from "../../utils/apiCalls";
import CollectionTable from "../../components/user/CollectionsTable";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";
import Layout from "../../components/utils/Layout";

const Profile = () => {
  const user = useSelector((state) => state.auth.currentUser);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user information
        const userResponse = await fetchUserDetails([user._id]);
        const { username, email, createdAt } = userResponse[0];

        const date = new Date(createdAt);
        const formattedDate = date.toLocaleDateString("en-GB");

        setUserInfo({
          username,
          email,
          createdAt: formattedDate,
        });

        // Fetch collections the user is collaborating on or is the owner
        const collectionsData = await fetchUserCollections(user._id);

        // Fetch stats for each collection asynchronously
        const collectionsWithStats = await Promise.all(
          collectionsData.map(async (collection) => {
            const stats = await fetchCollectionStats(collection.collection_id);
            return {
              ...collection,
              numCollaborators: stats.numCollaborators,
            };
          })
        );

        setCollections(collectionsWithStats);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch data", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return (
    <Layout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",  // Layout children in a row
          justifyContent: "space-between",  // Add space between the sections
          gap: 3,  // Add some space between the boxes
          width: "100%",  // Full width of the layout
          alignItems: "flex-start", // Align items at the top
        }}
      >
        {/* User Meta Info Section */}
        <Box
          sx={{
            flex: 1,
            maxWidth: 400,
            padding: 3,
            backgroundColor: "rgba(255,2555,255,0.7)", // Solid background color
            borderRadius: 2,
            textAlign: "left",
          }}
        >
          {loading ? (
            <CircularProgress />
          ) : (
            <Box>
              <Typography variant="body1">
                <strong>Username:</strong> {userInfo.username}
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong> {userInfo.email}
              </Typography>
              <Typography variant="body1">
                Joined {userInfo.createdAt}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Collections Section */}
        <Box
          sx={{
            flex: 2,
            maxWidth: 800,
            padding: 3,
            backgroundColor: "#ffffff", // Solid background color
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 500, mb: 2 }}>
            My Collections
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : (
            <CollectionTable collections={collections} />
          )}
        </Box>
      </Box>
    </Layout>
  );
};

export default Profile;
