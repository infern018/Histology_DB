import { Container, TextField } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { getCurrentUser } from '../../requestMethods';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useSelector } from 'react-redux';
import { Autocomplete, MenuItem, Select, InputLabel, FormControl, CircularProgress,Backdrop } from '@mui/material';
import { getAllUsers } from '../../redux/apiCalls';
import axios from 'axios'



const CollectionForm = ({onFormSubmit,collectionProp}) => {

    const user = useSelector(state=>state.user.currentUser)

    const [allUsers, setAllUsers] = useState([])

    const [collection, setCollection] = useState({
        name:'',
        description:'',
        visibility:'private',
        ownerID:user._id,
        editors:[],
        viewers:[]
    })

    const handleChange = (e) => {
        var newCollection = {...collection};
        const field = e.target.name
        newCollection[field] = e.target.value;
        setCollection(newCollection)
    }


    useEffect(() => {
      setCollection(collectionProp)
    }, [collectionProp])

    useEffect(() => {

            const getAllUsers = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/users`)
                console.log("REs",res.data);
                setAllUsers(res.data)

            } catch (error) {}
        };
        getAllUsers();

    }, [])
    
    

    // const handleVisibilityChange = (e) => {
        
    // }

    const handleFormSubmit = (e) => {
        e.preventDefault();
        onFormSubmit(collection)
    }

    
  return (
    // <MuiThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Add collection details
          </Typography>
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>

              <Grid item xs={12} sm={12}>
                <TextField id="outlined-basic"  label="Name" name="name" value={collection.name} required fullWidth variant="outlined" 
                            onChange={(e)=>handleChange(e)}
                />
              </Grid>
    
              <Grid item xs={12}>
                <TextField id="outlined-basic" label="Description" name="description" value={collection.description} required fullWidth variant="outlined"
                            onChange={(e)=>handleChange(e)}  
                />
              </Grid>



            {user.isAdmin &&

                //toggle visibility
                <Grid item xs={12}>
                    <p>Visibility:</p>
                    <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="visibility"
                        value={collection.visibility}
                        onChange={(e) => handleChange(e)}
                    >
                        <FormControlLabel value="public" control={<Radio />} label="Public" />
                        <FormControlLabel value="private" control={<Radio />} label="Private" />
                    </RadioGroup>
                </Grid>
            
            }

            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick = {handleFormSubmit}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Container>
  )
}

export default CollectionForm