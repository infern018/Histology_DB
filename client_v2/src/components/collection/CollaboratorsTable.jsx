import React from "react";
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";

const CollaboratorsTable = ({ collaborators, onModeChange, onRemove }) => {
  const handleToggleMode = (collaborator) => {
    const newMode = collaborator.mode === "view" ? "edit" : "view";
    onModeChange(collaborator.user_id, newMode);
  };

  const isEditMode = (mode) => mode === "edit";

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Username</strong></TableCell>
            <TableCell align="center"><strong>Mode</strong></TableCell>
            <TableCell align="center"><strong>Actions</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {collaborators.map((collaborator) => (
            <TableRow key={collaborator.user_id}>
              <TableCell>{collaborator.username}</TableCell>
              <TableCell align="center">
                <IconButton
                  onClick={() => handleToggleMode(collaborator)}
                  sx={{
                    borderRadius: "8px",
                    backgroundColor: "#f0f0f0",
                    padding: "6px",
                  }}
                >
                  <VisibilityIcon
                    sx={{
                      color: isEditMode(collaborator.mode) ? "blue" : "gray",
                      marginRight: "4px",
                    }}
                  />
                  <EditIcon
                    sx={{
                      color: isEditMode(collaborator.mode) ? "blue" : "gray",
                    }}
                  />
                </IconButton>
              </TableCell>
              <TableCell align="center">
                <IconButton
                  onClick={() => onRemove(collaborator.user_id)}
                  sx={{
                    borderRadius: "8px",
                    backgroundColor: "#f8d7da",
                    padding: "6px",
                  }}
                >
                  <DeleteIcon sx={{ color: "#c82333" }} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CollaboratorsTable;
