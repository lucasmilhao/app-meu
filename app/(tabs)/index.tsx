import { FlatList, StyleSheet, Text, View, ActivityIndicator, useColorScheme } from 'react-native';
import { PostCard } from '@/components/PostCard';
import { usePostagemData } from '@/hooks/postagem/usePostagemData';
import PostagemProps from '../interface/PostagemProps';
import { useRouter } from 'expo-router';
import { Palette, ThemePalette } from '@/constants/pallete';
import { useMemo } from 'react';

export default function HomeScreen() {
  const { data: postagens, isPending, isError, error } = usePostagemData();
  const router = useRouter();

  
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
    <View style={styles.container}>
      <FlatList
        data={postagens ?? []}
        keyExtractor={(postagem) => String(postagem.id)}
        renderItem={({ item }) => (
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
          />
        )}
        ListEmptyComponent={
          <Text>Nenhuma postagem encontrada.</Text>
        }
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
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