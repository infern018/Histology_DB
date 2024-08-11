import axios from 'axios';

const axiosReq = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

export const registerAPI = async (newUser) => {
    try {
        const response = await axiosReq.post("/auth/register", newUser);
        return response;
    } catch (error) {
        throw new Error(error.message);
    }

}

export const loginAPI = async (user) => {
    try {
        const response = await axiosReq.post("/auth/login", user);
        return response;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const logoutAPI = async () => {
    try {
        // Make a request to the logout endpoint
        const response = await axiosReq.post("/auth/logout");
        return response;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const getAllUserMetas = async (accessToken) => {
    try {
        const response = await axiosReq.get("/users/meta/all",
            { headers: { 'token': `${accessToken}` } }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const fetchUserCollections = async (userID) => {
    try {
        const response = await axiosReq.get(`/users/${userID}/collections`);
        return response.data;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const fetchCollectionStats = async (collectionID) => {
    try {
        const response = await axiosReq.get(`/collections/${collectionID}/stats`);
        return response.data;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const createCollectionAPI = async (collection, accessToken) => {
    try {
        const response = await axiosReq.post('/collections', collection,
            { headers: { 'token': `${accessToken}` } }
        );
        return response;
    } catch (error) {
        throw new Error(error.message);
    }
}

// return user details of ther userIDs provided in the body
export const fetchUserDetails = async (userIDs, accessToken) => {
    // make the userIDs array of format : {user_IDs: [id1, id2, id3, ...]}
    // and send as request body
    try {
        const response = await axiosReq.post('/users/details', { userIDs },
            { headers: { 'token': `${accessToken}` } }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const fetchCollaboratorsAPI = async (collectionID, accessToken) => {
    try {
        const response = await axiosReq.get(`/collections/${collectionID}/`,
            { headers: { 'token': `${accessToken}` } }
        );
        return response.data.collaborators;
    } catch (error) {
        throw new Error(error.message);
    }
}

// the collaborators API endpoint expect {user_id, mode} in the request body
export const addCollaboratorAPI = async (collectionID, newCollaborator, accessToken) => {
    console.log("newCollaborator", newCollaborator);
    console.log("accessToken", accessToken);
    console.log("collectionID", collectionID);
    try {
        const response = await axiosReq.post(`/collections/${collectionID}/collaborators`, { newCollaborator },
            { headers: { 'token': `${accessToken}` } }
        );
        return response.data;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const updateCollaboratorAPI = async (collectionID, updateCollaborator, accessToken) => {
    try {
        const response = await axiosReq.put(`/collections/${collectionID}/collaborators`, { updateCollaborator },
            { headers: { 'token': `${accessToken}` } }
        );
        return response;
    }
    catch (error) {
        throw new Error(error.message);
    }
}

export const deleteCollaboratorAPI = async (collectionID, collaboratorID, accessToken) => {
    try {
        const response = await axiosReq.delete(
            `/collections/${collectionID}/collaborators`,
            {
                headers: { 'token': `${accessToken}` },
                data: { collaboratorID }
            }
        );
        return response.data;
    }
    catch (error) {
        throw new Error(error.message);
    }
}


