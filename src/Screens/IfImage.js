import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import Toast from "react-native-simple-toast";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../Contexts/auth";


const IfImage = ({ uri, name, type, sender, reciever, }) => {

  const navigate = useNavigation();

  // const uploadStatus = async () => {
  //   try {
  //     const formData = new FormData();
  //     if (!uri) {
  //       setUpload(false);
  //       return;
  //     } else {
  //       formData.append("status", {
  //         name: new Date() + "_status",
  //         uri: uri,
  //         type: "image" ? "image/jpg" : "video/mp4",
  //       });

  //       if (formData) {
  //         Toast.show("Uploading Status...");
  //         const { data } = await axios.post(
  //           `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/status/upload-status/${auth?.user?._id}`,
  //           formData,
  //           {
  //             headers: {
  //               Accept: "application/json",
  //               "Content-Type": "multipart/form-data",
  //             },
  //             onUploadProgress: (progressEvent) => {
  //               const progress = Math.floor(
  //                 (progressEvent.loaded / progressEvent.total) * 100
  //               );
  //               setUploadProgress(progress);
  //               setUploading(true);
  //             },
  //           }
  //         );
  //         if (data?.success) {
  //           Toast.show("Status Updated");
  //           setUpload(true);
  //           setUploading(false);
  //           navigate.goBack();
  //         } else {
  //           Toast.show(data?.message);
  //           setUpload(false);
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };


  const send = async () => {
    try {
      navigate.goBack();
        const formdata = new FormData();
        if (!uri) {
          Toast.show("No Image Selected");
          return;
        } else {
          formdata.append("photo", {
            name: new Date() + "_image",
            uri: uri,
            type: "image/jpg",
          });

          formdata.append("sender", sender);
          formdata.append("reciever", reciever);

          const { data } = await axios.post(
            `${process.env.EXPO_PUBLIC_BASE_URL}/api/v1/media/send-photo/`,
            formdata,
            {
              headers: {
                Accept: "application/json",
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (data?.success) {
            Toast.show(data?.message);
            
          } else {
            Toast.show(data?.message);
            
          }
        }
      } catch (error) {
        console.log(error.message);
        Toast.show(error.message + ", " + "Please Try Again");
      }
  }

  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#000",
        alignItems: "center",
        justifyContent: "center",
        gap: 50,
      }}
    >
      <Image
        source={{ uri: uri }}
        style={{ width: "100%", height: "60%" }}
        resizeMode="cover"
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
        placeholder="Add Message"
        editable={true}
        multiline={true}
      />
        
        <TouchableOpacity
        onPress={send}
          style={{
            flexDirection: "column-reverse",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
            <MaterialIcons
              style={styles.send}
              onPress={send}
              name="send"
              size={20}
              color={"white"}
            />
          
        </TouchableOpacity>
     
      </SafeAreaView>
    </View>
  );
};

export default IfImage;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#000",
    padding: 10,
    position: 'absolute',
    bottom: 15
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
