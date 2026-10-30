import { ConversaCard } from "@/components/ConversaCard";
import { Palette, ThemePalette } from "@/constants/pallete";
import { useConversaDataUsuario } from "@/hooks/chat/conversa/useConversaDataUsuario";
import { useUsuarioLogado } from "@/hooks/usuario/useUsuarioLogado";
import { useMemo } from "react";
import { FlatList, StyleSheet, Text, useColorScheme, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Chat() {

  const { data: usuarioLogado, isPending, isError, error } = useUsuarioLogado();
  const { data: conversas } = useConversaDataUsuario(usuarioLogado?.id);

  const colors = Palette[useColorScheme() === "dark" ? "dark" : "light"];
  const styles = useMemo(() => makeStyles(colors), [colors]);

  if (isPending) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text>Carregando postagens...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <Text>Erro ao carregar postagens.</Text>
        <Text>{error.message}</Text>
      </View>
    );
  }


  return (
    <View>

      <FlatList
        data={conversas ?? []}
        keyExtractor={(conversa) => String(conversa.idConversa)}
        renderItem={({ item }) => (
          <ConversaCard
            {...item}
          />
        )}
        ListEmptyComponent={
          <Text>Nenhuma conversa encontrada.</Text>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  )
}

const makeStyles = (c: ThemePalette) =>

  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.bgPrimary,
    },
    listContent: {
      flexGrow: 1,
      padding: 16,
    },
  });