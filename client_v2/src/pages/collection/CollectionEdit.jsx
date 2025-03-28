import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import CollectionEditForm from "../../components/collection/CollectionEditForm";
import { getCollectionAPI, updateCollectionAPI } from "../../utils/apiCalls";
import Layout from "../../components/utils/Layout";

const CollectionEdit = () => {
	const { collectionID } = useParams();
	const user = useSelector((state) => state.auth.currentUser);
	const [error, setError] = useState(null);
	const [collection, setCollection] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchCollection = async () => {
			try {
				const collection = await getCollectionAPI(collectionID, user.accessToken);
				setCollection(collection);
			} catch (error) {
				setError(error.message);
			}
		};

		fetchCollection();
	}, [collectionID, user.accessToken]);

	const handleCollectionEdit = async (updatedCollection) => {
		try {
			const updatedCollectionRes = await updateCollectionAPI(collectionID, updatedCollection, user.accessToken);
			if (updatedCollectionRes) {
				navigate(`/user/${user.username}`);
			} else {
				setError("Collection update failed");
			}
		} catch (error) {
			setError(error.message);
		}
	};

	return (
		<Layout>
			{error && <p>{error}</p>}
			{collection && <CollectionEditForm collection={collection} onSubmit={handleCollectionEdit} />}
		</Layout>
	);
};

export default CollectionEdit;
