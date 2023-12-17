import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MainScreen from './src/Screens/MainScreen';
import Conversation from './src/Screens/Conversation';
import Navigator from './src/Components/Navigations';
import { AuthProvider } from './src/Contexts/auth';
import { useEffect, useState } from 'react';


export default function App() {




  return (
    <AuthProvider>
    <View style={styles.container}>
      <Navigator />
      <StatusBar style="auto" />
    </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingVertical: 10,
  },
});
