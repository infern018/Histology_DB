import React from "react";
import { useSelector } from "react-redux";
import Typography from "@mui/material/Typography";
import Layout from "../components/utils/Layout";

const Home = () => {
  const user = useSelector((state) => state.auth.currentUser);

  return (
    <Layout>
      {user && (
        <Typography variant="h3" color="primary" sx={{ mt: 3, mb:4 }}>
          Hey, {user.username}!
        </Typography>
      )}
      <Typography variant="h4" sx={{ fontWeight: 500, color: "#0c2f57" }}>
        Welcome to MiMe,
      </Typography>
      <Typography paragraph sx={{ fontSize: 20, mt: 2 }}>
        Microscopy Metadata Index (MiMe) is a platform designed to streamline
        the sharing and collaboration of histology data. Discover, contribute,
        and manage your data seamlessly.
      </Typography>
    </Layout>
  );
};

export default Home;
