import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Alert,
  CircularProgress,
  Box,
  Chip,
} from "@mui/material";
import {
  PublishOutlined as PublishIcon,
  Comment as CommentIcon,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { requestPublicationAPI } from "../../utils/apiCalls";
import AdminCommentsDialog from "./AdminCommentsDialog";

const PublicationRequestButton = ({ collection, onStatusChange }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [commentsDialogOpen, setCommentsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { currentUser } = useSelector((state) => state.auth);

  const handleRequestPublication = async () => {
    setLoading(true);
    setError("");

    try {
      await requestPublicationAPI(
        collection.collection_id,
        currentUser.accessToken
      );
      setDialogOpen(false);
      if (onStatusChange) {
        onStatusChange();
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewFeedback = () => {
    setCommentsDialogOpen(true);
  };

  const handleResubmit = () => {
    setDialogOpen(true);
  };

  const getStatusDisplay = () => {
    switch (collection.publicationRequestStatus) {
      case "in_review":
        return {
          color: "warning",
          text: "In Review",
          description:
            "Your publication request is being reviewed by administrators.",
        };
      case "changes_requested":
        return {
          color: "info",
          text: "Changes Requested",
          description:
            "Administrators have requested changes before publication.",
        };
      case "published":
        return {
          color: "success",
          text: "Published",
          description: "Your collection has been approved and is now public.",
        };
      default:
        return null;
    }
  };

  const statusDisplay = getStatusDisplay();

  // Don't show button if collection is already public or not private
  if (collection.visibility !== "private") {
    return null;
  }

  // Render the button content based on status
  const renderButtonContent = () => {
    // Show status if there's a publication request
    if (collection.publicationRequestStatus) {
      return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip
            label={statusDisplay.text}
            color={statusDisplay.color}
            size="small"
          />
          {collection.publicationRequestStatus === "changes_requested" && (
            <>
              <Button
                size="small"
                variant="outlined"
                startIcon={<CommentIcon />}
                onClick={handleViewFeedback}
              >
                View Feedback
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={handleResubmit}
                disabled={loading}
              >
                Resubmit Request
              </Button>
            </>
          )}
          {collection.publicationRequestStatus === "published" &&
            collection.adminComments &&
            collection.adminComments.length > 0 && (
              <Button
                size="small"
                variant="outlined"
                startIcon={<CommentIcon />}
                onClick={() => setCommentsDialogOpen(true)}
              >
                View Comments
              </Button>
            )}
        </Box>
      );
    }

    // Show request publication button if no status
    return (
      <Button
        variant="outlined"
        startIcon={<PublishIcon />}
        onClick={() => setDialogOpen(true)}
        size="small"
      >
        Request Publication
      </Button>
    );
  };

  return (
    <>
      {renderButtonContent()}

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Request Publication</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Request to make <strong>{collection.name}</strong> publicly
            available?
          </Typography>

          <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
            <Typography variant="body2">
              <strong>What happens next:</strong>
            </Typography>
            <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
              <li>Your collection will be reviewed by administrators</li>
              <li>
                A validation report will be generated to check data quality
              </li>
              <li>You'll be notified of the decision via the platform</li>
              <li>
                If approved, your collection will become publicly searchable
              </li>
            </ul>
          </Alert>

          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Before requesting publication, ensure:</strong>
            </Typography>
            <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
              <li>All entries have complete required information</li>
              <li>
                Brain parts and staining methods use standardized terminology
              </li>
              <li>Species names are accurate and properly formatted</li>
              <li>You have permission to share all data publicly</li>
            </ul>
          </Alert>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleRequestPublication}
            variant="contained"
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={16} /> : <PublishIcon />
            }
          >
            {loading ? "Submitting..." : "Submit Request"}
          </Button>
        </DialogActions>
      </Dialog>

      <AdminCommentsDialog
        open={commentsDialogOpen}
        onClose={() => setCommentsDialogOpen(false)}
        collection={collection}
      />
    </>
  );
};

export default PublicationRequestButton;
