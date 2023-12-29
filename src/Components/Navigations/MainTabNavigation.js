import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MainScreen from '../../Screens/MainScreen';
import NotImplimentedScreens from '../../Screens/NotImplementedScreens';
import { StyleSheet } from 'react-native';
import { Entypo, Ionicons } from '@expo/vector-icons';
import ContactScreen from '../../Screens/ContactScreen';
import SettingsScreen from '../../Screens/SettingsScreen';
import UpdatesScreen from '../../Screens/UpdatesScreen';
import ChatList from '../ChatListItems';

const MainTabNavigation = () => {

    const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator initialRouteName='Chats' screenOptions={{
      tabBarStyle: {backgroundColor: 'lightblue'},
      headerStyle: {backgroundColor: 'lightblue',},
      headerStatusBarHeight: 10,
    }} >
        <Tab.Screen name='Contacts' component={ContactScreen} options={{tabBarIcon: ({ color, size}) => (
          <Ionicons name='call-outline' size={size} color={color} />
        ), headerTitleAlign: 'center'}} />
        <Tab.Screen name='Chats' component={ChatList} options={({navigation})=>({headerTitleAlign: 'center', tabBarIcon: ({color, size}) => (
          <Ionicons name='ios-chatbubbles-sharp' size={size} color={color} />
        ), headerRight: () => (
          <Entypo onPress={() => navigation.navigate('Users')} name='new-message' color={'royalblue'} size={24} style={{marginRight: 20}} />
        )})} />
        <Tab.Screen name='Updates' component={UpdatesScreen} options={{tabBarIcon: ({ color, size}) => (
          <Ionicons name='camera-outline' size={size} color={color} />
        ), headerTitleAlign: 'center'}} />
        <Tab.Screen name='Settings' component={SettingsScreen} options={{tabBarIcon: ({ color, size}) => (
          <Ionicons name='settings-outline' size={size} color={color} />
        ), headerTitleAlign: 'center'}} />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({})

export default MainTabNavigation
