import { Container, TextField } from '@material-ui/core'
import React, { useState } from 'react'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import {Link} from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar';
import { login } from '../../redux/userRedux';


const Login = () => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const dispatch  = useDispatch();

    const navigate = useNavigate();

    const handleClick = async (e) => {
        e.preventDefault();
        dispatch(login({username,password}));
        navigate("/");
    }

  return (
    <>
    <Navbar/>
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
            Log in
          </Typography>
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>

              <Grid item xs={12} sm={12}>
                <TextField id="outlined-basic" label="Username" name="username" required fullWidth variant="outlined" 
                            onChange={(e)=>setUsername(e.target.value)}
                />
              </Grid>
    
              <Grid item xs={12}>
                <TextField id="outlined-basic" label="Password" name="password" required fullWidth variant="outlined" type="password"
                            onChange={(e)=>setPassword(e.target.value)}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleClick}
            >
              Log In
            </Button>

            {/* {error && <Alert severity="error">Something went wrong!</Alert>} */}

            <Grid container style={{justifyContent:"flex-end"}}>
              <Grid item sx={{ mt: 2}}>
                <Link to={`/register`} style={{color:"#1976D2"}}>
                  Don't have an account? Sign up
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </>
    
  )
}

export default Login