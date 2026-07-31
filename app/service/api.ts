import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"

export const API_URL = "https://wnh65hn3-8080.brs.devtunnels.ms";

export const api = axios.create({
    baseURL: API_URL
});

api.interceptors.request.use((config) => {
    const token = AsyncStorage.getItem("authToken");

    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
})