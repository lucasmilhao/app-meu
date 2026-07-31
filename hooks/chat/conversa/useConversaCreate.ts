import { ConversaRequestProps } from "@/app/interface/ConversaRequestProps";
import { ConversaResponseProps } from "@/app/interface/ConversaResponse";
import { api } from "@/app/service/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosPromise } from "axios";

const fetchdata = async (data : ConversaRequestProps) : Promise<ConversaResponseProps> => {
    const response = await api.post(`/conversa/participantes`, data);

    return response.data;
}

export function useConversaCreate() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: fetchdata,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["conversa-data"]});
        }
    })
}