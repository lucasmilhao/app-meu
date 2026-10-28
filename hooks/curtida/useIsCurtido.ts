import { api } from "@/app/service/api";
import { useQuery } from "@tanstack/react-query";

const fetchdata = async (idPostagem : string | undefined) : Promise<boolean> => {
    const response = await api.get(`/curtida/${idPostagem}`);

    return response.data;
}

export function useIsCurtido(idPostagem : string | undefined) {

    return useQuery({
        queryFn: () => fetchdata(idPostagem),
        queryKey: ["postagem-data", idPostagem],
        retry: 2
    });
}