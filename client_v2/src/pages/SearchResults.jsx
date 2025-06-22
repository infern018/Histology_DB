import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Pagination,
  Button,
  CircularProgress,
} from "@mui/material";
import { Download as DownloadIcon } from "@mui/icons-material";
import Layout from "../components/utils/Layout";
import EntriesTable from "../components/entries/EntriesTable";
import { fetchSearchResults, exportSearchResults } from "../utils/apiCalls";
import {
  convertToCSV,
  downloadCSV,
  formatDateForFilename,
} from "../utils/exportUtils";
import TableSkeleton from "../components/utils/TableSkeleton";
import AdvancedSearch from "../components/search/AdvancedSearch";
import { useNavigate } from "react-router-dom";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);
  const [currentSearchParams, setCurrentSearchParams] = useState({});

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    const fetchResults = async () => {
      try {
        const searchParams = Object.fromEntries(queryParams.entries());
        searchParams.page = page;
        setCurrentSearchParams(searchParams);

        const data = await fetchSearchResults(searchParams);

        setTotalEntries(data.totalEntries);
        setEntries(data.entries);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [location.search, page]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleSearch = (searchParams) => {
    const queryParams = new URLSearchParams(searchParams).toString();
    navigate(`/search/results?${queryParams}`);
  };

  const handleExport = async () => {
    if (totalEntries === 0) {
      return;
    }

    setExporting(true);
    try {
      // Export all results (not just current page)
      const exportData = await exportSearchResults(currentSearchParams);

      if (exportData.entries && exportData.entries.length > 0) {
        const csvContent = convertToCSV(exportData.entries);
        const timestamp = formatDateForFilename();
        const filename = `histology_search_results_${timestamp}.csv`;

        downloadCSV(csvContent, filename);

        console.log(
          `✅ Exported ${exportData.entries.length} entries to ${filename}`
        );
      } else {
        console.warn("No entries to export");
      }
    } catch (error) {
      console.error("Failed to export search results:", error);
      // You could add a toast notification here for better UX
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <Box sx={{ width: "50%", flexShrink: 0, mb: 2 }}>
            <AdvancedSearch
              initialValues={currentSearchParams}
              onSearch={handleSearch}
            />
          </Box>
          <Typography variant="h6" gutterBottom>
            Loading results...
          </Typography>
          <Box
            sx={{
              width: "69%",
              overflow: "auto",
            }}
          >
            <TableSkeleton />
          </Box>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          //   width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <Box sx={{ width: "50%", flexShrink: 0 }}>
          <AdvancedSearch
            initialValues={currentSearchParams}
            onSearch={handleSearch}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            flexShrink: 0,
            mb: 2,
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ textAlign: "left" }}>
            {totalEntries > 0
              ? `Found ${totalEntries} matching result${
                  totalEntries > 1 ? "s" : ""
                }...`
              : "No matching results found."}
          </Typography>

          {totalEntries > 0 && (
            <Button
              variant="outlined"
              startIcon={
                exporting ? <CircularProgress size={16} /> : <DownloadIcon />
              }
              onClick={handleExport}
              disabled={exporting}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                px: 2,
                py: 1,
                fontSize: "0.875rem",
                fontWeight: 500,
              }}
            >
              {exporting ? "Exporting..." : `Export All (${totalEntries})`}
            </Button>
          )}
        </Box>
        <Box
          sx={{
            width: "100%",
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <EntriesTable
            entries={entries}
            currUserMode={"view"}
            selectedEntries={[]}
            onSelectEntry={() => {}}
            onSelectAll={() => {}}
            isPublic={true}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            mt: 1.5,
            width: "100%",
          }}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Box>
    </Layout>
  );
};

export default SearchResults;
