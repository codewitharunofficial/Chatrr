import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import Toast from "react-native-simple-toast";
import { useNavigation } from "@react-navigation/native";


const StoriesCaptionImage = ({ asset, setUpload, setUploadProgress, setUploading, auth }) => {

  // const navigate = useNavigation();
  const [caption, setCaption] = useState("");

  const uploadStatus = async () => {
    try {
      const formData = new FormData();
      if (!asset) {
        setUpload(false);
        return;
      } else {
        formData.append("status", {
          name: new Date() + "_status",
          uri: asset.uri,
          type: asset.type === "image" ? "image/jpg" : "video/mp4",
        });

        formData.append("caption", caption);

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
            setUpload(false);
          } else {
            Toast.show(data?.message);
            setUpload(false);
          }
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };


  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#ffffff",
        alignItems: "center",
        justifyContent: "center",
        gap: 50,
      }}
    >
      <Image
        source={{ uri: asset.uri }}
        style={{ width: "100%", height: "60%" }}
        resizeMode="contain"
      />
      <SafeAreaView edges={["bottom"]} style={styles.container}>
      <TextInput
        style={{
          flex: 1,
          backgroundColor: "white",
          borderRadius: 20,
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: "lightgray",
          maxHeight: 80,
        }}
        placeholder="Caption..."
        editable={true}
        onChangeText={(value) => setCaption(value)}
        multiline={true}
      />
        
        <TouchableOpacity
        onPress={uploadStatus}
          style={{
            flexDirection: "column-reverse",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
            <MaterialIcons
              style={styles.send}
              onPress={uploadStatus}
              name="send"
              size={20}
              color={"white"}
            />
          
        </TouchableOpacity>
     
      </SafeAreaView>
    </View>
  );
};

export default StoriesCaptionImage;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "lightblue",
    padding: 10,
    position: 'absolute',
    bottom: 10,
    borderRadius: 10
  },
  send: {
    backgroundColor: "royalblue",
    padding: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignSelf: "center",
    marginLeft: 7,
  },
});
