import PostagemProps from "@/app/interface/PostagemProps";
import { api } from "@/app/service/api";
import { useQuery } from "@tanstack/react-query";

const fetchdata = async (idUsuario : string | undefined) : Promise<PostagemProps[]> => {
    const response = await api.get(`/postagem/${idUsuario}`);

    return response.data;
}

export function usePostagemUsuario(idUsuario : string | undefined) {

    return useQuery({
        queryFn: () => fetchdata(idUsuario),
        queryKey: ["postagem-data", idUsuario],
        retry: 2
    });
}