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
import { useSelector, useDispatch } from 'react-redux';
import { getPrivateCollections } from '../../redux/apiCalls';

const CollectionListPrivate = () => {

    const user = useSelector(state=>state.user.currentUser)

    const collections = useSelector(state=>state.collection.privateCollections)

    const dispatch = useDispatch();

    const location = useLocation()

    useEffect(() => {

            getPrivateCollections(dispatch,user);

    }, [location,collections])
    

  return (
    <div>
        <Navbar/>
        
        <Container className='collectionListContainer' maxWidth="md">            
            <div className="collectionListHeaderMain">
            <div><h1 className='collectionListHeader'>Your Private Collections</h1></div>
            
            {user && 
            
            <div className='addCollection'>
                <Link to={`/createCollection`} style={{color:"white"}}>
                                    <Button>
                                        Add collection<AddCircleOutline/>
                                    </Button>
                </Link>
            </div>

            }

            </div>
            <div className="collectionListWrapper">
                
                <Collections view={'private'} collections={collections} />                
            </div>
        </Container>
    </div>
  )
}

export default CollectionListPrivate