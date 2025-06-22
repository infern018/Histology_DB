import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  Chip,
  Paper,
  Alert,
} from "@mui/material";
import {
  Person as PersonIcon,
  AccessTime as TimeIcon,
} from "@mui/icons-material";

const AdminCommentsDialog = ({ open, onClose, collection }) => {
  if (!collection) {
    return null;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusDisplay = () => {
    switch (collection.publicationRequestStatus) {
      case "changes_requested":
        return {
          color: "error",
          text: "Changes Requested",
          description:
            "Please address the following feedback and resubmit your collection for review.",
        };
      case "published":
        return {
          color: "success",
          text: "Published",
          description:
            "Your collection has been approved and is now publicly available.",
        };
      default:
        return {
          color: "warning",
          text: "In Review",
          description: "Your collection is currently being reviewed.",
        };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        className: "admin-panel-paper",
      }}
    >
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h6">
            Admin Feedback: {collection.name}
          </Typography>
          <Chip
            label={statusDisplay.text}
            color={statusDisplay.color}
            size="small"
          />
        </Box>
      </DialogTitle>

      <DialogContent>
        <Alert severity={statusDisplay.color} sx={{ mb: 3 }}>
          <Typography variant="body2">{statusDisplay.description}</Typography>
        </Alert>

        {collection.adminComments && collection.adminComments.length > 0 ? (
          <Box>
            <Typography variant="h6" gutterBottom>
              Admin Comments ({collection.adminComments.length})
            </Typography>

            <List sx={{ width: "100%" }}>
              {collection.adminComments
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((comment, index) => (
                  <ListItem key={index} sx={{ px: 0, pb: 2 }}>
                    <Paper
                      sx={{
                        width: "100%",
                        p: 2,
                        backgroundColor: "background.paper",
                        border: 1,
                        borderColor: "divider",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <PersonIcon fontSize="small" color="action" />
                        <Typography variant="subtitle2" fontWeight="bold">
                          {comment.adminId?.username || "Admin"}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            ml: "auto",
                          }}
                        >
                          <TimeIcon fontSize="small" color="action" />
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(comment.createdAt)}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {comment.comment}
                      </Typography>
                    </Paper>
                  </ListItem>
                ))}
            </List>
          </Box>
        ) : (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No admin comments yet.
            </Typography>
          </Box>
        )}

        {collection.publicationRequestStatus === "changes_requested" && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Next Steps:</strong>
            </Typography>
            <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
              <li>Review the admin feedback above</li>
              <li>Make the necessary changes to your collection</li>
              <li>Click "Resubmit Request" to request publication again</li>
            </ul>
          </Alert>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdminCommentsDialog;
