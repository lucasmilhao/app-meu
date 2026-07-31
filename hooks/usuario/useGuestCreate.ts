import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "@/app/service/api";

const fetchdata = async () => {
    const response = await axios.post(`${API_URL}/auth/guest`);
    

    const token = response.data.token;

    localStorage.setItem("authToken", token)

    return response.data;
}

export function useGuestCreate() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: fetchdata,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey : ["guest-data"]})
        }
    });
}