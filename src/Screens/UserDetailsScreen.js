import { View, Text, Image, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native";
import { Entypo, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { useAuth } from "../Contexts/auth";
import { ScrollView } from "react-native-gesture-handler";
import Toast from 'react-native-simple-toast';
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [auth, setAuth] = useAuth();
  const isFocused = useIsFocused();
  const [attachments, setAttachments] = useState([]);
  const [updatedUser, setUpdatedUser] = useState([]);
  const [blocked, setBlocked] = useState(false);

  const { user } = route.params.params;

  const values = {
    sender: auth?.user?._id,
    reciever: user?._id
  }

  const getAttachments = async() => {
    const formData = new FormData();
    formData.append('sender', auth?.user?._id)
    formData.append('reciever', user?._id)
    try {
      const {data} = await axios.post(`${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/media/get-attachs`, formData, {
        headers: {
          Accept: 'application/json',
              'Content-Type': 'multipart/form-data'
        }
      });
      if(data.success) {
        setAttachments(data.attachments);
      }
    } catch (error) {
      console.log(error.message);
    }
  }
  
  const block = async () => {
    try {
      const {data} = await axios.post(`${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/users/block-user/${auth?.user?._id}`, {user: user?._id});
    if(data?.success){
      Toast.show(data?.message);
      setBlocked(true);
      setAuth({
        ...auth,
        user: data?.updatedUser
      });
      setUpdatedUser(data?.updatedUser);
      AsyncStorage.setItem('auth', JSON.stringify(updatedUser));
    } else{
    Toast.show(data?.message)
    }
    } catch (error) {
      console.log(error.message);
    }
  }

  //unblock user

  const unBlock = async () => {
    try {
      const {data} = await axios.post(`${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/users/unblock-user/${auth?.user?._id}`, {user: user?._id});
    if(data?.success){
      Toast.show(data?.message);
      setBlocked(false);
      setAuth({
        ...auth,
        user: data?.updatedUser
      });
      setUpdatedUser(data?.updatedUser);
      AsyncStorage.setItem('auth', JSON.stringify(updatedUser));
    } else{
    Toast.show(data?.message)
    }
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    if(isFocused){
      getAttachments();
    };
    if(auth?.user?.blocked_users?.includes(user?._id)){
      setBlocked(true);
    }
  }, [isFocused]);

  return (
    <View style={{ width: "100%", height: "100%", alignItems: "center" }}>
      <Pressable
        onPress={() =>
          navigation.navigate("Image-Viewer", {
            params: {
              image: user?.profilePhoto?.secure_url,
            },
          })
        }
        style={{
          width: 150,
          height: 150,
          borderRadius: 100,
          borderWidth: 1,
          marginTop: 60,
        }}
      >
        <Image
          source={{ uri: user?.profilePhoto?.secure_url }}
          style={{ width: 150, height: 150, borderRadius: 100 }}
        />
      </Pressable>
      <View
        style={{
          width: "90%",
          padding: 10,
          alignSelf: "center",
          alignItems: "flex-start",
          flexDirection: "column",
          justifyContent: "space-evenly",
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "400",
            marginTop: 10,
            backgroundColor: "black",
            color: "white",
            width: "100%",
            borderRadius: 20,
            padding: 5,
            paddingHorizontal: 10,
          }}
        >
          {user.name}
        </Text>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "400",
            marginTop: 10,
            backgroundColor: "black",
            color: "white",
            width: "100%",
            borderRadius: 20,
            padding: 5,
            paddingHorizontal: 10,
          }}
        >
          {user.phone}
        </Text>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "400",
            marginTop: 10,
            backgroundColor: "black",
            color: "white",
            width: "100%",
            borderRadius: 20,
            padding: 10,
          }}
        >
          {user.email}
        </Text>
      </View>
      <Pressable onPress={() => blocked === false ? block() : unBlock()} style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
        {
          blocked === true ? (
           <>
           <Entypo name="block" size={20} color={"green"} />
        <Text style={{ color: "green", fontSize: 20 }}>Unblock</Text>
           </>
          ) : (
            <>
            <Entypo name="block" size={20} color={"red"} />
        <Text style={{ color: "red", fontSize: 20 }}>Block</Text>
            </>
          )
        }
      </Pressable>
      <View
        style={{
          width: "90%",
          height: 150,
          padding: 10,
          backgroundColor: "#8f2fd0",
          borderRadius: 10,
          marginTop: 20,
          justifyContent: 'center'
        }}
      >
        {
          attachments.length < 1 ? (
            <Text style={{fontSize: 20, alignSelf: 'center', color: 'white'}} >No Media Files Found</Text>
          ) : (
            <ScrollView horizontal={true} contentContainerStyle={{paddingHorizontal: 7, gap: 8}} >
              {
                attachments.map((e) => (   
                  e?.image?.format === "jpg" || "jpeg" || "png" ? (
                    <Image key={e._id} source={{uri: e?.image?.secure_url}} style={{padding: 5, borderWidth: 1, borderRadius: 10, width: 120, height: 120}} />
                  ) : e?.audio?.format === "mp4" || "m4a" ? (
                    <Text>Audio</Text>
                  ) : null
                ))
              }
            </ScrollView>
          )
        }
      </View>
    </View>
  );
};

export default UserDetailsScreen;
