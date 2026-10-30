import { FlatList, StyleSheet, Text, View, ActivityIndicator, useColorScheme, type ListRenderItem } from 'react-native';
import { PostCard } from '@/components/PostCard';
import { usePostagemData } from '@/hooks/postagem/usePostagemData';
import PostagemProps from '../interface/PostagemProps';
import { useRouter } from 'expo-router';
import { Palette, ThemePalette } from '@/constants/pallete';
import { useCallback, useMemo, useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { CommentModal } from '@/components/CommentModal';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const { data: postagens, isPending, isError, error } = usePostagemData();
  const router = useRouter();
  const [postagem, setPostagem] = useState<PostagemProps>();
  const [isComentariosOpen, setIsComentariosOpen] = useState(false);

  const colors = Palette[useColorScheme() === "dark" ? "dark" : "light"];
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const renderPostagem = useCallback<ListRenderItem<PostagemProps>>(({ item }) => (
    <PostCard
      postagem={item}
      onPressUsuario={() => {
        router.push({
          pathname: "/(screens)/user-profile",
          params: {
            username: item.usuario.username,
          },
        });
      }}

      onPressComentarios={(postagem) => {
        setIsComentariosOpen(true);
        setPostagem(postagem);
      }}
    />
  ), [router]);


  if (isPending) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Postagens</Text>
        </View>

        <View style={styles.stateContainer}>
          <View style={styles.iconContainer}>
            <ActivityIndicator size="large" color={colors.accent} />
          </View>

          <Text style={styles.stateTitle}>
            Carregando postagens
          </Text>

          <Text style={styles.stateDescription}>
            Estamos buscando as postagens mais recentes...
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
      {isComentariosOpen && <CommentModal comentarios={postagem?.comentarios} idPostagem={postagem?.id} idUsuario={postagem?.usuario.id} onClose={() => setIsComentariosOpen(false)} visible={isComentariosOpen}/>}

      <FlatList
        data={postagens ?? []}
        keyExtractor={(postagem) => String(postagem.id)}
        renderItem={renderPostagem}
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
          (!postagens || postagens.length === 0) && styles.emptyList,
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
