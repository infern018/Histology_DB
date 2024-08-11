import { Link } from "react-router-dom";

const CollectionTable = ({ collections }) => {
  return (
    <table>
      <thead>
        <tr>
            <th></th>
          <th>Name</th>
          <th>Collaborators</th>
          <th>Mode</th>
        </tr>
      </thead>
      <tbody>
        {collections.map((collection, index) => (
          <tr key={index}>
            <td>
            <Link to={`/collection/${collection.collection_id}/settings`}>
                Settings
            </Link>
            </td>
            <td>{collection.name}</td>
            <td>{collection.numCollaborators}</td>
            <td>{collection.mode}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CollectionTable;
