
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams, useRouter } from "expo-router";

import { puzzles, formatTime } from "../(tabs)/practice";
import { useSolveDataUser } from "../../hooks/solves/useSolveDataUser";
import { useUsuarioLogado } from "../../hooks/usuario/useUsuarioLogado";
import { useUsuarioLogout } from "../../hooks/usuario/useUsuarioLogout";
import { useFollowSeguindoData } from "../../hooks/follow/useFollowSeguindoData";
import { useFollowSeguidoresData } from "../../hooks/follow/useFollowSeguidoresData";
import {
  useFollowCreate,
  type FollowRequest,
} from "../../hooks/follow/useFollowCreate";
import { useFollowStatus } from "../../hooks/follow/useFollowStatus";

import { useConversaCreate } from "../../hooks/chat/conversa/useConversaCreate";

// Substitua pelos componentes compatíveis com React Native do seu projeto.
import PostagemProps from "../interface/PostagemProps";
import { usePostagemUsuario } from "@/hooks/postagem/usePostagemUsuario";
import { useUsuarioUsername } from "@/hooks/usuario/useUsuarioUsername";
import { PostCard } from "@/components/PostCard";
import { Palette, ThemePalette } from "@/constants/pallete";
import { SafeAreaView } from "react-native-safe-area-context";
import { SolveChart } from "@/components/SolveChat";
import { UsuarioModal } from "@/components/UsuarioModal";

const puzzleNames: Record<string, string> = {
  "3x3x3": "THREE",
  "2x2x2": "TWO",
  "4x4x4": "FOUR",
  "5x5x5": "FIVE",
  "6x6x6": "SIX",
  "7x7x7": "SEVEN",
  square1: "SQ1",
  megaminx: "MEGA",
  clock: "CLOCK",
  skewb: "SKEWB",
  pyraminx: "PYRA",
};

export function getTypeCubo(cubo: string): string {
  return puzzleNames[cubo] ?? "Desconhecido";
}

