import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UsuarioRequest } from "@/app/interface/UsuarioRequest";
import { API_URL } from "@/app/service/api";

const fetchdata = async (request : UsuarioRequest) => {
    const response = await axios.post(`${API_URL}/auth/register`, request, {
        withCredentials: true
    });

    return response.data;
}

export function useUsuarioCreate() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: fetchdata,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey : ["usuario-data"]})
        }
    });
}