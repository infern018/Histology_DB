import React from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Paper,
  Tooltip,
  Box,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { deleteCollectionAPI } from "../../utils/apiCalls";
import { useState } from "react";
import { useSelector } from "react-redux";
import theme, { COLORS } from "../../theme";
import PublicationRequestButton from "../collection/PublicationRequestButton";
import DeleteConfirmationDialog from "../dialogs/DeleteConfirmationDialog";

const CollectionTable = ({ collections, isPublic }) => {
  if (!isPublic) {
    isPublic = false;
  }

  const user = useSelector((state) => state.auth.currentUser);

  const [displayCollections, setDisplayCollections] = useState(collections);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState(null);

  const handleDeleteClick = (collection) => {
    setCollectionToDelete(collection);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!collectionToDelete) return;

    try {
      await deleteCollectionAPI(
        collectionToDelete.collection_id,
        user.accessToken
      );
      // Remove the collection from the state
      const updatedCollections = collections.filter(
        (collection) =>
          collection.collection_id !== collectionToDelete.collection_id
      );
      setDisplayCollections(updatedCollections);
    } catch (error) {
      console.error("Failed to delete collection:", error);
    } finally {
      setDeleteDialogOpen(false);
      setCollectionToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCollectionToDelete(null);
  };

  const tableRowHeight = 65;
  const tableHeaderRowHeight = 52;

  return (
    <TableContainer
      component={Paper}
      sx={{
        width: "100%",
        maxWidth: "100%",
        overflowY: "auto",
        borderRadius: "8px",
        border: "1px solid",
        borderColor: COLORS.neutral700,
      }}
    >
      <Table sx={{ width: "100%" }} size="small">
        <TableHead>
          <TableRow
            sx={{
              height: tableHeaderRowHeight,
              backgroundColor: theme.palette.background.light,
            }}
          >
            <TableCell>
              <Typography variant="subtitle2" fontWeight="bold" color="white">
                Collection Name
              </Typography>
            </TableCell>
            {isPublic ? (
              <>
                <TableCell>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    color="white"
                  >
                    Description
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    color="white"
                  >
                    Owner
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    color="white"
                  >
                    Total Records
                  </Typography>
                </TableCell>
              </>
            ) : (
              <>
                <TableCell>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    color="white"
                  >
                    Access Mode
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    color="white"
                  >
                    Publication Status
                  </Typography>
                </TableCell>
                <TableCell align="center" sx={{ width: "120px" }}>
                  <Typography
                    variant="subtitle2"
                    fontWeight="bold"
                    color="white"
                  >
                    Actions
                  </Typography>
                </TableCell>
              </>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {displayCollections.map((collection, index) => (
            <TableRow
              key={index}
              hover
              sx={{
                "height": tableRowHeight,
                "cursor": "pointer",
                "backgroundColor": theme.palette.background.default,
                "&:hover": {
                  backgroundColor: "#333333",
                },
                "transition": "background-color 0.3s ease",
              }}
            >
              <TableCell>
                <Link
                  to={
                    !isPublic && user
                      ? `/collection/${collection.collection_id}/entries?collectionName=${collection.name}`
                      : `/collection/${collection.collection_id}?isPublic=${isPublic}`
                  }
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Typography
                    variant="body2"
                    color="white"
                    sx={{
                      "&:hover": {
                        color: theme.palette.primary.main,
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {collection.name}
                  </Typography>
                </Link>
              </TableCell>

              {isPublic ? (
                <>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        maxWidth: "300px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {collection.description || "No description available"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="white">
                      {collection.owner || "Unknown"}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" color="white" fontWeight="bold">
                      {collection.entryCount || 0}
                    </Typography>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>
                    <Typography variant="body2" color="white">
                      {collection.mode}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PublicationRequestButton
                        collection={collection}
                        onStatusChange={() => {
                          // Optionally refresh collections here
                          window.location.reload();
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "4px",
                      }}
                    >
                      {(collection.mode === "edit" ||
                        collection.mode === "owner") && (
                        <Tooltip title="Collection Settings" arrow>
                          <IconButton
                            component={Link}
                            to={`/collection/${collection.collection_id}/settings`}
                            sx={{
                              "color": theme.palette.text.secondary,
                              "padding": "6px",
                              "&:hover": {
                                backgroundColor: theme.palette.action.hover,
                                color: theme.palette.primary.main,
                              },
                              "transition": "all 0.2s ease",
                            }}
                            size="small"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <SettingsIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {collection.mode === "owner" && (
                        <Tooltip title="Delete Collection" arrow>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(collection);
                            }}
                            sx={{
                              "color": theme.palette.text.secondary,
                              "padding": "6px",
                              "&:hover": {
                                backgroundColor: "rgba(244, 67, 54, 0.1)",
                                color: "#f44336",
                              },
                              "transition": "all 0.2s ease",
                            }}
                            size="small"
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Collection"
        message={`Are you sure you want to delete the collection "${collectionToDelete?.name}"? This action cannot be undone.`}
      />
    </TableContainer>
  );
};

export default CollectionTable;
