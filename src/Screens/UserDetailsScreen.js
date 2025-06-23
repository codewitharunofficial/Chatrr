import {
  View,
  Text,
  Image,
  TouchableOpacity,
  BackHandler,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useIsFocused, useRoute } from "@react-navigation/native";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { useAuth } from "../Contexts/auth";
import Toast from "react-native-simple-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Video } from "expo-av";

const UserDetailsScreen = ({ navigation }) => {
  const route = useRoute();
  const { user } = route.params.params;

  const [auth, setAuth] = useAuth();
  const [attachments, setAttachments] = useState([]);
  const [blocked, setBlocked] = useState(false);
  const isFocused = useIsFocused();

  const getAttachments = async () => {
    try {
      const formData = new FormData();
      formData.append("sender", auth?.user?._id);
      formData.append("reciever", user?._id);

      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/media/get-attachs`,
        formData,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data?.success) setAttachments(data.attachments);
    } catch (error) {
      console.log("Get Attachments Error:", error.message);
    }
  };

  const updateUserAndAuth = async (updatedUser) => {
    setAuth((prev) => ({ ...prev, user: updatedUser }));
    await AsyncStorage.setItem("auth", JSON.stringify({ ...auth, user: updatedUser }));
  };

  const blockUser = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/users/block-user/${auth?.user?._id}`,
        { user: user?._id }
      );

      Toast.show(data?.message);
      if (data?.success) {
        setBlocked(true);
        updateUserAndAuth(data?.updatedUser);
      }
    } catch (error) {
      console.log("Block User Error:", error.message);
    }
  };

  const unBlockUser = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/users/unblock-user/${auth?.user?._id}`,
        { user: user?._id }
      );

      Toast.show(data?.message);
      if (data?.success) {
        setBlocked(false);
        updateUserAndAuth(data?.updatedUser);
      }
    } catch (error) {
      console.log("Unblock User Error:", error.message);
    }
  };

  const handleAudio = (audio) => {
    navigation.navigate("Audio-Player", {
      params: { file: audio },
    });
  };

  const handleBackButton = () => {
    navigation.goBack();
    return true;
  };

  useEffect(() => {
    if (isFocused) {
      getAttachments();
      setBlocked(auth?.user?.blocked_users?.includes(user?._id));
    }
  }, [isFocused]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", handleBackButton);
    return () => backHandler.remove();
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", backgroundColor: "#fff" }}>
      {/* Profile Photo */}
      <TouchableOpacity
        onPress={() =>
          user?.profilePhoto
            ? navigation.navigate("Image-Viewer", {
                params: { image: user?.profilePhoto?.secure_url },
              })
            : Toast.show("No Photo To Show", 3000)
        }
        style={{
          width: 150,
          height: 150,
          borderRadius: 75,
          borderWidth: 1,
          marginTop: 60,
          overflow: "hidden",
        }}
      >
        <Image
          source={{ uri: user?.profilePhoto?.secure_url }}
          style={{ width: "100%", height: "100%" }}
        />
      </TouchableOpacity>

      {/* User Info */}
      <View style={{ width: "90%", marginTop: 20 }}>
        {[user?.name, user?.phone, user?.email].map((val, i) => (
          <Text
            key={i}
            style={{
              fontSize: 20,
              backgroundColor: "black",
              color: "white",
              borderRadius: 20,
              padding: 10,
              marginTop: i === 0 ? 0 : 10,
            }}
          >
            {val}
          </Text>
        ))}
      </View>

      {/* Block/Unblock */}
      <TouchableOpacity
        onPress={() => (blocked ? unBlockUser() : blockUser())}
        style={{ flexDirection: "row", gap: 8, alignItems: "center", marginTop: 20 }}
      >
        <Entypo name="block" size={20} color={blocked ? "green" : "red"} />
        <Text style={{ fontSize: 20, color: blocked ? "green" : "red" }}>
          {blocked ? "Unblock" : "Block"}
        </Text>
      </TouchableOpacity>

      {/* Media Section */}
      <View
        style={{
          width: "90%",
          height: 150,
          padding: 10,
          backgroundColor: "#8f2fd0",
          borderRadius: 10,
          marginTop: 20,
          justifyContent: "center",
        }}
      >
        {attachments.length === 0 ? (
          <Text style={{ fontSize: 20, color: "white", textAlign: "center" }}>
            No Media Files Found
          </Text>
        ) : (
          <ScrollView
            horizontal
            contentContainerStyle={{
              paddingHorizontal: 7,
              gap: 10,
              alignItems: "center",
            }}
          >
            {attachments.map((e) => {
              if (e.audio) {
                return (
                  <TouchableOpacity
                    key={e._id}
                    onPress={() => handleAudio(e)}
                    style={{ padding: 8, borderWidth: 1, borderRadius: 10 }}
                  >
                    <MaterialIcons name="audiotrack" size={100} color="orange" />
                  </TouchableOpacity>
                );
              } else if (e.image) {
                return (
                  <TouchableOpacity
                    key={e._id}
                    onPress={() =>
                      navigation.navigate("Image-Viewer", {
                        params: { image: e?.image?.secure_url },
                      })
                    }
                    style={{ padding: 8 }}
                  >
                    <Image
                      source={{ uri: e.image.secure_url }}
                      style={{ width: 120, height: 120, borderRadius: 10 }}
                    />
                  </TouchableOpacity>
                );
              } else if (e.video) {
                return (
                  <Video
                    key={e._id}
                    source={{ uri: e.video.secure_url }}
                    resizeMode="cover"
                    style={{
                      width: 120,
                      height: 120,
                      borderRadius: 10,
                      borderWidth: 1,
                    }}
                    useNativeControls={false}
                    isMuted
                  />
                );
              }
              return null;
            })}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default UserDetailsScreen;
