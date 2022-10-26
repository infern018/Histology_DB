import React from 'react'
import CollectionForm from '../../components/Form/CollectionForm'
import Navbar from '../../components/Navbar/Navbar'
import { useDispatch,useSelector } from 'react-redux'
import { createPrivateCollection } from '../../redux/apiCalls'
import { useNavigate } from 'react-router-dom';

const CollectionCreate = () => {
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

    const handleCollectionAdd = (collection) => { 
        createPrivateCollection(dispatch,collection,user);
        navigate(`/collections/private/${user._id}`);
    }

  return (
    <div>
        <Navbar/>
        <CollectionForm onFormSubmit={(collection) => handleCollectionAdd(collection)} collectionProp={templateCollection}/>
    </div>
  )
}

export default CollectionCreate