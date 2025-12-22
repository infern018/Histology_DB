import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  Grid,
  Typography,
  Box,
  Pagination,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon,
} from "@mui/icons-material";

import VerticalAlignBottomIcon from "@mui/icons-material/VerticalAlignBottom";
import { useTheme } from "@mui/material/styles";
import {
  fetchEntriesByCollectionID,
  deleteEntriesAPI,
  fetchEntriesOfPublicCollection,
} from "../../utils/apiCalls";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Layout from "../../components/utils/Layout";
import { Link } from "react-router-dom";
import EntriesTable from "../../components/entries/EntriesTable";
import Snackbar from "@mui/material/Snackbar";

import DeleteConfirmationDialog from "../../components/dialogs/DeleteConfirmationDialog";
import TableSkeleton from "../../components/utils/TableSkeleton";

const CollectionEntriesPage = () => {
  const { collectionID } = useParams();
  const theme = useTheme();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const isPublic = queryParams.get("isPublic") === "true";
  const collectionName = queryParams.get("collectionName");
  const currUserMode = queryParams.get("mode");

  const currUser = useSelector((state) => state.auth.currentUser);

  const accessToken = currUser ? currUser.accessToken : null;

  const [openSnackbar, setOpenSnackbar] = useState(false);

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const [sortField, setSortField] = useState("_id");
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"

  // Pagination state
  const [page, setPage] = useState(1);
  // const [totalEntries, setTotalEntries] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [limit] = useState(10); // Entries per page

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        let data;
        if (isPublic) {
          // Fetch from the public endpoint without the accessToken
          data = await fetchEntriesOfPublicCollection(
            collectionID,
            page,
            limit,
            sortField,
            sortOrder
          );
        } else {
          // Fetch from the private endpoint with the accessToken
          data = await fetchEntriesByCollectionID(
            collectionID,
            accessToken,
            page,
            limit,
            sortField,
            sortOrder
          );
        }

        setEntries(data.entries);
        // setTotalEntries(data.totalEntries);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching entries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [collectionID, accessToken, page, limit, isPublic, sortField, sortOrder]);

  // Function to close the snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleSelectAll = (event) => {
    setSelectedEntries(
      event.target.checked ? entries.map((entry) => entry._id) : []
    );
  };

  const handleSelectEntry = (entryId) => {
    setSelectedEntries((prevSelected) =>
      prevSelected.includes(entryId)
        ? prevSelected.filter((id) => id !== entryId)
        : [...prevSelected, entryId]
    );
  };

  const handleSort = (field, order) => {
    setSortField(field);
    setSortOrder(order);
  };

  const handleDeleteSelected = async () => {
    try {
      await deleteEntriesAPI(collectionID, selectedEntries, accessToken);

      // Fetch updated entries after deletion
      const updatedEntries = await fetchEntriesByCollectionID(
        collectionID,
        accessToken,
        page,
        limit
      );

      // Check if the current page has no entries and adjust the page number
      if (updatedEntries.entries.length === 0 && page > 1) {
        setPage((prevPage) => prevPage - 1); // Go to the previous page
      } else {
        setEntries(updatedEntries.entries);
        // setTotalEntries(updatedEntries.totalEntries);
        setTotalPages(updatedEntries.totalPages);
        setSelectedEntries([]);
      }
    } catch (error) {
      console.error("Error deleting entries:", error);
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ width: "75%", mx: "auto", p: 3 }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              display: "flex",
              textAlign: "left",
              marginBottom: "1.3rem",
            }}
          >
            Loading Collection...
          </Typography>
          <TableSkeleton />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header Section */}
      <Card
        sx={{
          width: "72%",
          backgroundColor: theme.palette.background.default,
          mb: 3,
          paddingY: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <CardContent>
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
            {/* Collection Info */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {collectionName}
                </Typography>
                <Chip
                  label={isPublic ? "Public" : "Private"}
                  size="small"
                  color={isPublic ? "success" : "default"}
                  variant="outlined"
                />
                {currUserMode && (
                  <Chip
                    label={
                      currUserMode === "edit" ? "Edit Access" : "View Only"
                    }
                    size="small"
                    color={currUserMode === "edit" ? "primary" : "default"}
                  />
                )}
              </Box>
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  justifyContent: { xs: "flex-start", md: "flex-end" },
                  flexWrap: "wrap",
                }}
              >
                <Button
                  component={Link}
                  to={`/visualize/collection/${collectionID}?isPublic=${isPublic}`}
                  variant="outlined"
                  startIcon={<VisibilityIcon />}
                  size="small"
                  sx={{
                    "color": theme.palette.text.secondary,
                    "borderColor": theme.palette.text.secondary,
                    "&:hover": {
                      borderColor: theme.palette.primary.main,
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  Visualize
                </Button>

                {currUserMode !== "view" && (
                  <>
                    <Button
                      component={Link}
                      to={`/collection/${collectionID}/bulk-upload`}
                      variant="outlined"
                      startIcon={<VerticalAlignBottomIcon />}
                      size="small"
                      sx={{
                        "color": theme.palette.text.secondary,
                        "borderColor": theme.palette.text.secondary,
                        "&:hover": {
                          borderColor: theme.palette.primary.main,
                          color: theme.palette.primary.main,
                        },
                      }}
                    >
                      Bulk Import
                    </Button>
                    <Button
                      component={Link}
                      to={`/collection/${collectionID}/entry/create`}
                      variant="contained"
                      startIcon={<AddIcon />}
                      size="small"
                    >
                      New Entry
                    </Button>
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ width: "75%", mx: "auto", p: 3 }}>
        <EntriesTable
          entries={entries}
          selectedEntries={selectedEntries}
          onSelectEntry={handleSelectEntry}
          onSelectAll={handleSelectAll}
          currUserMode={currUserMode}
          isPublic={isPublic}
          handleSort={handleSort}
        />

        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          mt={3}
        >
          <Grid item>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Grid>

          {selectedEntries.length > 0 && (
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setOpenDeleteDialog(true)}
                startIcon={<DeleteIcon />}
              >
                Delete Selected
              </Button>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDeleteSelected}
      />

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // Positioning at top center
      ></Snackbar>
    </Layout>
  );
};

export default CollectionEntriesPage;
