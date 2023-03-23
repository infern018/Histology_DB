import { createSlice } from "@reduxjs/toolkit";

//for private collections
const requestSlice = createSlice({
    name:"request",
    initialState:{
        requestCollections:[],
        error:false
    },
    reducers:{
        //GET
        getRequestSuccess:(state,action)=>{
            state.requestCollections = action.payload
        },
        getRequestFaliure:(state)=>{
            state.error = true
        },

        //APPROVE REQUEST ==  UPDATE
        updateRequestCollectionSuccess:(state,action)=>{
            state.isFetching = false
            state.requestCollections[state.requestCollections.findIndex(item=> item._id === action.payload.id)] = action.payload.collection
        },

        //DECLINE REQUEST == DELETE
        deleteRequestCollectionSuccess:(state,action)=>{
            state.isFetching = false
            state.requestCollections.splice(
                state.requestCollections.findIndex(item=> item._id === action.payload),
                1
            )
        }
    }
})

export const {  
                getRequestSuccess, getRequestFaliure, updateRequestCollectionSuccess, deleteRequestCollectionSuccess
            }  = requestSlice.actions;
export default requestSlice.reducer;