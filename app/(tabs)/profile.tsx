import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Colors, Fonts } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Profile() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.profileInfo} className='profile-info'>
          <View style={styles.infoContainer}>
            <Image style={styles.image} source={require("../../assets/images/profile.jpg")} />
            <Text style={styles.mainText}>Lucas</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.text}>Média</Text>
            <Text style={styles.mainText}>23.12s</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.text}>Seguidores</Text>
            <Text style={styles.mainText}>41</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.text}>Seguindo</Text>
            <Text style={styles.mainText}>162</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  text: {
    color: Colors.dark.text,
    fontSize: 15,
  },
  mainText: {
    fontWeight: 'bold',
    color: Colors.dark.text,
    fontSize: 25,
  },
  profileInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50
  },
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  infoContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }
})