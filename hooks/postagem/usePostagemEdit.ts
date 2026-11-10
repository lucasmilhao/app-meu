import PostagemProps from "@/app/interface/PostagemProps";
import { api } from "@/app/service/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosPromise } from "axios";

export interface PostagemEditRequest {
    idPostagem?: string | undefined;
    descricao : string| undefined,
    idUsuario : string | undefined,
    idScramble? : string | undefined | null
}

const fetchData = async (data : PostagemEditRequest) : AxiosPromise<PostagemProps> => {
    const response = api.put(`/postagem/${data.idPostagem}`, data);

    return response;
} 


export function usePostagemEdit(){
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: fetchData, 
        retry: 2,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey : ["postagem-data"]})
        }
    })
}