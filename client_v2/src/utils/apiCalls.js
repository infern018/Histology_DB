import axios from "axios";

const axiosReq = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export const registerAPI = async (newUser) => {
  try {
    const response = await axiosReq.post("/auth/register", newUser);
    return response;
  } catch (error) {
    throw error;
  }
};

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

export const githubLoginAPI = async () => {
  try {
    window.open(`${process.env.REACT_APP_API_URL}/auth/github`, "_self");
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAllUserMetas = async (accessToken) => {
  try {
    const response = await axiosReq.get("/users/meta/all", {
      headers: { token: `${accessToken}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchUserCollections = async (userID) => {
  try {
    const response = await axiosReq.get(`/users/${userID}/collections`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchPublicCollections = async () => {
  try {
    const response = await axiosReq.get("/collections/public");
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchCollectionStats = async (collectionID) => {
  try {
    const response = await axiosReq.get(`/collections/${collectionID}/stats`);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getCollectionAPI = async (collectionID, accessToken) => {
  try {
    const response = await axiosReq.get(`/collections/${collectionID}`, {
      headers: { token: `${accessToken}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getPublicCollectionAPI = async (collectionID) => {
  try {
    const response = await axiosReq.get(`/collections/public/${collectionID}`);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createCollectionAPI = async (collection, accessToken) => {
  try {
    const response = await axiosReq.post("/collections", collection, {
      headers: { token: `${accessToken}` },
    });
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateCollectionAPI = async (
  collectionID,
  updatedCollection,
  accessToken
) => {
  try {
    const response = await axiosReq.put(
      `/collections/${collectionID}`,
      updatedCollection,
      {
        headers: { token: `${accessToken}` },
      }
    );
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteCollectionAPI = async (collectionID, accessToken) => {
  try {
    const response = await axiosReq.delete(`/collections/${collectionID}`, {
      headers: { token: `${accessToken}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const flushCollectionAPI = async (collectionID, accessToken) => {
  try {
    const response = await axiosReq.delete(
      `/collections/${collectionID}/flush`,
      {
        headers: { token: `${accessToken}` },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// return user details of ther userIDs provided in the body
export const fetchUserDetails = async (userIDs, accessToken) => {
  // make the userIDs array of format : {user_IDs: [id1, id2, id3, ...]}
  // and send as request body
  try {
    const response = await axiosReq.post(
      "/users/details",
      { userIDs },
      { headers: { token: `${accessToken}` } }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchCollaboratorsAPI = async (collectionID, accessToken) => {
  try {
    const response = await axiosReq.get(`/collections/${collectionID}/`, {
      headers: { token: `${accessToken}` },
    });
    return response.data.collaborators;
  } catch (error) {
    throw new Error(error.message);
  }
};

// the collaborators API endpoint expect {user_id, mode} in the request body
export const addCollaboratorAPI = async (
  collectionID,
  newCollaborator,
  accessToken
) => {
  try {
    const response = await axiosReq.post(
      `/collections/${collectionID}/collaborators`,
      { newCollaborator },
      { headers: { token: `${accessToken}` } }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateCollaboratorAPI = async (
  collectionID,
  updateCollaborator,
  accessToken
) => {
  try {
    const response = await axiosReq.put(
      `/collections/${collectionID}/collaborators`,
      { updateCollaborator },
      { headers: { token: `${accessToken}` } }
    );
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteCollaboratorAPI = async (
  collectionID,
  collaboratorID,
  accessToken
) => {
  try {
    const response = await axiosReq.delete(
      `/collections/${collectionID}/collaborators`,
      {
        headers: { token: `${accessToken}` },
        data: { collaboratorID },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchEntriesByCollectionID = async (
  collectionID,
  accessToken,
  page = 1,
  limit = 10,
  sortField = "_id",
  sortOrder = "asc"
) => {
  try {
    const response = await axiosReq.get(
      `/collections/${collectionID}/entries?page=${page}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}`,
      {
        headers: { token: `${accessToken}` },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchEntriesOfPublicCollection = async (
  collectionID,
  page = 1,
  limit = 10,
  sortField = "_id",
  sortOrder = "asc"
) => {
  try {
    const response = await axiosReq.get(
      `/collections/${collectionID}/entries/public?page=${page}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}`
    );

    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createEntryAPI = async (newEntry, accessToken) => {
  try {
    const response = await axiosReq.post(`/entries/`, newEntry, {
      headers: { token: `${accessToken}` },
    });

    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateEntryAPI = async (entryID, updatedEntry, accessToken) => {
  try {
    const response = await axiosReq.put(`/entries/${entryID}`, updatedEntry, {
      headers: { token: `${accessToken}` },
    });
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const uploadCSVEntries = async (collectionID, csvData, accessToken) => {
  const headers = [
    "bionomialSpeciesName",
    "stainingMethod",
    "bodyWeight",
    "brainWeight",
    "developmentalStage",
    "sex",
    "ageNumber",
    "ageUnit",
    "origin",
    "sectionThickness",
    "planeOfSectioning",
    "interSectionDistance",
    "brainPart",
    "comments",
    "NCBITaxonomyCode",
    "microdraw_link",
    "source_link",
    "thumbnail",
    "archivalCode",
  ];

  const csvContent = [
    headers.join(","), // Add headers
    ...csvData.map((row) =>
      [
        row.bionomialSpeciesName,
        row.stainingMethod,
        row.bodyWeight,
        row.brainWeight,
        row.developmentalStage,
        row.sex,
        row.ageNumber,
        row.ageUnit,
        row.origin,
        row.sectionThickness,
        row.planeOfSectioning,
        row.interSectionDistance,
        row.brainPart,
        row.comments,
        row.NCBITaxonomyCode,
        row.microdraw_link,
        row.source_link,
        row.thumbnail,
        row.archivalCode,
      ].join(",")
    ),
  ].join("\n");

  const formData = new FormData();
  const blob = new Blob([csvContent], { type: "text/csv" });

  console.log("INPUT CSV DATA", csvData);

  formData.append("file", blob, "entries.csv");

  return await axiosReq.post(
    `/collections/${collectionID}/entries/upload-csv`,
    formData,
    {
      headers: {
        "token": `${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const deleteEntriesAPI = async (collectionID, entryIDs, accessToken) => {
  try {
    const response = await axiosReq.delete(
      `/collections/${collectionID}/entries`,
      {
        headers: { token: `${accessToken}` },
        data: entryIDs,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getEntryAPI = async (entryID, accessToken) => {
  try {
    const response = await axiosReq.get(`/entries/${entryID}`, {
      headers: { token: `${accessToken}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getPublicEntryAPI = async (entryID) => {
  try {
    const response = await axiosReq.get(`/entries/public/${entryID}`);
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchSearchResults = async (searchParams) => {
  try {
    const response = await axiosReq.get("/entries/advanced-search", {
      params: searchParams,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching search results:", error);
    throw error;
  }
};

export const fetchDistinctOrders = async () => {
  try {
    const response = await axiosReq.get("/entries/distinct-orders");
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchDistinctStainings = async () => {
  try {
    const response = await axiosReq.get("/entries/distinct-stainings");

    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchDistinctBrainParts = async () => {
  try {
    const response = await axiosReq.get("/entries/distinct-brain-parts");
    return response.data;
  } catch (error) {
    throw new Error(error.message);
  }
};
