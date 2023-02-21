import { Container, TextField } from '@material-ui/core'
import React, { useState } from 'react'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import {Link} from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'



const Register = () => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')

    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();

        const resp = await axios.post(`http://localhost:5000/api/auth/register`,{username,password,email});
        navigate("/login");
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
            Sign up
          </Typography>
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>

              <Grid item xs={12} sm={12}>
                <TextField id="outlined-basic"  label="Username" name="name" required fullWidth variant="outlined" 
                            onChange={(e)=>setUsername(e.target.value)}
                />
              </Grid>
    
              <Grid item xs={12}>
                <TextField id="outlined-basic" label="Email" name="email" required fullWidth variant="outlined" type="email"
                            onChange={(e)=>setEmail(e.target.value)}  
                />
              </Grid>
              <Grid item xs={12}>
                <TextField id="outlined-basic" label="Password" name="password" required fullWidth variant="outlined"  type="password"
                            onChange={(e)=>setPassword(e.target.value)}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick = {handleSignup}
            >
              Sign Up
            </Button>
            <Grid container style={{justifyContent:"flex-end"}}>
              <Grid item sx={{ mt: 2}}>
                <Link to={`/login`} style={{color:"#1976D2"}}>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    // </MuiThemeProvider>
  )
}

export default Register