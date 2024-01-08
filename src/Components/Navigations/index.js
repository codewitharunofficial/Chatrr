import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Conversation from "../../Screens/Conversation";
import MainTabNavigation from "./MainTabNavigation";
import LoginScreen from "../../Screens/AuthenticationScreens/LoginScreen";
import SignUpScreen from "../../Screens/AuthenticationScreens/SignUpScreen";
import SettingsScreen from "../../Screens/SettingsScreen";
import UserProfileScreen from "../../Screens/UserProfileScreen";
import { useAuth } from "../../Contexts/auth";
import UsersScreen from "../../Screens/AuthenticationScreens/UsersScreen";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ResetPasswordScreen from "../../Screens/AuthenticationScreens/ResetPasswordScreen";
import AccountSettingScreen from "../../Screens/AccountSettingScreen";
import { ActivityIndicator } from "react-native";
import socketServcies from "../../Utils/SocketServices";
const Navigator = () => {
  const Stack = createNativeStackNavigator();

  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [auth] = useAuth();

  const keepMeLoggedIn = async () => {
    setLoading(true);
    const data = await AsyncStorage.getItem("LoggedIn");
    console.log(data);
    setIsLogged(data);
    setLoading(false);
  };

  useEffect(() => {
    keepMeLoggedIn();
  }, [isLogged]);


  return (
    <NavigationContainer>
      {loading === true ? (
        <ActivityIndicator
          size={"large"}
          color={"royalblue"}
          style={{ alignSelf: "center" }}
        />
      ) : (
        <Stack.Navigator initialRouteName={isLogged === null ? "Login" : "Home"}>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Reset-Password"
            component={ResetPasswordScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Home"
            component={MainTabNavigation}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Users"
            component={UsersScreen}
            options={{ headerTitleAlign: "center" }}
          />

          {/* <Stack.Screen
              name="Contacts"
              component={ContactScreen}
              options={{ headerTitleAlign: "center" }}
            /> */}

          <Stack.Screen
            name="Conversation"
            component={Conversation}
            options={{ headerTitleAlign: "center" }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ headerTitleAlign: "center", }}
          />
          <Stack.Screen
            name="Profile"
            component={UserProfileScreen}
            options={{ headerTitleAlign: "center" }}
          />
          <Stack.Screen
            name="Account-Settings"
            component={AccountSettingScreen}
            options={{ headerTitleAlign: "left" }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default Navigator;
