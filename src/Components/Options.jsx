import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TurboModuleRegistry,
  View,
} from "react-native";
import React, { useContext } from "react";
import { Menu, Divider, IconButton } from "react-native-paper";
import { Options } from "../Contexts/options";
import { useNavigation } from "@react-navigation/native";
import socketServices from "../Utils/SocketServices";
import { useAuth } from "../Contexts/auth";
import Toast from "react-native-simple-toast";
import * as Updates from "expo-updates";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../Contexts/Theme";
import { DefaultTheme, OceanBreeze } from "./utils/ThemeColors";

const OptionsMenu = () => {
  const { options, setOptions } = useContext(Options);
  const [auth, setAuth] = useAuth();
  const [theme, setTheme] = useTheme();

  const navigation = useNavigation();

  const handlePress = async () => {
    socketServices.initializeSocket();
    socketServices.emit("log-out", auth.user?._id);
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    AsyncStorage.clear();
    Toast.show("Logged Out Successfully!");
    navigation.navigate("Login");
  };

  const updates = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      Toast.show(update.manifest.runtimeVersion);
      if (update.isAvailable) {
        ToastAndroid.show(
          "New Update Available" + "" + update.manifest.version,
          2000
        );
        Alert.prompt(
          "New Version Available",
          "Update to the lastest version to enjoy the lastest features!!"
        );
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      } else {
        Toast.show("You're currently on the lastest version.", 2000);
      }
    } catch (error) {
      console.log(error);
      Toast.show(
        // `Error While Fetching Updates From Chatrr App Server: ${error}`
        error
      );
    }
  };

  const switchTheme = () => {
    console.log(theme);
    if (theme?.mame !== "Default") {
      setTheme(OceanBreeze);
    } else {
      setTheme(DefaultTheme);
      // console.log(theme);
    }
  };

  return (
    <Menu
      contentStyle={{ marginTop: "45%" }}
      visible={options}
      onDismiss={() => setOptions(!options)}
      anchor={
        <IconButton
          style={{ padding: 10 }}
          icon="dots-vertical"
          iconColor="royalblue"
          size={24}
          onPress={() => setOptions(true)}
        />
      }
    >
      <Menu.Item
        onPress={() => {
          navigation.navigate("Profile");
          setOptions(false);
        }}
        title="Profile"
      />
      <Menu.Item
        onPress={() => {
          navigation.navigate("Account-Settings");
          setOptions(false);
        }}
        title="Account-Settings"
      />
      <Menu.Item
        onPress={() => {
          updates();
          setOptions(false);
        }}
        title="Updates"
      />
      <Menu.Item
        onPress={() => {
          console.log("Will Navigate to Help");
        }}
        title="Help"
      />
      <Menu.Item
        onPress={() => {
          handlePress();
          setOptions(false);
        }}
        title="Log-Out"
      />
      <Menu.Item
        onPress={() => {
          switchTheme();
          setOptions(false);
        }}
        title="Switch-Theme"
      />
    </Menu>
  );
};

export default OptionsMenu;

const styles = StyleSheet.create({});
