// src/pages/CollectionSettings.js
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
import CollaboratorsTable from "../../components/collection/CollaboratorsTable";
import SearchUserSelectComponent from "../../components/user/SearchUserSelect";

const CollectionSettings = () => {
  const { collectionID } = useParams();
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
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
            return { ...collaborator, username: user.username };
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

  const handleModeChange = async (collaboratorID, mode) => {
    try {
      const updatedCollaborator = {
        user_id: collaboratorID,
        mode,
      };

      await updateCollaboratorAPI(
        collectionID,
        updatedCollaborator,
        accessToken
      );

      setCollaborators((prevCollaborators) =>
        prevCollaborators.map((collaborator) =>
          collaborator.user_id === collaboratorID
            ? { ...collaborator, mode }
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
      const newCollaborator = {
        user_id: collaboratorID,
        mode: "view",
      };

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
          return { ...collaborator, username: user.username };
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
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Collection Settings</h1>
      <h2>Collaborators</h2>
      <CollaboratorsTable
        collaborators={collaborators}
        onModeChange={handleModeChange}
        onRemove={handleRemoveCollaborator}
      />
      <h2>Add Collaborator</h2>
      <SearchUserSelectComponent
        users={allUsers}
        onUserSelect={handleUserAdd}
      />
    </div>
  );
};

export default CollectionSettings;