export default function Usuario() {
  const router = useRouter();
  const { username, postId } = useLocalSearchParams<{
    username: string;
    postId?: string;
  }>();

  const scrollRef = useRef<ScrollView>(null);
  const postPositions = useRef<Record<string, number>>({});

  const { data: usuarioLogado, isError: erroUsuario } =
    useUsuarioLogado();
  const { mutate : logout } = useUsuarioLogout();

  const {
    data: usuario,
    isLoading,
    isError,
    error,
  } = useUsuarioUsername(username ?? usuarioLogado?.username);

  const idUsuario = usuario?.id;


  const colors = Palette[useColorScheme() === "dark" ? "dark" : "light"];
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const { data: seguindo } = useFollowSeguindoData(idUsuario);
  const { data: seguidores } = useFollowSeguidoresData(idUsuario);
  const { data: postagens } = usePostagemUsuario(idUsuario);

  const { mutate: seguir, isPending: carregandoSeguir } =
    useFollowCreate();

  const { data: followStatus } = useFollowStatus(idUsuario);
  const { data: solveUser } = useSolveDataUser(idUsuario);
  const { mutate: conversa } = useConversaCreate();

  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [puzzle, setPuzzle] = useState(puzzles[1]);
  const [nome, setNome] = useState("");
  const [image, setImage] = useState<string | undefined>();

  useEffect(() => {
    if (usuario?.nome) setNome(usuario.nome);
    if (usuario?.picture) setImage(usuario.picture);
  }, [usuario?.nome, usuario?.picture]);

  useEffect(() => {
    if (erroUsuario) {
      router.replace("/(auth)/login");
    }
  }, [erroUsuario, router]);

  useEffect(() => {
    if (!postId) return;

    const y = postPositions.current[String(postId)];

    if (y !== undefined) {
      scrollRef.current?.scrollTo({
        y: Math.max(0, y - 100),
        animated: true,
      });
    }
  }, [postId, postagens]);

  const isUsuarioLogado = usuarioLogado?.id === idUsuario;
  const isConvidado = usuarioLogado?.isGuest === true;

  const followInfo = useMemo(() => {
    if (!followStatus) return "Seguir";

    if (followStatus.sigo && followStatus.meSegue) return "Amigos";
    if (followStatus.sigo) return "Seguindo";
    if (followStatus.meSegue) return "Seguir de volta";

    return "Seguir";
  }, [followStatus]);

  // Copia o array antes de ordenar/filtrar para não alterar os dados da query.
  const solves = useMemo(
    () =>
      (solveUser?.data ?? []).filter(
        (solve) => solve.tipoCubo === getTypeCubo(puzzle)
      ),
    [solveUser?.data, puzzle]
  );

  const media =
    solves.length > 0
      ? formatTime(
        solves.reduce((total, solve) => total + solve.tempo, 0) /
        solves.length
      )
      : null;

  const handleModal = () => {
    if (isConvidado) {
      Alert.alert(
        "Login",
        "Faça login para editar seu perfil.",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Login",
            onPress: () => router.push("/(auth)/login"),
          },
        ]
      );
      return;
    }

    setIsOpen((prev) => !prev);
  };

  const handleSeguir = () => {
    if (!usuarioLogado?.id || !idUsuario) {
      Alert.alert("Login", "Entre na sua conta para seguir usuários.");
      return;
    }

    const props: FollowRequest = {
      idSeguidor: usuarioLogado.id,
      idSeguindo: idUsuario,
    };

    seguir(props);
  };

  const submitConversa = () => {
    if (!usuario?.id || !usuarioLogado?.id) {
      Alert.alert("Login", "Entre na sua conta para iniciar uma conversa.");
      return;
    }

    if (isConvidado) {
      Alert.alert("Login", "Faça login para iniciar uma conversa.", [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Login",
          onPress: () => router.push("/(auth)/login"),
        },
      ]);
      return;
    }

    // const props: ConversaRequestProps = {
    //   nome: `${usuario.nome} e ${usuarioLogado.nome}`,
    //   idsUsuarios: [usuario.id, usuarioLogado.id],
    //   isGrupo: false,
    // };

    //   conversa(props, {
    //     onSuccess: (data) => {
    //       router.push(`/chat/${data.idConversa}` as never);
    //     },
    //     onError: () => {
    //       Alert.alert("Erro", "Não foi possível iniciar a conversa.");
    //     },
    //   });
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.secondaryText}>Carregando usuário...</Text>
      </View>
    );
  }

  if (isError || !usuario) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          Erro ao buscar usuário: {String(error ?? "Usuário não encontrado")}
        </Text>
        <Pressable onPress={() => router.back()} style={styles.secondaryButton}>
          <Text style={styles.buttonTextPrimary}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  console.log();

  console.log(usuario.nome);
  console.log("Username recebido:", username);
  console.log("Usuário retornado:", usuario);
  console.log("Carregando:", isLoading);
  console.log("Erro:", isError, error);


  return (
    <SafeAreaView style={styles.container}>
      {isOpen && (
        <UsuarioModal
          visible={isOpen}
          usuarioLogado={usuarioLogado}
          onClose={() => setIsOpen(false)}
        />
      )}

      

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho e ações do perfil */}
        <View style={styles.header}>
          <View style={styles.profileRow}>
            <View style={styles.profile}>
              {image ? (
                <Pressable onPress={() => router.push("/perfil/foto" as never)}>
                  <Image
                    source={{ uri: image }}
                    style={styles.avatar}
                  />
                </Pressable>
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Text style={styles.avatarLetter}>
                    {(nome || usuario.username || "?").charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}

              <View style={styles.nameContainer}>
                <Text style={styles.name} numberOfLines={2}>
                  {nome || usuario.username}
                </Text>
                {!!usuario.username && (
                  <Text style={styles.username}>@{usuario.username}</Text>
                )}
              </View>
            </View>

            {isUsuarioLogado && (
              <View style={styles.profileMenuContainer}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Abrir opções do perfil"
                  onPress={() => setIsMenuOpen((open) => !open)}
                  style={styles.profileMenuButton}
                >
                  <Ionicons name="ellipsis-vertical" size={22} color={colors.textPrimary} />
                </Pressable>
                {isMenuOpen && (
                  <View style={styles.profileMenu}>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => {
                        setIsMenuOpen(false);
                        logout();
                      }}
                      style={styles.profileMenuItem}
                    >
                      <Ionicons name="log-out-outline" size={18} color={colors.textPrimary} />
                      <Text style={styles.profileMenuText}>Sair da conta</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            )}
          </View>

          {!isUsuarioLogado && (
            <Pressable
              style={styles.secondaryButton}
              onPress={submitConversa}
            >
              <Text style={styles.buttonTextPrimary}>Mensagem</Text>
            </Pressable>
          )}

          <Pressable
            disabled={!isUsuarioLogado && carregandoSeguir}
            onPress={isUsuarioLogado ? handleModal : handleSeguir}
            style={[
              styles.primaryButton,
              !isUsuarioLogado && carregandoSeguir && styles.disabledButton,
            ]}
          >
            <Text style={styles.buttonTextPrimary}>
              {isUsuarioLogado
                ? "Editar perfil"
                : carregandoSeguir
                  ? "Aguarde..."
                  : followInfo}
            </Text>
          </Pressable>
        </View>

        {/* Estatísticas */}
        <View style={styles.stats}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Média {puzzle}</Text>
            <Text style={styles.statValue}>
              {media !== null ? `${media}s` : "--"}
            </Text>
            <Text style={styles.statCaption}>
              {solves.length} resoluções
            </Text>
          </View>

          <Pressable
            style={styles.statCard}
            onPress={() =>
              router.push(`/followers/${idUsuario}` as never)
            }
          >
            <Text style={styles.statLabel}>Seguidores</Text>
            <Text style={styles.statValue}>
              {seguidores?.length ?? 0}
            </Text>
          </Pressable>

          <Pressable
            style={styles.statCard}
            onPress={() =>
              router.push(`/following/${idUsuario}` as never)
            }
          >
            <Text style={styles.statLabel}>Seguindo</Text>
            <Text style={styles.statValue}>
              {seguindo?.length ?? 0}
            </Text>
          </Pressable>
        </View>

        {/* Gráfico de resoluções */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Desempenho</Text>

          <Text style={styles.fieldLabel}>Tipo de cubo</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.puzzleOptions}
          >
            {puzzles.map((item: any) => (
              <Pressable
                key={item}
                onPress={() => setPuzzle(item)}
                style={[
                  styles.puzzleChip,
                  puzzle === item && styles.puzzleChipSelected,
                ]}
              >
                <Text
                  style={[
                    styles.puzzleChipText,
                    puzzle === item && styles.puzzleChipTextSelected,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {solves.length > 0 ? (
            <SolveChart solves={solves} />
          ) : (
            <Text style={styles.emptyText}>
              Sem resoluções para este tipo de cubo.
            </Text>
          )}
        </View>

        {/* Publicações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Publicações</Text>

          {postagens?.length ? (
            postagens.map((postagem: PostagemProps) => (
              <View
                key={postagem.id}
                onLayout={(event) => {
                  postPositions.current[String(postagem.id)] =
                    event.nativeEvent.layout.y;
                }}
              >
                <PostCard postagem={postagem} />
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>
              Ainda não há publicações para mostrar.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = (c: ThemePalette) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: c.bgPrimary },
    scrollContent: { padding: 16, paddingBottom: 40, gap: 16 },
    center: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      gap: 12,
      backgroundColor: c.bgPrimary,
    },
    header: {
      backgroundColor: c.cardBg,
      borderRadius: 18,
      padding: 16,
      gap: 12,
      borderWidth: 1,
      borderColor: c.borderColor,
    },
    profileRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    profile: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
    profileMenuContainer: { position: "relative", zIndex: 1 },
    profileMenuButton: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 20,
    },
    profileMenu: {
      position: "absolute",
      top: 42,
      right: 0,
      width: 150,
      backgroundColor: c.cardBg,
      borderWidth: 1,
      borderColor: c.borderColor,
      borderRadius: 10,
      zIndex: 2,
      elevation: 6,
    },
    profileMenuItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingHorizontal: 14,
      paddingVertical: 12,
    },
    profileMenuText: { color: c.textPrimary, fontSize: 14, fontWeight: "600" },
    avatar: {
      width: 68,
      height: 68,
      borderRadius: 34,
      backgroundColor: c.borderColor,
    },
    avatarPlaceholder: { alignItems: "center", justifyContent: "center" },
    avatarLetter: { fontSize: 26, fontWeight: "700", color: c.textPrimary },
    nameContainer: { flex: 1, gap: 4 },
    name: { fontSize: 20, fontWeight: "700", color: c.textPrimary },
    username: { fontSize: 14, color: c.textSecondary },
    primaryButton: {
      backgroundColor: c.accent,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 10,
      alignItems: "center",
    },
    secondaryButton: {
      backgroundColor: c.inputBg,
      borderWidth: 1,
      borderColor: c.borderColor,
      paddingVertical: 11,
      paddingHorizontal: 14,
      borderRadius: 10,
      alignItems: "center",
    },
    disabledButton: { opacity: 0.6 },
    buttonTextPrimary: { fontSize: 14, fontWeight: "600", color: c.accentText },
    buttonTextSecondary: { fontSize: 14, fontWeight: "600", color: c.textPrimary },
    stats: { flexDirection: "row", gap: 8 },
    statCard: {
      flex: 1,
      minWidth: 0,
      backgroundColor: c.cardBg,
      borderRadius: 14,
      padding: 12,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: c.borderColor,
      gap: 5,
    },
    statLabel: { fontSize: 12, color: c.textSecondary, textAlign: "center" },
    statValue: { fontSize: 22, fontWeight: "700", color: c.textPrimary },
    statCaption: { fontSize: 11, color: c.textSecondary },
    section: {
      backgroundColor: c.cardBg,
      padding: 16,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: c.borderColor,
      gap: 12,
    },
    sectionTitle: { fontSize: 19, fontWeight: "700", color: c.textPrimary },
    fieldLabel: { fontSize: 14, fontWeight: "600", color: c.textSecondary },
    puzzleOptions: { gap: 8, paddingVertical: 2 },
    puzzleChip: {
      paddingHorizontal: 14,
      paddingVertical: 9,
      borderRadius: 20,
      backgroundColor: c.inputBg,
    },
    puzzleChipSelected: { backgroundColor: c.accent },
    puzzleChipText: { fontSize: 13, color: c.textSecondary, fontWeight: "500" },
    puzzleChipTextSelected: { color: c.accentText },
    emptyText: { color: c.textSecondary, fontSize: 14, lineHeight: 21 },
    secondaryText: { color: c.textSecondary, fontSize: 14 },
    errorText: { color: c.error, textAlign: "center" },
  });