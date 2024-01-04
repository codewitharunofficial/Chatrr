import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ContactScreen from "../../Screens/ContactScreen";
import Conversation from "../../Screens/Conversation";
import MainTabNavigation from "./MainTabNavigation";
import LoginScreen from "../../Screens/AuthenticationScreens/LoginScreen";
import SignUpScreen from "../../Screens/AuthenticationScreens/SignUpScreen";
import SettingsScreen from "../../Screens/SettingsScreen";
import UserProfileScreen from "../../Screens/UserProfileScreen";
import { useAuth } from "../../Contexts/auth";
import UploadPhotoScreen from "../../Screens/AuthenticationScreens/UploadPhotoScreen";
import UsersScreen from "../../Screens/AuthenticationScreens/UsersScreen";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ResetPasswordScreen from "../../Screens/AuthenticationScreens/ResetPasswordScreen";
import AccountSettingScreen from "../../Screens/AccountSettingScreen";
import socketServcies from "../../Utils/SocketServices";
const Navigator = () => {
  const Stack = createNativeStackNavigator();

  const [auth, setAuth] = useAuth();
  const [isLogged, setIsLogged] = useState(false);
  const [authRef, setAuthRef] = useState([]);

  const keepMeLoggedIn = async () => {
    const data = await AsyncStorage.getItem("LoggedIn");
    setIsLogged(JSON.parse(data));
  };

  useEffect(() => {
    keepMeLoggedIn();
  }, []);

  // console.log(isLogged);

  return (
    <NavigationContainer>
      <Stack.Navigator>
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
          name="Home"
          component={MainTabNavigation}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Reset-Password"
          component={ResetPasswordScreen}
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
          options={{ headerTitleAlign: "center" }}
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
    </NavigationContainer>
  );
};

export default Navigator;
