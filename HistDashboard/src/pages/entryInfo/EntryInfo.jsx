import { Button, Container } from '@material-ui/core'
import React, { useState } from 'react'
import Navbar from '../../components/Navbar/Navbar'
import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { publicRequest } from '../../requestMethods'
import { addEntry } from '../../redux/workspaceRedux'
import { useDispatch } from 'react-redux'

const EntryInfo = () => {

    const location = useLocation()
    const entryId = location.pathname.split("/")[2];

    const [entry, setEntry] = useState({})
    // const dispatch = useDispatch()

    useEffect(() => {
      const getEntry = async () =>{
        try {
            const resp  = await publicRequest.get(`/entries/${entryId}`); 
            console.log("R",resp.data);
            setEntry(resp.data);
        } catch (error) {}
      }
      getEntry(); 
    }, [entryId])

    const handleClick = () => {
        //update workspace
        // dispatch(addEntry({entry}))
    }
    

  return (
    
    <div>
        <Navbar/>
        
            {entry.identification &&
                <Container maxWidth="md">
                    <h1>{entry.identification.bionomialSpeciesName}</h1>
                    <Button  onClick = {handleClick} variant="outlined" >Save</Button>

                </Container>
            }
        
    </div>
  )
}

export default EntryInfo