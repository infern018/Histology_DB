import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:"user",
    initialState:{
        currentUser:null,
        isFetching:false,
        error:false,
        allUsers:[]
    },
    reducers:{
        loginStart:(state)=>{
            state.isFetching = true
        },
        loginSuccess:(state,action)=>{
            state.isFetching = false
            state.currentUser = action.payload
        },
        loginFaliure:(state)=>{
            state.isFetching = false
            state.error = true
        },
        logoutSuccess:(state)=>{
            state.currentUser = null
            state.isFetching = false
        },
        getAllUsersSuccess:(state,action)=>{
            state.allUsers = action.payload
        }
    }
})

export const {loginStart, loginSuccess, loginFaliure, logoutSuccess, getAllUsersSuccess}  = userSlice.actions;
export default userSlice.reducer;