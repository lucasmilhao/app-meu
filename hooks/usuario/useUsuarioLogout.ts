import { api } from "@/app/service/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const fetchdata = async () => {
    const response = await api.post("/auth/logout");

    return response.data;
}

export function useUsuarioLogout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: fetchdata,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["usuario-data"] });
            queryClient.invalidateQueries({ queryKey: ["usuario-logado-data"] });
        },
        onError: () => {
            console.log("FERROU RAPAZES");
        }
    });
}