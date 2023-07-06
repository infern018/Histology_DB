import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import axios from 'axios'
import { useDispatch,useSelector } from 'react-redux'
import {  getRolesOfCollection, updatePrivateCollection } from '../../redux/apiCalls'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import Collaborators from '../../components/Collaborator/Collaborators'

const CollectionEditColab = () => {

    const location = useLocation()
    const collectionID = location.pathname.split("/")[2];

    const user = useSelector(state=>state.user.currentUser)
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const roles = useSelector(state=>state.role.roles)
    const [collectionRoles, setCollectionRoles] = useState(roles);

    console.log("ROLES",roles);

    //get all collaborators for this project, role URL
    useEffect(() => {
        // getRole(dispatch,user)
    }, [location])

    useEffect(()=> {
      console.log("TRIGGERED")
      const getCollaboratorsDetails = async () => {
        try {
            // iski jagah rolesID
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/roles?project=${collectionID}`,
              {
                headers:{
                  'token':`Bearer ${user.accessToken}`
                }
              })
              console.log("RESULT",res.data);
            setCollectionRoles(res.data)

        } catch (error) {
          console.log("ERROR",error);
        }
    };
    getCollaboratorsDetails();
    },[roles])
    

  return (
    <div>
        <Navbar/>
        <Collaborators collaborators={collectionRoles} collectionID={collectionID}/>
    </div>
  )
}

export default CollectionEditColab