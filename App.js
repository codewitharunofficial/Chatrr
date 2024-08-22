import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import Navigator from "./src/Components/Navigations";
import { AuthProvider } from "./src/Contexts/auth";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SoundProvider } from "./src/Contexts/SoundContext";
import { ContactsProvider } from "./src/Contexts/ContactsContext";
import { MessageProvider } from "./src/Contexts/MessageContext";
import { ReplyProvider } from "./src/Contexts/ReplyContext";
import { ControlsProvider } from "./src/Contexts/PlayerControls";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

export default function App() {

  return (
    <ControlsProvider>
      <ReplyProvider>
        <MessageProvider>
          <ContactsProvider>
            <SoundProvider>
              <AuthProvider>
                <GestureHandlerRootView style={{ flex: 1 }}>
                  <SafeAreaProvider>
                    <SafeAreaView style={{ flex: 1 }}>
                      <View style={styles.container}>
                        <StatusBar style="auto" animated={true} />
                        <Navigator />
                      </View>
                    </SafeAreaView>
                  </SafeAreaProvider>
                </GestureHandlerRootView>
              </AuthProvider>
            </SoundProvider>
          </ContactsProvider>
        </MessageProvider>
      </ReplyProvider>
    </ControlsProvider>
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
