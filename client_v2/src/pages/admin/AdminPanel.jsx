import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { useSelector } from "react-redux";
import { getCollectionsInReviewAPI } from "../../utils/apiCalls";
import ValidationReportDialog from "../../components/admin/ValidationReportDialog";
import ActionDialog from "../../components/admin/ActionDialog";

const AdminPanel = () => {
  const [collectionsInReview, setCollectionsInReview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [validationDialogOpen, setValidationDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(""); // 'approve' or 'request-changes'

  const { currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    if (currentUser?.isAdmin) {
      loadCollectionsInReview();
    }
  }, [currentUser]);

  const loadCollectionsInReview = async () => {
    try {
      setLoading(true);
      const data = await getCollectionsInReviewAPI(currentUser.accessToken);
      setCollectionsInReview(data);
    } catch (error) {
      setError("Failed to load collections in review");
      console.error("Error loading collections:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewValidation = (collection) => {
    setSelectedCollection(collection);
    setValidationDialogOpen(true);
  };

  const handleAction = (collection, action) => {
    setSelectedCollection(collection);
    setActionType(action);
    setActionDialogOpen(true);
  };

  const handleActionComplete = () => {
    setActionDialogOpen(false);
    setSelectedCollection(null);
    setActionType("");
    loadCollectionsInReview(); // Refresh the list
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "in_review":
        return "warning";
      case "changes_requested":
        return "error";
      case "published":
        return "success";
      default:
        return "default";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!currentUser?.isAdmin) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          You do not have permission to access the admin panel.
        </Alert>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 3,
        minHeight: "100vh",
        background: "inherit",
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 700,
          color: "text.primary",
          mb: 3,
        }}
      >
        Admin Panel - Publication Requests
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card className="admin-metrics-card">
            <CardContent>
              <Typography
                variant="h6"
                color="info.main"
                sx={{ fontWeight: 600 }}
              >
                Total Requests
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, mt: 1 }}>
                {collectionsInReview.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="admin-metrics-card">
            <CardContent>
              <Typography
                variant="h6"
                color="warning.main"
                sx={{ fontWeight: 600 }}
              >
                In Review
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, mt: 1 }}>
                {
                  collectionsInReview.filter(
                    (c) => c.publicationRequestStatus === "in_review"
                  ).length
                }
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="admin-metrics-card">
            <CardContent>
              <Typography
                variant="h6"
                color="error.main"
                sx={{ fontWeight: 600 }}
              >
                Changes Requested
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 700, mt: 1 }}>
                {
                  collectionsInReview.filter(
                    (c) => c.publicationRequestStatus === "changes_requested"
                  ).length
                }
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <TableContainer component={Paper} className="admin-panel-paper">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Collection Name</TableCell>
              <TableCell>Owner</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Requested Date</TableCell>
              <TableCell>Total Entries</TableCell>
              <TableCell>Issues</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {collectionsInReview.map((collection) => (
              <TableRow key={collection._id}>
                <TableCell>
                  <Typography variant="subtitle2">{collection.name}</Typography>
                  {collection.description && (
                    <Typography variant="body2" color="text.secondary">
                      {collection.description}
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {collection.ownerID.username}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {collection.ownerID.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={collection.publicationRequestStatus
                      .replace("_", " ")
                      .toUpperCase()}
                    color={getStatusColor(collection.publicationRequestStatus)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {formatDate(collection.publicationRequestedAt)}
                </TableCell>
                <TableCell>
                  {collection.validationReport?.totalEntries || 0}
                </TableCell>
                <TableCell>
                  <Chip
                    label={`${
                      collection.validationReport?.issues?.length || 0
                    } issues`}
                    color={
                      collection.validationReport?.issues?.length > 0
                        ? "warning"
                        : "success"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleViewValidation(collection)}
                    >
                      View Report
                    </Button>
                    {collection.publicationRequestStatus === "in_review" && (
                      <>
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          onClick={() => handleAction(collection, "approve")}
                        >
                          Approve
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          color="warning"
                          onClick={() =>
                            handleAction(collection, "request-changes")
                          }
                        >
                          Request Changes
                        </Button>
                      </>
                    )}
                    {collection.publicationRequestStatus ===
                      "changes_requested" && (
                      <Button
                        size="small"
                        variant="contained"
                        color="info"
                        onClick={() => handleAction(collection, "approve")}
                      >
                        Approve Now
                      </Button>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {collectionsInReview.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            p: 6,
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 2,
            backgroundColor: "rgba(39, 39, 42, 0.3)",
          }}
        >
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No collections pending review
          </Typography>
          <Typography variant="body2" color="text.secondary">
            All publication requests have been processed
          </Typography>
        </Box>
      )}

      <ValidationReportDialog
        open={validationDialogOpen}
        onClose={() => setValidationDialogOpen(false)}
        collection={selectedCollection}
      />

      <ActionDialog
        open={actionDialogOpen}
        onClose={() => setActionDialogOpen(false)}
        collection={selectedCollection}
        actionType={actionType}
        onComplete={handleActionComplete}
      />
    </Box>
  );
};

export default AdminPanel;
