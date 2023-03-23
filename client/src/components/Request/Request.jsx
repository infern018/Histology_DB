import { Button, Card, CardActions, CardContent, Grid } from '@material-ui/core'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { deleteRequest, getPrivateCollections, updateRequests } from '../../redux/apiCalls';

const Request = ({requestCollection}) => {

    const user = useSelector(state=>state.user.currentUser);
    const dispatch = useDispatch();

    const handleRequestApprove = () => {
        updateRequests(dispatch,requestCollection,user);
        getPrivateCollections(dispatch,user);
    }

    const handleRequestDecline = () => {
        deleteRequest(dispatch,requestCollection._id,user);
    }

  return (
    <Grid item xs={4} sm={6}>
        <Card sx={{ minWidth: 275 }}>
            <CardContent>
                <p className='cardHeader'>{requestCollection.name}</p>
                <p className="cardDesc">{requestCollection.description}</p>
                <p>STATUS:{requestCollection.publicStatus}</p>
                
            </CardContent>
            <CardActions>
                    <Button onClick={handleRequestApprove} className='cardBtn' color="primary" size="small">
                        <CheckIcon/>
                    </Button>

                    <Button onClick = {handleRequestDecline} className='cardBtn' color="primary" size="small">
                        <CloseIcon/>
                    </Button>

            
            </CardActions>
        </Card>
    </Grid>
  )
}

export default Request