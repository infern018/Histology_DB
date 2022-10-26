import { Button, Container, Grid } from '@material-ui/core';
import { Autocomplete, TextField, MenuItem, Select, InputLabel, FormControl, CircularProgress,Backdrop } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const EntryForm = ({onFormSubmit,collectionID}) => {

    const templateObject = 
    {
        identification: {
            collectionCode: "",
            itemCode: "",
            individualCode: "",
            NCBITaxonomyCode: null,
            wikipediaSpeciesName: "",
            bionomialSpeciesName: ""
        },
        archivalIdentification: {
            archivalIndividualCode: "",
            archivalSpeciesCode:"",
            archivalSpeciesOrder: "",
            archivalSpeciesName: ""
    },
    physiologicalInformation: {
            age: {
                developmentalStage: null,
                number:null,
                unitOfNumber: null,
                origin: ""
            },
            sex: "u",
            bodyWeight: null,
            brainWeight: null
        },
        histologicalInformation: {
            stainingMethod: "",
            sectionThickness: "",
            planeOfSectioning: "",
            interSectionDistance: "",
            brainPart: "",
            dataThumbnailImage: "",
            comments: ""
        },
        collectionID:collectionID
    };
    
    const [entryData, setEntryData] = useState(templateObject);
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        // setOpen(!open)

        const config = {
            headers: {
              'Content-Type': 'application/JSON'
            }
        };

        onFormSubmit(entryData)
    }

    const handleAgeChange2 = (e) => {
        const path  = e.target.name;

        const {
            target: { value },
        } = e;

        const newEntryData = {...entryData};
        
        const upper = newEntryData.physiologicalInformation.age;

        if(path=='developmentalStage' && value.length<=3){
            upper[path] = '---'
        }

        else if(typeof(upper[path])=='number'){
            upper[path] = Number(value);
        } else {
            upper[path] = value;
        }

        newEntryData.physiologicalInformation.age = upper;
        setEntryData(newEntryData);
    }

    const handleAgeChange = (e) => {
        const path = e.target.id;

        const newEntryData = {...entryData};
        
        const upper = newEntryData.physiologicalInformation.age;

        if(typeof(upper[path])=='number'){
            upper[path] = Number(e.target.value);
        } else {
            upper[path] = e.target.value;
        }

        newEntryData.physiologicalInformation.age = upper;
        setEntryData(newEntryData);
    }

    const handleChange2 = (e) => {
        const {
            target: { value },
        } = e;

        const path = e.target.name.split(".");
        const firstField = path[0];
        const secondField = path[1];

        const newEntryData = {...entryData};

        const upper = newEntryData[firstField];
        

        if(typeof(upper[secondField])=='number'){
            upper[secondField] = Number(value);
        } else {
            upper[secondField] = value;
        }

        newEntryData[firstField] = upper;
        setEntryData(newEntryData)
    }

    const handleAutocompleteChange = (e,newValue) => {
        console.log("E",e)

        const {
            target: { value },
        } = e;

        console.log("VAL",value)
        
        console.log("VAL-NEW",newValue);

        const path = e.target.id.split(".");

        console.log("PATH",path);

        const firstField = 'identification';
        const secondField = 'collectionCode';

        const newEntryData = {...entryData};

        const upper = newEntryData[firstField];
        

        if(typeof(upper[secondField])=='number'){
            upper[secondField] = Number(newValue);
        } else {
            upper[secondField] = newValue;
        }

        newEntryData[firstField] = upper;
        setEntryData(newEntryData)
    }

    const handleChange = (e) => {
        const path = e.target.id.split(".");
        const firstField = path[0];
        const secondField = path[1];

        const newEntryData = {...entryData};

        const upper = newEntryData[firstField];
        

        if(typeof(upper[secondField])=='number'){
            upper[secondField] = Number(e.target.value);
        } else {
            upper[secondField] = e.target.value;
        }

        newEntryData[firstField] = upper;
        setEntryData(newEntryData)

    }

  return (
    <div>

        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
        >
            <CircularProgress />
        </Backdrop>

        <Container style={{textAlign:'left',maxWidth:'60rem'}}>

            <h1 style={{marginBottom:"20px"}} >AddEntryData</h1>

            <form onSubmit={handleFormSubmit}>

                <Grid container spacing={2}>
                
                    <Grid item xs={12}>
                        <p style={{fontSize:'20px',fontWeight:"600"}}>Identification</p>
                    </Grid>

                    <Grid item xs={12} style={{display:"block"}}>
                        <TextField
                                name="identification.NCBITaxonomyCode"
                                onChange={(e) => handleChange2(e)}
                                label="NCBI Taxonomy Code"
                                type="number"
                                value={entryData.identification.NCBITaxonomyCode}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <p style={{fontSize:'20px',fontWeight:"600"}}>Archival Identification</p>
                    </Grid>
                    <Grid item xs={6}>
                        
                        <TextField
                            
                            name="archivalIdentification.archivalIndividualCode"
                            onChange={(e) => handleChange2(e)}
                            label="Archival Individual Code"
                            type="text"
                            value={entryData.archivalIdentification.archivalIndividualCode}               
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <TextField
                            name="archivalIdentification.archivalSpeciesCode"
                            onChange={(e) => handleChange2(e)}
                            label="Archival Species Code"
                            value={entryData.archivalIdentification.archivalSpeciesCode} 
                            type="text"
                            // InputLabelProps={{ shrink: true }}                       
                        />
                    </Grid>
        
                    <Grid item xs={6}>                        
                        <TextField
                            
                            name="archivalIdentification.archivalSpeciesOrder"
                            onChange={(e) => handleChange2(e)}
                            label="Archival Species Order"
                            value={entryData.archivalIdentification.archivalSpeciesOrder}    
                            type="text"
                        />
                    </Grid>

                    <Grid item xs={6}> 

                        <TextField
                            name="archivalIdentification.archivalSpeciesName"
                            onChange={(e) => handleChange2(e)}
                            label="Archival Species Name"
                            type="text"
                            value={entryData.archivalIdentification.archivalSpeciesName}
                                                    
                        />
                    </Grid>


                    <Grid item xs={12}>
                        <p style={{fontSize:'20px',fontWeight:"600"}}>Physiological Information :</p> 
                    </Grid>

                    <Grid item xs={12}>
                        <p>Age :</p> 
                    </Grid>                    
                    
                    <Grid item xs={3}>

                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Developmental Stage</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            label="Developmental Stage"
                            name="developmentalStage"
                            onChange={handleAgeChange2}
                            // defaultValue="---"
                            value={entryData.physiologicalInformation.age.developmentalStage}
                        >
                            <MenuItem value="embryo">Embryo</MenuItem>
                            <MenuItem value="fetus">Fetus</MenuItem>
                            <MenuItem value="neonate">Neonate</MenuItem>
                            <MenuItem value="infant">Infant</MenuItem>
                            <MenuItem value="juvenile">Juvenile</MenuItem>
                            <MenuItem value="adult">Adult</MenuItem>
                        </Select>
                    </FormControl>
                    </Grid>

                    <Grid item xs={2}>

                        <TextField
                            name="number"
                            onChange={(e) => handleAgeChange2(e)}
                            label="Number"
                            type="number"
                            value={entryData.physiologicalInformation.age.number}
                            
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Unit of Number</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                name="unitOfNumber"
                                label="Unit of Number"
                                onChange={handleAgeChange2}
                                value={entryData.physiologicalInformation.age.unitOfNumber}
                            >
                                <MenuItem value="days">Days</MenuItem>
                                <MenuItem value="months">Months</MenuItem>
                                <MenuItem value="weeks">Weeks</MenuItem>
                                <MenuItem value="years">Years</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Origin</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                name="origin"
                                label="Origin"
                                onChange={handleAgeChange2}
                                value={entryData.physiologicalInformation.age.origin}
                            >
                                <MenuItem value="postNatal">Post Natal</MenuItem>
                                <MenuItem value="postConception">Post Conception</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={2}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Sex</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                name="physiologicalInformation.sex"
                                label="Sex"
                                onChange={(e) => handleChange2(e)}
                                value={entryData.physiologicalInformation.sex}
                            >
                                <MenuItem value="m">Male</MenuItem>
                                <MenuItem value="f">Female</MenuItem>
                                <MenuItem value="u">Undefined</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={2}>
                        <TextField
                            name="physiologicalInformation.bodyWeight"
                            onChange={(e) => handleChange2(e)}
                            label="Body Weight"
                            type="number"
                            value={entryData.physiologicalInformation.bodyWeight}
                        />
                    </Grid>

                    <Grid item xs={2}>
                        <TextField
                            name="physiologicalInformation.brainWeight"
                            onChange={(e) => handleChange2(e)}
                            label="Brain Weight"
                            type="number"
                            value={entryData.physiologicalInformation.brainWeight}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <p style={{fontSize:'20px',fontWeight:"600"}}>Histological Information</p>
                    </Grid>

                    <Grid item xs={4}>
                        <TextField
                            
                            name="histologicalInformation.stainingMethod"
                            onChange={(e) => handleChange2(e)}
                            label="Staining Method"
                            value={entryData.histologicalInformation.stainingMethod}
                        />
                    </Grid>

                    <Grid item xs={4}>

                        <TextField
                            
                            name="histologicalInformation.sectionThickness"
                            onChange={(e) => handleChange2(e)}
                            label="Section Thickness"
                            value={entryData.histologicalInformation.sectionThickness}
                        />
                    </Grid>

                    <Grid item xs={4}>                        
                        <TextField
                            
                            name="histologicalInformation.planeOfSectioning"
                            onChange={(e) => handleChange2(e)}
                            label="Plane Of Sectioning"
                            value={entryData.histologicalInformation.planeOfSectioning}
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <TextField
                            
                            name="histologicalInformation.interSectionDistance"
                            onChange={(e) => handleChange2(e)}
                            label="Intersection Distance"
                            value={entryData.histologicalInformation.interSectionDistance}
                        />
                    </Grid>

                    <Grid item xs={4}>
                        <TextField
                            
                            name="histologicalInformation.brainPart"
                            onChange={(e) => handleChange2(e)}
                            label="Brain Part"
                            value={entryData.histologicalInformation.brainPart}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button type="submit" variant="contained"  >Submit</Button>
                    </Grid>
                </Grid>

            </form>

        </Container>
    </div>
  )
}

export default EntryForm