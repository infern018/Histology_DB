import React, { useState } from "react";
import { Box, Button, useTheme } from "@mui/material";
import Select from "react-select";

const SearchUserSelectComponent = ({ users, onUserSelect }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const theme = useTheme(); // Access the current theme

  const handleChange = (selectedOption) => {
    setSelectedUser(selectedOption);
  };

  const handleUserAdd = () => {
    if (selectedUser) {
      const selectedUserMeta = {
        user_id: selectedUser.value,
        username: selectedUser.label,
      };
      onUserSelect(selectedUserMeta);
      setSelectedUser(null);
    }
  };

  const options = users.map((user) => ({
    value: user._id,
    label: user.username,
  }));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 2, // spacing between elements
        padding: 2,
        fontFamily: theme.typography.fontFamily, // Ensure font family is inherited
        height: "200px", // Set a height for the parent container to allow dropdown to expand
      }}
    >
      <Select
        value={selectedUser}
        onChange={handleChange}
        options={options}
        placeholder="Search for a user..."
        styles={{
          control: (base) => ({
            ...base,
            borderRadius: "8px",
            border: "1px solid #ccc",
            boxShadow: "none",
            "&:hover": { 
              borderColor: "#aaa",
              cursor: "text" // Set cursor to text (I-beam) on hover
            },
            minWidth: "250px",
            fontFamily: theme.typography.fontFamily, // Apply theme font
            fontSize: theme.typography.fontSize, // Apply theme font size
          }),
          menu: (base) => ({
            ...base,
            zIndex: 9999,
            fontFamily: theme.typography.fontFamily, // Apply theme font
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }),
          menuList: (base) => ({
            ...base,
            maxHeight: "200px", // Set a max height for scrolling
            overflowY: "auto", // Enable vertical scrolling
          }),
          placeholder: (base) => ({
            ...base,
            fontFamily: theme.typography.fontFamily, // Apply theme font
            fontSize: theme.typography.fontSize, // Apply theme font size
          }),
        }}
      />
      <Button
        variant="contained"
        onClick={handleUserAdd}
        sx={{
          borderRadius: "8px",
          padding: "8px 16px",
          textTransform: "none",
          fontFamily: theme.typography.fontFamily, // Ensure button font is inherited
          fontSize: theme.typography.fontSize, // Ensure button font size matches theme
        }}
      >
        Add User
      </Button>
    </Box>
  );
};

export default SearchUserSelectComponent;
