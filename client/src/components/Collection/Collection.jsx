import { Button, Card, CardActions, CardContent, Grid } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useDispatch,useSelector } from 'react-redux'
import {Link} from 'react-router-dom'
import './Collections.css'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from '@mui/icons-material/Settings';
import { deletePrivateCollection, getRequests, updatePrivateCollection } from '../../redux/apiCalls'
import { publicRequest, userRequest } from '../../requestMethods'


const Collection = ({collection,view}) => {

    const user=useSelector(state=>state.user.currentUser);
    
    const [userRole, setUserRole] = useState({
        project:collection._id,
        role:'admin',
        user:user.username
    })

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

    useEffect(() => {
      const getUserRoleDetails = async() => {
        try {
            console.log("SHARED COLLECTION REQUEST USER", user)
            const res = await publicRequest.get(`/roles?project=${collection._id}&user=${user.username}`,{
                headers:{
                    'token':`Bearer ${user.accessToken}`
                }
            });
            console.log("RESPONSE",res.data);
            if(res.data[0]){
                setUserRole(res.data[0])
            };
        } catch (error) {
            console.log("ERROR",error)
        }
      }
      
      getUserRoleDetails();
    }, [])
    

    //TODO: FOR SHARED COLLECTIONS: 
    // -> if user is editor show edit collection name, view ke andar add entry option and settings options too?
    // -> else if user is viewer then show only view button and don't show add entry option 

  return (
    <Grid item xs={6} sm={6}>
        <Card sx={{ minWidth: 285 }}>
            <CardContent>
                <p className='cardHeader'>{collection.name}</p>
                <p className="cardDesc">{collection.description}</p>
                {view &&
                   
                    <p>STATUS :{collection.publicStatus}</p>
                }
            </CardContent>
            <CardActions>
                <Link to={`/collection/${collection._id}?view=${userRole.role}`}  style={{ textDecoration: 'none' }}>
                    <Button className='cardBtn' color="primary" size="small">
                        View
                    </Button>
                </Link>


                {view &&
                
                <div>
                    {(userRole.role=='editor'||userRole.role=='admin') &&
                        <>
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

                        </>
                    }
                    
                </div>

                }
                {view && !(collection.publicStatus=='approved') &&
                <Button className='cardBtn' size='small' onClick={handleRequest}>Send for Review</Button>
                }
            </CardActions>
            {/* {view && !(collection.publicStatus=='approved') &&
                <Button style={{paddingLeft:'24px'}} onClick={handleRequest}>Send for Review</Button>
            } */}
        </Card>
    </Grid>
  )
}

export default Collection