import React, { useEffect, useState } from 'react'
import Checkbox from '@mui/material/Checkbox';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Container } from '@material-ui/core';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { updateRole } from '../../redux/apiCalls';


const RoleSelector = ({roleProp}) => {

  const location = useLocation();
  const dispatch = useDispatch();
  const collectionID = location.pathname.split("/")[2]

  const [role, setRole] = useState({
    project:'',
    user:'admin',
    role:'admin'
  })

  useEffect(() => {
    
    setRole(roleProp);
   
  }, [])
  


  const handleRoleEdit = (e) => {
    console.log("event",e);

    var newRole = {...role}
    const field = 'role'
    newRole[field] = e.target.name;
    console.log("NEW ROLE",newRole)
    // updateRole(dispatch,role)
  }
  

  return (
    <>    
{/*         
        {(role=="user")||(role=="admin")?<VisibilityIcon/>:null}
        {(role=="editor")||(role=="admin")?<EditIcon/>:null} */}

        <Checkbox onChange={(e)=> handleRoleEdit(e)} checked={(role.role=="user")||(role.role=="admin")} name="user" icon={<VisibilityIcon />} checkedIcon={<VisibilityIcon />}/>
        <span></span>
        <Checkbox onChange={(e)=> handleRoleEdit(e)} checked={(role.role=="editor")||(role.role=="admin")} name="editor" icon={<EditIcon />} checkedIcon={<EditIcon />} />
    </>
  )
}

export default RoleSelector