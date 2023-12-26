import { View, Text, Image, Pressable } from "react-native";
import React, { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth } from "../../Contexts/auth";
import * as ImagePicker from 'expo-image-picker';
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import Toast from 'react-native-simple-toast'; 

const UploadPhotoScreen = () => {
  const [auth, setAuth] = useAuth();

  const navigation = useNavigation();

  //states

  const [photo, setPhoto] = useState("");


  const handlePress = async () => {
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
           
           console.log(formdata);
           
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
                  token: data.token
                });
                Toast.show(data?.message);
             } else {
                Toast.show(data?.message)
             }
   
          } catch (error) {
              console.log(error.message);
          }
        }
    }

  return (
    <View
      style={{
        width: "90%",
        height: "90%",
        alignSelf: "center",
        gap: 10,
        marginTop: 20,
        borderRadius: 10,
        paddingHorizontal: 20,
      }}
    >
      <View
        style={{
          width: "100%",
          height: "100%",
          alignItems: "center",
          borderRadius: 60,
          alignSelf: "center",
          overflow: "hidden",
          justifyContent: "center",
          marginTop: "-20%",
        }}
      >
        {auth?.user?.photo?.url ? (
          <Image
            source={{ uri: auth?.user?.photo?.url }}
            style={{ width: "100%", height: "100%" }}
          />
        ) : photo ? (
          <Image
            source={{ uri: photo }}
            style={{ width: "100%", height: "100%" }}
          />
        ) : (
          <FontAwesome name="user-circle" size={112} />
        )}
         
         <Pressable
          onPress={handlePress}
          style={{ 
            width: "30%",
            height: "3%",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
            marginTop: 15,
            marginBottom: 10
          }}
        >
          <Text onPress={() => navigation.navigate('Home')} style={{color: 'green', textDecorationLine: 'underline'}} >Skip</Text>
        </Pressable>
        

        <Pressable
          onPress={handlePress}
          style={{
            backgroundColor: "#00d4ff",
            width: "30%",
            height: "7%",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 10,
            marginTop: 10,
          }}
        >
          <Text>Upload</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default UploadPhotoScreen;
