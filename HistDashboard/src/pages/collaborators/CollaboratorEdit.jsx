import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import AddCollaboratorForm from '../../components/Form/CollaboratorForm'
import Navbar from '../../components/Navbar/Navbar';
import { createRole, getAllUsers, updateRole } from '../../redux/apiCalls';
import axios from 'axios'
import { useSelect } from '@mui/base';

const CollaboratorEdit = () => {

    //fetch all users
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const user = useSelector(state=>state.user.currentUser)

    const collectionID = location.pathname.split("/")[2];
    const roleID = location.pathname.split("/")[4];

    const [role, setRole] = useState({
        project:collectionID,
        role:'user',
        user:''
      })

    useEffect(() => {
        const getRoleDetails = async () => {
            try {
                // iski jagah rolesID
                const res = await axios.get(`http://localhost:5000/api/roles/${roleID}`,
                {
                    headers:{
                        'token':`Bearer ${user.accessToken}`
                    }
                })
                setRole(res.data)
    
            } catch (error) {}
        };
        getRoleDetails();
    },[location])

    useEffect(() => {
      getAllUsers(dispatch)
    }, [])

    const handleRoleEdit = (role) => {
        updateRole(dispatch,role);
        navigate(`/collection/${collectionID}/settings`)
    }

  return (
    <>
        <Navbar/>
        <AddCollaboratorForm onFormSubmit = {(role) => handleRoleEdit(role)} editMode={true} collectionID={collectionID} roleProp={role}/>
    </>
  )
}

export default CollaboratorEdit