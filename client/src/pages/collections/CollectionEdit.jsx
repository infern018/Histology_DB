import React, { useEffect, useState } from 'react'
import CollectionForm from '../../components/Form/CollectionForm'
import Navbar from '../../components/Navbar/Navbar'
import axios from 'axios'
import { useDispatch,useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { getCollectionDetails, updatePrivateCollection } from '../../redux/collectionRedux'

const CollectionEdit = () => {

    const location = useLocation()
    const collectionID = location.pathname.split("/")[2];

    const user = useSelector(state=>state.user.currentUser)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const templateCollection = 
    {
        name:'',
        description:'',
        visibility:'private',
        ownerID:user._id,
    }

    const [currCollection, setCurrCollection] = useState(templateCollection);

    useEffect(() => {
        dispatch(getCollectionDetails(collectionID))
          .then((response) => {
            setCurrCollection(response.payload);
          })
          .catch((error) => {
            console.error('Failed to fetch collection details:', error);
          });
      }, [dispatch, collectionID]);
    

    const handleCollectionAdd = (collection) => {
        dispatch(updatePrivateCollection(collection));
        navigate(`/collections/private/${user._id}`);
      };
  return (
    <div>
        <Navbar/>
        <CollectionForm onFormSubmit={(collection) => handleCollectionAdd(collection)} collectionProp={currCollection}/>
    </div>
  )
}

export default CollectionEdit