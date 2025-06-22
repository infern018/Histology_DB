import React, { useEffect, useState } from "react";
import {
  fetchUserCollections,
  fetchUserDetails,
  getUserCollectionsWithStatus,
} from "../../utils/apiCalls";
import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useTheme } from "@mui/material/styles";
import Layout from "../../components/utils/Layout";
import ProfileSidebar from "../../components/user/ProfileSidebar";
import ProfileDetails from "../../components/user/ProfileDetails";
import MyDataTab from "../../components/user/MyDataTab";

const Profile = () => {
  const theme = useTheme();
  const user = useSelector((state) => state.auth.currentUser);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch user details
        const userResponse = await fetchUserDetails([user._id]);
        const { username, email, createdAt } = userResponse[0];

        const date = new Date(createdAt);
        const formattedDate = date.toLocaleDateString("en-GB");

        setUserInfo({
          username,
          email,
          createdAt: formattedDate,
        });

        // Fetch collections with publication status
        const collectionsData = await getUserCollectionsWithStatus(
          user.accessToken
        );
        // Transform the data to match the expected format
        const formattedCollections = collectionsData.map((collection) => ({
          collection_id: collection._id,
          name: collection.name,
          mode: "owner", // User is owner of their collections
          visibility: collection.visibility,
          publicationRequestStatus: collection.publicationRequestStatus,
          publicationRequestedAt: collection.publicationRequestedAt,
          adminComments: collection.adminComments,
        }));
        setCollections(formattedCollections);

        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch data", error);
        setError(error.message || "Failed to fetch user data");
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchData();
    }
  }, [user]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileDetails userInfo={userInfo} loading={loading} />;
      case "mydata":
        return <MyDataTab collections={collections} loading={loading} />;
      default:
        return <ProfileDetails userInfo={userInfo} loading={loading} />;
    }
  };

  return (
    <Layout>
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          width: "75%",
        }}
      >
        <Box>
          {/* Page Header */}
          <Box sx={{ marginBottom: "2rem" }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                marginBottom: "0.5rem",
              }}
            >
              Settings
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: theme.palette.text.secondary,
              }}
            >
              Manage your account settings and preferences
            </Typography>
          </Box>

          {/* Error Display */}
          {error && (
            <Box
              sx={{
                backgroundColor: theme.palette.error?.main || "#ef4444",
                color: theme.palette.error?.contrastText || "#ffffff",
                padding: "1rem",
                borderRadius: "0.5rem",
                marginBottom: "1.5rem",
              }}
            >
              <Typography variant="body2">{error}</Typography>
            </Box>
          )}

          {/* Main Content */}
          <Box
            sx={{
              display: "flex",
              gap: "2rem",
              alignItems: "flex-start",
            }}
          >
            {/* Sidebar */}
            <ProfileSidebar
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />

            {/* Content Area */}
            <Box
              sx={{
                flex: 1,
                minHeight: "30rem",
              }}
            >
              {renderTabContent()}
            </Box>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default Profile;
