import { createSlice } from "@reduxjs/toolkit";

//for private collections
const roleSlice = createSlice({
    name:"role",
    initialState:{
        roles:[],
        isFetching:false,
        error:false
    },
    reducers:{

        //GET
        getRoleStart:(state)=>{
            state.isFetching = true
        },
        getRoleSuccess:(state,action)=>{
            state.isFetching = false
            state.roles = action.payload
        },
        getRoleFaliure:(state)=>{
            state.isFetching = false
            state.error = true
        },

        //CREATE
        createRoleStart:(state)=>{
            state.isFetching = true
        },
        createRoleSuccess:(state,action)=>{
            state.isFetching = false
            state.roles.push(action.payload)
        },
        createRoleFaliure:(state)=>{
            state.isFetching = false
            state.error = true
        },

        //UPDATE
        updateRoleSuccess:(state,action)=>{
            state.isFetching = false
            state.roles[state.roles.findIndex(item=> item._id === action.payload.id)] = action.payload.role
        },

        //DELETE
        deleteRoleStart:(state)=>{
            state.isFetching = true
        },
        deleteRoleSuccess:(state,action)=>{
            state.isFetching = false
            state.roles.splice(
                state.roles.findIndex(item=> item._id === action.payload),
                1
            )
        },
        deleteRoleFaliure:(state)=>{
            state.isFetching = false
            state.error = true
        }
    }
})

export const {  getRoleStart, getRoleSuccess,getRoleFaliure, 
                deleteRoleStart, deleteRoleSuccess, deleteRoleFaliure,
                createRoleStart, createRoleSuccess, createRoleFaliure,
                updateRoleSuccess,


            }  = roleSlice.actions;
export default roleSlice.reducer;