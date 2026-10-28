import { api } from "@/app/service/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosPromise } from "axios";

const fetchData = async (idPostagem : string) : AxiosPromise<void> => {   
    const response = api.delete(`/postagem/${idPostagem}`);

    return response;
}


export function usePostagemDelete(){
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: fetchData, 
        retry: 2,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey : ["postagem-data"]})
        }
    })
}