import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  AntDesign,
  MaterialCommunityIcons,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";
import { useAuth } from "../Contexts/auth";
import Toast from "react-native-simple-toast";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
import { PermissionsAndroid } from "react-native";
import * as ImagePicker from 'expo-image-picker';

const SettingsScreen = () => {
  const [auth, setAuth] = useAuth();

  const navigation = useNavigation();
  const [id, setId] = useState('');

  const [photo, setPhoto] = useState('');



  const handlePress = async () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    AsyncStorage.clear();
    Toast.show("Logged Out Successfully!");
    navigation.navigate("Login");
  };

  const uploadPhoto = async () => {

      
    const granted = await ImagePicker.requestMediaLibraryPermissionsAsync();


     if(granted.status !== 'granted' ) {
      Toast.show("Sorry, Please Allow to Procceed Further")
     } else {

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    });

    console.log(res);
    
    setPhoto(res.assets[0].uri);
    setId(auth.user._id);

          try {
           
           const formdata = new FormData();
           if(!res) return
   
   
           formdata.append('profilePhoto', {
            name: new Date() + '_profile',
            uri: photo,
            type: 'image/jpg'
           });
           
           
           const {data} = await axios.post(`http://192.168.112.47:6969/api/v1/media/upload/${id}`, formdata, {
            headers:{
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data'
            }
           });
             
             if(data?.success === true){
                setAuth({
                  ...auth,
                  user: data.user,
                  token: auth.token
                });
                Toast.show(data?.message);
             } else {
                Toast.show(data?.message)
             }
   
          } catch (error) {
              console.log(error.message);
          }
        }
  };

  

  return (
    <View style={styles.container}>
      <View style={{borderWidth: 0.5, width: '40%', height: '20%', alignSelf: 'center', borderRadius:60, marginBottom: 20, marginTop: 30,}} >
      <View
        style={{
          width: "100%",
          height: "100%",
          alignItems: "center",
          borderRadius: 60,
          alignSelf: 'center',
          overflow: 'hidden'
        }}
      >
        {
          auth?.user?.photo?.url ? (
            <Image source={{uri: auth?.user?.photo?.url}} style={{width: '100%', height: '100%'}} />
          ) : photo ? (
            <Image source={{uri: photo}} style={{width: '100%', height: '100%'}} />
          ) : (
            <FontAwesome name="user-circle" size={112} />
          )
        }
      </View>
        <MaterialIcons onPress={uploadPhoto} name="photo-camera" size={40} color='royalblue' 
        style={{ marginTop: -20, alignSelf: 'flex-end'}} />
        </View>
      <Pressable
        onPress={() => navigation.navigate("Profile")}
        style={styles.item}
      >
        <Text style={styles.text}>Profile <AntDesign name="user" size={20} /> </Text>
      </Pressable>
      <Pressable onPress={handlePress} style={styles.item}>
        <Text style={styles.text}>
          Logout <MaterialCommunityIcons name="power-settings" size={24} />{" "}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    width: "100%",
    alignSelf: "flex-start",
    height: "10%",
    borderBottomWidth: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    borderRadius: 10,
    paddingHorizontal: 10,
    borderBottomColor: 'lightgray',
  },
  container: {
    width: "90%",
    height: "90%",
    alignSelf: 'center',
    gap: 10,
    borderWidth: 2,
    marginTop: 20,
    borderRadius: 10,
    paddingHorizontal: 20
  },
  text: {
    fontSize: 20,
  },
});

export default SettingsScreen;
