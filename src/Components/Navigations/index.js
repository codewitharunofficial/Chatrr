import { NavigationContainer, useNavigation } from "@react-navigation/native";
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
import VerifyOTP from "../../Screens/AuthenticationScreens/VerifyOTP";
import EmailVerification from "../../Screens/AuthenticationScreens/EmailVerification";
import UserDetailsScreen from "../../Screens/UserDetailsScreen";
import ImageViewerScreen from "../../Screens/ImageViewerScreen";
import DeleteAccountScreen from "../../Screens/AuthenticationScreens/DeleteAccountScreen";
import ContactScreen from "../../Screens/ContactScreen";
// import VideoPlayer from "../../Screens/VideoPlayer";
import VideoPlayers from "../../Screens/VideoPlayer";
import StoryViewer from "../../Screens/StoryViewer";
import SelectedFileScreen from "../../Screens/SelectedFileScreen";
import MainScreen from "../../Screens/MainScreen";
import ChatList from "../ChatListItems";
import VoiceCallPage from "../../Screens/VoiceCallScreen";
import AudioPlayer from "../../Screens/MediaHandlers/AudioPlayer";
const Navigator = () => {
  const Stack = createNativeStackNavigator();

  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [auth] = useAuth();

  const keepMeLoggedIn = async () => {
    setLoading(true);
    const data = await AsyncStorage.getItem("LoggedIn");
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
        <Stack.Navigator
          initialRouteName={isLogged === null ? "Login" : "Home"}
        >
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Reset-Password"
            component={ResetPasswordScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Email-Verification"
            component={VerifyOTP}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Email-Verification-2"
            component={EmailVerification}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Home"
            component={MainTabNavigation}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="Chats"
            component={ChatList}
            options={{ headerTitleAlign: "center" }}
          />

          <Stack.Screen
            name="Contacts"
            component={ContactScreen}
            options={{ headerTitleAlign: "center" }}
          />

          <Stack.Screen
            name="Conversation"
            component={Conversation}
            options={{ headerTitleAlign: "center", headerShown: false }}
          />
          {/* <Stack.Screen
            name="Voice-Call"
            component={VoiceCallPage}
            options={{ headerTitleAlign: "center", headerShown: false }}
          /> */}

          <Stack.Screen
            name="Audio-Player"
            component={AudioPlayer}
            options={{
              headerTitleAlign: "center",
              headerShown: true,
              animationTypeForReplace: "pop",
              animation: "slide_from_bottom",
            }}
          />

          <Stack.Screen
            name="Image-Viewer"
            component={ImageViewerScreen}
            options={{
              headerTitleAlign: "center",
              headerShown: true,
              animationTypeForReplace: "pop",
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="Caption"
            component={SelectedFileScreen}
            options={{
              headerTitleAlign: "center",
              headerShown: true,
              headerTitle: "File Preview",
            }}
          />
          <Stack.Screen
            name="Story-Viewer"
            component={StoryViewer}
            options={{
              headerTitleAlign: "center",
              headerShown: true,
              animationTypeForReplace: "pop",
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="Video-Player"
            component={VideoPlayers}
            options={{
              headerTitleAlign: "center",
              headerShown: true,
              animationTypeForReplace: "pop",
              animation: "slide_from_right",
            }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ headerTitleAlign: "center" }}
          />
          <Stack.Screen
            name="Profile"
            component={UserProfileScreen}
            options={{
              headerTitleAlign: "center",
              animationTypeForReplace: "push",
              animation: "slide_from_left",
            }}
          />
          <Stack.Screen
            name="User-Profile"
            component={UserDetailsScreen}
            options={{
              headerTitleAlign: "center",
              animationTypeForReplace: "pop",
              animation: "slide_from_bottom",
            }}
          />
          <Stack.Screen
            name="Account-Settings"
            component={AccountSettingScreen}
            options={{ headerTitleAlign: "left" }}
          />
          <Stack.Screen
            name="delete-account"
            component={DeleteAccountScreen}
            options={{ headerTitleAlign: "center" }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default Navigator;
