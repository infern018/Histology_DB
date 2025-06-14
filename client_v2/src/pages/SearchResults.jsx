import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Box, Typography, Pagination } from "@mui/material";
import Layout from "../components/utils/Layout";
import EntriesTable from "../components/entries/EntriesTable";
import { fetchSearchResults } from "../utils/apiCalls";
import TableSkeleton from "../components/utils/TableSkeleton";
import AdvancedSearch from "../components/search/AdvancedSearch";
import { useNavigate } from "react-router-dom";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
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

        console.log("searchParams", searchParams);

        const data = await fetchSearchResults(searchParams);
        console.log("data", data);
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
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ textAlign: "left" }}>
            {totalEntries > 0
              ? `Found ${totalEntries} matching result${
                  totalEntries > 1 ? "s" : ""
                }...`
              : "No matching results found."}
          </Typography>
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
