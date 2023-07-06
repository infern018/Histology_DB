import { Button, Container, Grid } from '@material-ui/core'
import React from 'react'
import './Landing.css'
import {Link} from 'react-router-dom'
import { useSelector } from 'react-redux'

const Landing = () => {
  const user = useSelector(state=> state.user.currentUser);

  return (
    <Container className='landingContainer' maxWidth="md">
        <div className="wrapper">
            <h1 className='landingHeader'>HISTOLOGY DB.</h1>
            <p className='landingDesc'>An online database for storing, curating and sharing metadata from diverse collections of histological data.</p>
            <Grid container>
                <Grid item xs={12}>
                  {/* <Link to={`/collections/public`}   style={{ textDecoration: 'none' }}>
                      <Button variant="outlined">Public Collections </Button>
                  </Link> */}
                </Grid>

              {user &&
                 <Grid item xs={12} style={{"marginTop":"20px"}}>
                    <Link to={`/collections/private/${user._id}`}   style={{ textDecoration: 'none' }}>
                        <Button variant="contained" disableElevation>Your Private Collections </Button>
                    </Link>
                  </Grid>
              }
            </Grid>

        </div>
    </Container>
  )
}

export default Landing