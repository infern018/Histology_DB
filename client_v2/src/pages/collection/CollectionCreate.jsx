import { useState } from 'react';
import { useSelector } from 'react-redux';
import CollectionCreateForm from '../../components/collection/CollectionCreateForm';
import { createCollectionAPI } from '../../utils/apiCalls';
import Navbar from '../../components/navbar/Navbar';

const CollectionCreate = () => {
    const user = useSelector((state) => state.auth.currentUser);
    const [error, setError] = useState(null);

    const handleCollectionAdd = async (collection) => {
        console.log("Adding collection", collection);
        try {
            const response = await createCollectionAPI(collection, user.accessToken);
            if (response.status === 200) {
              console.log("Collection created successfully");
            } else {
              setError(response.data.message || "Collection create failed");
            }
          } catch (error) {
            setError(error.message);
    }
}


    return (
        <div>    
        <Navbar />
        {error && <p>{error}</p>}
        <CollectionCreateForm
            onSubmit={handleCollectionAdd}
        />
        </div>
    );
}

export default CollectionCreate;
