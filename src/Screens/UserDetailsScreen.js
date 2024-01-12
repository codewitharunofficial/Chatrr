import { View, Text, Image, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native";
import { Entypo } from "@expo/vector-icons";
import axios from "axios";
import { useAuth } from "../Contexts/auth";

const UserDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [auth] = useAuth();
  const isFocused = useIsFocused();
  const [attachments, setAttachments] = useState([]);

  const { user } = route.params.params;

  const values = {
    sender: auth?.user._id,
    reciever: user._id
  }

  const getAttachments = async() => {
    const formData = new FormData();
    formData.append('sender', auth?.user?._id)
    formData.append('reciever', user?._id)
    try {
      const {data} = await axios.post(`${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/media/get-attachs`, formData);
    console.log(data);
    if(data.success) {
      setAttachments(data.attachments);
    }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
      getAttachments();
  }, [isFocused]);

  return (
    <View style={{ width: "100%", height: "100%", alignItems: "center" }}>
      <Pressable
        onPress={() =>
          navigation.navigate("Image-Viewer", {
            params: {
              image: user.profilePhoto.secure_url,
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
          source={{ uri: user.profilePhoto.secure_url }}
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
      <Pressable style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
        <Entypo name="block" size={20} color={"red"} />
        <Text style={{ color: "red", fontSize: 20 }}>Block</Text>
      </Pressable>
      <View
        style={{
          width: "90%",
          height: 150,
          padding: 10,
          backgroundColor: "#8f2fd0",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 10,
          marginTop: 20,
        }}
      >
        {
          !attachments ? (
            <Text>No Media Files Found</Text>
          ) : (
            <Pressable>
              {
                attachments.map((e) => (
                  <Text>{e?.etag}</Text>
                ))
              }
            </Pressable>
          )
        }
      </View>
    </View>
  );
};

export default UserDetailsScreen;
