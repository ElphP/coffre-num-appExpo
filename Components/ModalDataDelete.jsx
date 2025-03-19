import React from "react";
import { View,  StyleSheet, Pressable, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";


const ModalDataDelete = ({reference, setShowModalDelete, removeItemFromList}) => {

    const deleteEnreg= async(reference)=>{
        try {
            await AsyncStorage.removeItem(reference);
            await SecureStore.deleteItemAsync(reference);
           
            // Mettre à jour la liste des références (enregistrement du tableau sous forme String)
            removeItemFromList(reference);

        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
        }
        setShowModalDelete(false);
    }

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
                alignItems:"center",
            }}
        >
            <Text style={styles.text}>
                Voulez-vous vraiment effacer{" "}
                <Text style={styles.yellow}>
                    {reference}
                </Text>{" "}
                ?
            </Text>
               <View style={styles.row}>
                            <Pressable
                                style={styles.button}
                                title="Vider l'enregistrement"
                                onPress={() => deleteEnreg(reference)}
                            >
                                <Text style={styles.buttonText}>Effacer</Text>
                            </Pressable>
                            <Pressable
                                style={styles.buttonClose}
                                title="Fermer la modale"
                                onPress={() => setShowModalDelete(false)}
                            >
                                <Text style={styles.buttonText}>Fermer</Text>
                            </Pressable>
                        </View>
        </View>
    );
};

export default ModalDataDelete;

const styles = StyleSheet.create({
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
    button: {
        borderRadius: 10,
        padding: 15,
        margin: 10,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor: "rgb(0,157,245)",
    },
    buttonClose: {
        borderRadius: 10,
        padding: 15,
        margin: 10,
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
    row: {
        flex: 1,
        flexDirection: "row",
    },
});
