import PostagemProps from "@/app/interface/PostagemProps";
import { api } from "@/app/service/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosPromise } from "axios";

export interface PostagemRequest {
    descricao : string,
    idUsuario: string,
    idScramble? : string
}

const fetchData = async (data : FormData) : AxiosPromise<PostagemProps[]> => {
    const response = api.post(`/postagem`, data);

    return response;
} 


export function usePostagemCreate(){
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: fetchData, 
        retry: 2,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey : ["postagem-data"]})
        }
    })
}