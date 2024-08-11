import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  fetchUserCollections,
  fetchCollectionStats,
} from "../../utils/apiCalls";
import CollectionTable from "../../components/user/CollectionsTable";
import Navbar from "../../components/navbar/Navbar";

const Profile = () => {
  const { state } = useLocation();
  const userID = state.user._id;
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch collections the user is collaborating on or is the owner
        const collectionsData = await fetchUserCollections(userID);

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
        console.error("Failed to fetch collections", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [userID]);

  return (
    <div>
        <Navbar />
      <h1>User Profile</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <CollectionTable collections={collections} />
      )}
    </div>
  );
};

export default Profile;
