import { api } from "@/app/service/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const fetchdata = async (request : FormData) : Promise<string> => {
    const response = await api.post(`/uploads`, request);

    return response.data;
}

export function useUploadPost() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: fetchdata,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey : ["upload-data"]})
            queryClient.invalidateQueries({queryKey : ["usuario-id-data"]})
            queryClient.invalidateQueries({queryKey : ["usuario-logado-data"]})
        }
    });
}