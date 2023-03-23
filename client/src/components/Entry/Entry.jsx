import React from 'react'
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import {Link} from 'react-router-dom';
import { Button } from '@material-ui/core';
import { getCurrentUser } from '../../requestMethods';

const Entry = ({entry}) => {

    let brainWeight = 'NA'

    if(entry.physiologicalInformation.brainWeight>0){
        brainWeight = entry.physiologicalInformation.brainWeight
    }    

  return (
    <TableRow key={entry._id}>
                <TableCell component="th" align="center" scope="row">
                    <Link to={`/entry/${entry._id}`}  style={{ textDecoration: 'none', color:'black' }}>
                        <Button>{entry.archivalIdentification.archivalIndividualCode}</Button> 
                    </Link>
              </TableCell>
              <TableCell align="center">{entry.identification.bionomialSpeciesName}</TableCell>
              <TableCell align="center">{brainWeight}</TableCell>
              <TableCell align="center">{entry.histologicalInformation.stainingMethod}</TableCell>
              <TableCell align="center">{entry.histologicalInformation.planeOfSectioning}</TableCell>
    </TableRow>
  )
}

export default Entry