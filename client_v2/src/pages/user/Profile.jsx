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
        const userResponse = await fetchUserDetails([user._id]);
        const { username, email, createdAt } = userResponse[0];

        const date = new Date(createdAt);
        const formattedDate = date.toLocaleDateString("en-GB");

        setUserInfo({
          username,
          email,
          createdAt: formattedDate,
        });

        const collectionsData = await fetchUserCollections(user._id);
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
          flexDirection: "row",
          gap: 3,
          width: "100%",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: 2, // Adjust padding to ensure no extra margins
          margin: "0 auto", // Prevent horizontal scroll
        }}
      >
        {/* User Meta Info Section */}
        <Box
          sx={{
            flex: 1,
            maxWidth: 400,
            padding: 3,
            backgroundColor: "rgba(255,255,255,0.9)",
            borderRadius: 2,
            textAlign: "left",
            boxShadow: 3,
            boxSizing: "border-box",
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
                <strong>Joined:</strong> {userInfo.createdAt}
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
            backgroundColor: "#ffffff",
            borderRadius: 2,
            textAlign: "center",
            boxShadow: 3,
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: 500, mb: 2 }}
            textAlign={"left"}
          >
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
