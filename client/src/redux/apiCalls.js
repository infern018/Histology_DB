import axios from 'axios';

const publicAxios = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

const userAxios = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Add request interceptors, authentication headers, etc. if needed

export const loginAPI = async (user) => {
  try {
    const response = await publicAxios.post("/auth/login", user);
    console.log("TRIEGGERED", response.data)
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const logoutAPI = async () => {
  try {
    // Make a request to the logout endpoint
    const response = await publicAxios.post("/auth/logout");
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAllUsersAPI = async () => {
  try {
    const response = await publicAxios.get("/users");
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

//single collection
export const getCollectionDetailsAPI = async (collectionId,accessToken) => {
  try {
    const response = await publicAxios.get(`/collections/${collectionId}`,{
      headers: {
        token: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getPrivateCollectionsAPI = async (userId,accessToken) => {
  try {
    const response = await userAxios.get(`/collections/owned/${userId}`,{
      headers: {
        token: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getSharedCollectionsAPI = async (userId, accessToken) => {
  try {
    const response = await userAxios.get(`/collections/collaborating/${userId}`,{
      headers: {
        token: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deletePrivateCollectionAPI = async (collectionId, userId, accessToken) => {
  try {
    const response = await userAxios.delete(`/collections/${collectionId}`, {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createPrivateCollectionAPI = async (userId, collection, accessToken) => {
  try {
    const response = await userAxios.post(`/collections`, collection, {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updatePrivateCollectionAPI = async (collectionId, userId, collection, accessToken) => {
  try {
    const response = await userAxios.put(`/collections/${collectionId}`, collection, {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Other API functions for requests and roles
