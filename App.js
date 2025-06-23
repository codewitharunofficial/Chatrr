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
import { OptionsProvider } from "./src/Contexts/options";
import { PaperProvider } from "react-native-paper";
import { ModalPortal } from "react-native-modals";
import { StreamVideoClient } from '@stream-io/video-react-native-sdk';

export default function App() {


  return (
    <PaperProvider>
      <ControlsProvider>
        <OptionsProvider>
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
                            <ModalPortal />
                          </View>
                        </SafeAreaView>
                      </SafeAreaProvider>
                    </GestureHandlerRootView>
                  </AuthProvider>
                </SoundProvider>
              </ContactsProvider>
            </MessageProvider>
          </ReplyProvider>
        </OptionsProvider>
      </ControlsProvider>
    </PaperProvider>
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
