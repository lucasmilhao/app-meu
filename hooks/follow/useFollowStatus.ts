import { api } from "@/app/service/api";
import {useQuery} from "@tanstack/react-query";

interface FollowStatus {
    sigo : boolean,
    meSegue : boolean
}

const fetchdata = async (idUsuario : string | undefined) : Promise<FollowStatus> => {
    const response = await api.get(`/follow/status/${idUsuario}`);

    return response.data;
}

export function useFollowStatus(idUsuario : string | undefined) {

    return useQuery({
        queryFn: () => fetchdata(idUsuario),
        queryKey: ["status-data", idUsuario],
        retry: 2
    });
}