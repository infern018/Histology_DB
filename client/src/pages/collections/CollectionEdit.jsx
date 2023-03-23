import React, { useEffect, useState } from 'react'
import CollectionForm from '../../components/Form/CollectionForm'
import Navbar from '../../components/Navbar/Navbar'
import axios from 'axios'
import { useDispatch,useSelector } from 'react-redux'
import {  updatePrivateCollection } from '../../redux/apiCalls'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';

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
        const getCollectionDetails = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/collections/${collectionID}`)
                setCurrCollection(res.data)
    
            } catch (error) {}
        };
        getCollectionDetails();
    }, [location])
    

    const handleCollectionAdd = (collection) => { 
        updatePrivateCollection(dispatch,collection,user);
        navigate(`/collections/private/${user._id}`);
    }
  return (
    <div>
        <Navbar/>
        <CollectionForm onFormSubmit={(collection) => handleCollectionAdd(collection)} collectionProp={currCollection}/>
    </div>
  )
}

export default CollectionEdit