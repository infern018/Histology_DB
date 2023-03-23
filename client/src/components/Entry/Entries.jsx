import React, { useEffect, useState } from 'react'
import Entry from './Entry'
import './Entries.css'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios'
import { useSelector } from 'react-redux';

const Entries = ({collectionID,name,skip,limit}) => {

    const user = useSelector(state=>state.user.currentUser);
    const [entries, setEntries] = useState([])


    useEffect(() => {
        const getEntries = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/entries?collectionID=${collectionID}&name=${name}&skip=${skip}&limit=${limit}`)
            setEntries(res.data)

        } catch (error) {}
    };
    getEntries();

}, [collectionID,skip,limit,name])

  return (
        <div className='entriesWrapper'>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <TableCell align='center'>Archival Code</TableCell>
                            <TableCell align='center'>Binomial Name</TableCell>
                            <TableCell align='center'>Brain Weight &nbsp;(g)</TableCell>
                            <TableCell align='center'>Staining Method</TableCell>
                            <TableCell align='center'>Plane of Sectioning</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                        {entries.map((entry)=>{
                            return(
                                    <Entry key={entry._id} entry={entry}  />
                                )
                            } 
                        )}

                    </TableBody>
                </Table>
            </TableContainer>
        </div>
  )
}

export default Entries