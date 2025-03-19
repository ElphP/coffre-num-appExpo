import React, { useState } from "react";
import { View, TextInput, StyleSheet, Pressable, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

const ModalDataModify = ({
    reference,
    setShowModalModify,
    login,
    password,
}) => {
    const [text1, setText1] = useState(login);
    const [text2, setText2] = useState(password);
    const [messError, setMessError] = useState("");

    const changeItemData = async (login, password, reference) => {
        try {
            await AsyncStorage.setItem(reference, login);
            await SecureStore.setItemAsync(reference, password);
        } catch (e) {
            setMessError(
                "Une erreur est survenue pendant la modification des données: " +
                    e.message
            );
        }

        setShowModalModify(false);
    };

    return (
        <View
            style={{
                flex: 1,
                top: "50%",
                left: "50%",
                transform: [{ translateX: -150 }, { translateY: -100 }], // Ajuster selon la taille
                width: 300,
                position: "absolute",
                borderWidth: 1,
                padding: 20,
                backgroundColor: "#000",
                borderRadius: 5,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text style={styles.text}>
                Modifier <Text style={styles.yellow}>{reference}</Text> ?
            </Text>

            <Text style={styles.labelText}>Identifiant: </Text>
            <TextInput
                style={styles.input}
                onChangeText={(value) => setText1(value)}
                value={text1}
            />
            <Text style={styles.labelText}>Mot de passe: </Text>
            <TextInput
                style={styles.input}
                onChangeText={(value) => setText2(value)}
                value={text2}
            />
            <View style={styles.row}>
                <Pressable
                    style={styles.button}
                    title="Modifier l'enregistrement"
                    onPress={() => changeItemData(text1, text2, reference)}
                >
                    <Text style={styles.buttonText}>Modifier</Text>
                </Pressable>
                <Pressable
                    style={styles.buttonClose}
                    title="Fermer la modale"
                    onPress={() => setShowModalModify(false)}
                >
                    <Text style={styles.buttonText}>Fermer</Text>
                </Pressable>
            </View>
            {messError !== "" && <Text style={styles.error}>{messError}</Text>}
        </View>
    );
};

export default ModalDataModify;

const styles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: "row",
    },
    text: {
        color: "#fff",
        fontSize: 24,
        margin: 5,
    },
    yellow: {
        color: "yellow",
        fontWeight: "bold",
        fontSize: 24,
    },
    labelText: {
        color: "#fff",
        fontSize: 18,
    },
    input: {
        height: 40,
        width: 200,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        backgroundColor: "#fff",
    },
    error: {
        color: "rgb(237, 61, 61)",
        fontSize: 20,
    },
    button: {
        borderRadius: 10,
        padding: 15,
        margin: 25,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor: "rgb(0,157,245)",
    },
    buttonClose: {
        borderRadius: 10,
        padding: 15,
        margin: 25,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor: "rgb(237, 61, 61)",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 20,
    },
});
