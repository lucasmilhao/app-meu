import useScramble from "@/hooks/scramble/useScramble";
import { useUsuarioLogado } from "@/hooks/usuario/useUsuarioLogado";
import { StyleSheet, Text, View } from "react-native";
import { SvgXml } from "react-native-svg";


export const segundos = (milis: number): string => {

  const seconds = Math.floor((milis / 1000) % 60);
  const milisecs = Math.floor(milis % 1000 / 10);
  const finalTime = `${seconds}.${milisecs}`;
  return finalTime;
}
export const puzzles = ['2x2x2', '3x3x3', '4x4x4', '5x5x5', '6x6x6', '7x7x7', 'square1', 'megaminx', 'clock', 'skewb', 'pyraminx'];



export default function Practice() {
    const {data : scramble, error} = useScramble();
    const svg = scramble?.svg
        .replace(/\\u003C/g, "<")
        .replace(/\\u003E/g, ">")
        .replace(/\\"/g, '"')
        .replace(/\\n/g, "");

    const {data : usuario} = useUsuarioLogado();


    console.log(usuario?.nome);
    

    return (
        <View style={styles.titleContainer}>
            <View>
                <Text style={{ color: "white" }}>{scramble?.scramble}</Text>
            </View>
            <View>
                {svg && <SvgXml xml={svg} />}
            </View>
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
