import React from 'react'
import CollectionForm from '../../components/Form/CollectionForm'
import Navbar from '../../components/Navbar/Navbar'
import { useDispatch,useSelector } from 'react-redux'
import { createPrivateCollection } from '../../redux/collectionRedux'
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
        editors:[],
        viewers:[]
    }

    const handleCollectionAdd = (collection) => { 
        console.log("Collection, " ,collection);
        dispatch(createPrivateCollection(collection));
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