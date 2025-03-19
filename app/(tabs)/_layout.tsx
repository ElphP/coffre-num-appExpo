import { Stack } from "expo-router";


export default function RootLayout() {
  return (
      <Stack
          screenOptions={{
              headerStyle: {
                  backgroundColor: "rgb(120, 81, 169)",
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                  fontWeight: "bold",
              },
              title: "Mon coffre numérique",
          }}
      >
          <Stack.Screen name="index" options={{ title: "Coffre-fort numérique" }} />
          <Stack.Screen name="liste" options={{ title: "Liste des mots de passe" }} />
      </Stack>
  );
        
}
