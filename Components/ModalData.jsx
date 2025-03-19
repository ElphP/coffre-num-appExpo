import React, { useState } from "react";
import { View, TextInput, StyleSheet, Pressable, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

const ModalData = ({ setModalVisible, listKey }) => {
    const [text1, setText1] = useState("");
    const [text2, setText2] = useState("");
    const [text3, setText3] = useState("");
    const [messError, setMessError] = useState("");

    const storeToAsyncStorage = async (key, login) => {
        try {
            await AsyncStorage.setItem(key, login);
        } catch (e) {
         throw e; 
        }
    };

    const storeToExpoSecure = async(key, password) =>  {
          try {
              await SecureStore.setItemAsync(key, password);
          } catch (e) {
             throw e; 
          }
    }

    const enreg = async(text1,text2,text3) => {
        if (listKey.includes(text1))  {
             setMessError(
                 "Cette référence existe déjà, enregistrement impossible."
             );
        }
        else {
            if (text1 !== "" && text3 !== "") {
                try {
                    await storeToAsyncStorage(text1, text2);
                    await storeToExpoSecure(text1, text3);
                    listKey.push(text1);
                    await AsyncStorage.setItem(
                        "listKey",
                        JSON.stringify(listKey)
                    );
                } catch (e) {
                    setMessError(
                        "Une erreur est survenue pendant l'enregistrement: " +
                            e.message
                    );
                }

                setModalVisible(false);
            } else {
                setMessError(
                    "La référence et le mot de passe sont nécessaires pour effectuer un enregistrement!"
                );
            }
        }
            
    };
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                borderWidth: 1,
                padding: 10,
                backgroundColor: "#000",
                borderRadius: 5,
            }}
        >
            <Text style={styles.labelText}>Référence: *</Text>
            <TextInput
                style={styles.input}
                onChangeText={(value) => setText1(value)}
                value={text1}
                placeholder=""
            />
            <Text style={styles.labelText}>Identifiant: </Text>
            <TextInput
                style={styles.input}
                onChangeText={(value) => setText2(value)}
                value={text2}
                placeholder=""
            />
            <Text style={styles.labelText}>Mot de passe: *</Text>
            <TextInput
                style={styles.input}
                onChangeText={(value) => setText3(value)}
                value={text3}
                placeholder=""
            />
            <View style={styles.row}>
                <Pressable
                    style={styles.button}
                    title="Fermer la modale"
                    onPress={() => enreg(text1,text2,text3)}
                >
                    <Text style={styles.buttonText}>Enregistrer</Text>
                </Pressable>
                <Pressable
                    style={styles.buttonClose}
                    title="Fermer la modale"
                    onPress={() => setModalVisible(false)}
                >
                    <Text style={styles.buttonText}>Fermer</Text>
                </Pressable>
            </View>

            {messError !== "" && <Text style={styles.error}>{messError}</Text>}
        </View>
    );
};
const styles = StyleSheet.create({
    input: {
        height: 40,
        width: 200,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        backgroundColor: "#fff",
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
    labelText: {
        color: "#fff",
        fontSize: 18,
    },
    error: {
        color: "rgb(237, 61, 61)",
        fontSize:20,
    },
    row: {
        flex: 1,
        flexDirection: "row",
    },
});

export default ModalData;
