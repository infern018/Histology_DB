import { Container,  IconButton,Button, TextField } from '@material-ui/core'
import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Entries from '../../components/Entry/Entries'
import './EntryList.css'
import { Search } from '@material-ui/icons'
import { Pagination } from '@mui/material'
import { useEffect } from 'react'
import axios from 'axios'
import Navbar from '../../components/Navbar/Navbar'
import { getCurrentUser } from '../../requestMethods';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {Link} from 'react-router-dom'
import { useSelector } from 'react-redux'


const EntryList = () => {

    const location = useLocation()
    const collectionID = location.pathname.split("/")[2];

    const user = useSelector(state=>state.user.currentUser);

    // const [user, setUser] = useState()
    const [query, setQuery] = useState('')
    const [name, setName] = useState('');
    const [pages, setPages] = useState(1)
    const [currPage, setCurrPage] = useState(1);
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(10)
    const [savedEntries, setSavedEntries] = useState([])
    const [finalSavedEntries, setFinalSavedEntries] = useState([])
    const [workspaceID, setWorkspaceID] = useState()
    const [entries, setEntries] = useState([])

    useEffect(() => {
        const tmpUser = getCurrentUser();
        
        // setUser(tmpUser);
        const getNumEntries = async () =>{
            try {
                const resp = await axios.get(`http://localhost:5000/api/entries?collectionID=${collectionID}&name=${name}&limit=5000`);
                setPages(getTotalPages(resp.data.length));
            } catch (error) {  
            }
        }
        getNumEntries();
    }, [collectionID,name])
    

    const handleNameSearch = (e) => {
        const value = e.target.value;
        setQuery(value)
    }

    const handleSubmit = () => {
        setName(query);
    }

    const getTotalPages = (totalEntries) => {
        totalEntries = parseInt(totalEntries);
        if(totalEntries%limit==0){
            return parseInt(totalEntries/limit);
        } else {
            return parseInt(totalEntries/limit) +1;
        }
    }

    const handlePageChange = (event,value) => {
        const num = parseInt(value)
        const tmp = (num-1)*limit;
        setSkip(tmp);
        // setPages(num)
    }




  return (
    //add filters here, search and all
    <div>
        <Navbar/>
        <Container className='entryListContainer' maxWidth="md">
            
            <div className="entryListHeader">
                <h1>{collectionID}</h1>
            </div>
            <div className="entryListFilters">
                <div className="searchByName">
                    <TextField id="outlined-basic" label="Search By Name" name="name" onChange={handleNameSearch} variant="outlined">    
                    </TextField>

                    <IconButton onClick={handleSubmit} color="primary" sx={{ p: '10px' }} >
                            <Search/>
                    </IconButton>
                </div>
                {user &&
                
                <div className="saveFeature">
                    <Link to={`/collection/${collectionID}/createEntry`} style={{color:"white",textDecoration:"none"}}>
                        <Button>
                        Add Entry<AddCircleOutlineIcon/>
                        </Button>
                    </Link>
                </div>
                
                }
            </div>  
            <Entries name={name} collectionID={collectionID} skip={skip} limit={limit} />
            <div className="entriesPagination">
                <Pagination count={pages} onChange={handlePageChange} color="primary"/>
            </div>
        </Container>
    </div>
  )
}

export default EntryList