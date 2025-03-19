import React from "react";
import { useState, useEffect } from "react";
import {
    View,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import ModalDataDelete from "../../Components/ModalDataDelete.jsx";
import ModalDataModify from "../../Components/ModalDataModify.jsx";

export default function Liste() {
    const [messageError, setMessageError] = useState("");

    const route = useRoute();
    const { listKey } = route.params as { listKey: string[] }; // Récupération du tableau de string
    const sortedList = [...listKey].sort(); // Crée une copie du tableau et le trie
    const [localListKey, setLocalListKey] = useState<string[]>(sortedList);
  

    const removeItemFromList = async (reference: string) => {
        try {
            const newList = localListKey.filter((item) => item !== reference);
            await AsyncStorage.setItem("listKey", JSON.stringify(newList));

            setLocalListKey(newList);
        } catch (error) {
            console.error(
                "Erreur lors de la suppression de l'élément :",
                error
            );
        }
    };

    const [dataObjects, setDataObjects] = useState<
        { index: string; reference: string; login: string; password: string }[]
    >([]);

    const getLogin = async (element: string) => {
        try {
            return await AsyncStorage.getItem(element);
        } catch (error) {
            setMessageError(
                "Une erreur est survenue lors de la récupération du login: "
            );
        }
    };

    const getPassword = async (element: string) => {
        try {
            return await SecureStore.getItemAsync(element);
        } catch (error) {
            setMessageError(
                "Une erreur est survenue lors de la récupération du mot de passe:"
            );
        }
    };

    const findDatas = async () => {
        let data: {
            index: string;
            reference: string;
            login: string;
            password: string;
        }[] = [];
        // Utiliser for...of pour attendre que chaque promesse soit résolue

        for (const element of localListKey) {
            const index = localListKey.indexOf(element).toString();
            // Attendre les résultats des fonctions asynchrones

            const login = await getLogin(element);
            const password = await getPassword(element);

            // Ajouter les données une fois que tout est résolu
            data.push({
                index: index,
                reference: element,
                login: login ?? "", // Au cas où la valeur soit null ou undefined
                password: password ?? "", // Même traitement pour le mot de passe
            });
        }
        setDataObjects(data);
    };

    const [showModalDelete, setShowModalDelete] = useState(false);
    const [showModalModify, setShowModalModify] = useState(false);

    const [referenceSelected, setReferenceSelected] = useState("");

    const deleteEnreg = (reference: string) => {
        setReferenceSelected(reference);
        setShowModalDelete(true);
    };

    const modifyEnreg = (reference: string) => {
        setReferenceSelected(reference);
        setShowModalModify(true);
    };

    useEffect(() => {
        const loadData = async () => {
            await findDatas();
        };
        if (!showModalModify) {
            loadData();
        }
    }, [localListKey, showModalModify]);

    type ItemProps = {
        id: string;
        reference: string;
        login: string;
        pwd: string;
    };

    const Item = ({ id, reference, login, pwd }: ItemProps) => (
        <View style={styles.item}>
            <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", gap: 10 }}>
                    <Text style={styles.ref}>{reference}</Text>
                    <TouchableOpacity onPress={() => modifyEnreg(reference)}>
                        <Image
                            source={require("../../assets/images/modify2.png")}
                            style={{ width: 40, height: 40 }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteEnreg(reference)}>
                        <Image
                            source={require("../../assets/images/trash2.png")}
                            style={{ width: 40, height: 40 }}
                        />
                    </TouchableOpacity>
                </View>

                <Text style={styles.data}>Login: {login}</Text>
                <Text style={styles.data}>Mot de passe: {pwd}</Text>
            </View>

            {/* Boutons à droite */}
        </View>
    );

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                {/* Bouton Retour */}
                <TouchableOpacity
                    onPress={() => router.replace("/")}
                    style={{ marginBottom: 20 }}
                >
                    <Ionicons name="arrow-back" size={24} color="black" />
                    <Text style={styles.textBack}>Retour à l'accueil</Text>
                </TouchableOpacity>
                {messageError != "" && <Text>{messageError}</Text>}
                <FlatList
                    data={dataObjects}
                    renderItem={({ item }) => (
                        <Item
                            id={item.index}
                            reference={item.reference}
                            login={item.login}
                            pwd={item.password}
                        />
                    )}
                    keyExtractor={(item) => item.index}
                />

                {showModalDelete && (
                    <ModalDataDelete
                        reference={referenceSelected}
                        setShowModalDelete={setShowModalDelete}
                        removeItemFromList={removeItemFromList}
                    />
                )}
                {showModalModify && (
                    <ModalDataModify
                        reference={referenceSelected}
                        setShowModalModify={setShowModalModify}
                        login={
                            dataObjects?.find(
                                (item) => item.reference === referenceSelected
                            )?.login ?? ""
                        }
                        password={
                            dataObjects?.find(
                                (item) => item.reference === referenceSelected
                            )?.password ?? ""
                        }
                    />
                )}
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // marginTop: StatusBar.currentHeight || 0,
        backgroundColor: "rgba(120,81,169,0.15)",
    },
    item: {
        backgroundColor: "rgb(142, 177, 208)",
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 15,
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
    },

    ref: {
        fontWeight: "bold",
        fontSize: 32,
        flex:1,
    },
    data: {
        fontSize: 24,
    },
    textBack: {
        fontSize: 24,
    },
});
