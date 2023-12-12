import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MainScreen from '../../Screens/MainScreen';
import NotImplimentedScreens from '../../Screens/NotImplementedScreens';
import { StyleSheet } from 'react-native';
import { Entypo, Ionicons } from '@expo/vector-icons';

const MainTabNavigation = () => {

    const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator initialRouteName='Chats' screenOptions={{
      tabBarStyle: {backgroundColor: 'whitesmoke'},
      headerStyle: {backgroundColor: 'whitesmoke'}
    }} >
        <Tab.Screen name='Contacts' component={NotImplimentedScreens} options={{tabBarIcon: ({ color, size}) => (
          <Ionicons name='call-outline' size={size} color={color} />
        )}} />
        <Tab.Screen name='Chats' component={MainScreen} options={{headerTitleAlign: 'center', tabBarIcon: ({color, size}) => (
          <Ionicons name='ios-chatbubbles-sharp' size={size} color={color} />
        ), headerRight: () => (
          <Entypo name='new-message' color={'royalblue'} size={24} style={{marginRight: 20}} />
        )}} />
        <Tab.Screen name='Status' component={NotImplimentedScreens} options={{tabBarIcon: ({ color, size}) => (
          <Ionicons name='camera-outline' size={size} color={color} />
        )}} />
        <Tab.Screen name='Settings' component={NotImplimentedScreens} options={{tabBarIcon: ({ color, size}) => (
          <Ionicons name='settings-outline' size={size} color={color} />
        )}} />
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({})

export default MainTabNavigation
