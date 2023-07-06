import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllUsersAPI, loginAPI, logoutAPI } from "./apiCalls";


export const login = createAsyncThunk(
  "user/login",
  async (user) => {
    try {
      const response = await loginAPI(user);
      console.log("RES", response)
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
);

export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async () => {
    try {
      const response = await getAllUsersAPI();
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
);

export const logout = createAsyncThunk(
  "user/logout",
  async () => {
    try {
      await logoutAPI();
      return null;
    } catch (error) {
      throw new Error(error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    isFetching: false,
    error: false,
    allUsers: [],
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log("ACTION PAYLOAD", action)
        state.isFetching = false;
        state.currentUser = action.payload;
      })
      .addCase(login.rejected, (state) => {
        state.isFetching = false;
        state.error = true;
      })
      .addCase(logout.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isFetching = false;
        state.currentUser = null;
      })
      .addCase(logout.rejected, (state) => {
        state.isFetching = false;
        state.error = true;
      })
      .addCase(getAllUsers.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isFetching = false;
        state.allUsers = action.payload;
      })
      .addCase(getAllUsers.rejected, (state) => {
        state.isFetching = false;
        state.error = true;
      });
  },
});

export const { actions } = userSlice;
export default userSlice.reducer;
