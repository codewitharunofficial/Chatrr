import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MainScreen from "../../Screens/MainScreen";
import NotImplimentedScreens from "../../Screens/NotImplementedScreens";
import { StyleSheet } from "react-native";
import {
  Entypo,
  Ionicons,
  MaterialIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import ContactScreen from "../../Screens/ContactScreen";
import SettingsScreen from "../../Screens/SettingsScreen";
import UpdatesScreen from "../../Screens/UpdatesScreen";
import ChatList from "../ChatListItems";
import UsersScreen from "../../Screens/AuthenticationScreens/UsersScreen";
import CallLogsScreen from "../../Screens/CallLogsScreen";

const MainTabNavigation = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      initialRouteName="Chats"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "lightblue",
          paddingBottom: 10,
          height: "8%",
        },
        headerStyle: { backgroundColor: "lightblue" },
        headerStatusBarHeight: 10,
      }}
    >
      <Tab.Screen
        name="Chats"
        component={ChatList}
        options={({ navigation }) => ({
          headerTitleAlign: "center",
          title: "Chatrr",
          headerTintColor: "royalblue",
          headerTitleAllowFontScaling: true,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-ellipses" size={size} color={color} />
          ),
          headerRight: () => (
            <SimpleLineIcons
              name="options-vertical"
              color={"royalblue"}
              size={20}
              style={{ marginRight: "10%" }}
            />
          ),
        })}
      />
      <Tab.Screen
        name="Contacts"
        component={ContactScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="contacts" size={size} color={color} />
          ),
          headerTitleAlign: "center",
        }}
      />
      <Tab.Screen
        name="Updates"
        component={UpdatesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="camera-outline" size={size} color={color} />
          ),
          headerTitleAlign: "center",
        }}
      />
      <Tab.Screen
        name="Calls"
        component={CallLogsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="call-outline" size={size} color={color} />
          ),
          headerTitleAlign: "center",
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({});

export default MainTabNavigation;
