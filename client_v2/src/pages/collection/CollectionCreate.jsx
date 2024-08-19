import { useState } from 'react';
import { useSelector } from 'react-redux';
import CollectionCreateForm from '../../components/collection/CollectionCreateForm';
import { createCollectionAPI } from '../../utils/apiCalls';
import Layout from '../../components/utils/Layout';
import { useNavigate } from 'react-router-dom';

const CollectionCreate = () => {
    const user = useSelector((state) => state.auth.currentUser);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleCollectionAdd = async (collection) => {
        try {
            const response = await createCollectionAPI(collection, user.accessToken);
            if (response.status === 200) {
              navigate(`/user/${user.username}`);
            } else {
              setError(response.data.message || "Collection create failed");
            }
          } catch (error) {
            setError(error.message);
    }
}


    return (
        <Layout>
        {error && <p>{error}</p>}
        <CollectionCreateForm
            onSubmit={handleCollectionAdd}
        />
        </Layout>
    );
}

export default CollectionCreate;
