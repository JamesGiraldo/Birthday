import React from "react";
import {
    StyleSheet,
    Text,
    View
} from "react-native";
import firebase from "../utils/firebase";
import 'firebase/auth';

export default function ActionBar(props) {
    const { showList, setshowList } = props;

    const logout = async () => {
        await firebase.auth().signOut();
    }

    return (
        <View style={styles.viewFooter}>
            <View style={styles.viewClouse}>
                <Text style={styles.text} onPress={logout}>Cerrar Sessión</Text>
            </View>

            <View style={styles.viewAdd}>
                <Text style={styles.text} onPress={() => setshowList(!showList)}>
                    {showList ? 'Nueva fecha' : 'Cancelar fecha'}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    viewFooter: {
        position: "absolute",
        bottom: 0,
        flexDirection: "row",
        width: "100%",
        height: 50,
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 30,
        marginBottom: 15
    },
    viewClouse: {
        backgroundColor: "#920000",
        borderRadius: 50,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    viewAdd: {
        backgroundColor: "#1ea1f2",
        borderRadius: 50,
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    text: {
        fontSize: 16,
        color: "#fff",
        textAlign: "center"
    }
})