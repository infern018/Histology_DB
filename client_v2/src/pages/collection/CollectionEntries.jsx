import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import { fetchEntriesByCollectionID } from "../../utils/apiCalls";

import { useSelector } from "react-redux";
import Layout from "../../components/utils/Layout";
import { Link } from "react-router-dom";

const CollectionEntriesPage = () => {
  const { collectionID } = useParams();

  const accessToken = useSelector(
    (state) => state.auth.currentUser.accessToken
  );

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const data = await fetchEntriesByCollectionID(
          collectionID,
          accessToken
        );
        setEntries(data);
      } catch (error) {
        console.error("Error fetching entries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [collectionID, accessToken]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Layout>
      <TableContainer>
        <Button
          component={Link}
          to={`/collection/${collectionID}/entry/create`}
          variant="contained"
          color="primary"
        >
          + Add Entry
        </Button>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle1" fontWeight="bold">
                  Item Code
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1" fontWeight="bold">
                  Individual Code
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1" fontWeight="bold">
                  Developmental Stage
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1" fontWeight="bold">
                  Sex
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry._id} hover>
                <TableCell>
                  <Typography variant="body1">
                    {entry.identification.itemCode}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">
                    {entry.identification.individualCode}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">
                    {entry.physiologicalInformation.age.developmentalStage}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1">
                    {entry.physiologicalInformation.sex}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Layout>
  );
};

export default CollectionEntriesPage;
