import {
    Text,
    View,
    TouchableOpacity,
    ImageBackground,
    StyleSheet,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import React, { useState } from "react";
import ModalData from "../../Components/ModalData";
import * as LocalAuthentication from "expo-local-authentication";
import { useNavigation, StackActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import imageFond from "../../assets/images/fondApp.png";

export default function Index() {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [listKey, setListKey] = useState([]);

   
    // récupération d'un tableau contenant toutes les références dans le AsyncStorage
    const getArray = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem("listKey");
            if (jsonValue !== null) {
                setListKey(JSON.parse(jsonValue));
                
            }
        } catch (error) {
            console.log("Erreur lors de la récupération des references", error);
        }
    };
    getArray();
 

    // Fonction pour authentifier l'utilisateur avec biométrie
    const authenticateWithBiometrics = async () => {
        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: "Authentifie-toi avec ton empreinte digitale",
            fallbackLabel: "Utiliser un code",
        });

        if (result.success) {
            navigation.dispatch(
                StackActions.replace("liste", { listKey: listKey })
            );
        } else {
            alert("Authentification échouée");
        }
    };
    return (
        <SafeAreaProvider>
            <SafeAreaView
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    marginHorizontal: 0,
                }}
            >
                <ImageBackground
                    source={imageFond}
                    resizeMode="cover"
                    style={styles.image}
                >
                    <TouchableOpacity
                        style={[styles.button, styles.btn1]}
                        onPress={authenticateWithBiometrics}
                    >
                       
                            <Text style={[styles.textLabel]}>
                                Accéder à la liste
                            </Text>
                    
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.btn2]}
                        onPress={() => setModalVisible(true)}
                    >
                        <Text style={[styles.textLabel]}>
                            Ajouter un mot de passe
                        </Text>
                    </TouchableOpacity>
                    {modalVisible && (
                        <ModalData
                            setModalVisible={setModalVisible}
                            listKey={listKey}
                        />
                    )}
                </ImageBackground>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 10,
        padding: 15,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        width: 250,
        margin: 20,
        backgroundColor: "rgba(0,0,0,0.7)",
    },
    
    btn1: {
        borderColor: "rgba(3, 192, 74,0.7)",
        borderWidth: 3,
        
    },
    btn2: {
        borderColor: "rgba(0,157,245,0.7)",
        borderWidth: 3,
    },
    textLabel: {
        fontSize: 25,
        color: "#fff",
    },

    buttonIcon: {
        paddingRight: 8,
    },
    buttonLabel: {
        color: "#fff",
        fontSize: 16,
    },
    image: {
        flex: 1, // L'image prendra tout l'espace disponible
        width: "100%", // L'image s'étendra sur toute la largeur
        height: "100%", // L'image s'étendra sur toute la hauteur
        justifyContent: "center", // Centrer le contenu si nécessaire
        alignItems: "center", // Centrer le contenu si nécessaire
    },
});
