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


export default function App() {


  return (
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
