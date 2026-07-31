import useScramble from "@/hooks/scramble/useScramble";
import { StyleSheet, Text, View } from "react-native";
import { SvgXml } from "react-native-svg";

export default function Practice() {
    const {data : scramble, error} = useScramble();
    const svg = scramble?.svg
        .replace(/\\u003C/g, "<")
        .replace(/\\u003E/g, ">")
        .replace(/\\"/g, '"')
        .replace(/\\n/g, "");

    console.log(scramble?.scramble);
    

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
