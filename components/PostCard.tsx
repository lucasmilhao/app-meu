import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { useEffect, useMemo, useState } from "react";
import { Alert, Platform, Pressable, Share, StyleSheet, Text, useColorScheme, View } from "react-native";

import type PostagemProps from "@/app/interface/PostagemProps";
import { useUsuarioLogado } from "@/hooks/usuario/useUsuarioLogado";
import { usePostagemDelete } from "@/hooks/postagem/usePostagemDelete";
import { DenunciaRequest, useDenunciaCreate } from "@/hooks/postagem/useDenunciaCreate";
import { CurtidaRequest, useCurtidaCreate } from "@/hooks/curtida/useCurtidaCreate";
import { useIsCurtido } from "@/hooks/curtida/useIsCurtido";
import useScrambleSvg from "@/hooks/scramble/useScrambleSvg";
import { SvgXml } from "react-native-svg";
import { Palette, ThemePalette } from "@/constants/pallete";
import { router } from "expo-router";

// Troque pelo endereço do seu front web: é o link que vai no "Compartilhar".
const WEB_URL = "https://cubing2gether-2aen.onrender.com";

// Espelha as variáveis CSS do web. Ajuste o accent para o do seu projeto.
const COLORS = {
  text: "#e7e9ea",
  muted: "#71767b",
  border: "#2f3336",
  surface: "#16181c",
};

type PostCardProps = {
  postagem: PostagemProps;
  /** Equivale ao "post-card-destacado" do web (ex.: post aberto por link). */
  destacado?: boolean;
  onPressUsuario?: (username: string) => void;
  onPressComentarios?: (postagem: PostagemProps) => void;
  onPressEditar?: (postagem: PostagemProps) => void;
};

