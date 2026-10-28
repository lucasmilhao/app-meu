import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UsuarioLoginRequest } from "@/app/interface/UsuarioLoginRequest";
import { API_URL } from "@/app/service/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const fetchdata = async (request : UsuarioLoginRequest) => {
    const response = await axios.post(`${API_URL}/auth/login`, request);

    const token = response.data.token;

    AsyncStorage.setItem("authToken", token)

    return response.data;
}

export function useUsuarioLogin() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: fetchdata,
        onSuccess: () => {
            console.log("VAMO BRASISSSSISLSLSIDL");
            
            queryClient.invalidateQueries({queryKey : ["usuario-data"]});
        },
        onError: () => {
            console.log("FERROU RAPAZES");
        }
    });
}