import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginAPI, logoutAPI, verifyUserAPI } from "../../utils/apiCalls";


export const verifyUser = createAsyncThunk(
    "user/verify",
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState();
            const accessToken = state.auth.currentUser?.accessToken;

            if (!accessToken) {
                return rejectWithValue();
            }

            const data = await verifyUserAPI(accessToken);
            return data;
        } catch {
            return rejectWithValue();
        }
    }
);


export const login = createAsyncThunk(
    "user/login",
    async (user) => {
        try {
            const response = await loginAPI(user);
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

const authSlice = createSlice({
    name: "user",
    initialState: {
        currentUser: null,
        isFetching: false,
        error: false,
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.isFetching = true;
            })
            .addCase(login.fulfilled, (state, action) => {
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
            .addCase(verifyUser.rejected, (state) => {
                state.currentUser = null;
            });

    },
});

export const { actions } = authSlice;
export default authSlice.reducer;
