import { createSlice } from "@reduxjs/toolkit";

const workspaceSlice = createSlice({
    name:"workspace",
    initialState:{
        entries:[]
    },
    reducers:{
        addEntry:(state,action) => {
            //push unique entries here
            state.entries.push(action.payload.entry)
        }
    }
})

export const {addEntry}  = workspaceSlice.actions;
export default workspaceSlice.reducer;