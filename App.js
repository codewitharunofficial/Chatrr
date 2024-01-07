import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import Navigator from "./src/Components/Navigations";
import { AuthProvider } from "./src/Contexts/auth";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "react-native-gesture-handler";
import {
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import ChatList from "./src/Components/ChatListItems";
import LoginScreen from "./src/Screens/AuthenticationScreens/LoginScreen";

export default function App() {

  const [isLogged, setIsLogged] = useState(false);
  const [token, setToken] = useState('');

  const keepMeLoggedIn = async () => {
      try {
        const data = await AsyncStorage.getItem('LoggedIn');
      setIsLogged(JSON.parse(data));
      const token = await AsyncStorage.getItem('token');
      setToken(token);
      } catch (error) {
        console.log(error)
      }
  }

  useEffect(() => {
    keepMeLoggedIn();
  }, []);
  
  // console.log(token);

  return (
      <AuthProvider>
    <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
              <StatusBar style="auto" animated={true} />
              <Navigator>
               {
                isLogged === true ? <ChatList /> : <LoginScreen />
               }
              </Navigator>
            </View>
          </SafeAreaView>
        </SafeAreaProvider>
    </GestureHandlerRootView>
      </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingVertical: 10,
    marginTop: 0,
  },
});
