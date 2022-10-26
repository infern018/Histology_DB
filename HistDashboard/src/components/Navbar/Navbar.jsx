import { AppBar, Badge, Box, Button, Container, Grid, Toolbar, Typography } from '@material-ui/core'
import React from 'react'
import { useSelector } from 'react-redux'
import {Link} from 'react-router-dom'
import AccountCircle from '@mui/icons-material/AccountCircle';
import HandymanIcon from '@mui/icons-material/Handyman';
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { logoutSuccess } from '../../redux/userRedux'

const Navbar = () => {

    const navigate = useNavigate();

    const user = useSelector(state=>state.user.currentUser);
    const dispatch = useDispatch();
    
    const handleLogout = () =>{
        dispatch(logoutSuccess());
        navigate("/");
    }

    
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Container maxWidth="lg">
        <Toolbar>
            <Grid
            justify="space-between" // Add it here :)
            container 
            >
                <Grid item>
                    <Link to={`/`} style={{color:"white",textDecoration:"none"}}>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            HOME
                        </Typography>
                    </Link>
                </Grid>
                {user && user.isAdmin &&
                
                <Grid item>
                    <Link to={`/`} style={{color:"white",textDecoration:"none"}}>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Welcome Mr.Admin ^^
                        </Typography>
                    </Link>
                </Grid>
                
                }

                <Grid item>
                    <div>
                    {
                        !user &&
                        <>
                            <Link to={`/register`} style={{color:"white",textDecoration:"none"}}>
                                <Button color="inherit">
                                    SIGN UP
                                </Button>
                            </Link>

                            <Link to={`/login`} style={{color:"white",textDecoration:"none"}}>
                                <Button color="inherit">
                                    LOGIN
                                </Button>
                            </Link>
                        </>
                     }

                    {user &&

                        <Link to={`/collections/private/${user._id}`} style={{color:"white"}}>
                        <Button color="inherit">
                            <AccountCircle/>
                        </Button>
                        </Link>

                    }

                    { user && user.isAdmin && 
                        <>
                            <Link to={`/admin/requests`} style={{color:"white"}}>
                                <Button color="inherit">
                                    <HandymanIcon/>
                                </Button>
                            </Link>
                        </>
                    }
                    

                    {user &&
                        <Button onClick = {handleLogout} color="inherit">LOGOUT</Button>
                    }   

                    </div>
                </Grid>

            </Grid>
        </Toolbar>
        </Container>
      </AppBar>
    </Box>
  )
}

export default Navbar