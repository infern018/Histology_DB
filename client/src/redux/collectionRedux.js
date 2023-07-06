import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getPrivateCollectionsAPI,
  getSharedCollectionsAPI,
  deletePrivateCollectionAPI,
  createPrivateCollectionAPI,
  updatePrivateCollectionAPI,
  getCollectionDetailsAPI,
} from "./apiCalls";

export const getCollectionDetails = createAsyncThunk(
  "collection/getCollectionDetails",
  async (collectionId, {getState}) => {
    try {
      const accessToken = getState().user.currentUser.accessToken;
      const response = await getCollectionDetailsAPI(collectionId,accessToken);
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
);

export const getPrivateCollections = createAsyncThunk(
  "collection/getPrivateCollections",
  async (_, { getState }) => {
    try {
      const userId = getState().user.currentUser._id;
      const accessToken = getState().user.currentUser.accessToken;
      const response = await getPrivateCollectionsAPI(userId,accessToken);
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
);

export const getSharedCollections = createAsyncThunk(
  "collection/getSharedCollections",
  async (_, { getState }) => {
    try {
      const userId = getState().user.currentUser._id;
      const accessToken = getState().user.currentUser.accessToken;
      const response = await getSharedCollectionsAPI(userId, accessToken);
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
);

export const deletePrivateCollection = createAsyncThunk(
  "collection/deletePrivateCollection",
  async (collectionId, { getState }) => {
    try {
      const userId = getState().user.currentUser._id;
      const accessToken = getState().user.currentUser.accessToken;
      await deletePrivateCollectionAPI(collectionId, userId, accessToken);
      return collectionId;
    } catch (error) {
      throw new Error(error.message);
    }
  }
);

export const createPrivateCollection = createAsyncThunk(
  "collection/createPrivateCollection",
  async (collection, { getState }) => {
    try {
      const userId = getState().user.currentUser._id;
      const accessToken = getState().user.currentUser.accessToken;
      const response = await createPrivateCollectionAPI(userId, collection, accessToken);
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
);

export const updatePrivateCollection = createAsyncThunk(
  "collection/updatePrivateCollection",
  async (collection, { getState }) => {
    try {
      const userId = getState().user.currentUser._id;
      const accessToken = getState().user.currentUser.accessToken;
      const response = await updatePrivateCollectionAPI(collection._id, userId, collection, accessToken);
      return response.data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
);

const collectionSlice = createSlice({
  name: "collection",
  initialState: {
    privateCollections: [],
    sharedCollections: [],
    isFetching: false,
    error: false,
  },
  reducers: {
    // Other reducer functions...
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPrivateCollections.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(getPrivateCollections.fulfilled, (state, action) => {
        state.isFetching = false;
        state.privateCollections = action.payload;
      })
      .addCase(getPrivateCollections.rejected, (state) => {
        state.isFetching = false;
        state.error = true;
      })
      .addCase(getSharedCollections.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(getSharedCollections.fulfilled, (state, action) => {
        state.isFetching = false;
        state.sharedCollections = action.payload;
      })
      .addCase(getSharedCollections.rejected, (state) => {
        state.isFetching = false;
        state.error = true;
      })
      .addCase(deletePrivateCollection.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(deletePrivateCollection.fulfilled, (state, action)=>{
        state.isFetching = false;
        const collectionId = action.payload;
        state.privateCollections = state.privateCollections.filter(collection => collection._id !== collectionId);
      })
      .addCase(deletePrivateCollection.rejected, (state) => {
        state.isFetching = false;
        state.error = true;
      })
      .addCase(createPrivateCollection.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(createPrivateCollection.fulfilled, (state, action) => {
        console.log("STATE", state.privateCollections);
        console.log("ACTION PAYLOAD", action)
        state.isFetching = false;
        state.privateCollections.push(action.payload);
      })
      .addCase(createPrivateCollection.rejected, (state) => {
        state.isFetching = false;
        state.error = true;
      })
      .addCase(updatePrivateCollection.pending, (state) => {
        state.isFetching = true;
      })
      .addCase(updatePrivateCollection.fulfilled, (state, action) => {
        state.isFetching = false;
        const updatedCollection = action.payload;
        state.privateCollections = state.privateCollections.map(collection => {
          if (collection._id === updatedCollection._id) {
            return updatedCollection;
          }
          return collection;
        });
      })
      .addCase(updatePrivateCollection.rejected, (state) => {
        state.isFetching = false;
        state.error = true;
      });
  },
});

export const {
  // Other reducer functions...
} = collectionSlice.actions;

export default collectionSlice.reducer;
