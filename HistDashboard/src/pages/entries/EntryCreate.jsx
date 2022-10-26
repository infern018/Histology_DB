import React from 'react'
import { useLocation } from 'react-router-dom'
import EntryForm from '../../components/Form/EntryForm';
import Navbar from '../../components/Navbar/Navbar';
import axios from 'axios'
import { useSelector } from 'react-redux';

const EntryCreate = () => {
    const location = useLocation();
    const collectionID = location.pathname.split("/")[2];

    const user = useSelector(state=>state.user.currentUser)

    const handleEntryCreate = async (entry) => {
        try {
            const res = await axios.post(`http://localhost:5000/api/entries/${collectionID}/${user._id}`,entry,
            {
                headers:{
                    'token':`Bearer ${user.accessToken}`
                }
            })
            console.log("ADDED SUCCESSFULLY",res.data)
        } catch (error) {
            console.log("ERROR",error)
        }
    }

  return (
    <div>
        <Navbar/>
        <EntryForm collectionID={collectionID} onFormSubmit={(entry)=>handleEntryCreate(entry)}/>
    </div>
  )
}

export default EntryCreate