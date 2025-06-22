import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useSelector } from "react-redux";
import { approvePublicationAPI, requestChangesAPI } from "../../utils/apiCalls";

const ActionDialog = ({
  open,
  onClose,
  collection,
  actionType,
  onComplete,
}) => {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { currentUser } = useSelector((state) => state.auth);

  const handleSubmit = async () => {
    if (actionType === "request-changes" && !comment.trim()) {
      setError("Comment is required when requesting changes");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (actionType === "approve") {
        await approvePublicationAPI(
          collection._id,
          comment,
          currentUser.accessToken
        );
      } else if (actionType === "request-changes") {
        await requestChangesAPI(
          collection._id,
          comment,
          currentUser.accessToken
        );
      }

      setComment("");
      onComplete();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setComment("");
      setError("");
      onClose();
    }
  };

  if (!collection) {
    return null;
  }

  const isApproval = actionType === "approve";

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        className: "admin-panel-paper",
      }}
    >
      <DialogTitle>
        {isApproval ? "Approve Publication" : "Request Changes"}
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" gutterBottom>
          Collection: <strong>{collection.name}</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Owner: {collection.ownerID?.username} ({collection.ownerID?.email})
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label={
              isApproval ? "Approval Comment (Optional)" : "Required Changes*"
            }
            placeholder={
              isApproval
                ? "Add any comments about the approval..."
                : "Describe what changes are needed before publication..."
            }
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            error={actionType === "request-changes" && !comment.trim()}
            helperText={
              actionType === "request-changes" && !comment.trim()
                ? "Please describe what changes are needed"
                : ""
            }
          />
        </Box>

        {isApproval && (
          <Alert severity="success" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>This action will:</strong>
            </Typography>
            <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
              <li>Mark the collection as published</li>
              <li>Make the collection publicly visible</li>
              <li>Notify the owner of the approval</li>
            </ul>
          </Alert>
        )}

        {actionType === "request-changes" && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>This action will:</strong>
            </Typography>
            <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
              <li>Mark the collection as requiring changes</li>
              <li>Send your comments to the collection owner</li>
              <li>Allow the owner to resubmit after making changes</li>
            </ul>
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color={isApproval ? "success" : "warning"}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={16} /> : null}
        >
          {loading
            ? "Processing..."
            : isApproval
            ? "Approve Publication"
            : "Request Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ActionDialog;
