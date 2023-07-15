import axios from "axios"

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
const API_AUTH = process.env.NEXT_PUBLIC_API_AUTH

export default axios.create({
    baseURL:BASE_URL,
    headers: { 
        "Content-Type": "application/json", 
        'X-Space-App-Key': API_AUTH,
    }
})

export const axiosAuth = axios.create({
    baseURL:BASE_URL,
    headers: { 
        "Content-Type": "application/json", 
        'X-Space-App-Key': API_AUTH,
    }
})