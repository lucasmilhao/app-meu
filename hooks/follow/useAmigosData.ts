import { UsuarioProps } from "@/app/interface/UsuarioProps";
import { api } from "@/app/service/api";
import {useQuery} from "@tanstack/react-query";

const fetchdata = async () : Promise<UsuarioProps[]> => {
    const response = await api.get(`/follow/amigos`);

    return response.data;
}

export function useFollowAmigosData() {

    return useQuery({
        queryFn: () => fetchdata(),
        queryKey: ["amigos-data"],
        retry: 2
    });
}