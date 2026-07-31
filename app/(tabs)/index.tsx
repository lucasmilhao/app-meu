import { Image } from 'expo-image';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import {SvgXml} from "react-native-svg";

export default function HomeScreen() {

  const svgEscapado = "\u003Csvg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 130 98\" width=\"130px\" version=\"1.1\" height=\"98px\"\u003E\n\t\u003Cg transform=\"matrix(1.0,0.0,0.0,1.0,0.5,0.5)\"\u003E\n\t\t\u003Crect x=\"2.0\" width=\"10.0\" y=\"34.0\" fill=\"#0000ff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"12.0\" width=\"10.0\" y=\"34.0\" fill=\"#ff0000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"22.0\" width=\"10.0\" y=\"34.0\" fill=\"#0000ff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"2.0\" width=\"10.0\" y=\"44.0\" fill=\"#ffffff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"12.0\" width=\"10.0\" y=\"44.0\" fill=\"#ff8000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"22.0\" width=\"10.0\" y=\"44.0\" fill=\"#ffff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"2.0\" width=\"10.0\" y=\"54.0\" fill=\"#00ff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"12.0\" width=\"10.0\" y=\"54.0\" fill=\"#ff0000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"22.0\" width=\"10.0\" y=\"54.0\" fill=\"#ff0000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"34.0\" width=\"10.0\" y=\"66.0\" fill=\"#ffff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"44.0\" width=\"10.0\" y=\"66.0\" fill=\"#ff8000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"54.0\" width=\"10.0\" y=\"66.0\" fill=\"#0000ff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"34.0\" width=\"10.0\" y=\"76.0\" fill=\"#ffffff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"44.0\" width=\"10.0\" y=\"76.0\" fill=\"#ffff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"54.0\" width=\"10.0\" y=\"76.0\" fill=\"#ff0000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"34.0\" width=\"10.0\" y=\"86.0\" fill=\"#ff8000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"44.0\" width=\"10.0\" y=\"86.0\" fill=\"#ffffff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"54.0\" width=\"10.0\" y=\"86.0\" fill=\"#00ff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"98.0\" width=\"10.0\" y=\"34.0\" fill=\"#ffff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"108.0\" width=\"10.0\" y=\"34.0\" fill=\"#ffffff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"118.0\" width=\"10.0\" y=\"34.0\" fill=\"#ffffff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"98.0\" width=\"10.0\" y=\"44.0\" fill=\"#ffff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"108.0\" width=\"10.0\" y=\"44.0\" fill=\"#0000ff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"118.0\" width=\"10.0\" y=\"44.0\" fill=\"#00ff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"98.0\" width=\"10.0\" y=\"54.0\" fill=\"#ff0000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"108.0\" width=\"10.0\" y=\"54.0\" fill=\"#ff8000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"118.0\" width=\"10.0\" y=\"54.0\" fill=\"#ffffff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"66.0\" width=\"10.0\" y=\"34.0\" fill=\"#ffff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"76.0\" width=\"10.0\" y=\"34.0\" fill=\"#ff8000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"86.0\" width=\"10.0\" y=\"34.0\" fill=\"#00ff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"66.0\" width=\"10.0\" y=\"44.0\" fill=\"#ffff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"76.0\" width=\"10.0\" y=\"44.0\" fill=\"#ff0000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"86.0\" width=\"10.0\" y=\"44.0\" fill=\"#ff8000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"66.0\" width=\"10.0\" y=\"54.0\" fill=\"#ffffff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"76.0\" width=\"10.0\" y=\"54.0\" fill=\"#ffff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"86.0\" width=\"10.0\" y=\"54.0\" fill=\"#ffffff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"34.0\" width=\"10.0\" y=\"2.0\" fill=\"#ff8000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"44.0\" width=\"10.0\" y=\"2.0\" fill=\"#0000ff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"54.0\" width=\"10.0\" y=\"2.0\" fill=\"#ff0000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"34.0\" width=\"10.0\" y=\"12.0\" fill=\"#00ff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"44.0\" width=\"10.0\" y=\"12.0\" fill=\"#ffffff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"54.0\" width=\"10.0\" y=\"12.0\" fill=\"#00ff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"34.0\" width=\"10.0\" y=\"22.0\" fill=\"#ff8000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"44.0\" width=\"10.0\" y=\"22.0\" fill=\"#0000ff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"54.0\" width=\"10.0\" y=\"22.0\" fill=\"#00ff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"34.0\" width=\"10.0\" y=\"34.0\" fill=\"#ffff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"44.0\" width=\"10.0\" y=\"34.0\" fill=\"#ff0000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"54.0\" width=\"10.0\" y=\"34.0\" fill=\"#ff8000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"34.0\" width=\"10.0\" y=\"44.0\" fill=\"#00ff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"44.0\" width=\"10.0\" y=\"44.0\" fill=\"#00ff00\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"54.0\" width=\"10.0\" y=\"44.0\" fill=\"#0000ff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"34.0\" width=\"10.0\" y=\"54.0\" fill=\"#0000ff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"44.0\" width=\"10.0\" y=\"54.0\" fill=\"#0000ff\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\t\u003Crect x=\"54.0\" width=\"10.0\" y=\"54.0\" fill=\"#ff0000\" stroke=\"#000000\" height=\"10.0\"\u003E\n\t\t\u003C/rect\u003E\n\t\u003C/g\u003E\n\u003C/svg\u003E";
  const svg = svgEscapado
    .replace(/\\u003C/g, "<")
    .replace(/\\u003E/g, ">")
    .replace(/\\"/g, '"')
    .replace(/\\n/g, "");

  return (
    <View style={styles.titleContainer}>
      <Text style={{color:"white"}}>Feed</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: "center",
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
