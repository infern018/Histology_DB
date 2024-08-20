import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  fetchCollaboratorsAPI,
  fetchUserDetails,
  updateCollaboratorAPI,
  deleteCollaboratorAPI,
  addCollaboratorAPI,
  getAllUserMetas,
} from "../../utils/apiCalls";
import Layout from "../../components/utils/Layout";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchUserSelectComponent from "../../components/user/SearchUserSelect";

const CollectionSettings = () => {
  const { collectionID } = useParams();
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [dialogOpen, setAddDialogOpen] = useState(false);
  const accessToken = useSelector(
    (state) => state.auth.currentUser.accessToken
  );
  const currentUserID = useSelector((state) => state.auth.currentUser._id);

  useEffect(() => {
    const fetchCollaborators = async () => {
      const collaboratorsData = await fetchCollaboratorsAPI(
        collectionID,
        accessToken
      );
      return collaboratorsData;
    };

    const fetchUsersAndFilter = async (collaboratorsWithDetails) => {
      const allUsers = await getAllUserMetas(accessToken);
      return allUsers.filter(
        (user) =>
          user._id !== currentUserID &&
          !collaboratorsWithDetails.some(
            (collaborator) => collaborator.user_id === user._id
          )
      );
    };

    const fetchData = async () => {
      try {
        const collaboratorsData = await fetchCollaborators();
        const userIds = collaboratorsData.map(
          (collaborator) => collaborator.user_id
        );
        const userDetails = await fetchUserDetails(userIds, accessToken);

        const collaboratorsWithDetails = collaboratorsData.map(
          (collaborator) => {
            const user = userDetails.find(
              (user) => user._id === collaborator.user_id
            );
            return {
              ...collaborator,
              username: user.username,
              email: user.email,
            };
          }
        );

        const filteredUsers = await fetchUsersAndFilter(
          collaboratorsWithDetails
        );

        setCollaborators(collaboratorsWithDetails);
        setAllUsers(filteredUsers);
      } catch (error) {
        console.error("Failed to fetch collaborators", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionID, accessToken, currentUserID]);

  const handleModeToggle = async (collaboratorID, newMode) => {
    try {
      const updatedCollaborator = { user_id: collaboratorID, mode: newMode };
      await updateCollaboratorAPI(
        collectionID,
        updatedCollaborator,
        accessToken
      );
      setCollaborators((prevCollaborators) =>
        prevCollaborators.map((collaborator) =>
          collaborator.user_id === collaboratorID
            ? { ...collaborator, mode: newMode }
            : collaborator
        )
      );
    } catch (error) {
      console.error("Failed to update collaborator mode", error);
    }
  };

  const handleRemoveCollaborator = async (collaboratorID) => {
    try {
      await deleteCollaboratorAPI(collectionID, collaboratorID, accessToken);
      const removedUser = collaborators.find(
        (collaborator) => collaborator.user_id === collaboratorID
      );
      setCollaborators((prevCollaborators) =>
        prevCollaborators.filter(
          (collaborator) => collaborator.user_id !== collaboratorID
        )
      );
      setAllUsers((prevUsers) => [
        ...prevUsers,
        { _id: removedUser.user_id, username: removedUser.username },
      ]);
    } catch (error) {
      console.error("Failed to remove collaborator", error);
    }
  };

  const handleAddCollaborator = async (collaboratorID) => {
    try {
      const newCollaborator = { user_id: collaboratorID, mode: "view" };
      const updatedCollection = await addCollaboratorAPI(
        collectionID,
        newCollaborator,
        accessToken
      );
      const userIds = updatedCollection.collaborators.map(
        (collaborator) => collaborator.user_id
      );
      const userDetails = await fetchUserDetails(userIds, accessToken);
      const collaboratorsWithDetails = updatedCollection.collaborators.map(
        (collaborator) => {
          const user = userDetails.find(
            (user) => user._id === collaborator.user_id
          );
          return { ...collaborator, username: user.username, email: user.email };
        }
      );
      const filteredUsers = await getAllUserMetas(accessToken).then(
        (allUsers) =>
          allUsers.filter(
            (user) =>
              user._id !== currentUserID &&
              !collaboratorsWithDetails.some(
                (collaborator) => collaborator.user_id === user._id
              )
          )
      );
      setCollaborators(collaboratorsWithDetails);
      setAllUsers(filteredUsers);
    } catch (error) {
      console.error("Failed to add collaborator", error);
    }
  };

  const handleUserAdd = (selectedUser) => {
    if (selectedUser) {
      handleAddCollaborator(selectedUser.user_id);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Layout>
      <Box sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          Collection Settings
        </Typography>
        <Paper sx={{ padding: 3, marginBottom: 3 }}>
          <Typography variant="h6" gutterBottom>
            Collaborators
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Mode</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {collaborators.map((collaborator) => (
                  <TableRow key={collaborator.user_id}>
                    <TableCell>{collaborator.username}</TableCell>
                    <TableCell sx={{ color: "gray" }}>
                      {collaborator.email}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={collaborator.mode}
                        onChange={(e) =>
                          handleModeToggle(collaborator.user_id, e.target.value)
                        }
                        variant="outlined"
                        sx={{
                          width: "100px",
                          height: "40px",
                        }}
                      >
                        <MenuItem value="view">View</MenuItem>
                        <MenuItem value="edit">Edit</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() =>
                          handleRemoveCollaborator(collaborator.user_id)
                        }
                        sx={{ color: "#f44336" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
        <Button
          variant="outlined"
          onClick={() => setAddDialogOpen(true)}
          sx={{ marginBottom: 2 }}
        >
          Add Collaborator
        </Button>
        <Paper sx={{ padding: 3 }}>
          <SearchUserSelectComponent
            users={allUsers}
            onUserSelect={handleUserAdd}
          />
        </Paper>
      </Box>
    </Layout>
  );
};

export default CollectionSettings;
