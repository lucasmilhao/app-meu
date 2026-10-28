import PostagemProps from "@/app/interface/PostagemProps";
import { api } from "@/app/service/api";
import { useQuery } from "@tanstack/react-query";

const fetchData = async () : Promise<PostagemProps[]> => {
    const response = await api.get<PostagemProps[]>(`/postagem`);

    return response.data;
}

export function usePostagemData() {
    return useQuery ({
        queryFn: fetchData,
        queryKey: ["postagem-data"],
        retry: 2
    })
    
}