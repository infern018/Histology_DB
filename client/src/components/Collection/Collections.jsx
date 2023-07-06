import { Container, Grid } from '@material-ui/core'
import React from 'react'
import Collection from './Collection'
import './Collections.css'

const Collections = ({collections,view}) => {

    return (
      <Container className='collectionContainer' maxWidth="md">
        <Grid container spacing={2} >
            {collections &&
            
              collections.map((item)=>(
                <Collection view={view} collection={item} key={item.id} />
            ))}
        </Grid>
      </Container>
    )
}

export default Collections