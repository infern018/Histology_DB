import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  CircularProgress,
  Button,
  Grid,
  IconButton,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Pagination, // Import Pagination component
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Upload as UploadIcon,
} from "@mui/icons-material";
import {
  fetchEntriesByCollectionID,
  uploadCSVEntries,
  deleteEntriesAPI,
} from "../../utils/apiCalls";
import { useSelector } from "react-redux";
import Layout from "../../components/utils/Layout";
import { Link } from "react-router-dom";
import EntriesTable from "../../components/entries/EntriesTable";
import CSVUploader from "../../components/utils/CSVUploader";

const CollectionEntriesPage = () => {
  const { collectionID } = useParams();
  const accessToken = useSelector(
    (state) => state.auth.currentUser.accessToken
  );

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEntries, setSelectedEntries] = useState([]);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [limit] = useState(9); // Entries per page

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const data = await fetchEntriesByCollectionID(
          collectionID,
          accessToken,
          page,
          limit
        );
        setEntries(data.entries);
        setTotalEntries(data.totalEntries);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching entries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [collectionID, accessToken, page, limit]);

  const handleCSVUpload = async (csvData) => {
    try {
      await uploadCSVEntries(collectionID, csvData, accessToken);
      const updatedEntries = await fetchEntriesByCollectionID(
        collectionID,
        accessToken,
        page,
        limit
      );
      setEntries(updatedEntries.entries);
      setTotalEntries(updatedEntries.totalEntries);
      setTotalPages(updatedEntries.totalPages);
    } catch (error) {
      console.error("Error uploading CSV:", error);
    } finally {
      setOpenUploadDialog(false);
    }
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

  const handleDeleteSelected = async () => {
    try {
      await deleteEntriesAPI(collectionID, selectedEntries, accessToken);
      const updatedEntries = await fetchEntriesByCollectionID(
        collectionID,
        accessToken,
        page,
        limit
      );
      setEntries(updatedEntries.entries);
      setTotalEntries(updatedEntries.totalEntries);
      setTotalPages(updatedEntries.totalPages);
      setSelectedEntries([]);
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
    return <CircularProgress />;
  }

  return (
    <Layout>
      <Box mb={2}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Button
              component={Link}
              to={`/collection/${collectionID}/entry/create`}
              variant="contained"
              color="primary"
            >
              + Add Entry
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setOpenUploadDialog(true)}
              startIcon={<UploadIcon />}
            >
              Upload CSV
            </Button>
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

      <EntriesTable
        entries={entries}
        selectedEntries={selectedEntries}
        onSelectEntry={handleSelectEntry}
        onSelectAll={handleSelectAll}
      />

      <Box mt={2} display="flex" justifyContent="center">
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      {/* Upload CSV Dialog */}
      <Dialog
        open={openUploadDialog}
        onClose={() => setOpenUploadDialog(false)}
      >
        <DialogTitle>Upload CSV File</DialogTitle>
        <DialogContent>
          <CSVUploader onUpload={handleCSVUpload} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUploadDialog(false)} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete the selected entries?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteSelected} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
};

export default CollectionEntriesPage;
