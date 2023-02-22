import { createSlice } from "@reduxjs/toolkit";
import { createRole } from "./apiCalls";

//for private collections
const collectionSlice = createSlice({
    name:"collection",
    initialState:{
        privateCollections:[],
        sharedCollections:[],
        isFetching:false,
        error:false
    },
    reducers:{

        //GET
        getCollectionStart:(state)=>{
            state.isFetching = true
        },
        getPrivateCollectionSuccess:(state,action)=>{
            state.isFetching = false
            state.privateCollections = action.payload
        },
        getCollectionFaliure:(state)=>{
            state.isFetching = false
            state.error = true
        },

        //CREATE
        createCollectionStart:(state)=>{
            state.isFetching = true
        },
        createPrivateCollectionSuccess:(state,action)=>{
            state.isFetching = false
            state.privateCollections.push(action.payload)
        },
        createCollectionFaliure:(state)=>{
            state.isFetching = false
            state.error = true
        },

        //UPDATE
        updatePrivateCollectionSuccess:(state,action)=>{
            state.isFetching = false
            state.privateCollections[state.privateCollections.findIndex(item=> item._id === action.payload.id)] = action.payload.collection
        },

        //DELETE
        deleteCollectionStart:(state)=>{
            state.isFetching = true
        },
        deletePrivateCollectionSuccess:(state,action)=>{
            state.isFetching = false
            state.privateCollections.splice(
                state.privateCollections.findIndex(item=> item._id === action.payload),
                1
            )
        },
        deleteCollectionFaliure:(state)=>{
            state.isFetching = false
            state.error = true
        },

        //TODO:
        //get shared collections
        getSharedCollectionSuccess:(state,action)=>{
            state.sharedCollections = action.payload
        },        
    
    }
})

export const {  getCollectionStart, getPrivateCollectionSuccess,getCollectionFaliure, 
                deleteCollectionStart, deletePrivateCollectionSuccess, deleteCollectionFaliure,
                createCollectionStart, createPrivateCollectionSuccess, createCollectionFaliure,
                updatePrivateCollectionSuccess, getSharedCollectionSuccess

            }  = collectionSlice.actions;
export default collectionSlice.reducer;