export function PostCard({
  postagem,
  destacado = false,
  onPressUsuario,
  onPressComentarios,
  onPressEditar,
}: PostCardProps) {
  const { data: usuarioLogado } = useUsuarioLogado();
  const { mutate: deletar } = usePostagemDelete();
  const { mutate: denunciar } = useDenunciaCreate();
  const curtida = useCurtidaCreate();
  const { data: isCurtido } = useIsCurtido(postagem.id);


  const colors = Palette[useColorScheme() === "dark" ? "dark" : "light"];
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const svgFinal = (postagem?.scramble?.svg ?? "")
    .replace(/\\u003C/g, "<")
    .replace(/\\u003E/g, ">")
    .replace(/\\"/g, '"')
    .replace(/\\n/g, "");


  const [aspectRatio, setAspectRatio] = useState(16 / 9);

  const { usuario } = postagem;
  const ehDono = usuarioLogado?.id === usuario.id;
  const tempoRelativo = formatarTempoRelativo(postagem.createdAt);

  const abrirUsuario = () => {
    if (usuario.username) onPressUsuario?.(usuario.username);
  };

  const toggleCurtir = () => {
    const props: CurtidaRequest = {
      idPostagem: postagem.id,
      idUsuario: usuarioLogado?.id,
    };

    curtida.mutate(props);
  };

  const denuncia = () => {
    const props: DenunciaRequest = {
      idPostagem: postagem.id,
      idUsuario: usuario.id,
    };

    denunciar(props, {
      onSuccess: () => Alert.alert("Denúncia enviada", "Obrigado por avisar."),
    });
  };

  const confirmarExclusao = () => {
    Alert.alert("Excluir postagem", "Essa ação não pode ser desfeita.", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: () => deletar(postagem.id) },
    ]);
  };

  const abrirMenu = () => {
    if (ehDono) {
      Alert.alert("Opções", undefined, [
        { text: "Editar", onPress: () => onPressEditar?.(postagem) },
        { text: "Excluir", style: "destructive", onPress: confirmarExclusao },
        { text: "Cancelar", style: "cancel" },
      ]);
      return;
    }

    Alert.alert("Opções", undefined, [
      { text: "Denunciar", style: "destructive", onPress: denuncia },
      { text: "Cancelar", style: "cancel" },
    ]);
  };

  const compartilhar = async () => {
    const link = `${WEB_URL}/user/${usuario.username}#post-${postagem.id}`;
    await Share.share({ message: link });
  };

  const renderizarTexto = (texto: string) =>
    texto.split(/(@[a-zA-Z0-9_]+)/g).map((parte, index) => {
      if (/^@[a-zA-Z0-9_]+$/.test(parte)) {
        return (
          <Text
            key={`${parte}-${index}`}
            style={styles.mention}
            onPress={() => router.push({
                pathname: "/(screens)/user-profile",
                params: {
                  username: parte.slice(1),
                },
              })}
          >
            {parte}
          </Text>
        );
      }
      

      return parte;
    });

  return (
    <View style={[styles.card, destacado && styles.cardDestacado]}>
      <Pressable onPress={abrirUsuario}>
        {usuario.picture ? (
          <Image source={{ uri: usuario.picture }} style={styles.avatar} contentFit="cover" />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarLetra}>{usuario.nome?.[0] ?? "U"}</Text>
          </View>
        )}
      </Pressable>

      <View style={styles.main}>
        <View style={styles.header}>
          <Pressable onPress={abrirUsuario} style={styles.userProps}>
            <Text style={styles.nome} numberOfLines={1}>
              {usuario.nome}
            </Text>
            {usuario.username ? (
              <Text style={styles.muted} numberOfLines={1}>
                @{usuario.username}
              </Text>
            ) : null}
            <Text style={styles.muted}>· {tempoRelativo}</Text>
          </Pressable>

          <Pressable onPress={abrirMenu} hitSlop={12}>
            <Ionicons name="ellipsis-horizontal" size={16} color={COLORS.muted} />
          </Pressable>
        </View>

        {postagem.descricao ? (
          <Text style={styles.descricao}>{renderizarTexto(postagem.descricao)}</Text>
        ) : null}

        {postagem.caminhoImagem ? (
          <Image
            source={{ uri: postagem.caminhoImagem }}
            style={[styles.imagem, { aspectRatio }]}
            contentFit="cover"
            onLoad={(event) => {
              const { width, height } = event.source;
              if (width && height) {
                // limita a altura para imagens muito altas ou muito largas
                setAspectRatio(Math.min(Math.max(width / height, 0.75), 2));
              }
            }}
          />
        ) : null}

        {/* {postagem.scramble} */}
        {postagem.scramble ? (
          <View style={styles.scramble}>
            {svgFinal && (
              <View style={styles.scrambleSvg}>
                <SvgXml
                  xml={svgFinal}
                  width="100%"
                  height="180"
                />
              </View>
            )}

            <InfoLinha
              styles={styles}
              label="Scramble"
              value={postagem.scramble.scramble}
            />

            <InfoLinha
              styles={styles}
              label="Solução"
              value={postagem.scramble.solution}
            />
          </View>
        ) : null}

        <View style={styles.actions}>
          <Pressable
            style={styles.action}
            onPress={() => onPressComentarios?.(postagem)}
            hitSlop={8}
          >
            <Ionicons name="chatbubble-outline" size={18} color={COLORS.muted} />
            <Text style={styles.actionText}>{postagem.comentarios?.length ?? 0}</Text>
          </Pressable>

          <Pressable
            style={styles.action}
            onPress={toggleCurtir}
            disabled={curtida.isPending}
            hitSlop={8}
          >
            <Ionicons
              name={isCurtido ? "heart" : "heart-outline"}
              size={18}
              color={isCurtido ? colors.accent : COLORS.muted}
            />
            <Text style={[styles.actionText, isCurtido && { color: colors.accent }]}>
              {postagem.curtidas}
            </Text>
          </Pressable>

          <Pressable style={styles.action} onPress={compartilhar} hitSlop={8}>
            <Ionicons name="share-outline" size={18} color={COLORS.muted} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function InfoLinha({ styles, label, value }: { styles: any, label: string; value: string }) {
  return (
    <View style={styles.infoLinha}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export function formatarTempoRelativo(dataISO: string) {
  const data = new Date(dataISO);
  const diffMs = Date.now() - data.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "agora";
  if (diffMin < 60) return `${diffMin}min`;
  const diffHoras = Math.floor(diffMin / 60);
  if (diffHoras < 24) return `${diffHoras}h`;
  const diffDias = Math.floor(diffHoras / 24);
  if (diffDias < 7) return `${diffDias}d`;
  return data.toLocaleDateString("pt-BR");
}

const makeStyles = (c: ThemePalette) =>
  StyleSheet.create({
    card: {
      flexDirection: "row",
      gap: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: c.borderColor,
    },
    cardDestacado: { backgroundColor: c.cardBg },
    avatar: { width: 44, height: 44, borderRadius: 22 },
    avatarPlaceholder: {
      backgroundColor: c.borderColor,
      alignItems: "center",
      justifyContent: "center",
    },
    avatarLetra: { color: c.textPrimary, fontWeight: "600" },
    main: { flex: 1, minWidth: 0, gap: 4 },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8,
    },
    userProps: {
      flex: 1,
      flexDirection: "row",
      alignItems: "baseline",
      gap: 4,
    },
    nome: {
      flexShrink: 1,
      color: c.textPrimary,
      fontSize: 14,
      fontWeight: "700",
    },
    muted: { flexShrink: 1, color: c.textSecondary, fontSize: 14 },
    descricao: { color: c.textPrimary, fontSize: 15, lineHeight: 21 },
    mention: { color: c.accent, fontWeight: "600" },
    imagem: { width: "100%", marginTop: 8, borderRadius: 12 },
    scramble: {
      marginTop: 4,
      gap: 10,
      padding: 12,
      borderWidth: 1,
      borderColor: c.borderColor,
      borderRadius: 16,
      backgroundColor: c.cardBg,
    },
    scrambleSvg: {
      width: "100%",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 8,
    },
    infoLinha: { gap: 2 },
    infoLabel: {
      color: c.textPrimary,
      fontSize: 11,
      textTransform: "uppercase",
      letterSpacing: 0.4,
    },
    infoValue: {
      color: c.textSecondary,
      fontSize: 13,
      fontFamily: Platform.select({ ios: "Menlo", default: "monospace" }),
    },
    actions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 28,
      marginTop: 6,
    },
    action: { flexDirection: "row", alignItems: "center", gap: 6 },
    actionText: { color: c.textSecondary, fontSize: 13 },
  });