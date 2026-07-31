import { UsuarioProps } from "@/app/interface/UsuarioProps";
import { api } from "@/app/service/api";
import {useQuery} from "@tanstack/react-query";

export interface FollowProps {
    id : string,
    seguindo : UsuarioProps,
    seguidor : UsuarioProps
}

const fetchdata = async (idUsuario : string | undefined) : Promise<FollowProps[]> => {
    const response = await api.get(`/follow/seguindo/${idUsuario}`);

    return response.data;
}

export function useFollowSeguindoData(idUsuario : string | undefined) {

    return useQuery({
        queryFn: () => fetchdata(idUsuario),
        queryKey: ["seguindo-data", idUsuario],
        retry: 2
    });
}