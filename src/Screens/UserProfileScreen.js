import { View, Text, Pressable, StyleSheet, Image, TextInput } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  AntDesign,
  MaterialCommunityIcons,
  FontAwesome,
  MaterialIcons,
  Feather,
  Ionicons
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
  const [editable, setEditable] = useState(false);



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
           
           
           const {data} = await axios.post(`https://android-chattr-app.onrender.com/api/v1/media/upload/${id}`, formdata, {
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
      <View style={{ width: '40%', height: '20%', alignSelf: 'center', borderRadius:60, marginBottom: 20, marginTop: 30, borderBottomWidth: StyleSheet.hairlineWidth}} >
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
        <View style={styles.pressable} >
          <Ionicons name="person" size={20} />
          <View style={{width: '90%', paddingHorizontal: 20,}} >
            <Text style={{fontSize: 16, fontWeight: '400', color: 'gray'}} >Name</Text>
            <TextInput editable={editable} value={auth.user.name} style={{fontSize: 24, fontWeight: '400', color: 'black'}} />
            <Feather name="edit" size={20} style={{alignSelf: 'flex-end', marginTop: '-10%'}} />
          </View>
        </View>
        <View style={styles.pressable} >
          <Feather name="phone" size={20} />
          <View style={{width: '90%', paddingHorizontal: 20,}} >
            <Text style={{fontSize: 16, fontWeight: '400', color: 'gray'}} >Phone</Text>
            <TextInput editable={editable} value={auth.user.phone} style={{fontSize: 24, fontWeight: '400', color: 'black'}} />
            <Feather name="edit" size={20} style={{alignSelf: 'flex-end', marginTop: '-10%'}} />
          </View>
        </View>
        <View style={styles.pressable} >
          <MaterialIcons name="email" size={20} />
          <View style={{width: '90%', paddingHorizontal: 20,}} >
            <Text style={{fontSize: 16, fontWeight: '400', color: 'gray'}} >Email</Text>
            <TextInput editable={editable} value={auth.user.email} style={{fontSize: 16, fontWeight: '400', color: 'black'}} />
            <Feather name="edit" size={20} style={{alignSelf: 'flex-end', marginTop: '-10%'}} />
          </View>
        </View>
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
    width: "100%",
    height: "90%",
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 10,
    paddingHorizontal: 20
  },
  text: {
    fontSize: 20,
  },
  pressable: {
    width: "100%",
    height: "13%",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row'
  }
});

export default SettingsScreen;
