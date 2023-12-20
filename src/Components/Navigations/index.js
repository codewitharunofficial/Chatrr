import { NavigationContainer } from "@react-navigation/native";
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

const Navigator = () => {
  const Stack = createNativeStackNavigator();

  const [auth] = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        
          
      <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Upload Photo"
          component={UploadPhotoScreen}
          options={{ headerShown: true }}
        />

        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={MainTabNavigation}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Conversation"
          component={Conversation}
          options={{ headerTitleAlign: "center" }}
        />

        <Stack.Screen
          name="Contacts"
          component={ContactScreen}
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
        
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
