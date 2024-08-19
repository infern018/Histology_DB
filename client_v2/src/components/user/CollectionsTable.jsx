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
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

const CollectionTable = ({ collections }) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
            {" "}
            {/* Greyed background for header */}
            <TableCell>
              <Typography variant="subtitle1" fontWeight="bold">
                Name
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle1" fontWeight="bold">
                Collaborators
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle1" fontWeight="bold">
                Mode
              </Typography>
            </TableCell>
            <TableCell align="left" sx={{ width: "50px" }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {collections.map((collection, index) => (
            <TableRow key={index} hover>
              <TableCell>
                <Typography variant="body1">{collection.name}</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1">
                  {collection.numCollaborators}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body1">{collection.mode}</Typography>
              </TableCell>
              <TableCell align="right" sx={{ padding: "0px 16px" }}>
                <IconButton
                  component={Link}
                  to={`/collection/${collection.collection_id}/settings`}
                  size="small"
                  edge="end"
                >
                  <SettingsIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CollectionTable;
