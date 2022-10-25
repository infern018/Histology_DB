import { publicRequest, userRequest } from "../requestMethods";

import {    getCollectionFaliure, getCollectionStart, getPrivateCollectionSuccess, 
            deleteCollectionStart, deletePrivateCollectionSuccess, deleteCollectionFaliure,
            createCollectionStart, createPrivateCollectionSuccess, createCollectionFaliure,
            updatePrivateCollectionSuccess
        } from "./collectionRedux";

import { loginFaliure, loginStart, loginSuccess } from "./userRedux"
import { getRequestSuccess, getRequestFaliure, updateRequestCollectionSuccess, deleteRequestCollectionSuccess } from './requestRedux'
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

export const getPrivateCollections = async (dispatch,user) =>{
    dispatch(getCollectionStart());

    try {
        const res = await publicRequest.get(`/collections?ownerID=${user._id}&backupCollection=false`)
        dispatch(getPrivateCollectionSuccess(res.data));
    } catch (error) {
        dispatch(getCollectionFaliure());
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


