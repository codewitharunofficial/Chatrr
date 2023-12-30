import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Navigator from "./src/Components/Navigations";
import { AuthProvider, useAuth } from "./src/Contexts/auth";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "react-native-gesture-handler";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import socketServcies from "./src/Utils/SocketServices";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {

  // const [user, setUser] = useState([]);
     
  // const keepMeLoggedIn = async () => {
  //        setUser(auth?.user)
  //   const {data} = await AsyncStorage.getItem("LoggedIn");
  //   if(data === true) {
  //     socketServcies.initializeSocket();
  //     socketServcies.emit("connected",);
  //   }
  // }

  // useEffect(() => {
  //   keepMeLoggedIn();
  // }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
              <Navigator />
              <StatusBar style="auto" animated={true} />
            </View>
          </SafeAreaView>
        </SafeAreaProvider>
      </AuthProvider>
    </GestureHandlerRootView>
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
