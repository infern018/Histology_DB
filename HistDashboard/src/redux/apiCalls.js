import { publicRequest, userRequest } from "../requestMethods";

import {    getCollectionFaliure, getCollectionStart, getPrivateCollectionSuccess, 
            deleteCollectionStart, deletePrivateCollectionSuccess, deleteCollectionFaliure,
            createCollectionStart, createPrivateCollectionSuccess, createCollectionFaliure,
            updatePrivateCollectionSuccess, getSharedCollectionSuccess
        } from "./collectionRedux";

import { loginFaliure, loginStart, loginSuccess, getAllUsersSuccess } from "./userRedux"
import { getRequestSuccess, getRequestFaliure, updateRequestCollectionSuccess, deleteRequestCollectionSuccess } from './requestRedux'

import {    getRoleStart, getRoleSuccess,getRoleFaliure, 
            deleteRoleStart, deleteRoleSuccess, deleteRoleFaliure,
            createRoleStart, createRoleSuccess, createRoleFaliure,
            updateRoleSuccess,
    } from './roleRedux'

import axios from 'axios'


export const login = async (dispatch,user) =>{
    dispatch(loginStart());
    try {
        const res = await publicRequest.post("/auth/login",user)
        console.log("LOGGED IN", res.data);
        dispatch(loginSuccess(res.data));
    } catch (error) {
        dispatch(loginFaliure());
    }
}

//TODO: change it to auth methods not everyone can get all users data
export const getAllUsers = async(dispatch) => {
    try {
        const res = await publicRequest.get(`/users/`)
        dispatch(getAllUsersSuccess(res.data));
    } catch (error) {
        console.log("ERROR",error)
    }
}

//COLLECTIONS
export const getPrivateCollections = async (dispatch,user) =>{
    dispatch(getCollectionStart());

    try {
        const res = await publicRequest.get(`/collections?ownerID=${user._id}&backupCollection=false`)
        dispatch(getPrivateCollectionSuccess(res.data));
    } catch (error) {
        dispatch(getCollectionFaliure());
    }
}

export const getSharedCollections = async(dispatch,user) => {
    try {
        const res = await userRequest.get(`/collections/shared/${user.username}`);
        console.log("FETCHED",res.data)
        dispatch(getSharedCollectionSuccess(res.data));
    } catch (error) {
        console.log("ERROR",error);
    }
}

export const deletePrivateCollection = async (dispatch,id,user) =>{
    console.log("ID",id);
    console.log("USER",user.accessToken);
    dispatch(deleteCollectionStart());

    //CHECK USER METHOD FOR THIS (request methods me)

    try {
        const res = await axios.delete(`http://localhost:5000/api/collections/${id}/${user._id}`,
        {
            headers:{
                'token':`Bearer ${user.accessToken}`
            }
        })
        console.log("RES",res.data)
        dispatch(deletePrivateCollectionSuccess(id));
    } catch (error) {
        dispatch(deleteCollectionFaliure());
    }
}

export const createPrivateCollection = async (dispatch,collection,user) =>{
    dispatch(createCollectionStart());

    //CHECK USER METHOD FOR THIS (request methods me)

    try {
        const res = await axios.post(`http://localhost:5000/api/collections/${user._id}`,collection,
        {
            headers:{
                'token':`Bearer ${user.accessToken}`
            }
        })
        console.log("RES",res.data)
        dispatch(createPrivateCollectionSuccess(res.data));
    } catch (error) {
        dispatch(createCollectionFaliure());
    }
}

//ADD EDITOR/VIEWER?
export const updatePrivateCollection = async (dispatch,collection,user) =>{
    //CHECK USER METHOD FOR THIS (request methods me)

    try {
        const res = await axios.put(`http://localhost:5000/api/collections/${collection._id}/${user._id}`,collection,
        {
            headers:{
                'token':`Bearer ${user.accessToken}`
            }
        })
        console.log("RES",res.data)
        dispatch(updatePrivateCollectionSuccess({id:collection._id,collection:res.data}));
    } catch (error) {
        console.log("ERROR",error);
    }
}


//REQUESTS
export const getRequests = async (dispatch) =>{

    try {
        const res = await publicRequest.get(`/collections?publicStatus=pending&backupCollection=false`)
        dispatch(getRequestSuccess(res.data));
    } catch (error) {
        dispatch(getRequestFaliure());
    }
}

export const updateRequests = async (dispatch,collection,user) =>{
    //CHECK USER METHOD FOR THIS (request methods me)
    try {
        const res = await axios.put(`http://localhost:5000/api/collections/${collection._id}/${user._id}`,{publicStatus:'approved',visibility:'public'},{
            headers: {
                'token': `Bearer ${user.accessToken}`
            }
        })
        console.log("RES",res.data)
        dispatch(updateRequestCollectionSuccess({id:collection._id,collection:res.data}));
    } catch (error) {
        console.log("ERROR",error);
    }
}

export const deleteRequest = async (dispatch,id,user) =>{
    console.log("ID",id);
    console.log("USER",user.accessToken);

    try {
        const resp = await axios.put(`http://localhost:5000/api/collections/${id}/${user._id}`,{publicStatus:'declined',visibility:'private'},{
            headers: {
                'token': `Bearer ${user.accessToken}`
            }
        })
        console.log("SUCCESS",resp.data)
        dispatch(deleteRequestCollectionSuccess(id));
    } catch (error) {
        console.log("ERR",error)
    }
}



//-------------------------------------------------------

//ROLES:
export const getRole = async (dispatch) =>{
    dispatch(getRoleStart());
    try {
        const res = await userRequest.get(`/roles`)
        console.log("RES ROLES",res.data);
        dispatch(getRoleSuccess(res.data));
    } catch (error) {
        dispatch(getRoleFaliure());
    }
}

//TEMP FUNCTION FOR GETTING ROLE OF A PARTICULAR PROJECT
export const getRolesOfCollection = async(dispatch,collectionID) => {
    try {
        const res = await userRequest.get(`/roles?project=${collectionID}`)
        var roles = res.data;
        console.log("ROLES OF A COLLECTION",roles);
        return res.data;
    } catch (error) {
        console.log("ERROR",error);
    }
}

export const deleteRole = async (dispatch,id) =>{
    console.log("ID",id); //roleID to delete
    dispatch(deleteRoleStart());

    //CHECK USER METHOD FOR THIS (request methods me)

    try {
        const res = await userRequest.delete(`/roles/${id}`)
        dispatch(deleteRoleSuccess(id));
    } catch (error) {
        dispatch(deleteRoleFaliure());
    }
}

export const createRole = async (dispatch,role) =>{
    dispatch(createRoleStart());

    //CHECK USER METHOD FOR THIS (request methods me)

    try {
        const res = await userRequest.post(`/roles`,role)
       
        console.log("RES",res.data)
        dispatch(createRoleSuccess(res.data));
    } catch (error) {
        dispatch(createRoleFaliure());
    }
}

export const updateRole = async (dispatch,role) =>{
    //CHECK USER METHOD FOR THIS (request methods me)

    try {
        const res = await userRequest.put(`/roles/${role._id}`,role)
        console.log("RES",res.data)
        dispatch(updateRoleSuccess({id:role._id,role:res.data}));
    } catch (error) {
        console.log("ERROR",error);
    }
}


