
import Ionicons from "@expo/vector-icons/Ionicons";
import { Palette, ThemePalette } from "@/constants/pallete";
import { useConversaDataUsuario } from "@/hooks/chat/conversa/useConversaDataUsuario";
import { useUsuarioLogado } from "@/hooks/usuario/useUsuarioLogado";
import { useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ConversaCard } from "@/components/ConversaCard";

export default function Chat() {
  const { data: usuarioLogado } = useUsuarioLogado();

  const {
    data: conversas,
    isPending,
    isError,
    error,
  } = useConversaDataUsuario(usuarioLogado?.id);

  const colors = Palette[useColorScheme() === "dark" ? "dark" : "light"];
  const styles = useMemo(() => makeStyles(colors), [colors]);

  if (isPending) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Conversas</Text>
        </View>

        <View style={styles.stateContainer}>
          <View style={styles.iconContainer}>
            <ActivityIndicator size="large" color={colors.accent} />
          </View>

          <Text style={styles.stateTitle}>
            Carregando conversas
          </Text>

          <Text style={styles.stateDescription}>
            Estamos buscando suas mensagens...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Conversas</Text>
        </View>

        <View style={styles.stateContainer}>
          <View style={styles.iconContainer}>
            <Ionicons
              name="alert-circle-outline"
              size={36}
              color={colors.accent}
            />
          </View>

          <Text style={styles.stateTitle}>
            Não foi possível carregar
          </Text>

          <Text style={styles.stateDescription}>
            {error.message || "Ocorreu um erro ao buscar suas conversas."}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Conversas</Text>
      </View>

      <FlatList
        data={conversas ?? []}
        keyExtractor={(conversa) => String(conversa.idConversa)}
        renderItem={({ item }) => <ConversaCard {...item} />}
        ListEmptyComponent={
          <View style={styles.stateContainer}>
            <View style={styles.iconContainer}>
              <Ionicons
                name="chatbubbles-outline"
                size={36}
                color={colors.accent}
              />
            </View>

            <Text style={styles.stateTitle}>
              Nenhuma conversa ainda
            </Text>

            <Text style={styles.stateDescription}>
              Quando você iniciar ou receber uma conversa,
              ela aparecerá aqui.
            </Text>
          </View>
        }
        contentContainerStyle={[
          styles.listContent,
          (!conversas || conversas.length === 0) && styles.emptyList,
        ]}
      />
    </SafeAreaView>
  );
}

const makeStyles = (c: ThemePalette) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.bgPrimary,
      padding: 10,
    },
    header: {
      marginBottom: 28,
    },
    pageTitle: {
      fontSize: 28,
      fontWeight: "800",
      color: c.textPrimary,
      letterSpacing: -0.8,
    },
    listContent: {
      flexGrow: 1,
    },
    emptyList: {
      flexGrow: 1,
      justifyContent: "center",
    },
    stateContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 32,
      paddingBottom: 60,
      gap: 12,
    },
    iconContainer: {
      width: 76,
      height: 76,
      borderRadius: 38,
      backgroundColor: c.cardBg,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 8,
    },
    stateTitle: {
      fontSize: 19,
      fontWeight: "700",
      color: c.textPrimary,
      textAlign: "center",
    },
    stateDescription: {
      fontSize: 14,
      lineHeight: 21,
      color: c.textSecondary,
      textAlign: "center",
      maxWidth: 280,
    },
  });
