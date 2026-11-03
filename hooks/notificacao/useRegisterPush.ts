import { useEffect } from "react";
import { useUsuarioLogado } from "@/hooks/usuario/useUsuarioLogado";
import { registrarPushToken } from "@/app/service/notificacaoService";
import { api } from "@/app/service/api";

export function useRegisterPush() {
  const { data: usuarioLogado } = useUsuarioLogado();

  useEffect(() => {
    if (!usuarioLogado?.id) return;

    let cancelado = false;

    async function registrar() {
      try {
        const token = await registrarPushToken();

        if (!token || cancelado) return;

        console.log("Expo Push Token:", token);

        await api.post("/push-token", {
          token,
        });
        
        console.log("Push token registrado no backend!");
      } catch (error) {
        console.error(
          "Erro ao registrar push token:",
          error
        );
      }
    }

    registrar();

    return () => {
      cancelado = true;
    };
  }, [usuarioLogado?.id]);
}