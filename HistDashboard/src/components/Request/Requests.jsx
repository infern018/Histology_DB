import { Container, Grid } from '@material-ui/core'
import React from 'react'
import Request from './Request'
import './Requests.css'

const Requests = ({requestCollections}) => {
    return (
      <Container className='collectionContainer' maxWidth="md">
        <Grid container spacing={2} >
            {requestCollections.map((item)=>(
                <Request  requestCollection={item} key={item.id} />
            ))}
        </Grid>
      </Container>
    )
}

export default Requests