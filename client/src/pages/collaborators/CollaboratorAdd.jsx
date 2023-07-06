import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom';
import AddCollaboratorForm from '../../components/Form/CollaboratorForm'
import Navbar from '../../components/Navbar/Navbar';
import { createRole, getAllUsers } from '../../redux/apiCalls';

const CollaboratorAdd = () => {

    //fetch all users
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const collectionID = location.pathname.split("/")[2];

    const [role, setRole] = useState({
        project:collectionID,
        role:'user',
        user:''
      })

    useEffect(() => {
      // getAllUsers(dispatch)
    }, [])

    const handleRoleAdd = (role) => {
        // createRole(dispatch,role);
        navigate(`/collection/${collectionID}/settings`)
    }
    

  return (
    <>
        <Navbar/>
        <AddCollaboratorForm onFormSubmit = {(role) => handleRoleAdd(role)} editMode={false} collectionID={collectionID} roleProp={role}/>
    </>
  )
}

export default CollaboratorAdd