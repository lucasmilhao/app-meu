import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "@/app/service/api";

const fetchdata = async (request : string | undefined) => {
    const response = await axios.post(`${API_URL}/auth/login/google`, request);

    const token = response.data.token;

    localStorage.setItem("authToken", token)

    return response.data;
}

export function useUsuarioLoginGoogle() {
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