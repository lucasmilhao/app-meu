
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import { puzzles, segundos } from "../Practice";
import { useSolveDataUser } from "../../hooks/solves/useSolveDataUser";
import { useUsuarioLogado } from "../../hooks/usuario/useUsuarioLogado";
import { useFollowSeguindoData } from "../../hooks/follow/useFollowSeguindoData";
import { useFollowSeguidoresData } from "../../hooks/follow/useFollowSeguidoresData";
import {
  useFollowCreate,
  type FollowRequest,
} from "../../hooks/follow/useFollowCreate";
import { useFollowStatus } from "../../hooks/follow/useFollowStatus";
import { usePostagemUsuario } from "../../hooks/postagem/usePostagemUsuario";
import { useConversaCreate } from "../../hooks/chat/conversa/useConversaCreate";
import { useUsuarioUsername } from "../../hooks/usuario/useUsuarioUsername";
import type { ConversaRequestProps } from "../../interface/ConversaRequestProps";

// Substitua pelos componentes compatíveis com React Native do seu projeto.
import { ModalPerfilNative } from "../../components/modal/ModalPerfilNative";
import { SolveChartNative } from "../../components/chart/SolveChartNative";
import { PostCardNative } from "../../components/postagem/PostCardNative";
import PostagemProps from "../interface/PostagemProps";

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

function getTypeCubo(cubo: string): string {
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

  const {
    data: usuario,
    isLoading,
    isError,
    error,
  } = useUsuarioUsername(username ?? "");

  const idUsuario = usuario?.id;

  const { data: usuarioLogado, isError: erroUsuario } =
    useUsuarioLogado();

  const { data: seguindo } = useFollowSeguindoData(idUsuario);
  const { data: seguidores } = useFollowSeguidoresData(idUsuario);
  const { data: postagens } = usePostagemUsuario(idUsuario);

  const { mutate: seguir, isPending: carregandoSeguir } =
    useFollowCreate();

  const { data: followStatus } = useFollowStatus(idUsuario);
  const { data: solveUser } = useSolveDataUser(idUsuario);
  const { mutate: conversa } = useConversaCreate();

  const [isOpen, setIsOpen] = useState(false);
  const [puzzle, setPuzzle] = useState(puzzles[1]);
  const [nome, setNome] = useState("");
  const [image, setImage] = useState<string | undefined>();

  useEffect(() => {
    if (usuario?.nome) setNome(usuario.nome);
    if (usuario?.picture) setImage(usuario.picture);
  }, [usuario?.nome, usuario?.picture]);

  useEffect(() => {
    if (erroUsuario) {
      router.replace("/auth/login");
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
      ? segundos(
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
            onPress: () => router.push("/auth/login"),
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
          onPress: () => router.push("/auth/login"),
        },
      ]);
      return;
    }

    const props: ConversaRequestProps = {
      nome: `${usuario.nome} e ${usuarioLogado.nome}`,
      idsUsuarios: [usuario.id, usuarioLogado.id],
      isGrupo: false,
    };

    conversa(props, {
      onSuccess: (data) => {
        router.push(`/chat/${data.idConversa}` as never);
      },
      onError: () => {
        Alert.alert("Erro", "Não foi possível iniciar a conversa.");
      },
    });
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
          <Text style={styles.buttonText}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isOpen && (
        <ModalPerfilNative
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

          {!isUsuarioLogado && (
            <Pressable
              style={styles.secondaryButton}
              onPress={submitConversa}
            >
              <Text style={styles.buttonText}>Mensagem</Text>
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
            <Text style={styles.buttonText}>
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
            {puzzles.map((item : any) => (
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
            <SolveChartNative solves={solves} />
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
            postagens.map((postagem : PostagemProps) => (
              <View
                key={postagem.id}
                onLayout={(event) => {
                  postPositions.current[String(postagem.id)] =
                    event.nativeEvent.layout.y;
                }}
              >
                <PostCardNative postagem={postagem} />
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>
              Ainda não há publicações para mostrar.
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7FB",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 12,
  },
  header: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#E5E7EB",
  },
  avatarPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLetter: {
    fontSize: 26,
    fontWeight: "700",
    color: "#374151",
  },
  nameContainer: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  username: {
    fontSize: 14,
    color: "#6B7280",
  },
  primaryButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: "#E8EEFF",
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1D4ED8",
  },
  stats: {
    flexDirection: "row",
    gap: 8,
  },
  statCard: {
    flex: 1,
    minWidth: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 5,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  statCaption: {
    fontSize: 11,
    color: "#6B7280",
  },
  section: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 12,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#111827",
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4B5563",
  },
  puzzleOptions: {
    gap: 8,
    paddingVertical: 2,
  },
  puzzleChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  puzzleChipSelected: {
    backgroundColor: "#2563EB",
  },
  puzzleChipText: {
    fontSize: 13,
    color: "#374151",
    fontWeight: "500",
  },
  puzzleChipTextSelected: {
    color: "#FFFFFF",
  },
  emptyText: {
    color: "#6B7280",
    fontSize: 14,
    lineHeight: 21,
  },
  secondaryText: {
    color: "#6B7280",
    fontSize: 14,
  },
  errorText: {
    color: "#DC2626",
    textAlign: "center",
  },
});
