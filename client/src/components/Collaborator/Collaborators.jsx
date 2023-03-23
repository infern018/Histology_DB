import { Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core'
import { AddCircleOutline } from '@material-ui/icons'
import React from 'react'
import { Link } from 'react-router-dom'
import Collaborator from './Collaborator'
import RoleManager from './Collaborator'

const Collaborators = ({collaborators,collectionID}) => {
  return (
    <Container component="main" maxWidth="md">
         <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <TableCell align='center'>Username</TableCell>
                            <TableCell align='center'>Roles</TableCell>
                            <TableCell align='center'>Options</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                        {collaborators.map((collaborator)=>{
                            return(
                                    
                                    <Collaborator key={collaborator._id} role={collaborator}/>
                                )
                            } 
                        )}

                    <Link to={`/collection/${collectionID}/addCollaborator`} style={{color:"white"}}>
                        <Button>
                            Add <AddCircleOutline/>
                            {/* clicking this take you to a new page where u can select a user and assign him role AKA collaboatorForm */}
                        </Button>
                    </Link>

                    </TableBody>
                </Table>
            </TableContainer>
    </Container>
  )
}

export default Collaborators