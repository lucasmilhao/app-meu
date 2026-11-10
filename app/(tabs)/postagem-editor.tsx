import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { File, Paths } from "expo-file-system";
import { Palette, ThemePalette } from "@/constants/pallete";
import { PostagemRequest, usePostagemCreate } from "@/hooks/postagem/usePostagemCreate";
import { useUsuarioLogado } from "@/hooks/usuario/useUsuarioLogado";
import { PostagemEditRequest, usePostagemEdit } from "@/hooks/postagem/usePostagemEdit";
import { ScrambleRequest, useScramblePost } from "@/hooks/scramble/useScramblePost";
import { useScrambleEdit } from "@/hooks/scramble/useScrambleEdit";
import { useScrambleDelete } from "@/hooks/scramble/useScrambleDelete";
import PostagemProps from "../interface/PostagemProps";
import { api } from "../service/api";
import { UsuarioProps } from "../interface/UsuarioProps";


const PLACEHOLDERS = [
  "O que você resolveu hoje?",
  "Qual foi seu melhor solve de hoje?",
  "Compartilhe seu progresso no cubo!",
  "Qual algoritmo você aprendeu hoje?",
  "No que você está treinando hoje?",
];

/**
 * Usa o TwistyPlayer real em um WebView.
 * O script é carregado da CDN oficial do cubing.js.
 */
function htmlPreview3D(scramble: string, solution: string, c: ThemePalette) {
  const escapeAttr = (value: string) =>
    value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  return `<!DOCTYPE html>
  <html lang="pt-BR"><head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <style>
      html, body { margin: 0; padding: 0; background: ${c.cardBg}; overflow: hidden; }
      twisty-player { width: 100%; height: 230px; display: block; }
    </style>
    <script src="https://cdn.cubing.net/v0/js/cubing/twisty" type="module"></script>
  </head><body>
    <twisty-player puzzle="3x3x3" viewer-link="none" background="none"
      experimental-setup-alg="${escapeAttr(scramble)}"
      alg="${escapeAttr(solution)}"></twisty-player>
  </body></html>`;
}

/**
 * No React Native, o Spring precisa receber a parte `dados` com
 * Content-Type: application/json (e não um campo de texto simples).
 * Por isso o JSON é salvo em um arquivo temporário para o multipart.
 */
async function prepararMultipart(
  dados: PostagemRequest,
  imagem: ImagePicker.ImagePickerAsset | null,
) {
  const arquivoJson = new File(
    Paths.cache,
    `postagem-${Date.now()}-${Math.random().toString(36).slice(2)}.json`,
  );

  arquivoJson.create();
  await arquivoJson.write(JSON.stringify(dados));

  const formData = new FormData();
  formData.append("dados", {
    uri: arquivoJson.uri,
    name: "dados.json",
    type: "application/json",
  } as any);

  if (imagem) {
    const tipo = imagem.mimeType ?? "image/jpeg";
    const extensao = tipo === "image/png" ? "png" : tipo === "image/webp" ? "webp" : "jpg";

    formData.append("file", {
      uri: imagem.uri,
      name: imagem.fileName ?? `postagem.${extensao}`,
      type: tipo,
    } as any);
  }

  return { formData, arquivoJson };
}

