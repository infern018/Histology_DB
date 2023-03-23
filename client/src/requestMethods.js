import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL

console.log("ENV",process.env)

const BASE_URL = API_URL
console.log("BASE URL",BASE_URL)

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
