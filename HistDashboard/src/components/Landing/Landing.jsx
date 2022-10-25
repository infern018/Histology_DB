import { Button, Container } from '@material-ui/core'
import React from 'react'
import './Landing.css'
import {Link} from 'react-router-dom'

const Landing = () => {
  return (
    <Container className='landingContainer' maxWidth="md">
        <div className="wrapper">
            <h1 className='landingHeader'>HISTOLOGY DB.</h1>
            <p className='landingDesc'>An online database for storing, curating and sharing metadata from diverse collections of histological data.</p>
            <Link to={`/collections/public`}   style={{ textDecoration: 'none' }}>
                <Button variant="outlined">Explore Collections </Button>
            </Link>
        </div>
    </Container>
  )
}

export default Landing