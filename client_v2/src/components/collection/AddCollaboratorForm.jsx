// src/components/AddCollaboratorForm.js
import React, { useState } from 'react';

const AddCollaboratorForm = ({ onAdd }) => {
  const [userID, setUserID] = useState('');
  const [mode, setMode] = useState('view');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(userID, mode);
    setUserID('');
    setMode('view');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="User ID"
        value={userID}
        onChange={(e) => setUserID(e.target.value)}
        required
      />
      <select
        value={mode}
        onChange={(e) => setMode(e.target.value)}
        required
      >
        <option value="view">View</option>
        <option value="edit">Edit</option>
      </select>
      <button type="submit">Add Collaborator</button>
    </form>
  );
};

export default AddCollaboratorForm;
