import { View, Text, StyleSheet, Image , TextInput, Pressable, ToastAndroid} from "react-native";
import React, { useState } from "react";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import {useAuth} from '../../Contexts/auth';
import AsyncStorage from "@react-native-async-storage/async-storage";
import io from 'socket.io-client';


const LoginScreen = () => {

  //states

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  //navigation

  const navigation = useNavigation();

  //context

  const [auth, setAuth] = useAuth();

  const value = {
    phone, password
  }




  const logIn = async () => {

    try {
      const {data} = await axios.post('http://192.168.161.47:6969/api/v1/users/login', {...value})
      console.log(data);
      if(data?.success){
        ToastAndroid.show(data?.message, ToastAndroid.TOP);
        setAuth({
          ...auth,
          user: data.user,
          token: data.token
        });

        const socket = io('http://192.168.161.47:6969', {
          reconnectionDelay: 3000
        })

        socket.on('connecion', (res) => {
          res.send(data.user._id);
        })
        
        AsyncStorage.setItem('auth', JSON.stringify(data));
        navigation.navigate('Home');


      } else {
        ToastAndroid.show(data?.message , ToastAndroid.TOP);
      }
    } catch (error) {
      console.log(error.message);
    }
   }

  

  return (
    <>
    <View style={{marginTop: 70}} >
      <View style={styles.container}>
        <Image
          src="https://cdn-icons-png.flaticon.com/512/3032/3032932.png"
          style={styles.logo}
        />
        <Text style={styles.title}>Chatrr</Text>
      </View>
      
      <View style={styles.authContainer}>
        
        <View style={{width: '100%', height: '20%', alignItems: 'center'}} > 
        <Text
          style={{
            marginTop: 20,
            fontSize: 30,
            color: "white",
            fontWeight: "bold",
            textDecorationLine: "underline",
          }}
        >
          Login
        </Text>
        </View>
        <View style={{width: '90%', height: 'auto', alignItems: 'center', alignSelf: 'center', justifyContent: 'center', gap: 25, paddingVertical: 12}} >
        <TextInput onChangeText={setPhone} required placeholder="Enter You Phone Number" style={styles.input} />
        <TextInput required onChangeText={setPassword} secureTextEntry={true} placeholder="Enter You Password" style={styles.input} />
        </View>
        <View style={{width: '90%', height: 'auto', alignSelf: 'center', alignItems: 'center', flexDirection: 'row', gap: 15, justifyContent: 'center'}} >
          <Pressable onPress={logIn} style={styles.button} >
            <Text>Login</Text>
          </Pressable>
          <Pressable style={styles.button} >
            <Text onPress={() => navigation.navigate('SignUp')} >SignUp</Text>
          </Pressable>
        </View>
      </View>
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    height: 100,
    backgroundColor: "royalblue",
    borderBottomLeftRadius: 20,
    alignSelf: "center",
    marginTop: 50,
    borderTopRightRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
    fontStyle: "italic",
    textDecorationLine: "underline",
  },
  logo: {
    height: 50,
    width: 50,
  },
  authContainer: {
    width: "90%",
    height: "60%",
    backgroundColor: "royalblue",
    borderBottomLeftRadius: 20,
    alignSelf: "center",
    marginTop: 50,
    borderTopRightRadius: 20,
    flexDirection: "column",
    
  },
  input: {
    backgroundColor: 'white',
    width: '90%',
    padding: 5,
    borderRadius: 10,
    
  },
  button: {
    backgroundColor: '#00d4ff',
    width: '30%',
    height: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginTop: 10,
  }
});

export default LoginScreen;
