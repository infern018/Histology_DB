import React from 'react'
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import {Link} from 'react-router-dom';
import { Button } from '@material-ui/core';
import { getCurrentUser } from '../../requestMethods';
import RoleSelector from './RoleSelector';
import { AddCircleOutline, Delete, Edit } from '@material-ui/icons';
import { useDispatch } from 'react-redux';
import { deleteRole } from '../../redux/apiCalls';

const Collaborator = ({role}) => {

  const dispatch = useDispatch();


    const handleRoleDelete = () => {
      console.log("ROLE",role);
      deleteRole(dispatch,role._id);
    }

  return (
      <TableRow key={role._id}>
                <TableCell align="center">{role.user}</TableCell>
                <TableCell align='center'> <RoleSelector roleProp={role}/> </TableCell>    
                <TableCell align='center'>
                  
                  <Link to={`/collection/${role.project}/editCollaborator/${role._id}`}  style={{ textDecoration: 'none',padding:'10px' }}>
                    <Button variant='outlined'>
                      EDIT
                    </Button>
                  </Link>
                  {/* Don's show this button if admin */}
                  <Button variant='outlined' onClick={handleRoleDelete}>
                    DELETE
                  </Button>

                </TableCell>            
      </TableRow>
      
  )
}

export default Collaborator