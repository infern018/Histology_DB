import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  fetchCollaboratorsAPI,
  fetchUserDetails,
  updateCollaboratorAPI,
  deleteCollaboratorAPI,
  addCollaboratorAPI,
  getAllUserMetas,
  flushCollectionAPI,
  getCollectionAPI,
} from "../../utils/apiCalls";
import Layout from "../../components/utils/Layout";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  Button,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Chip,
  Avatar,
  Autocomplete,
  TextField,
  Alert,
  Snackbar,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Collapse,
} from "@mui/material";
import {
  PersonRemove as PersonRemoveIcon,
  PersonAdd as PersonAddIcon,
  Edit as EditIcon,
  DeleteSweep as DeleteSweepIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import theme from "../../theme";

const CollectionSettings = () => {
  const { collectionID } = useParams();
  const navigate = useNavigate();
  const [collection, setCollection] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allUsers, setAllUsers] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openFlushDialog, setOpenFlushDialog] = useState(false);
  const [selectedCollaborator, setSelectedCollaborator] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedMode, setSelectedMode] = useState("view");
  const [showAddCollaborator, setShowAddCollaborator] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const accessToken = useSelector(
    (state) => state.auth.currentUser.accessToken
  );
  const currentUserID = useSelector((state) => state.auth.currentUser._id);

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);

      // Fetch collection details
      const collectionData = await getCollectionAPI(collectionID, accessToken);
      setCollection(collectionData);

      // Fetch collaborators
      const collaboratorsData = await fetchCollaboratorsAPI(
        collectionID,
        accessToken
      );
      const userIds = collaboratorsData.map(
        (collaborator) => collaborator.user_id
      );
      const userDetails = await fetchUserDetails(userIds, accessToken);

      const collaboratorsWithDetails = collaboratorsData.map((collaborator) => {
        const user = userDetails.find(
          (user) => user._id === collaborator.user_id
        );
        return {
          ...collaborator,
          username: user?.username || "Unknown",
          email: user?.email || "Unknown",
        };
      });

      // Fetch all users for adding collaborators
      const allUsersData = await getAllUserMetas(accessToken);
      const filteredUsers = allUsersData.filter(
        (user) =>
          user._id !== currentUserID &&
          !collaboratorsWithDetails.some(
            (collaborator) => collaborator.user_id === user._id
          )
      );

      setCollaborators(collaboratorsWithDetails);
      setAllUsers(filteredUsers);
    } catch (error) {
      console.error("Failed to fetch data", error);
      showSnackbar("Failed to load collection settings", "error");
    } finally {
      setLoading(false);
    }
  }, [collectionID, accessToken, currentUserID]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleFlushCollection = async () => {
    try {
      const result = await flushCollectionAPI(collectionID, accessToken);
      setOpenFlushDialog(false);
      showSnackbar(
        `Successfully deleted ${result.deletedCount || 0} entries`,
        "success"
      );
    } catch (error) {
      console.error("Failed to flush collection", error);
      showSnackbar("Failed to flush collection", "error");
    }
  };

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
      showSnackbar("Collaborator permissions updated", "success");
    } catch (error) {
      console.error("Failed to update collaborator mode", error);
      showSnackbar("Failed to update permissions", "error");
    }
  };

  const handleRemoveCollaborator = async () => {
    if (!selectedCollaborator) return;
    try {
      await deleteCollaboratorAPI(
        collectionID,
        selectedCollaborator.user_id,
        accessToken
      );
      const removedUser = collaborators.find(
        (collaborator) => collaborator.user_id === selectedCollaborator.user_id
      );
      setCollaborators((prevCollaborators) =>
        prevCollaborators.filter(
          (collaborator) =>
            collaborator.user_id !== selectedCollaborator.user_id
        )
      );
      setAllUsers((prevUsers) => [
        ...prevUsers,
        {
          _id: removedUser.user_id,
          username: removedUser.username,
          email: removedUser.email,
        },
      ]);
      setOpenDeleteDialog(false);
      setSelectedCollaborator(null);
      showSnackbar("Collaborator removed successfully", "success");
    } catch (error) {
      console.error("Failed to remove collaborator", error);
      showSnackbar("Failed to remove collaborator", "error");
    }
  };

  const handleAddCollaborator = async () => {
    if (!selectedUser) return;
    try {
      const newCollaborator = { user_id: selectedUser._id, mode: selectedMode };
      await addCollaboratorAPI(collectionID, newCollaborator, accessToken);

      // Add to collaborators list
      setCollaborators((prev) => [
        ...prev,
        {
          user_id: selectedUser._id,
          mode: selectedMode,
          username: selectedUser.username,
          email: selectedUser.email,
        },
      ]);

      // Remove from available users
      setAllUsers((prev) =>
        prev.filter((user) => user._id !== selectedUser._id)
      );

      // Reset form
      setSelectedUser(null);
      setSelectedMode("view");
      showSnackbar("Collaborator added successfully", "success");
    } catch (error) {
      console.error("Failed to add collaborator", error);
      showSnackbar("Failed to add collaborator", "error");
    }
  };

  const handleDeleteClick = (collaborator) => {
    setSelectedCollaborator(collaborator);
    setOpenDeleteDialog(true);
  };

  if (loading) {
    return (
      <Layout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "400px",
          }}
        >
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ width: "45rem", mx: "auto", p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{ color: theme.palette.text.primary, mb: 1 }}
          >
            Collection Settings
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: theme.palette.text.secondary }}
          >
            {collection?.name}
          </Typography>
        </Box>

        {/* Quick Actions */}
        <Card sx={{ backgroundColor: theme.palette.background.default, mb: 4 }}>
          <CardContent>
            <Typography
              variant="h6"
              sx={{ color: theme.palette.text.primary, mb: 3 }}
            >
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => navigate(`/collection/${collectionID}/edit`)}
                  sx={{
                    "color": theme.palette.text.secondary,
                    "borderColor": theme.palette.text.secondary,
                    "&:hover": {
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  Edit Collection
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<PersonAddIcon />}
                  onClick={() => setShowAddCollaborator(!showAddCollaborator)}
                  sx={{
                    "color": theme.palette.text.secondary,
                    "borderColor": theme.palette.text.secondary,
                    "&:hover": {
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  Add Collaborator
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<DeleteSweepIcon />}
                  onClick={() => setOpenFlushDialog(true)}
                  sx={{
                    "color": theme.palette.error.main,
                    "borderColor": theme.palette.error.main,
                    "&:hover": {
                      borderColor: theme.palette.error.dark,
                      backgroundColor: "rgba(244, 67, 54, 0.04)",
                    },
                  }}
                >
                  Flush Collection
                </Button>
              </Grid>
            </Grid>

            {/* Collapsible Add Collaborator Section */}
            <Collapse in={showAddCollaborator}>
              <Box
                sx={{
                  mt: 3,
                  pt: 3,
                  borderTop: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ color: theme.palette.text.primary, mb: 2 }}
                >
                  Add New Collaborator
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      value={selectedUser}
                      onChange={(event, newValue) => setSelectedUser(newValue)}
                      options={allUsers}
                      getOptionLabel={(option) =>
                        `${option.username} (${option.email})`
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select User"
                          variant="outlined"
                          size="small"
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              "color": theme.palette.text.primary,
                              "& fieldset": {
                                borderColor: theme.palette.text.secondary,
                              },
                              "&:hover fieldset": {
                                borderColor: theme.palette.text.primary,
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: theme.palette.primary.main,
                              },
                            },
                            "& .MuiInputLabel-root": {
                              color: theme.palette.text.secondary,
                            },
                          }}
                        />
                      )}
                      renderOption={(props, option) => (
                        <Box component="li" {...props}>
                          <Avatar sx={{ mr: 2, width: 32, height: 32 }}>
                            {option.username.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="body2">
                              {option.username}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {option.email}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Select
                      value={selectedMode}
                      onChange={(e) => setSelectedMode(e.target.value)}
                      size="small"
                      fullWidth
                      sx={{
                        "color": theme.palette.text.primary,
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: theme.palette.text.secondary,
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: theme.palette.text.primary,
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: theme.palette.primary.main,
                        },
                      }}
                    >
                      <MenuItem value="view">View Only</MenuItem>
                      <MenuItem value="edit">Edit Access</MenuItem>
                    </Select>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={handleAddCollaborator}
                      disabled={!selectedUser}
                    >
                      Add
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
          </CardContent>
        </Card>

        {/* Collaborators List */}
        <Card sx={{ backgroundColor: theme.palette.background.default }}>
          <CardContent>
            <Typography
              variant="h6"
              sx={{ color: theme.palette.text.primary, mb: 3 }}
            >
              Collaborators ({collaborators.length})
            </Typography>
            {collaborators.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  No collaborators added yet
                </Typography>
              </Box>
            ) : (
              <List>
                {collaborators.map((collaborator, index) => (
                  <React.Fragment key={collaborator.user_id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar>
                          {collaborator.username.charAt(0).toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography
                            variant="body1"
                            sx={{ color: theme.palette.text.primary }}
                          >
                            {collaborator.username}
                          </Typography>
                        }
                        secondary={
                          <Typography
                            variant="body2"
                            sx={{ color: theme.palette.text.secondary }}
                          >
                            {collaborator.email}
                          </Typography>
                        }
                      />
                      <ListItemSecondaryAction
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Select
                          value={collaborator.mode}
                          onChange={(e) =>
                            handleModeToggle(
                              collaborator.user_id,
                              e.target.value
                            )
                          }
                          size="small"
                          sx={{
                            "minWidth": 100,
                            "color": theme.palette.text.primary,
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "transparent",
                            },
                          }}
                        >
                          <MenuItem value="view">
                            <Chip label="View" size="small" color="default" />
                          </MenuItem>
                          <MenuItem value="edit">
                            <Chip label="Edit" size="small" color="primary" />
                          </MenuItem>
                        </Select>
                        <IconButton
                          onClick={() => handleDeleteClick(collaborator)}
                          sx={{
                            "color": theme.palette.text.secondary,
                            "&:hover": {
                              color: theme.palette.error.main,
                              backgroundColor: "rgba(244, 67, 54, 0.04)",
                            },
                          }}
                        >
                          <PersonRemoveIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < collaborators.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Delete Collaborator Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ color: theme.palette.text.primary }}>
          Remove Collaborator
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: theme.palette.text.secondary }}>
            Are you sure you want to remove{" "}
            <strong>{selectedCollaborator?.username}</strong> as a collaborator
            from this collection? They will lose access to view and edit this
            collection.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            sx={{ color: theme.palette.text.secondary }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRemoveCollaborator}
            color="error"
            variant="contained"
          >
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      {/* Flush Collection Dialog */}
      <Dialog
        open={openFlushDialog}
        onClose={() => setOpenFlushDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            color: theme.palette.text.primary,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <WarningIcon color="error" />
          Flush Collection
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone!
          </Alert>
          <DialogContentText sx={{ color: theme.palette.text.secondary }}>
            Are you sure you want to flush this collection? This will
            permanently delete all entries in the collection. The collection
            itself will remain, but all data will be lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenFlushDialog(false)}
            sx={{ color: theme.palette.text.secondary }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleFlushCollection}
            color="error"
            variant="contained"
          >
            Flush Collection
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default CollectionSettings;
