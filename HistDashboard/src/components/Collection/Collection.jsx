import { Button, Card, CardActions, CardContent, Grid } from '@material-ui/core'
import React from 'react'
import { useDispatch,useSelector } from 'react-redux'
import {Link} from 'react-router-dom'
import './Collections.css'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from '@mui/icons-material/Settings';
import { deletePrivateCollection, getRequests, updatePrivateCollection } from '../../redux/apiCalls'


const Collection = ({collection,view}) => {

    const user=useSelector(state=>state.user.currentUser);
    const dispatch = useDispatch();

    const handleRequest = () => {
        //set status as pending
        let tmpCollection = {
            _id:collection._id,
            publicStatus:'pending',
        }

        updatePrivateCollection(dispatch,tmpCollection,user);
        getRequests(dispatch);
    }

    const handleDelete = async ()=>{
        deletePrivateCollection(dispatch,collection._id,user);
    }

  return (
    <Grid item xs={4} sm={6}>
        <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <p className='cardHeader'>{collection.name}</p>
                <p className="cardDesc">{collection.description}</p>
                {view &&
                   
                    <p>STATUS :{collection.publicStatus}</p>
                }
            </CardContent>
            <CardActions>
                <Link to={`/collection/${collection._id}`}  style={{ textDecoration: 'none' }}>
                    <Button className='cardBtn' color="primary" size="small">
                        View
                    </Button>
                </Link>


                {view &&
                
                <div>
                    <Button onClick={handleDelete}>
                        <DeleteIcon/>
                    </Button>
                    <Link to={`/editCollection/${collection._id}`}  style={{ textDecoration: 'none' }}>
                        <Button className='cardBtn' color="primary" size="small">
                            <EditIcon/>
                        </Button>
                    </Link>
                    <Link to={`/collection/${collection._id}/settings`}  style={{ textDecoration: 'none' }}>
                        <Button className='cardBtn' color="primary" size="small">
                            <SettingsIcon/>
                        </Button>
                    </Link>
                </div>

                }
            </CardActions>
            {view && !(collection.publicStatus=='approved') &&
                <Button style={{paddingLeft:'24px'}} onClick={handleRequest}>Send for Review</Button>
            }
        </Card>
    </Grid>
  )
}

export default Collection