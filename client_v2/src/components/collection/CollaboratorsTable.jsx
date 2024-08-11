import React from 'react';

const CollaboratorsTable = React.memo(({ collaborators, onModeChange, onRemove }) => {
    console.log("PROPS", collaborators)

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Mode</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {collaborators.map((collaborator) => (
          <tr key={collaborator.user_id}>
            <td>{collaborator.username}</td>
            <td>
              Toggle
              <button onClick={() => onModeChange(collaborator.user_id, collaborator.mode === 'view' ? 'edit' : 'view')}>
                {collaborator.mode}
              </button>
            </td>
            <td>
              <button onClick={() => onRemove(collaborator.user_id)}>Remove</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
});

export default CollaboratorsTable;
