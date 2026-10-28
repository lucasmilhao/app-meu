import { FlatList, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { PostCard } from '@/components/PostCard';
import { usePostagemData } from '@/hooks/postagem/usePostagemData';

export default function HomeScreen() {
  const { data: postagens, isPending, isError, error } = usePostagemData();

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
            onPressUsuario={(usuario) => {
              console.log('Usuário pressionado:', usuario);
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070303',
  },
  listContent: {
    flexGrow: 1,
    padding: 16,
  },
});