export default function PostagemEditorScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams<{ idPostagem?: string }>();
  const idPostagem = params.idPostagem ? Number(params.idPostagem) : null;
  const isEditando = idPostagem !== null;
  const idValido = idPostagem !== null && Number.isInteger(idPostagem) && idPostagem > 0;

  const scheme = useColorScheme();
  const c = Palette[scheme === "dark" ? "dark" : "light"];
  const s = useMemo(() => makeStyles(c), [c]);

  const { data: usuario } = useUsuarioLogado();
  const criarPost = usePostagemCreate();
  const editarPost = usePostagemEdit();
  const criarScramble = useScramblePost();
  const editarScramble = useScrambleEdit();
  const excluirScramble = useScrambleDelete();

  // Se seu backend tiver outra rota para buscar uma postagem por ID, ajuste aqui.
  const {
    data: postagem,
    isLoading: carregandoPostagem,
    isError: erroPostagem,
    refetch: recarregarPostagem,
  } = useQuery<PostagemProps>({
    queryKey: ["postagem", idPostagem],
    queryFn: async () => {
      const { data } = await api.get<PostagemProps>(`/postagem/${idPostagem}`);
      return data;
    },
    enabled: idValido,
  });

  const [descricao, setDescricao] = useState("");
  const [imagem, setImagem] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [showScramble, setShowScramble] = useState(false);
  const [setupScramble, setSetupScramble] = useState("");
  const [solution, setSolution] = useState("");
  const [preview3D, setPreview3D] = useState<{ scramble: string; solution: string } | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [sugestoes, setSugestoes] = useState<UsuarioProps[]>([]);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const inputRef = useRef<TextInput>(null);
  const inicializadoId = useRef<string | null>(null);
  const [placeholder] = useState(
    () => PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)],
  );

  useEffect(() => {
    if (!postagem || inicializadoId.current === postagem.id) return;
    inicializadoId.current = postagem.id;
    const texto = postagem.descricao ?? "";
    setDescricao(texto);
    setSelection({ start: texto.length, end: texto.length });
    setShowScramble(Boolean(postagem.scramble?.id));
    setSetupScramble(postagem.scramble?.scramble ?? "");
    setSolution(postagem.scramble?.solution ?? "");
    if (postagem.scramble?.id) {
      setPreview3D({ scramble: postagem.scramble.scramble ?? "", solution: postagem.scramble.solution ?? "" });
    }
  }, [postagem]);

  const isAdmin = usuario?.tipo === "ADMIN" || usuario?.tipo === "CRIADOR";
  const podeAdicionarImagem = isAdmin && !isEditando;
  const temConteudo = Boolean(
    descricao.trim() || imagem || (showScramble && setupScramble.trim() && solution.trim()),
  );
  const podeSalvar = temConteudo && Boolean(usuario) && !salvando && (!isEditando || Boolean(postagem));

  // Identifica a palavra @username imediatamente antes do cursor.
  const termoMencao = useMemo(() => {
    const antes = descricao.slice(0, selection.start);
    const match = antes.match(/(?:^|\s)@([a-zA-Z0-9_]*)$/);
    return match?.[1] ?? null;
  }, [descricao, selection.start]);

  useEffect(() => {
    if (!termoMencao?.length) {
      setSugestoes([]);
      return;
    }

    let ativo = true;
    const timer = setTimeout(async () => {
      try {
        const { data } = await api.get<UsuarioProps[]>("/usuarios/busca", {
          params: { username: termoMencao },
        });
        if (ativo) setSugestoes(Array.isArray(data) ? data.slice(0, 6) : []);
      } catch {
        if (ativo) setSugestoes([]);
      }
    }, 300);

    return () => {
      ativo = false;
      clearTimeout(timer);
    };
  }, [termoMencao]);

  function selecionarMencao(pessoa: UsuarioProps) {
    if (!pessoa.username) return;
    const antes = descricao.slice(0, selection.start);
    const match = antes.match(/@([a-zA-Z0-9_]*)$/);
    if (!match) return;

    const inicio = selection.start - match[0].length;
    const insercao = `@${pessoa.username} `;
    const texto = descricao.slice(0, inicio) + insercao + descricao.slice(selection.end);
    const cursor = inicio + insercao.length;

    setDescricao(texto);
    setSelection({ start: cursor, end: cursor });
    setSugestoes([]);
    inputRef.current?.focus();
  }

  async function escolherImagem() {
    try {
      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 0.85,
      });
      if (!resultado.canceled && resultado.assets.length > 0) {
        setImagem(resultado.assets[0]);
      }
    } catch {
      Alert.alert("Não foi possível abrir a galeria", "Tente novamente.");
    }
  }

  function removerScramble() {
    setShowScramble(false);
    setSetupScramble("");
    setSolution("");
    setPreview3D(null);
  }

  async function salvar() {
    if (!usuario || !podeSalvar) return;

    if (showScramble && (!setupScramble.trim() || !solution.trim())) {
      Alert.alert("Scramble incompleto", "Preencha o embaralhamento e a solução, ou remova o scramble.");
      return;
    }

    setSalvando(true);
    let novoScrambleId: string | undefined | null = null;
    let postagemSalva = false;

    try {
      let idScramble: number | undefined | string;

      if (showScramble) {
        const dadosScramble: ScrambleRequest = {
          scramble: setupScramble.trim(),
          solution: solution.trim(),
        };

        if (isEditando && postagem?.scramble?.id) {
          const atualizado = await editarScramble.mutateAsync({
            idScramble: postagem.scramble.id,
            ...dadosScramble,
          });
          idScramble = atualizado?.id ?? postagem.scramble.id;
        } else {
          const criado = await criarScramble.mutateAsync(dadosScramble);
          idScramble = criado.id;
          novoScrambleId = criado.id;
        }
      }

      if (isEditando && postagem) {
        const dados: PostagemEditRequest = {
          idPostagem: postagem.id,
          idUsuario: usuario.id,
          descricao: descricao.trim(),
          // Sem idScramble: o backend deve desvincular o scramble antigo.
          ...(idScramble !== undefined ? { idScramble } : {}),
        };

        await editarPost.mutateAsync(dados);
        postagemSalva = true;

        // Exclui somente após a edição ter sido concluída.
        if (!showScramble && postagem.scramble?.id) {
          try {
            await excluirScramble.mutateAsync(postagem.scramble.id);
          } catch {
            Alert.alert("Publicação atualizada", "O scramble antigo não pôde ser excluído. Verifique o backend.");
          }
        }
      } else {
        const dados: PostagemRequest = {
          idUsuario: usuario.id,
          descricao: descricao.trim(),
          ...(idScramble !== undefined ? { idScramble } : {}),
        };

        const { formData, arquivoJson } = await prepararMultipart(dados, imagem);
        try {
          await criarPost.mutateAsync(formData);
          postagemSalva = true;
        } finally {
          try {
            arquivoJson.delete();
          } catch {
            // Um arquivo temporário não deve impedir o salvamento.
          }
        }
      }

      void queryClient.invalidateQueries({ queryKey: ["postagem-data"] });
      if (idPostagem) {
        void queryClient.invalidateQueries({ queryKey: ["postagem", idPostagem] });
      }
      router.back();
    } catch (erro) {
      // Evita deixar scramble órfão caso a criação da postagem falhe.
      if (!postagemSalva && novoScrambleId !== null) {
        try {
          await excluirScramble.mutateAsync(novoScrambleId);
        } catch {
          // Uma limpeza definitiva deve ser tratada também no backend.
        }
      }
      console.error("Erro ao salvar a publicação:", erro);
      Alert.alert("Erro ao salvar", "Não foi possível salvar a publicação. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  if (isEditando && (carregandoPostagem || erroPostagem || !idValido || !postagem)) {
    return (
      <SafeAreaView style={s.screen}>
        <View style={s.center}>
          {carregandoPostagem ? (
            <ActivityIndicator size="large" color={c.accent} />
          ) : (
            <>
              <Ionicons name="alert-circle-outline" size={36} color={c.error} />
              <Text style={s.title}>Não foi possível carregar a publicação</Text>
              <Pressable onPress={() => void recarregarPostagem()} style={s.smallButton}>
                <Text style={s.smallButtonText}>Tentar novamente</Text>
              </Pressable>
              <Pressable onPress={() => router.back()}>
                <Text style={s.muted}>Voltar</Text>
              </Pressable>
            </>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={s.screen}>
      <KeyboardAvoidingView
        style={s.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={s.header}>{isEditando && 
          <Pressable style={s.backButton} onPress={() => router.back()} hitSlop={10}>
            <Ionicons name="arrow-back" size={22} color={c.textPrimary} />
          </Pressable>}
          <View style={s.headerTitleBlock}>
            <Text style={s.title}>{isEditando ? "Editar publicação" : "Nova publicação"}</Text>
          </View>
          <View style={s.headerBadge}>
            <Ionicons name="earth-outline" size={14} color={c.textSecondary} />
            <Text style={s.headerBadgeText}>Público</Text>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={s.scrollContent}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="interactive"
          showsVerticalScrollIndicator={false}
        >
          <View style={s.authorRow}>
            {usuario?.picture ? (
              <Image source={{ uri: usuario.picture }} style={s.avatar} />
            ) : (
              <View style={s.avatarFallback}>
                <Text style={s.avatarFallbackText}>{usuario?.nome?.charAt(0).toUpperCase() ?? "U"}</Text>
              </View>
            )}
            <View style={s.flex}>
              <Text style={s.authorName}>{usuario?.nome ?? "Carregando usuário..."}</Text>
              <Text style={s.authorHint}>Compartilhe uma conquista com a comunidade</Text>
            </View>
          </View>

          <View style={s.editorCard}>
            <TextInput
              ref={inputRef}
              style={s.descriptionInput}
              value={descricao}
              onChangeText={setDescricao}
              onSelectionChange={(event) => setSelection(event.nativeEvent.selection)}
              selection={selection}
              placeholder={placeholder}
              placeholderTextColor={c.textMuted}
              multiline
              textAlignVertical="top"
              autoCapitalize="sentences"
              scrollEnabled={false}
              accessibilityLabel="Descrição da publicação"
            />
            <View style={s.editorFooter}>
              <View style={s.rowSmall}>
                <Ionicons name="at-outline" size={15} color={c.textMuted} />
                <Text style={s.muted}>Mencione pessoas com @</Text>
              </View>
              <Text style={s.muted}>{descricao.length} caracteres</Text>
            </View>
          </View>

          {termoMencao !== null && sugestoes.length > 0 && (
            <View style={s.suggestions}>
              <Text style={s.suggestionHeading}>Pessoas</Text>
              {sugestoes.map((pessoa) => (
                <Pressable
                  key={String(pessoa.id)}
                  style={s.suggestionItem}
                  onPress={() => selecionarMencao(pessoa)}
                >
                  <View style={s.suggestionAvatar}>
                    <Text style={s.suggestionAvatarText}>{pessoa.nome?.charAt(0).toUpperCase() ?? "@"}</Text>
                  </View>
                  <View style={s.flex}>
                    <Text style={s.suggestionName}>{pessoa.nome}</Text>
                    <Text style={s.muted}>@{pessoa.username ?? "sem-username"}</Text>
                  </View>
                </Pressable>
              ))}
            </View>
          )}

          {imagem && (
            <View style={s.photoCard}>
              <Image source={{ uri: imagem.uri }} style={s.photo} resizeMode="cover" />
              <Pressable style={s.removePhoto} onPress={() => setImagem(null)} hitSlop={8}>
                <Ionicons name="close" size={18} color={c.textPrimary} />
              </Pressable>
              <View style={s.photoCaption}>
                <Ionicons name="image-outline" size={16} color={c.textSecondary} />
                <Text style={s.captionText}>Imagem anexada</Text>
              </View>
            </View>
          )}

          {showScramble && (
            <View style={s.scrambleCard}>
              <View style={s.scrambleHeader}>
                <View style={s.cubeIconBox}>
                  <Ionicons name="cube-outline" size={24} color={c.accent} />
                </View>
                <View style={s.flex}>
                  <Text style={s.cardTitle}>Scramble 3×3×3</Text>
                  <Text style={s.muted}>Mostre como resolveu o cubo</Text>
                </View>
                <Pressable onPress={removerScramble} style={s.removeIconButton} hitSlop={8}>
                  <Ionicons name="close" size={20} color={c.textSecondary} />
                </Pressable>
              </View>
              <View style={s.fieldBlock}>
                <Text style={s.fieldLabel}>Embaralhamento</Text>
                <TextInput
                  style={s.fieldInput}
                  value={setupScramble}
                  onChangeText={setSetupScramble}
                  placeholder="R U R' U' F2 ..."
                  placeholderTextColor={c.textMuted}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  multiline
                  accessibilityLabel="Embaralhamento do cubo"
                />
              </View>
              <View style={s.fieldBlock}>
                <Text style={s.fieldLabel}>Solução</Text>
                <TextInput
                  style={[s.fieldInput, s.solutionInput]}
                  value={solution}
                  onChangeText={setSolution}
                  placeholder="Digite os movimentos da solução..."
                  placeholderTextColor={c.textMuted}
                  autoCapitalize="characters"
                  autoCorrect={false}
                  multiline
                  accessibilityLabel="Solução do cubo"
                />
              </View>
              <Pressable
                onPress={() => setPreview3D({ scramble: setupScramble, solution })}
                style={s.previewButton}
              >
                <Ionicons name="eye-outline" size={18} color={c.accent} />
                <Text style={s.previewButtonText}>Visualizar cubo em 3D</Text>
              </Pressable>
              {preview3D && (
                <View style={s.previewFrame}>
                  <WebView
                    key={`${preview3D.scramble}|${preview3D.solution}`}
                    originWhitelist={["*"]}
                    source={{
                      html: htmlPreview3D(preview3D.scramble, preview3D.solution, c),
                      baseUrl: "https://cdn.cubing.net/",
                    }}
                    style={s.cubeWebView}
                    scrollEnabled={false}
                    javaScriptEnabled
                  />
                </View>
              )}
              <View style={s.scrambleNote}>
                <Ionicons name="information-circle-outline" size={17} color={c.textSecondary} />
                <Text style={s.noteText}>A solução e o embaralhamento serão anexados à publicação.</Text>
              </View>
            </View>
          )}

          <View style={s.tipRow}>
            <Ionicons name="sparkles-outline" size={18} color={c.accent} />
            <Text style={s.tipText}>
              Uma boa publicação pode ter seu tempo, um algoritmo, uma foto ou uma conquista pessoal.
            </Text>
          </View>
        </ScrollView>

        <View style={s.bottomBar}>
          <View style={s.toolRow}>
            <Pressable
              onPress={() => (showScramble ? removerScramble() : setShowScramble(true))}
              style={[s.toolButton, showScramble && s.toolButtonActive]}
              accessibilityLabel={showScramble ? "Remover scramble" : "Adicionar scramble"}
            >
              <Ionicons name="cube-outline" size={23} color={showScramble ? c.accent : c.textSecondary} />
            </Pressable>
            {podeAdicionarImagem && (
              <Pressable
                onPress={() => void escolherImagem()}
                style={[s.toolButton, imagem && s.toolButtonActive]}
                accessibilityLabel="Adicionar imagem"
              >
                <Ionicons name="image-outline" size={23} color={imagem ? c.accent : c.textSecondary} />
              </Pressable>
            )}
          </View>
          <Pressable
            disabled={!podeSalvar}
            onPress={() => void salvar()}
            style={[s.publishButton, !podeSalvar && s.publishButtonDisabled]}
          >
            {salvando ? (
              <ActivityIndicator color={c.accentText} size="small" />
            ) : (
              <Ionicons name={isEditando ? "checkmark" : "send"} size={18} color={c.accentText} />
            )}
            <Text style={s.publishText}>
              {salvando ? "Salvando..." : isEditando ? "Salvar" : "Publicar"}
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const makeStyles = (c: ThemePalette) =>
  StyleSheet.create({
    flex: { flex: 1 },
    screen: { flex: 1, backgroundColor: c.bgPrimary },
    center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 25, gap: 16 },
    header: {
      flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 13,
      borderBottomWidth: 1, borderBottomColor: c.borderLight, backgroundColor: c.bgPrimary, gap: 12,
    },
    backButton: { width: 38, height: 38, alignItems: "center", justifyContent: "center", borderRadius: 19, backgroundColor: c.bgSecondary },
    headerTitleBlock: { flex: 1, gap: 2 },
    title: { color: c.textPrimary, fontWeight: "700", fontSize: 28 },
    subtitle: { color: c.textMuted, fontSize: 12 },
    headerBadge: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 16, backgroundColor: c.bgSecondary },
    headerBadgeText: { color: c.textSecondary, fontWeight: "600", fontSize: 12 },
    scrollContent: { padding: 16, paddingBottom: 40, gap: 17 },
    authorRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingTop: 5 },
    avatar: { width: 48, height: 48, borderRadius: 24 },
    avatarFallback: { width: 48, height: 48, borderRadius: 24, backgroundColor: c.accent, alignItems: "center", justifyContent: "center" },
    avatarFallbackText: { color: c.accentText, fontWeight: "800", fontSize: 21 },
    authorName: { color: c.textPrimary, fontWeight: "700", fontSize: 16 },
    authorHint: { color: c.textSecondary, fontSize: 12, marginTop: 4 },
    editorCard: { backgroundColor: c.cardBg, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: c.borderColor },
    descriptionInput: { minHeight: 180, fontSize: 17, lineHeight: 26, color: c.textPrimary, padding: 0 },
    editorFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderTopColor: c.borderLight, paddingTop: 13, gap: 8 },
    rowSmall: { flexDirection: "row", alignItems: "center", gap: 5 },
    muted: { color: c.textMuted, fontSize: 12 },
    suggestions: { backgroundColor: c.cardBg, borderWidth: 1, borderColor: c.borderColor, borderRadius: 16, padding: 8, gap: 3 },
    suggestionHeading: { color: c.textSecondary, fontSize: 12, fontWeight: "700", paddingHorizontal: 8, paddingVertical: 6 },
    suggestionItem: { flexDirection: "row", alignItems: "center", padding: 8, gap: 10, borderRadius: 10 },
    suggestionAvatar: { width: 35, height: 35, borderRadius: 18, backgroundColor: c.bgTertiary, alignItems: "center", justifyContent: "center" },
    suggestionAvatarText: { color: c.textPrimary, fontWeight: "700" },
    suggestionName: { color: c.textPrimary, fontWeight: "600", fontSize: 14 },
    photoCard: { backgroundColor: c.cardBg, borderWidth: 1, borderColor: c.borderColor, borderRadius: 20, padding: 9, overflow: "hidden" },
    photo: { width: "100%", height: 235, borderRadius: 13, backgroundColor: c.bgTertiary },
    removePhoto: { position: "absolute", right: 18, top: 18, height: 32, width: 32, borderRadius: 16, backgroundColor: c.cardBg, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: c.borderColor },
    photoCaption: { flexDirection: "row", alignItems: "center", gap: 7, paddingHorizontal: 6, paddingTop: 12, paddingBottom: 5 },
    captionText: { color: c.textSecondary, fontSize: 13 },
    scrambleCard: { backgroundColor: c.cardBg, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: c.borderColor, gap: 16 },
    scrambleHeader: { flexDirection: "row", alignItems: "center", gap: 11 },
    cubeIconBox: { backgroundColor: c.bgTertiary, width: 45, height: 45, borderRadius: 13, alignItems: "center", justifyContent: "center" },
    cardTitle: { color: c.textPrimary, fontWeight: "700", fontSize: 15, marginBottom: 3 },
    removeIconButton: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: c.bgSecondary },
    fieldBlock: { gap: 7 },
    fieldLabel: { color: c.textPrimary, fontWeight: "600", fontSize: 13 },
    fieldInput: { backgroundColor: c.inputBg, borderColor: c.borderColor, borderWidth: 1, borderRadius: 12, paddingHorizontal: 13, paddingVertical: 12, fontSize: 14, color: c.textPrimary, minHeight: 50 },
    solutionInput: { minHeight: 73, textAlignVertical: "top" },
    previewButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 12, gap: 8, backgroundColor: c.bgSecondary, borderWidth: 1, borderColor: c.borderColor, borderRadius: 12 },
    previewButtonText: { color: c.accent, fontWeight: "700", fontSize: 13 },
    previewFrame: { overflow: "hidden", borderRadius: 14, borderColor: c.borderLight, borderWidth: 1, height: 240 },
    cubeWebView: { flex: 1, backgroundColor: c.cardBg },
    scrambleNote: { flexDirection: "row", alignItems: "center", gap: 7, backgroundColor: c.bgSecondary, borderRadius: 10, padding: 11 },
    noteText: { color: c.textSecondary, fontSize: 12, lineHeight: 17, flex: 1 },
    tipRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, paddingHorizontal: 6, paddingTop: 3 },
    tipText: { color: c.textSecondary, fontSize: 12, lineHeight: 18, flex: 1 },
    bottomBar: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, borderTopColor: c.borderColor, borderTopWidth: 1, backgroundColor: c.cardBg, gap: 12 },
    toolRow: { flexDirection: "row", alignItems: "center", gap: 7, flex: 1 },
    toolButton: { width: 46, height: 46, borderRadius: 14, borderWidth: 1, borderColor: c.borderColor, backgroundColor: c.bgSecondary, alignItems: "center", justifyContent: "center" },
    toolButtonActive: { borderColor: c.accent, backgroundColor: c.bgTertiary },
    publishButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: c.accent, borderRadius: 14, minWidth: 128, height: 46, paddingHorizontal: 19 },
    publishButtonDisabled: { backgroundColor: c.accentDisabled },
    publishText: { color: c.accentText, fontSize: 15, fontWeight: "700" },
    smallButton: { backgroundColor: c.accent, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 18 },
    smallButtonText: { color: c.accentText, fontWeight: "700" },
  });
