import { Container } from '@material-ui/core'
import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import { useEffect } from 'react';
import axios from 'axios'
import Collections from '../../components/Collection/Collections';
import { Button } from '@mui/material';
import {Link} from 'react-router-dom'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { AddCircleOutline } from '@material-ui/icons';
import { getCurrentUser } from '../../requestMethods';
import { useLocation } from 'react-router-dom'
import { useDispatch,useSelector } from 'react-redux';
import Requests from '../../components/Request/Requests'
// import { getRequests } from '../../redux/apiCalls';

const RequestDetails = () => {


    //THIS PAGE IS FOR ADMIN ONLY

    // const [requestCollections , setRequestCollections] = useState([]) 
    const user = useSelector(state=>state.user.currentUser)
    const requestCollections = useSelector(state=>state.request.requestCollections);
    const dispatch = useDispatch();

    const location = useLocation()

    useEffect(() => {
        // getRequests(dispatch);

    }, [location,requestCollections])

  return (
        <div>
            <Navbar/>
            <Container className='collectionListContainer' maxWidth="md">


            
            <div className="collectionListHeaderMain">
            <div><h1 className='collectionListHeader'>Request Status</h1></div>


            </div>
            <div className="collectionListWrapper">
                
                <Requests requestCollections = {requestCollections} />     
            </div>
        </Container>

            
        </div>
    )
}

export default RequestDetails