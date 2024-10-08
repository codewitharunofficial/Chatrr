import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, ActivityIndicator, BackHandler } from "react-native";
import React, { useEffect, useState } from "react";
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
import { useIsFocused } from "@react-navigation/native";
import { Image } from "expo-image";
import ProfileSkeleton from "../SkeletonScreens/ProfileSkeleton";


const SettingsScreen = ({navigation}) => {
  const [auth, setAuth] = useAuth();

  // const navigation = useNavigation();
  const [id, setId] = useState('');
  const isFocused = useIsFocused();
  const [userId, setUserId] = useState('');
  const [name, setName] = useState(admin?.name);
  const [phone, setPhone] = useState(admin?.phone);
  const [email, setEmail] = useState(admin?.email);
  const [admin, setAdmin] = useState([]); 
  const [loading, setLoading] = useState(false);

  const [photo, setPhoto] = useState('');
  const [profilePhoto, setProfilePhoto] = useState('');
  const [editable, setEditable] = useState(false);


  useEffect(() => {
    const handleBackButton = () => {
      navigation.goBack();
      return true;
    }
    const backHandler = BackHandler.addEventListener("hardwareBackPress", handleBackButton);
    return () => {
      backHandler.remove();
    };
  }, []);



  const getAdminDetails = async () => {
    setUserId(auth?.user?._id);
    setLoading(true);
    try {
      const {data} = await axios.get(`${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/users/get-user/${userId}`);
    if(data.success === true) {
      setProfilePhoto(data?.user?.profilePhoto?.secure_url);
      setName(data.user.name)
      setPhone(data.user.phone);
      setEmail(data.user.email);
      setAdmin(data.user);
      setLoading(false);
    }
    } catch (error) {
      console.log(error);
    }
  }


  useEffect(() => {
    if(isFocused) {
      getAdminDetails();
    }
  }, [isFocused, userId, profilePhoto]);
  

  const uploadPhoto = async () => {

    setId(auth.user?._id);
      
    const granted = await ImagePicker.requestMediaLibraryPermissionsAsync();


     if(granted.status !== 'granted' ) {
      Toast.show("Sorry, Please Allow to Procceed Further")
     } else {

    const {assets} = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
    });

          try {
           const formdata = new FormData();
           if(!assets) return
   
   
           formdata.append('profilePhoto', {
            name: new Date() + '_profile',
            uri: assets[0].uri,
            type: 'image/jpg'
           });
           
           
           const {data} = await axios.post(`${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/media/upload/${id}`, formdata, {
            headers:{
              Accept: 'application/json',
              'Content-Type': 'multipart/form-data'
            }
           });
             
             if(data?.success === true){
              setProfilePhoto(data?.user?.profilePhoto?.secure_url);
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
              Toast.show(error.message + ", " + "Please Try Again");
          }
        }
  };

  
  const updateUserDetails = async () => {
       try {
        
        setUserId(auth.user?._id);

        const {data} = await axios.put(`${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/users/update-user/${userId}`, {name: name, phone: phone, email: email});
        if(data.success === true) {
          setName(data.user.name);
          setPhone(data.user.phone);
          setEmail(data.user.email);
          setEditable(false);
        } else{
          alert(data.message)
        }
       } catch (error) {
           alert(error.message)
       }
  }
  return (
   loading ? (
    <ProfileSkeleton />
   ) : (
    <>
    {
      <>
        <View style={styles.container}>
      <View style={{ display: 'flex', width: '40%', height: '20%', alignSelf: 'center', borderRadius:60, marginBottom: "10%", marginTop: '15%', alignItems: 'center'}} >
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
          profilePhoto ? (
            <Image source={profilePhoto} style={{width: 100, height: 100, borderRadius: 50}} />
          ) : photo ? (
            <Image source={photo} style={{width: 100, height: 100, borderRadius: 50}} />
          ) : (
            <FontAwesome name="user-circle" color={'lightgray'} size={112} />
          )
        }
        <MaterialIcons onPress={uploadPhoto} name="photo-camera" size={30} color='lightblue' 
        style={{position: 'absolute', left: '70%', top: '55%', zIndex: 1}} />
      </View>
        </View>
        <ScrollView style={{padding: 10}} >
        <View style={{width: '100%', height: '80%', marginTop: 10,}} >
          <TouchableOpacity onPress={() => setEditable(true)} style={{alignSelf: 'flex-end', backgroundColor: 'lightgreen', padding: 10, borderRadius: 10}} >
            <Text style={{fontSize: 16}} >Update <Feather name="edit" size={16} style={{alignSelf: 'center'}} /> </Text>
          </TouchableOpacity>
        <View style={styles.TouchableOpacity} >
          <Ionicons name="person" size={20} />
          <View style={{width: '90%', paddingHorizontal: 20,}} >
            <Text style={{fontSize: 16, fontWeight: '400', color: 'gray'}} >Name</Text>
            <TextInput onChangeText={setName} editable={editable} value={name}  style={{fontSize: 24, fontWeight: '400', color: 'black'}} />
          </View>
        </View>
        <View style={styles.TouchableOpacity} >
          <Feather name="phone" size={20} />
          <View style={{width: '90%', paddingHorizontal: 20,}} >
            <Text style={{fontSize: 16, fontWeight: '400', color: 'gray'}} >Phone</Text>
            <TextInput onChangeText={setPhone} editable={editable} value={ phone} style={{fontSize: 24, fontWeight: '400', color: 'black'}} />
            
          </View>
        </View>
        <View style={styles.TouchableOpacity} >
          <MaterialIcons name="email" size={20} />
          <View style={{width: '90%', paddingHorizontal: 20,}} >
            <Text style={{fontSize: 16, fontWeight: '400', color: 'gray'}} >Email</Text>
            <TextInput onChangeText={setEmail} editable={editable} value={email} style={{fontSize: 16, fontWeight: '400', color: 'black'}} />
          </View>
        </View>
    </View>
    {
      editable === true ? (
        <TouchableOpacity onPress={updateUserDetails} style={{alignSelf: 'center', backgroundColor: '#00d4ff', padding: 10, borderRadius: 10, marginVertical: 10}} >
      <Text>Save <MaterialCommunityIcons name="content-save-check-outline" size={20} /> </Text>
    </TouchableOpacity>
      ) : (
        null
      )
    }
    </ScrollView>
    </View>
      </>
     
    }
    </>
   )
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
  TouchableOpacity: {
    width: "100%",
    height: "auto",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    marginVertical: 10
  }
});

export default SettingsScreen;
