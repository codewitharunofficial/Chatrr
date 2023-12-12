
import { NavigationContainer } from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import MainScreen from '../../Screens/MainScreen';
import Conversation from '../../Screens/Conversation';
import MainTabNavigation from './MainTabNavigation';

const Navigator = () => {

     const Stack = createNativeStackNavigator();    

  return (
    <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name='Home' component={MainTabNavigation} options={{headerShown: false}}  />
            <Stack.Screen name='Conversation' component={Conversation} options={{headerTitleAlign: 'center'}} />
        </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigator