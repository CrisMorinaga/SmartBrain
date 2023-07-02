import axios from "axios"

const BASE_URL = "http://127.0.0.1:8080"

export default axios.create({
    baseURL:BASE_URL,
    headers: { 
        "Content-Type": "application/json", 
    }
})

export const axiosAuth = axios.create({
    baseURL:BASE_URL,
    headers: { 
        "Content-Type": "application/json", 
    }
})