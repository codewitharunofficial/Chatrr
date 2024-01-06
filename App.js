import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import Navigator from "./src/Components/Navigations";
import { AuthProvider } from "./src/Contexts/auth";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "react-native-gesture-handler";
import {
  GestureHandlerRootView,
} from "react-native-gesture-handler";

export default function App() {

  // const [isLogged, setIsLogged] = useState(false);

  // const keepMeLoggedIn = async () => {
  //     try {
  //       const data = await AsyncStorage.getItem('LoggedIn');
  //     setIsLogged(data);
  //     } catch (error) {
  //       console.log(error)
  //     }
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
