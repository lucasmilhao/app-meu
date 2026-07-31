import { PartidaProps } from "@/app/interface/PartidaProps";
import { UsuarioProps } from "@/app/interface/UsuarioProps";
import { api } from "@/app/service/api";
import { useQuery } from "@tanstack/react-query";
import type { AxiosPromise } from "axios";

interface SolveProps {
    id : number,
    tempo :  number,
    scramble: string,
    penalty : string,
    user: UsuarioProps,
    partida : PartidaProps
}

const fetchData = async (partidaId : string | undefined) : AxiosPromise<SolveProps[]> => {
    const response = api.get(`/solves/partida/${partidaId}`);

    return response;
}

export function useSolveDataPartida(partidaId : string | undefined) {
    return useQuery ({
        queryFn: () => fetchData(partidaId),
        queryKey: ["solves-data", partidaId],
        retry: 2,
        enabled: !!partidaId
    })
}