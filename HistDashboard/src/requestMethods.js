import axios from 'axios'

const BASE_URL = "http://localhost:5000/api/"

const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
const currentUser = user && JSON.parse(user).currentUser;
const TOKEN = currentUser?.accessToken;
console.log("CURR",currentUser)
console.log("TOKEN",TOKEN);

export const publicRequest = axios.create({
    baseURL:BASE_URL,
})

export const userRequest = axios.create({
    baseURL:BASE_URL,
    headers:{token:`Bearer ${TOKEN}`},
})

export const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
}
