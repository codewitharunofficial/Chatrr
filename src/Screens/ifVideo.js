import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import axios from "axios";
import Toast from "react-native-simple-toast";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Video } from "expo-av";
import VideoPlayer from "./VideoPlayer";

const IfVideo = ({ navigate, uri }) => {
  const [upload, setUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  
  console.log(uri);

  const uploadStatus = async () => {
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
            navigate.goBack();
          } else {
            Toast.show(data?.message);
            setUpload(false);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

//   const send = async () => {
//     navigate.goBack();
//     try {
//       Toast.show("Sending Audio...");
//       const formdata = new FormData();
//       if (!uri) {
//         Toast.show("No Audio File Selected");
//         return;
//       } else {
//         formdata.append("audio", {
//           name: new Date() + "_audio",
//           uri: uri,
//           type: "audio/mp3",
//         });

//         formdata.append("sender", sender);
//         formdata.append("receiver", reciever);

//         const { data } = await axios.post(
//           `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/media/send-audio`,
//           formdata,
//           {
//             headers: {
//               Accept: "application/json",
//               "Content-Type": "multipart/form-data",
//             },
//           }
//         );

//         if (data?.success) {
//           Toast.show(data?.message);
//         } else {
//           Toast.show(data?.message);
//         }
//       }
//     } catch (error) {
//       Toast.show(error.message + ", " + "Please Try Again");
//       console.log(error.message);
//     }
//   };

  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#000",
        alignItems: "center",
        justifyContent: "center",
        gap: 80,
      }}
    >
      <VideoPlayer videoUrl={uri} />
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
          placeholder="Add Message"
          editable={true}
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

export default IfVideo;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#000",
    padding: 10,
    position: "absolute",
    bottom: 15,
  },
  send: {
    backgroundColor: "royalblue",
    padding: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignSelf: "center",
    marginLeft: 7,
  },
  video: {
    width: "100%",
    height: "60%",
  },
});
