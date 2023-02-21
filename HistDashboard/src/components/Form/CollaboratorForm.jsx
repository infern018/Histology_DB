import { Container, TextField } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useSelector } from 'react-redux';
import { Autocomplete} from '@mui/material';

const AddCollaboratorForm = ({onFormSubmit,editMode,collectionID,roleProp}) => {
    
    const allUsers = useSelector(state=>state.user.allUsers)

    const [role, setRole] = useState({
      project:collectionID,
      role:'user',
      user:''
    })

    useEffect(() => {
      console.log("PROP",roleProp)
      setRole(roleProp)
    }, [roleProp])
    

    const handleChange = (e) => {
      var newRole = {...role};
      const field = e.target.name
      newRole[field] = e.target.value;
      console.log("NEW",newRole)
      setRole(newRole)
    }

    const handleChangeUserSelect = (e,newValue) => {
      var newRole = {...role}
      const field = 'user'
      newRole[field] = newValue
      console.log("NEW",newRole);
      setRole(newRole);
    }

    const handleFormSubmit = (e) => {
      e.preventDefault();
      onFormSubmit(role);
    }

  return (
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
            Add collaborator
          </Typography>
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>

              <Grid item xs={12}>
              <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={allUsers.map((user) => user.username)}
                  sx={{ width: 390 }}
                  value={role.user}
                  readOnly={editMode}
                  onInputChange={(e,newValue)=> handleChangeUserSelect(e,newValue)}
                  renderInput={(params) => <TextField {...params} label="Username"required fullWidth variant="outlined" />}
                />
              </Grid>

            

                {/* //toggle role */}
                <Grid item xs={12}>
                    <p>Role:</p>
                    <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="role"
                        value={role.role}
                        onChange={(e) => handleChange(e)}
                    >
                        <FormControlLabel value="editor" control={<Radio />} label="Editor" />
                        <FormControlLabel value="user" control={<Radio />} label="Viewer" />
                    </RadioGroup>
                </Grid>
            
          

            </Grid>
            {/* TODO create role? */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleFormSubmit}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Container>
  )
}

export default AddCollaboratorForm