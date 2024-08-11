import React, { useState } from "react";
import Select from "react-select";

const SearchUserSelectComponent = ({ users, onUserSelect }) => {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleChange = (selectedOption) => {
    // create a dict of user_id and username from label and value
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
      />
      <button onClick={handleUserAdd}>Add</button>
    </div>
  );
};

export default SearchUserSelectComponent;
