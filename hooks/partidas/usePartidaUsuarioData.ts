import { PartidaUsuarioProps } from "@/app/interface/PartidaUsuarioProps";
import { api } from "@/app/service/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const fetchdata = async (idPartida : string | undefined) : Promise<PartidaUsuarioProps[]> => {
    const response = await api.get(`/usuario-partida/${idPartida}`);
    console.log(response.data);
    

    return response.data;
}

export function usePartidaUsuarioData(idPartida : string | undefined) {
    return useQuery({
        queryFn: () => fetchdata(idPartida),
        queryKey: ["partida-usuario-data"]
    });
}
