import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-simple-toast";
import socketServcies from "../Utils/SocketServices";
import axios from "axios";
import { useAuth } from "../Contexts/auth";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { ProgressBar, Colors } from "react-native-paper";
import { useContacts } from "../Contexts/ContactsContext";

const UpdatesScreen = () => {
  const [auth] = useAuth();
  const isFocused = useIsFocused();
  const [upload, setUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [users] = useContacts();
  const [myStory, setMyStory] = useState([]);
  const [stories, setStories] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  const navigation = useNavigation();

  const handlePress = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (permission.status !== "granted") {
        Toast.show("Sorry, Please Allow to Procceed Further");
      } else {
        const { assets } = await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          videoMaxDuration: 30,
        });

        if (assets[0].type === "video") {
          Toast.show(
            "Video Status Will Be Updated & Will Be Deleted After 24hrs"
          );
        } else if (assets[0].type === "image") {
          Toast.show(
            "Image Status Will Be Updated & Will Be Deleted After 24hrs"
          );
        } else {
          Toast.show("Wait What??");
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleAlbum = async () => {
    try {
      const libraryPermissions =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (libraryPermissions.status !== "granted") {
        Toast.show("Sorry Please Give Permissions");
      } else {
        const { assets } = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          mediaTypes: ImagePicker.MediaTypeOptions.All,
        });

        try {
          const formData = new FormData();
          if (!assets) {
            setUpload(false);
            return;
          } else {
            formData.append("status", {
              name: new Date() + "_status",
              uri: assets[0].uri,
              type: assets[0]?.type === "image" ? "image/jpg" : "video/mp4",
            });

            if (formData) {
              Toast.show("Uploading Status...");
              const { data } = await axios.post(
                `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/status/upload-status/${auth?.user?._id}`,
                formData,
                {
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "multipart/form-data",
                  },
                  onUploadProgress: (progressEvent) => {
                    const progress = Math.floor(
                      (progressEvent.loaded / progressEvent.total) * 100
                    );
                    setUploadProgress(progress);
                    setUploading(true);
                  },
                }
              );
              if (data?.success) {
                Toast.show("Status Updated");
                setUpload(true);
                setUploading(false);
              } else {
                Toast.show(data?.message);
                setUpload(false);
              }
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const getStatus = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/status/get-status/${auth?.user?._id}`
      );
      setMyStory(data?.myStatus);
    } catch (error) {
      console.log(error.message);
    }
  };

  //fetching all user's status

  const getAllStatus = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/status/get-all-status`
      );
      setStories(data?.status);
      
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getStatus();
    getAllStatus();
  }, [isFocused, upload]);

  const handleStories = async () => {
    navigation.navigate("Story-Viewer", {
      stories: myStory,
    });
  };

  const handleAllStories = async (story) => {
    navigation.navigate("Story-Viewer", {
      stories: story?.stories
    });
    // console.log(story);
  };

  // console.log(stories);

  return (
    <SafeAreaView>
      {uploading && (
        <View
          style={{
            width: "100%",
            paddingVertical: 5,
            backgroundColor: "green",
          }}
        >
          <Text style={{ textAlign: "center" }}>
            {"Uploading..." + " " + uploadProgress + "%"}
          </Text>
        </View>
      )}
      <View style={styles.container}>
        <TouchableOpacity
          onPress={myStory?.length > 0 ? handleStories : handleAlbum}
          style={{
            width: "100%",
            borderWidth: StyleSheet.hairlineWidth,
            paddingVertical: 10,
            alignSelf: "center",
            flexDirection: "row",
            gap: 20,
            paddingHorizontal: 20,
          }}
        >
          {myStory?.length > 0 ? (
            <>
              <TouchableOpacity
                style={{
                  paddingHorizontal: 0,
                  borderWidth: myStory?.length > 0 ? 3 : 0,
                  borderRadius: 100,
                  borderColor: "purple",
                }}
              >
                <Image
                  source={{ uri: auth?.user?.photo?.secure_url }}
                  width={60}
                  height={60}
                  style={{ borderRadius: 100 }}
                />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={{
                paddingHorizontal: 0,
                borderWidth: myStory?.length > 0 ? 3 : 0,
                borderRadius: 100,
                borderColor: "purple",
              }}
            >
              <Ionicons name="add-circle" size={50} color={"royalblue"} />
            </TouchableOpacity>
          )}

          <Text
            style={{
              width: "100%",
              alignSelf: "center",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            {myStory?.length > 0 ? "My Status" : "Add Status"}
          </Text>
        </TouchableOpacity>
        <View
          style={{ height: 20, marginTop: 10, marginBottom: 10, marginLeft: 5 }}
        >
          <Text
            style={{ color: "royalblue", fontSize: 15, fontWeight: "bold" }}
          >
            Contact's Status
          </Text>
        </View>
        {stories?.length > 0 &&
          stories.map(
            (story) =>
              story?.author?._id !== auth.user?._id && (
                <TouchableOpacity
                key={story?.author?._id}
                  onPress={() => handleAllStories(story)}
                  style={{
                    width: "100%",
                    borderWidth: StyleSheet.hairlineWidth,
                    paddingVertical: 10,
                    alignSelf: "center",
                    flexDirection: "row",
                    gap: 20,
                    paddingHorizontal: 20,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      paddingHorizontal: 0,
                      borderWidth: stories?.length > 0 ? 3 : 0,
                      borderRadius: 100,
                      borderColor: "purple",
                    }}
                  >
                    <Image
                      source={{ uri: story?.author?.profilePhoto?.secure_url }}
                      width={60}
                      height={60}
                      style={{ borderRadius: 100 }}
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      width: "100%",
                      alignSelf: "center",
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    {story?.author?.name}
                  </Text>
                </TouchableOpacity>
              )
          )}

        <View style={styles.camContainer}>
          <TouchableOpacity
            onPress={handlePress}
            style={{
              width: "20%",
              height: "15%",
              justifyContent: "center",
              backgroundColor: "#00d4ff",
              alignSelf: "flex-end",
              marginRight: 20,
              alignItems: "center",
              borderRadius: 30,
              shadowColor: "lightgray",
            }}
          >
            <FontAwesome style={styles.camera} name="camera" size={20} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleAlbum}
            style={{
              width: "20%",
              height: "15%",
              justifyContent: "center",
              backgroundColor: "#00d4ff",
              alignSelf: "flex-end",
              marginRight: 20,
              alignItems: "center",
              borderRadius: 30,
              shadowColor: "lightgray",
            }}
          >
            <Ionicons name="albums" style={styles.camera} size={20} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-start",
  },
  text: {
    alignSelf: "center",
    fontSize: 24,
  },
  camera: {},
  camContainer: {
    width: "100%",
    height: "80%",
    justifyContent: "flex-end",
    gap: 10,
    position: "absolute",
    bottom: 20,
  },
});

export default UpdatesScreen;
