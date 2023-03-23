import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import EntryForm from '../../components/Form/EntryForm';
import Navbar from '../../components/Navbar/Navbar';
import axios from 'axios'
import { useSelector } from 'react-redux';

const EntryCreate = () => {
    const location = useLocation();
    const collectionID = location.pathname.split("/")[2];

    const navigate = useNavigate();

    const user = useSelector(state=>state.user.currentUser)

    const handleEntryCreate = async (entry) => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/entries/${collectionID}/${user._id}`,entry,
            {
                headers:{
                    'token':`Bearer ${user.accessToken}`
                }
            })
            //redirect to new location
            //https://histology.connect-project.io/collection/641c65e7537f88d93d8fb99f?view=admin
            navigate(`/collection/${collectionID}?view=editor`)

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