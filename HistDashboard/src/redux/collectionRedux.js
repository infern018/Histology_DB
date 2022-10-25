import { createSlice } from "@reduxjs/toolkit";

//for private collections
const collectionSlice = createSlice({
    name:"collection",
    initialState:{
        privateCollections:[],
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
        }
    }
})

export const {  getCollectionStart, getPrivateCollectionSuccess,getCollectionFaliure, 
                deleteCollectionStart, deletePrivateCollectionSuccess, deleteCollectionFaliure,
                createCollectionStart, createPrivateCollectionSuccess, createCollectionFaliure,
                updatePrivateCollectionSuccess

            }  = collectionSlice.actions;
export default collectionSlice.reducer;