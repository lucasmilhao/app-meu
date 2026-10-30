import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/app/service/api";
import ConversaResponseProps from "@/app/interface/ConversaResponse";

const fetchdata = async (data : ConversaResponseProps) : Promise<ConversaResponseProps> => {
    const response = await api.put(`/conversa/${data.idConversa}`, data);

    return response.data;
}

export function useConversaEdit() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: fetchdata,
        onSuccess: (_data, conversa) => {
            queryClient.invalidateQueries({ queryKey: ["conversa", conversa.idConversa] });
            queryClient.invalidateQueries({ queryKey: ["conversas-usuario"] });
        }
    });
}