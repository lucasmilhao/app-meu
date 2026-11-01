import { useEffect } from "react";
import { useRouter } from "expo-router";
import * as Notifications from "expo-notifications";

type PushData = {
  tipo?: string;
  referenciaId?: string;
};

export function usePushNavigation() {
  const router = useRouter();

  useEffect(() => {
    function abrirNotificacao(
      response: Notifications.NotificationResponse
    ) {
      const data = response.notification.request
        .content.data as PushData;

      if (!data.referenciaId) return;

      switch (data.tipo) {
        case "MENSAGEM":
          router.push({
            pathname: "/(screens)/conversa",
            params: {
              idConversa: data.referenciaId,
            },
          });
          break;

        case "CURTIDA":
        case "COMENTARIO":
          // Navegar para a postagem correspondente
          break;

        case "SEGUIDOR":
          // Navegar para o perfil do remetente
          break;
      }
    }

    const subscription =
      Notifications.addNotificationResponseReceivedListener(
        abrirNotificacao
      );

    Notifications.getLastNotificationResponseAsync()
      .then((response) => {
        if (response) {
          abrirNotificacao(response);
        }
      });

    return () => subscription.remove();
  }, [router]);
}