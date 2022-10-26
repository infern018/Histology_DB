import { Container } from '@material-ui/core'
import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import './CollectionList.css'
import { useEffect } from 'react';
import axios from 'axios'
import Collections from '../../components/Collection/Collections';
import { Button } from '@mui/material';
import {Link} from 'react-router-dom'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { AddCircleOutline } from '@material-ui/icons';
import { getCurrentUser } from '../../requestMethods';
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux';



const CollectionList = () => {

    const [collections , setCollections] = useState([]) 

    const user = useSelector(state=>state.user.currentUser)

    const location = useLocation()

    useEffect(() => {

            const getCollections = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/collections?visibility=public&backupCollection=false`)
                setCollections(res.data)

            } catch (error) {}
        };
        getCollections();

    }, [location])
    

  return (
    <div>
        <Navbar/>
        
        <Container className='collectionListContainer' maxWidth="md">


            
            <div className="collectionListHeaderMain">
            <div><h1 className='collectionListHeader'>All Public Collections</h1></div>
            

            </div>
            <div className="collectionListWrapper">
                
                <Collections collections={collections} />                
            </div>
        </Container>
    </div>
  )
}

export default CollectionList