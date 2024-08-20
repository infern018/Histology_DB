import React, { useState } from "react";
import { Button } from "@mui/material";
import Select from "react-select";

const SearchUserSelectComponent = ({ users, onUserSelect }) => {
  const [selectedUser, setSelectedUser] = useState(null);

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
    <div>
      <Select
        value={selectedUser}
        onChange={handleChange}
        options={options}
        placeholder="Search for a user..."
        styles={{
          control: (base) => ({
            ...base,
            borderRadius: "4px",
            border: "1px solid #ccc",
            boxShadow: "none",
            "&:hover": { borderColor: "#aaa" },
          }),
        }}
      />
      <Button
        variant="contained"
        onClick={handleUserAdd}
        sx={{ marginTop: 2 }}
      >
        Add User
      </Button>
    </div>
  );
};

export default SearchUserSelectComponent;
