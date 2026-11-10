import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_URL = "https://cubing2gether.onrender.com";

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

export async function salvarTokenAutenticacao(token: unknown): Promise<void> {
    if (typeof token !== "string" || token.trim().length === 0) {
        throw new Error("A resposta do login não contém um token válido.");
    }

    await AsyncStorage.setItem("authToken", token);
}

api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem("authToken");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});
